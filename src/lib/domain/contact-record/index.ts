export type { ContactChannel } from './ContactChannel';
export { contactChannels, contactChannelLabels } from './ContactChannel';

export type { ContactRecord, ContactRecordId } from './ContactRecord';

export type { ContactRecordDraft } from './ContactRecordDraft';

export type { ContactRecordStatus } from './ContactRecordStatus';
export { contactRecordStatuses, contactRecordStatusLabels } from './ContactRecordStatus';

export {
	getNextStatuses,
	canTransitionTo,
	assertCanTransitionTo
} from './ContactRecordTransitionPolicy';
