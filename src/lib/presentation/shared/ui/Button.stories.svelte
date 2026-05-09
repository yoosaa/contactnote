<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";

	const {Story} = defineMeta({
		title: 'Shared UI/Button',
		component: Button,
		tags: ['autodocs']
	})
</script>

<Story name="Variants" asChild>
	<div class="flex flex-wrap items-center gap-3 bg-slate-50 p-6">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="danger">Danger</Button>
		<Button variant="danger-outline">Danger Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="ghost-link">← Ghost Link</Button>
	</div>
</Story>

<Story name="Disabled" asChild>
	<div class="flex flex-wrap items-center gap-3 bg-slate-50 p-6">
		<Button variant="primary" disabled>Primary disabled</Button>
		<Button variant="secondary" disabled>Secondary disabled</Button>
		<Button variant="danger" disabled>Danger disabled</Button>
	</div>
</Story>
