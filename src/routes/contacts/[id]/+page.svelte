<script lang="ts">
	import ContactDetailPage from '$lib/presentation/pages/contact-detail/ContactDetailPage.svelte';

	type Props = {
		params: {
			id: string;
		};
	};

	let { params }: Props = $props();
</script>

<ContactDetailPage id={params.id} />
