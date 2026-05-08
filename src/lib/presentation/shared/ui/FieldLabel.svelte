<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<span class="text-xs font-bold tracking-wide text-slate-700">
	{@render children()}
</span>
