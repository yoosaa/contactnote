import type { ContactRecordId } from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function deleteContactRecord(
	repository: ContactRecordRepository,
	id: ContactRecordId
): Promise<void> {
	await repository.delete(id);
}
