<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {
    contactRecordStatuses,
    contactRecordStatusLabels,
  } from '$lib/domain/contact-record';
  import ContactStatusBadge from './ContactStatusBadge.svelte';

  const { Story } = defineMeta({
    title: 'Entities/ContactRecord/ContactStatusBadge',
    component: ContactStatusBadge,
    tags: ['autodocs'],
  });
</script>

<Story name="All statuses">
  <div class="flex flex-wrap items-center gap-3 bg-slate-50 p-6">
    {#each contactRecordStatuses as status}
      <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <ContactStatusBadge {status} />
        <span class="text-sm text-slate-500">
          {contactRecordStatusLabels[status]}
        </span>
      </div>
    {/each}
  </div>
</Story>