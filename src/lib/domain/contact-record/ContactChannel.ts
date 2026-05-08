export const contactChannels = ['email', 'phone', 'web_form', 'sns', 'in_person', 'other'] as const;

export type ContactChannel = (typeof contactChannels)[number];

export const contactChannelLabels: Record<ContactChannel, string> = {
	email: 'メール',
	phone: '電話',
	web_form: 'Webフォーム',
	sns: 'SNS',
	in_person: '対面',
	other: 'その他'
};
