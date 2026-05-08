import type { ContactRecordRepository } from '$lib/application/contact-record/ContactRecordRepository';
import type { ContactRecord, ContactRecordId } from '$lib/domain/contact-record';

const STORAGE_KEY = 'contactnote:contact-records';

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

function loadRecords(): ContactRecord[] {
	if (!isBrowser()) {
		return [];
	}

	const raw = window.localStorage.getItem(STORAGE_KEY);

	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);

		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed as ContactRecord[];
	} catch {
		return [];
	}
}

function saveRecords(records: ContactRecord[]): void {
	if (!isBrowser()) {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createLocalStorageContactRecordRepository(): ContactRecordRepository {
	return {
		async list() {
			return loadRecords();
		},

		async findById(id: ContactRecordId) {
			const records = loadRecords();

			return records.find((record) => record.id === id) ?? null;
		},

		async save(record: ContactRecord) {
			const records = loadRecords();
			const index = records.findIndex((item) => item.id === record.id);

			if (index === -1) {
				saveRecords([record, ...records]);
				return;
			}

			const nextRecords = records.map((item) => {
				if (item.id !== record.id) {
					return item;
				}

				return record;
			});

			saveRecords(nextRecords);
		},

		async delete(id: ContactRecordId) {
			const records = loadRecords();
			const nextRecords = records.filter((record) => record.id !== id);

			saveRecords(nextRecords);
		}
	};
}
