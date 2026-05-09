<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { listContactRecordsUseCase } from '$lib/composition/contact-record/contactRecordComposition';
	import {
		contactChannels,
		contactChannelLabels,
		contactRecordStatuses,
		contactRecordStatusLabels,
		type ContactChannel,
		type ContactRecord,
		type ContactRecordStatus
	} from '$lib/domain/contact-record';
	import AppShell from '$lib/presentation/widgets/app-shell/AppShell.svelte';
	import Button from '$lib/presentation/shared/ui/Button.svelte';
	import { selectClass } from '$lib/presentation/shared/ui/fieldClasses';
	import ContactStatusBadge from '$lib/presentation/entities/contact-record/ContactStatusBadge.svelte';

	type StatusFilter = ContactRecordStatus | 'all';
	type ChannelFilter = ContactChannel | 'all';

	let records: ContactRecord[] = $state([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	let statusFilter = $state<StatusFilter>('all');
	let channelFilter = $state<ChannelFilter>('all');

	const filteredRecords = $derived(
		records.filter((record) => {
			const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

			const matchesChannel = channelFilter === 'all' || record.contactChannel === channelFilter;

			return matchesStatus && matchesChannel;
		})
	);

	onMount(async () => {
		await loadRecords();
	});

	async function loadRecords() {
		try {
			isLoading = true;
			errorMessage = null;
			records = await listContactRecordsUseCase();
		} catch (error) {
			console.error(error);
			errorMessage = '問い合わせ一覧の取得に失敗しました。';
		} finally {
			isLoading = false;
		}
	}

	function openNewPage() {
		goto('/contacts/new');
	}

	function openDetailPage(id: string) {
		goto(`/contacts/${id}`);
	}

	function resetFilters() {
		statusFilter = 'all';
		channelFilter = 'all';
	}

	function formatDate(value: string): string {
		return new Intl.DateTimeFormat('ja-JP', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(value));
	}
</script>

<svelte:head>
	<title>Contactnote</title>
</svelte:head>

<AppShell>
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<div>
			<p class="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">Contactnote</p>
			<h1 class="text-3xl font-bold tracking-tight text-slate-950">問い合わせ一覧</h1>
			<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
				未着手・返答待ち・止まっている対応をすばやく確認できます。
			</p>
		</div>

		<Button variant="primary" onclick={openNewPage}>新規作成</Button>
	</div>

	<section
		class="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-[minmax(180px,240px)_minmax(180px,240px)_auto] md:items-end"
	>
		<label class="grid gap-2">
			<span class="text-xs font-bold tracking-wide text-slate-700">ステータス</span>
			<select class={selectClass} bind:value={statusFilter}>
				<option value="all">すべて</option>
				{#each contactRecordStatuses as status}
					<option value={status}>
						{contactRecordStatusLabels[status]}
					</option>
				{/each}
			</select>
		</label>

		<label class="grid gap-2">
			<span class="text-xs font-bold tracking-wide text-slate-700">連絡チャネル</span>
			<select
				class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
				bind:value={channelFilter}
			>
				<option value="all">すべて</option>
				{#each contactChannels as channel}
					<option value={channel}>
						{contactChannelLabels[channel]}
					</option>
				{/each}
			</select>
		</label>

		<Button variant="secondary" onclick={resetFilters}>リセット</Button>
	</section>

	{#if isLoading}
		<p class="text-sm text-slate-600">読み込み中...</p>
	{:else if errorMessage}
		<p class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
			{errorMessage}
		</p>
	{:else if records.length === 0}
		<section class="rounded-2xl border border-slate-200 bg-white p-10 text-center">
			<h2 class="text-xl font-bold tracking-tight text-slate-950">まだ問い合わせがありません</h2>
			<p class="mt-2 text-sm text-slate-600">最初の問い合わせを登録してみましょう。</p>
			<Button variant="primary" className="mt-6" onclick={openNewPage}>問い合わせを作成</Button>
		</section>
	{:else if filteredRecords.length === 0}
		<section class="rounded-2xl border border-slate-200 bg-white p-10 text-center">
			<h2 class="text-xl font-bold tracking-tight text-slate-950">
				条件に一致する問い合わせがありません
			</h2>
			<p class="mt-2 text-sm text-slate-600">フィルタ条件を変えてみてください。</p>
			<Button variant="secondary" className="mt-6" onclick={resetFilters}>
				フィルタをリセット
			</Button>
		</section>
	{:else}
		<section class="grid gap-4" aria-label="問い合わせ一覧">
			{#each filteredRecords as record}
				<article
					class={[
						'rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-sm',
						record.status === 'new' ? 'border-l-4 border-l-red-600' : ''
					]}
				>
					<div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
						<ContactStatusBadge status={record.status} />
						<span>{contactChannelLabels[record.contactChannel]}</span>
						<span>最終更新: {formatDate(record.lastActionAt)}</span>
					</div>

					<div class="mt-4">
						<h2 class="text-lg leading-snug font-bold tracking-tight text-slate-950">
							{record.title}
						</h2>
						<p class="mt-1 text-sm text-slate-500">{record.customerName}</p>
						<p class="mt-3 leading-7 text-slate-600">{record.summary}</p>
					</div>

					<div class="mt-5 flex justify-end">
						<Button variant="secondary" onclick={() => openDetailPage(record.id)}>
							詳細を見る
						</Button>
					</div>
				</article>
			{/each}
		</section>
	{/if}
</AppShell>
