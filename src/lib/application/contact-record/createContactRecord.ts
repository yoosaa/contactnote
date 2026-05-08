import type { ContactRecord, ContactRecordDraft } from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function createContactRecord(
	repository: ContactRecordRepository,
	draft: ContactRecordDraft
): Promise<ContactRecord> {
	const now = new Date().toISOString();

	const record: ContactRecord = {
		id: crypto.randomUUID(),
		...draft,
		receivedAt: now,
		lastActionAt: now
	};

	await repository.save(record);

	return record;
}
