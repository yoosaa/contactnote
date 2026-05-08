<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		createContactRecordUseCase,
		deleteContactRecordUseCase,
		getContactRecordUseCase,
		updateContactRecordUseCase
	} from '$lib/composition/contact-record/contactRecordComposition';
	import {
		contactChannels,
		contactChannelLabels,
		contactRecordStatuses,
		contactRecordStatusLabels,
		type ContactChannel,
		type ContactRecord,
		type ContactRecordDraft,
		type ContactRecordStatus
	} from '$lib/domain/contact-record';
	import AppShell from '$lib/presentation/widgets/app-shell/AppShell.svelte';
	import Button from '$lib/presentation/shared/ui/Button.svelte';
	import { inputClass, selectClass, textareaClass } from '$lib/presentation/shared/ui/fieldClasses';

	type Props = {
		id?: string;
	};

	let { id }: Props = $props();

	let title = $state('');
	let customerName = $state('');
	let contactChannel = $state<ContactChannel>('email');
	let status = $state<ContactRecordStatus>('new');
	let summary = $state('');
	let details = $state('');
	let owner = $state('');

	let currentRecord = $state<ContactRecord | null>(null);
	let isLoading = $state(false);
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let errorMessage = $state<string | null>(null);

	const isEditMode = $derived(Boolean(id));

	onMount(async () => {
		if (!id) {
			return;
		}

		try {
			const record = await getContactRecordUseCase(id);

			if (!record) {
				errorMessage = '問い合わせが見つかりません。';
				return;
			}

			currentRecord = record;
			title = record.title;
			customerName = record.customerName;
			contactChannel = record.contactChannel;
			status = record.status;
			summary = record.summary;
			details = record.details;
			owner = record.owner;
		} catch (error) {
			console.error(error);
			errorMessage = '問い合わせの取得に失敗しました。';
		} finally {
			isLoading = false;
		}
	});

	function buildDraft(): ContactRecordDraft {
		return {
			title,
			customerName,
			contactChannel,
			status,
			summary,
			details,
			owner
		};
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			isSubmitting = true;
			errorMessage = null;

			const draft = buildDraft();

			if (id) {
				const updated = await updateContactRecordUseCase(id, draft);
				goto(`/contacts/${updated.id}`);
				return;
			}

			const created = await createContactRecordUseCase(draft);
			goto(`/contacts/${created.id}`);
		} catch (error) {
			console.error(error);
			errorMessage = '問い合わせの保存に失敗しました。';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete() {
		if (!id) {
			return;
		}

		const ok = window.confirm('この問い合わせを削除しますか？');

		if (!ok) {
			return;
		}

		try {
			isDeleting = true;
			errorMessage = null;

			await deleteContactRecordUseCase(id);
			goto('/');
		} catch (error) {
			console.error(error);
			errorMessage = '問い合わせの削除に失敗しました。';
		} finally {
			isDeleting = false;
		}
	}

	function back() {
		if (id) {
			goto(`/contacts/${id}`);
			return;
		}

		goto('/');
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
	<title>{isEditMode ? '問い合わせを編集' : '問い合わせを新規作成'} | Contactnote</title>
</svelte:head>

<AppShell>
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<div>
			<Button variant="ghost-link" className="mb-6" onclick={back}>
				← {isEditMode ? '詳細へ戻る' : '一覧へ戻る'}
			</Button>

			<p class="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
				{isEditMode ? 'Edit Contact' : 'New Contact'}
			</p>
			<h1 class="text-3xl font-bold tracking-tight text-slate-950">
				{isEditMode ? '問い合わせを編集' : '問い合わせを新規作成'}
			</h1>
			<p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
				問い合わせの基本情報と対応内容を整理します。受付日時は作成時に自動で記録されます。
			</p>
		</div>

		<div class="flex flex-wrap gap-3">
			{#if isEditMode}
				<Button variant="danger-outline" onclick={handleDelete} disabled={isDeleting}>
					{isDeleting ? '削除中...' : '削除する'}
				</Button>
			{/if}

			<Button
				type="submit"
				variant="primary"
				form="contact-edit-form"
				disabled={isSubmitting || isLoading}
			>
				{isSubmitting ? '保存中...' : '保存する'}
			</Button>
		</div>
	</div>

	{#if isLoading}
		<p class="text-sm text-slate-600">読み込み中...</p>
	{:else}
		{#if errorMessage}
			<p
				class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
			>
				{errorMessage}
			</p>
		{/if}

		<form id="contact-edit-form" class="grid gap-6" onsubmit={handleSubmit}>
			<section class="rounded-2xl border border-slate-200 bg-white p-6">
				<div class="mb-5">
					<p class="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">Workflow</p>
					<h2 class="text-lg font-bold tracking-tight text-slate-950">状態と担当</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">現在の対応状態と担当者を管理します。</p>
				</div>

				<div class="grid gap-5 md:grid-cols-2">
					<label class="grid gap-2">
						<span class="text-xs font-bold tracking-wide text-slate-700">ステータス</span>
						<select class={selectClass} bind:value={status}>
							{#each contactRecordStatuses as item}
								<option value={item}>
									{contactRecordStatusLabels[item]}
								</option>
							{/each}
						</select>
					</label>

					<label class="grid gap-2">
						<span class="text-xs font-bold tracking-wide text-slate-700">担当者</span>
						<input class={inputClass} bind:value={owner} placeholder="例: 佐野" />
					</label>
				</div>
			</section>

			<section class="rounded-2xl border border-slate-200 bg-white p-6">
				<div class="mb-5">
					<p class="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">Basic Info</p>
					<h2 class="text-lg font-bold tracking-tight text-slate-950">基本情報</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						問い合わせの相手と連絡経路を記録します。
					</p>
				</div>

				<div class="grid gap-5">
					<label class="grid gap-2">
						<span class="text-xs font-bold tracking-wide text-slate-700">タイトル</span>
						<input
							class={inputClass}
							bind:value={title}
							required
							placeholder="例: 予約日時変更の相談"
						/>
					</label>

					<div class="grid gap-5 md:grid-cols-2">
						<label class="grid gap-2">
							<span class="text-xs font-bold tracking-wide text-slate-700">顧客名</span>
							<input
								class={inputClass}
								bind:value={customerName}
								required
								placeholder="例: 山田 花子"
							/>
						</label>

						<label class="grid gap-2">
							<span class="text-xs font-bold tracking-wide text-slate-700">連絡チャネル</span>
							<select class={selectClass} bind:value={contactChannel}>
								{#each contactChannels as channel}
									<option value={channel}>
										{contactChannelLabels[channel]}
									</option>
								{/each}
							</select>
						</label>
					</div>

					{#if currentRecord}
						<div class="rounded-xl bg-slate-50 p-4">
							<p class="text-xs font-bold tracking-wide text-slate-500">受付日時</p>
							<p class="mt-1 text-sm font-semibold text-slate-950">
								{formatDate(currentRecord.receivedAt)}
							</p>
							<p class="mt-1 text-xs leading-5 text-slate-500">
								受付日時は作成時に自動で記録されるため、編集できません。
							</p>
						</div>
					{/if}
				</div>
			</section>

			<section class="rounded-2xl border border-slate-200 bg-white p-6">
				<div class="mb-5">
					<p class="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">Content</p>
					<h2 class="text-lg font-bold tracking-tight text-slate-950">内容</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						一覧で見える要約と、詳細画面で読む本文を分けて入力します。
					</p>
				</div>

				<div class="grid gap-5">
					<label class="grid gap-2">
						<span class="text-xs font-bold tracking-wide text-slate-700">要約</span>
						<textarea
							class={`${textareaClass} min-h-24`}
							bind:value={summary}
							required
							rows="3"
							placeholder="一覧で確認しやすい短い要約を書きます"
						></textarea>
					</label>

					<label class="grid gap-2">
						<span class="text-xs font-bold tracking-wide text-slate-700">詳細</span>
						<textarea
							class={`${textareaClass} min-h-24`}
							bind:value={details}
							rows="8"
							placeholder="問い合わせ本文、補足、対応メモなどを記録します"
						></textarea>
					</label>
				</div>
			</section>
		</form>

		{#if isEditMode}
			<section class="mt-6 rounded-2xl border border-red-200 bg-white p-6">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p class="mb-1 text-xs font-bold tracking-wider text-red-700 uppercase">Danger Zone</p>
						<h2 class="text-lg font-bold tracking-tight text-slate-950">危険な操作</h2>
						<p class="mt-2 text-sm leading-6 text-slate-600">
							削除すると、この問い合わせは一覧から消えます。
						</p>
					</div>

					<Button variant="danger-outline" onclick={handleDelete} disabled={isDeleting}>
						{isDeleting ? '削除中...' : '削除する'}
					</Button>
				</div>
			</section>
		{/if}
	{/if}
</AppShell>
