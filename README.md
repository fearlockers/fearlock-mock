# Fearlock - 統合セキュリティプラットフォーム

Fearlockは、脆弱性診断、ソースコード診断、ネットワーク診断からネットワーク監視まで包括的に対応する現代的なセキュリティSaaSプラットフォームです。WAFやFirewall機能も統合された、企業のセキュリティ運用を一元化するソリューションです。

## 🚀 主な機能

### 📊 統合ダッシュボード
- リアルタイムセキュリティメトリクス
- 脆弱性検出トレンド分析
- 攻撃の可視化と統計情報
- 最新のセキュリティアクティビティ

### 🔍 脆弱性診断
- OWASP Top 10対応
- SQLインジェクション検出
- XSS（クロスサイトスクリプティング）検出
- 自動スキャンとレポート生成
- CVE情報連携

### 🛡️ WAF/Firewall管理
- Web Application Firewall機能
- ネットワークファイアウォール統合管理
- リアルタイム攻撃ブロック
- カスタムルール設定
- 攻撃ログの詳細分析

### 👥 その他の機能
- ソースコード診断（開発予定）
- ネットワークスキャン（開発予定）
- 24/7ネットワーク監視（開発予定）
- レポート生成（開発予定）
- チーム管理（開発予定）

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **アニメーション**: Framer Motion
- **チャート**: Recharts
- **フォーム管理**: React Hook Form + Zod

## 📋 前提条件

- Node.js 18.0以上
- npm または yarn

## 🚀 セットアップ

### ローカル開発

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd fearlock-security-platform
```

2. **依存関係のインストール**
```bash
npm install
# または
yarn install
```

3. **開発サーバーの起動**
```bash
npm run dev
# または
yarn dev
```

4. **ブラウザでアクセス**
```
http://localhost:3000
```

### デプロイ

#### GitHub Pages
- `main` ブランチにプッシュすると自動的にGitHub Pagesにデプロイされます
- デプロイ先: `https://fearlockers.github.io/fearlock-dev/`

#### Vercel
1. **Vercelアカウントでログイン**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでログイン

2. **プロジェクトのインポート**
   - 「New Project」をクリック
   - `fearlockers/fearlock-dev` リポジトリを選択
   - プロジェクト名: `fearlock-dev`

3. **環境変数の設定**
   - Vercelダッシュボードで環境変数を設定
   - 必要な環境変数:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **デプロイ**
   - 「Deploy」をクリック
   - 自動的にデプロイが開始されます

## 📁 プロジェクト構造

```
fearlock-security-platform/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── Dashboard.tsx      # ダッシュボード
│   ├── Header.tsx         # ヘッダー
│   ├── Sidebar.tsx        # サイドバー
│   ├── VulnerabilityScanner.tsx  # 脆弱性診断
│   └── WAFFirewall.tsx    # WAF/Firewall管理
├── next.config.js         # Next.js設定
├── tailwind.config.js     # Tailwind CSS設定
├── tsconfig.json          # TypeScript設定
└── package.json           # 依存関係
```

## 🎨 UI/UX 特徴

- **モダンなデザイン**: 直感的で使いやすいインターフェース
- **レスポンシブ対応**: デスクトップ・タブレット・モバイル対応
- **アニメーション**: Framer Motionによる滑らかなトランジション
- **ダークモード対応**: （今後実装予定）
- **アクセシビリティ**: WAI-ARIA準拠

## 📈 今後の開発予定

### Phase 1 - 基本機能拡充
- [ ] ソースコード診断機能
- [ ] ネットワークスキャン機能
- [ ] レポート生成機能
- [ ] ユーザー認証・認可

### Phase 2 - 高度な機能
- [ ] API連携
- [ ] 自動化ワークフロー
- [ ] 機械学習による異常検知
- [ ] SIEM連携

### Phase 3 - エンタープライズ機能
- [ ] マルチテナント対応
- [ ] SSO（Single Sign-On）
- [ ] コンプライアンス機能
- [ ] カスタムダッシュボード

## 🤝 貢献

プロジェクトへの貢献を歓迎します：

1. Forkする
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 📞 お問い合わせ

プロジェクトに関するご質問やご提案がございましたら、お気軽にお問い合わせください。

---

**Fearlock** - 企業のセキュリティを次のレベルへ 🚀
