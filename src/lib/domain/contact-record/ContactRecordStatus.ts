export const contactRecordStatuses = [
	'new',
	'in_progress',
	'waiting_for_reply',
	'resolved',
	'closed'
] as const;

export type ContactRecordStatus = (typeof contactRecordStatuses)[number];

export const contactRecordStatusLabels: Record<ContactRecordStatus, string> = {
	new: '未着手',
	in_progress: '対応中',
	waiting_for_reply: '返答待ち',
	resolved: '解決済み',
	closed: '完了'
};
