<script lang="ts">
  import {
    contactRecordStatusLabels,
    type ContactRecordStatus,
  } from '$lib/domain/contact-record';
  import { getContactStatusBadgeClass } from './contactRecordView';

  type Props = {
    status: ContactRecordStatus;
  };

  let { status }: Props = $props();
</script>

<span class={getContactStatusBadgeClass(status)}>
  {contactRecordStatusLabels[status]}
</span>