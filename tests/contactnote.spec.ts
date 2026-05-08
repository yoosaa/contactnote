import { expect, test } from '@playwright/test';

test.describe('Contactnote', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		await page.evaluate(() => {
			localStorage.clear();
		});

		await page.reload();
	});

	test('問い合わせを作成し、状態変更・編集・削除できる', async ({ page }) => {
		const title = `予約日時変更の相談 ${Date.now()}`;
		const updatedTitle = `${title} 更新後`;

		await page.goto('/');

		await page.getByRole('button', { name: '新規作成' }).click();

		await expect(page.getByRole('heading', { name: '問い合わせを新規作成' })).toBeVisible();

		await page.getByLabel('タイトル').fill(title);
		await page.getByLabel('顧客名').fill('山田 花子');
		await page.getByLabel('連絡チャネル').selectOption('web_form');
		await page.getByLabel('ステータス').selectOption('new');
		await page.getByLabel('担当者').fill('佐野');
		await page.getByLabel('要約').fill('予約日時を来週に変更したいという問い合わせ。');
		await page
			.getByLabel('詳細')
			.fill('Webフォーム経由で、来週水曜日の午後に変更可能か相談があった。');

		await page.getByRole('button', { name: '保存する' }).click();

		await expect(page.getByRole('heading', { name: title })).toBeVisible();
		await expect(page.getByText('未着手')).toBeVisible();
		await expect(page.locator('dd', { hasText: 'Webフォーム' })).toBeVisible();
		await expect(page.getByText('予約日時を来週に変更したいという問い合わせ。')).toBeVisible();

		await page.getByRole('button', { name: '対応中にする' }).click();

		await expect(page.getByText('対応中')).toBeVisible();
		await expect(page.getByRole('button', { name: '返答待ちにする' })).toBeVisible();
		await expect(page.getByRole('button', { name: '解決済みにする' })).toBeVisible();

		await page.getByRole('button', { name: '編集' }).click();

		await expect(page.getByRole('heading', { name: '問い合わせを編集' })).toBeVisible();

		await page.getByLabel('タイトル').fill(updatedTitle);
		await page.getByLabel('要約').fill('予約日時変更について、候補日を確認中。');

		await page.getByRole('button', { name: '保存する' }).click();

		await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
		await expect(page.getByText('予約日時変更について、候補日を確認中。')).toBeVisible();

		await page.getByRole('button', { name: '← 一覧へ戻る' }).click();

		await expect(page.getByRole('heading', { name: '問い合わせ一覧' })).toBeVisible();
		await expect(page.getByText(updatedTitle)).toBeVisible();

		const card = page.locator('article').filter({ hasText: updatedTitle });
		await card.getByRole('button', { name: '詳細を見る' }).click();

		await page.getByRole('button', { name: '編集' }).click();

		page.on('dialog', async (dialog) => {
			expect(dialog.message()).toContain('この問い合わせを削除しますか？');
			await dialog.accept();
		});

		await page.getByRole('button', { name: '削除する' }).first().click();

		await expect(page.getByRole('heading', { name: '問い合わせ一覧' })).toBeVisible();
		await expect(page.getByText(updatedTitle)).not.toBeVisible();
	});
});
