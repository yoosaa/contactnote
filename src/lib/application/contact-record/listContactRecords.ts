import type { ContactRecord } from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function listContactRecords(
	repository: ContactRecordRepository
): Promise<ContactRecord[]> {
	const records = await repository.list();

	return records.sort((a, b) => {
		return b.lastActionAt.localeCompare(a.lastActionAt);
	});
}
