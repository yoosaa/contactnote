<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FieldLabel from './FieldLabel.svelte';

  const { Story } = defineMeta({
    title: 'Shared UI/FieldLabel',
    component: FieldLabel,
    tags: ['autodocs'],
  });
</script>

<Story name="Default">
  <div class="bg-slate-50 p-6">
    <FieldLabel>ステータス</FieldLabel>
  </div>
</Story>