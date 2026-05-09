<script lang="ts">
	import ClarityScript from '$lib/presentation/shared/analytics/ClarityScript.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ClarityScript />

{@render children()}
