import type { ContactRecordStatus } from '$lib/domain/contact-record';

export function getContactStatusBadgeClass(status: ContactRecordStatus): string {
	const classByStatus: Record<ContactRecordStatus, string> = {
		new: 'rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800',
		in_progress: 'rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800',
		waiting_for_reply: 'rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800',
		resolved: 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800',
		closed: 'rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700'
	};

	return classByStatus[status];
}
