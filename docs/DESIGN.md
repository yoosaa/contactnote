# Contactnote Design

Contactnote は、小規模事業者向けの問い合わせ・対応管理メモツールです。

このドキュメントでは、Google Stitch で生成した UI と DESIGN.md をもとに、Contactnote として採用したデザイン方針を整理します。

Stitch の出力はそのまま実装するのではなく、画面構成・情報整理・余白・状態表現の参考資料として扱います。

## Design Concept

Contactnote のデザインコンセプトは、落ち着いていて信頼感のある軽量な業務ツールです。

本格的な CRM のように多機能・高密度にしすぎず、小規模店舗・個人運営・フリーランス・小規模チームでも迷わず使えることを重視します。

目指す印象は以下です。

- 落ち着いている
- 業務ツールとして見やすい
- 情報が整理されている
- 次にやることが分かりやすい
- 過度に装飾しない
- 将来的に SaaS として育てられそう

Stitch の DESIGN.md では、Minimalism / Modern Corporate をベースに、問い合わせの混沌を整理された静かな作業空間に変える “Trusted Assistant” のような方向性が示されていました。

Contactnote でもこの方向性を採用します。

## Color

基本方針は、淡い背景と白いカードを中心にした低ノイズな配色です。

### Base

- background: off-white / slate-50 系
- surface: white
- border: slate-200 系
- text: slate-950 系
- muted text: slate-500 / slate-600 系
- primary: deep navy / slate-950 系

画面全体は明るい背景にし、問い合わせカードやフォームは白いカードとして表示します。

これにより、各問い合わせが「1つの対応対象」として分かれて見えるようにします。

## Typography

フォントは、Stitch の方針では Manrope が指定されていました。

実装では以下の順で指定します。

```css
Manrope,
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif
```

文字の使い分けは以下です。

- ページタイトル: 大きく、太く、視線の起点にする
- セクションタイトル: 情報のまとまりを示す
- 本文: 読みやすい行間を確保する
- ラベル: 小さく太く、入力項目やメタ情報を識別しやすくする
- キッカー: uppercase / tracking を使い、セクションの補助情報として使う

Layout

Contactnote では、以下の共通レイアウトを採用します。

AppShell

- Sidebar
- MainContent

左側に最小限のサイドバー、右側にメインコンテンツを置きます。

初期 MVP では、サイドバーの項目は増やしすぎません。

Sidebar:

- Contactnote
- 問い合わせ

Dashboard / Contacts / Archive / Settings / Help などは、Stitch の出力にはありましたが、初期 MVP では未採用です。

未実装のナビゲーションを並べると、プロダクトの完成度が低く見えやすいためです。

Spacing

余白は 8px ベースで考えます。

主な方針は以下です。

- カード内 padding は広めに取る
- 一覧カード同士には十分な余白を取る
- 詳細画面では読むための縦方向の余白を重視する
- フォームでは項目同士を詰めすぎない
- 情報のまとまりごとにカードを分ける

Stitch の DESIGN.md でも、問い合わせ一覧では各問い合わせを独立した扱いやすいタスクとして見せるため、十分な padding と vertical rhythm を重視する方針が示されていました。

Contactnote でもこの方針を採用します。

Shape and Elevation

角丸と影は控えめに使います。

- Radius
- Button / input: rounded-lg
- Card: rounded-2xl
- Badge: rounded-full
- Elevation

強い shadow は使いません。

基本は以下です。

- white background
- 1px border
- hover 時だけ軽い shadow

Stitch の方針では、重い影ではなく tonal layers と low-contrast outlines を使う設計でした。

Contactnote でも、カードは境界線で分け、影は控えめにします。

Components
Button

共通 UI として Button.svelte を使います。

主な variant は以下です。

- primary: 主操作
- secondary: 補助操作
- danger: 削除などの危険操作
- danger-outline: 危険操作の控えめ表示
- ghost: 装飾を抑えた操作
- ghost-link: 戻る導線などの軽いリンク風ボタン
- Usage

primary:

- 新規作成
- 保存する
- 状態変更

secondary:

- 詳細を見る
- 編集
- フィルタリセット

danger:

- Danger Zone 内の削除

danger-outline:

- ヘッダー付近の削除

ghost-link:

- 一覧へ戻る
- 詳細へ戻る

Button はボタンそのものの見た目を担当します。

余白や配置は呼び出し側で className を渡して調整します。

例:
<Button variant="ghost-link" className="mb-6" onclick={backToList}>
← 一覧へ戻る
</Button>

FieldLabel

フォームのラベルは FieldLabel.svelte を使います。

ラベルは小さく太く表示し、入力対象が分かりやすいようにします。

用途:

- ステータス
- 担当者
- タイトル
- 顧客名
- 連絡チャネル
- 要約
- 詳細

Input / Select / Textarea

フォーム要素の class は fieldClasses.ts にまとめます。

inputClass
selectClass
textareaClass

これにより、Tailwind の長い class を各画面に散らばらせすぎないようにします。

ただし、すべてをコンポーネント化しすぎない方針です。

bind:value との相性や、フォーム項目ごとの違いを考慮し、まずは class 定数で十分と判断しています。

Status Badge

ステータスは pill 型の badge で表示します。

Stitch の DESIGN.md では、Status Badges は pill-shaped chips として、薄い背景色と高コントラストな文字色を使う方針でした。

Contactnote でもこの方針を採用します。

Statuses

new: 未着手
in_progress: 対応中
waiting_for_reply: 返答待ち
resolved: 解決済み
closed: 完了

Badge colors

new:

- red 系
- 未着手であることを強調

in_progress:

- blue 系
- 現在対応中であることを示す

waiting_for_reply:

- amber 系
- 止まりやすい状態として見つけやすくする

resolved:

- green 系
- 実質解決済みであることを示す

closed:

- slate / gray 系
- 完了済みとして控えめに表示する

実装では ContactStatusBadge.svelte としてコンポーネント化し、Storybook で全状態を確認できるようにしています。

Inquiry Cards

一覧画面のカードは、問い合わせを 1 件の対応対象として見せるための主要コンポーネントです。

カード内の構造は以下です。

ContactRecordCard

- status badge
- contactChannel
- lastActionAt
- title
- customerName
- summary excerpt
- detail action

一覧画面は「読む場所」ではなく「見つける場所」です。

そのため、details は一覧には出しません。

一覧では以下を重視します。

- 未着手を見つけやすい
- 返答待ちを見つけやすい
- 止まっている対応を見つけやすい
- 詳細へ進みやすい
- 情報を載せすぎない

new のカードには左側のアクセントを付け、未着手を目立たせます。

Detail Layout

詳細画面は、問い合わせの文脈を読む場所です。

一覧画面とは役割を分け、summary と details を別カードとして扱います。

ContactDetailPage

- Header
- Summary Card
- Details Card
- Information Panel
- Next Action Panel

詳細画面では以下を重視します。

- 問い合わせの内容を落ち着いて読める
- summary と details の違いが分かる
- 顧客名・連絡チャネル・受付日時・担当者が確認できる
- 現在の状態と次に進める状態が分かる
- 編集画面とは役割を分ける
- Edit Form

編集画面は、情報を更新する場所です。

詳細画面のように読むことを目的にせず、入力と保存に集中できる構成にします。

ContactEditPage

- Header
- Workflow Section
- Basic Info Section
- Content Section
- Danger Zone

Workflow

- status
- owner

Basic Info

- title
- customerName
- contactChannel
- receivedAt display

Content

- summary
- details
- Danger Zone
- delete

receivedAt は作成時に自動で記録し、編集画面では表示のみとします。

これは、Stitch の編集画面にあった「system-generated and cannot be edited directly」という考え方を Contactnote に合わせて採用したものです。
