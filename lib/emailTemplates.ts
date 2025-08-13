// Supabaseメールテンプレート設定

// メンバー招待メールのSubject heading
export const INVITE_EMAIL_SUBJECT = 'Fearlock - 組織への招待'

// メンバー招待メールのMessage body
export const INVITE_EMAIL_BODY = `
Fearlockへようこそ！

あなたは組織に招待されました。

以下の情報でアカウントを作成し、組織に参加してください：

**招待された組織**: {{ .OrganizationName }}
**権限**: {{ .Role }}

アカウント作成は以下のリンクから行えます：
{{ .ConfirmationURL }}

このリンクは24時間有効です。

セキュリティに関するご質問がございましたら、お気軽にお問い合わせください。

---
Fearlock Team
セキュリティ管理プラットフォーム
https://fearlock.com
`

// HTML版のメールテンプレート
export const INVITE_EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fearlock - 組織への招待</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
        }
        .info-box {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fearlock</h1>
        <p>セキュリティ管理プラットフォーム</p>
    </div>
    
    <div class="content">
        <h2>組織への招待</h2>
        <p>Fearlockへようこそ！</p>
        <p>あなたは組織に招待されました。以下の情報でアカウントを作成し、組織に参加してください。</p>
        
        <div class="info-box">
            <h3>招待情報</h3>
            <p><strong>組織名:</strong> {{ .OrganizationName }}</p>
            <p><strong>権限:</strong> {{ .Role }}</p>
            <p><strong>招待者:</strong> {{ .InvitedBy }}</p>
        </div>
        
        <p>アカウント作成は以下のボタンから行えます：</p>
        <a href="{{ .ConfirmationURL }}" class="button">アカウントを作成</a>
        
        <p><small>このリンクは24時間有効です。</small></p>
        
        <p>セキュリティに関するご質問がございましたら、お気軽にお問い合わせください。</p>
    </div>
    
    <div class="footer">
        <p>Fearlock Team</p>
        <p>セキュリティ管理プラットフォーム</p>
        <p><a href="https://fearlock.com">https://fearlock.com</a></p>
    </div>
</body>
</html>
`

// メールテンプレートの設定
export const EMAIL_TEMPLATES = {
  invite: {
    subject: INVITE_EMAIL_SUBJECT,
    body: INVITE_EMAIL_BODY,
    html: INVITE_EMAIL_HTML
  }
}

// Supabaseダッシュボードでの設定手順
export const SUPABASE_EMAIL_SETUP_INSTRUCTIONS = `
## Supabaseメールテンプレート設定手順

### 1. Supabaseダッシュボードにアクセス
- https://supabase.com/dashboard にログイン
- プロジェクトを選択

### 2. Authentication > Email Templates に移動
- 左サイドバーから「Authentication」を選択
- 「Email Templates」タブをクリック

### 3. Invite User テンプレートを編集
- 「Invite User」テンプレートを選択
- 「Edit Template」ボタンをクリック

### 4. Subject を設定
以下の内容をコピーしてSubject欄に貼り付け：
${INVITE_EMAIL_SUBJECT}

### 5. Message Body を設定
以下の内容をコピーしてMessage Body欄に貼り付け：
${INVITE_EMAIL_BODY}

### 6. HTML版を設定（オプション）
HTML版を使用する場合は、以下の内容をHTML欄に貼り付け：
${INVITE_EMAIL_HTML}

### 7. 保存
- 「Save」ボタンをクリックして設定を保存

### 8. テンプレート変数
以下の変数が利用可能です：
- {{ .ConfirmationURL }}: アカウント作成リンク
- {{ .Email }}: 招待されたメールアドレス
- {{ .Token }}: 招待トークン
- {{ .TokenHash }}: トークンハッシュ
- {{ .SiteURL }}: サイトURL
- {{ .RedirectTo }}: リダイレクト先URL

### 9. カスタム変数の追加
組織情報を表示するために、以下のカスタム変数を追加できます：
- {{ .OrganizationName }}: 組織名
- {{ .Role }}: 権限
- {{ .InvitedBy }}: 招待者名

これらの変数は、招待時にdataオブジェクトで渡された値が表示されます。
` 