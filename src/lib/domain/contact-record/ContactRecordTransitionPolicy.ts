import type { ContactRecordStatus } from './ContactRecordStatus';

const transitions: Record<ContactRecordStatus, ContactRecordStatus[]> = {
	new: ['in_progress'],
	in_progress: ['waiting_for_reply', 'resolved'],
	waiting_for_reply: ['in_progress', 'resolved'],
	resolved: ['closed'],
	closed: []
};

export function getNextStatuses(current: ContactRecordStatus): ContactRecordStatus[] {
	return transitions[current];
}

export function canTransitionTo(current: ContactRecordStatus, next: ContactRecordStatus): boolean {
	return transitions[current].includes(next);
}

export function assertCanTransitionTo(
	current: ContactRecordStatus,
	next: ContactRecordStatus
): void {
	if (!canTransitionTo(current, next)) {
		throw new Error(`Invalid status transition: ${current} -> ${next}`);
	}
}
