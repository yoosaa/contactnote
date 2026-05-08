import type {
	ContactRecord,
	ContactRecordDraft,
	ContactRecordId
} from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function updateContactRecord(
	repository: ContactRecordRepository,
	id: ContactRecordId,
	draft: ContactRecordDraft
): Promise<ContactRecord> {
	const current = await repository.findById(id);

	if (!current) {
		throw new Error(`ContactRecord not found: ${id}`);
	}

	const updated: ContactRecord = {
		...current,
		...draft,
		receivedAt: current.receivedAt,
		lastActionAt: new Date().toISOString()
	};

	await repository.save(updated);

	return updated;
}
