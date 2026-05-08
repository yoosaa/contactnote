import type { ContactRecord, ContactRecordId } from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function getContactRecord(
	repository: ContactRecordRepository,
	id: ContactRecordId
): Promise<ContactRecord | null> {
	return repository.findById(id);
}
