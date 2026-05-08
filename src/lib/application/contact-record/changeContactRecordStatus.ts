import type {
	ContactRecord,
	ContactRecordId,
	ContactRecordStatus
} from '$lib/domain/contact-record';
import { assertCanTransitionTo } from '$lib/domain/contact-record';
import type { ContactRecordRepository } from './ContactRecordRepository';

export async function changeContactRecordStatus(
	repository: ContactRecordRepository,
	id: ContactRecordId,
	nextStatus: ContactRecordStatus
): Promise<ContactRecord> {
	const current = await repository.findById(id);

	if (!current) {
		throw new Error(`ContactRecord not found: ${id}`);
	}

	assertCanTransitionTo(current.status, nextStatus);

	const updated: ContactRecord = {
		...current,
		status: nextStatus,
		lastActionAt: new Date().toISOString()
	};

	await repository.save(updated);

	return updated;
}
