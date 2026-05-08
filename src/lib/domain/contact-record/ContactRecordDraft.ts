import type { ContactChannel } from './ContactChannel';
import type { ContactRecordStatus } from './ContactRecordStatus';

export type ContactRecordDraft = {
	title: string;
	customerName: string;
	contactChannel: ContactChannel;
	status: ContactRecordStatus;
	summary: string;
	details: string;
	owner: string;
};
