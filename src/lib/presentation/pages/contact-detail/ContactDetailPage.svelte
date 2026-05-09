<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		changeContactRecordStatusUseCase,
		getContactRecordUseCase
	} from '$lib/composition/contact-record/contactRecordComposition';
	import {
		contactChannelLabels,
		contactRecordStatusLabels,
		getNextStatuses,
		type ContactRecord,
		type ContactRecordStatus
	} from '$lib/domain/contact-record';
	import AppShell from '$lib/presentation/widgets/app-shell/AppShell.svelte';
	import Button from '$lib/presentation/shared/ui/Button.svelte';
	import ContactStatusBadge from '$lib/presentation/entities/contact-record/ContactStatusBadge.svelte';

	type Props = {
		id: string;
	};

	let { id }: Props = $props();

	let record = $state<ContactRecord | null>(null);
	let isLoading = $state(true);
	let isChangingStatus = $state(false);
	let errorMessage = $state<string | null>(null);

	const nextStatuses = $derived(record ? getNextStatuses(record.status) : []);

	onMount(async () => {
		await loadRecord();
	});

	async function loadRecord() {
		try {
			isLoading = true;
			errorMessage = null;
			record = await getContactRecordUseCase(id);
		} catch (error) {
			console.error(error);
			errorMessage = '問い合わせ詳細の取得に失敗しました。';
		} finally {
			isLoading = false;
		}
	}

	async function changeStatus(nextStatus: ContactRecordStatus) {
		try {
			isChangingStatus = true;
			errorMessage = null;

			record = await changeContactRecordStatusUseCase(id, nextStatus);
		} catch (error) {
			console.error(error);
			errorMessage = 'ステータス変更に失敗しました。';
		} finally {
			isChangingStatus = false;
		}
	}

	function backToList() {
		goto('/');
	}

	function openEditPage() {
		goto(`/contacts/${id}/edit`);
	}

	function formatDate(value: string): string {
		return new Intl.DateTimeFormat('ja-JP', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(value));
	}
</script>

<svelte:head>
	<title>{record ? `${record.title} | Contactnote` : '問い合わせ詳細 | Contactnote'}</title>
</svelte:head>

<AppShell>
	<Button variant="ghost-link" className="mb-6" onclick={backToList}>← 一覧へ戻る</Button>

	{#if isLoading}
		<p class="text-sm text-slate-600">読み込み中...</p>
	{:else if errorMessage}
		<p class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
			{errorMessage}
		</p>
	{:else if !record}
		<section class="rounded-2xl border border-slate-200 bg-white p-10 text-center">
			<h1 class="text-xl font-bold tracking-tight text-slate-950">問い合わせが見つかりません</h1>
			<p class="mt-2 text-sm text-slate-600">削除されたか、URLが間違っている可能性があります。</p>

			<Button variant="secondary" className="mt-6" onclick={backToList}>一覧へ戻る</Button>
		</section>
	{:else}
		<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<div class="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
					<ContactStatusBadge status={record.status} />
					<span>最終更新: {formatDate(record.lastActionAt)}</span>
				</div>

				<h1 class="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-slate-950">
					{record.title}
				</h1>
			</div>

			<Button variant="secondary" onclick={openEditPage}>編集</Button>
		</div>

		<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
			<div class="grid gap-6">
				<section class="rounded-2xl border border-slate-200 bg-white p-6">
					<p class="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">Summary</p>
					<h2 class="text-lg font-bold tracking-tight text-slate-950">要約</h2>
					<p class="mt-4 leading-7 text-slate-700">{record.summary}</p>
				</section>

				<section class="rounded-2xl border border-slate-200 bg-white p-6">
					<p class="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">Details</p>
					<h2 class="text-lg font-bold tracking-tight text-slate-950">詳細</h2>
					<p class="mt-4 leading-7 whitespace-pre-wrap text-slate-700">
						{record.details || '詳細は未入力です。'}
					</p>
				</section>
			</div>

			<aside class="grid content-start gap-6">
				<section class="rounded-2xl border border-slate-200 bg-white p-6">
					<h2 class="text-lg font-bold tracking-tight text-slate-950">問い合わせ情報</h2>

					<dl class="mt-5 grid gap-4">
						<div>
							<dt class="text-xs font-bold tracking-wide text-slate-500">顧客名</dt>
							<dd class="mt-1 text-sm font-semibold text-slate-950">{record.customerName}</dd>
						</div>

						<div>
							<dt class="text-xs font-bold tracking-wide text-slate-500">連絡チャネル</dt>
							<dd class="mt-1 text-sm font-semibold text-slate-950">
								{contactChannelLabels[record.contactChannel]}
							</dd>
						</div>

						<div>
							<dt class="text-xs font-bold tracking-wide text-slate-500">受付日時</dt>
							<dd class="mt-1 text-sm font-semibold text-slate-950">
								{formatDate(record.receivedAt)}
							</dd>
						</div>

						<div>
							<dt class="text-xs font-bold tracking-wide text-slate-500">担当者</dt>
							<dd class="mt-1 text-sm font-semibold text-slate-950">
								{record.owner || '未設定'}
							</dd>
						</div>
					</dl>
				</section>

				<section class="rounded-2xl border border-slate-200 bg-white p-6">
					<h2 class="text-lg font-bold tracking-tight text-slate-950">次のアクション</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						現在の状態から進められる操作だけを表示しています。
					</p>

					{#if nextStatuses.length === 0}
						<p class="mt-5 rounded-lg bg-slate-100 p-4 text-sm font-semibold text-slate-600">
							この問い合わせで実行できる状態変更はありません。
						</p>
					{:else}
						<div class="mt-5 grid gap-3">
							{#each nextStatuses as nextStatus}
								<Button
									variant="primary"
									onclick={() => changeStatus(nextStatus)}
									disabled={isChangingStatus}
								>
									{contactRecordStatusLabels[nextStatus]}にする
								</Button>
							{/each}
						</div>
					{/if}
				</section>
			</aside>
		</div>
	{/if}
</AppShell>
