import type { ContactRecord, ContactRecordId } from '$lib/domain/contact-record';

export type ContactRecordRepository = {
	list(): Promise<ContactRecord[]>;
	findById(id: ContactRecordId): Promise<ContactRecord | null>;
	save(record: ContactRecord): Promise<void>;
	delete(id: ContactRecordId): Promise<void>;
};
