<script lang="ts">
	type Props = {
		children: import('svelte').Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="min-h-screen bg-slate-50 text-slate-950 md:grid md:grid-cols-[240px_1fr]">
	<aside
		class="hidden border-r border-slate-200 bg-white p-6 md:block"
		aria-label="メインナビゲーション"
	>
		<div class="mb-10">
			<div class="text-lg font-bold tracking-tight">Contactnote</div>
			<div class="mt-1 text-xs text-slate-500">Inquiry workspace</div>
		</div>

		<nav class="grid gap-2">
			<a class="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white" href="/">
				問い合わせ
			</a>
		</nav>
	</aside>

	<main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
		{@render children()}
	</main>
</div>
