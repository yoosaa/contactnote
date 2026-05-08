import type { ContactChannel } from './ContactChannel';
import type { ContactRecordStatus } from './ContactRecordStatus';

export type ContactRecordId = string;

export type ContactRecord = {
	id: ContactRecordId;
	title: string;
	customerName: string;
	contactChannel: ContactChannel;
	receivedAt: string;
	status: ContactRecordStatus;
	summary: string;
	details: string;
	owner: string;
	lastActionAt: string;
};
