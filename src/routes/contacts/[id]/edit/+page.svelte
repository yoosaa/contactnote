<script lang="ts">
	import ContactEditPage from '$lib/presentation/pages/contact-edit/ContactEditPage.svelte';

	type Props = {
		params: {
			id: string;
		};
	};

	let { params }: Props = $props();
</script>

<ContactEditPage id={params.id} />
