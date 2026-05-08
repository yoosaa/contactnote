import {
	changeContactRecordStatus,
	createContactRecord,
	deleteContactRecord,
	getContactRecord,
	listContactRecords,
	updateContactRecord
} from '$lib/application/contact-record';
import type {
	ContactRecordDraft,
	ContactRecordId,
	ContactRecordStatus
} from '$lib/domain/contact-record';
import { createLocalStorageContactRecordRepository } from '$lib/infrastructure/contact-record';

function createRepository() {
	return createLocalStorageContactRecordRepository();
}

export async function listContactRecordsUseCase() {
	return listContactRecords(createRepository());
}

export async function getContactRecordUseCase(id: ContactRecordId) {
	return getContactRecord(createRepository(), id);
}

export async function createContactRecordUseCase(draft: ContactRecordDraft) {
	return createContactRecord(createRepository(), draft);
}

export async function updateContactRecordUseCase(id: ContactRecordId, draft: ContactRecordDraft) {
	return updateContactRecord(createRepository(), id, draft);
}

export async function deleteContactRecordUseCase(id: ContactRecordId) {
	return deleteContactRecord(createRepository(), id);
}

export async function changeContactRecordStatusUseCase(
	id: ContactRecordId,
	nextStatus: ContactRecordStatus
) {
	return changeContactRecordStatus(createRepository(), id, nextStatus);
}
