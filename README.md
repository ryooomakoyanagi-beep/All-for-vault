# All for Vault

棒高跳技術分析とアドバイスツール

## 機能

- **助走・ポール分析** - 跳躍データを入力して、助走とポール選択のフィードバックを取得
- **技術アドバイス** - AIによる技術的なアドバイスを取得

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` ファイルを `.env.local` にコピーし、実際の値を設定してください：

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# または手動で .env.local を作成
```

`.env.local` ファイルを開き、以下の値を設定してください：

```bash
# OpenAI API Key for technical advice feature
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Admin password for feedback management page
# Use a strong password and never commit this file
ADMIN_PASSWORD=your_admin_password_here
```

**⚠️ 重要: `.env.local` ファイルは絶対にGitにコミットしないでください！**

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## その他のコマンド

- `npm run build` - 本番用にアプリケーションをビルド
- `npm start` - 本番モードでアプリケーションを起動
- `npm run lint` - ESLintでコードをチェック
- `npm run check:secrets` - 秘密情報の漏洩をチェック（GitHubに公開する前に実行推奨）

## Vercelへのデプロイ

### フィードバック保存について

- **開発環境**: フィードバックは `data/feedback.jsonl` ファイルに保存されます
- **Vercel（本番環境）**: フィードバックはVercel KV（またはUpstash Redis）に保存されます

### Vercel KVの設定（オプション）

Vercelにデプロイする場合、フィードバック機能を動作させるためにVercel KV（またはUpstash Redis）の設定が必要です：

1. **VercelダッシュボードでKVストアを作成**
   - Vercelプロジェクトの「Storage」セクションから「Create Database」を選択
   - 「KV」または「Upstash Redis」を選択して作成

2. **環境変数の自動設定**
   - Vercel KVを作成すると、`KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動的に設定されます
   - これらは環境変数として自動的に利用可能になります

3. **手動で環境変数を設定する場合**
   - Vercelダッシュボードの「Settings」→「Environment Variables」から設定
   - `KV_REST_API_URL`: KVストアのREST API URL
   - `KV_REST_API_TOKEN`: KVストアの認証トークン

**注意**: Vercel KVが設定されていない場合、フィードバック機能はエラーを返します。開発環境ではファイルシステムを使用するため、ローカル開発では問題ありません。

## フィードバック管理画面

フィードバック管理画面にアクセスするには：

1. ブラウザで `/admin/feedback?password=YOUR_ADMIN_PASSWORD` にアクセス
2. または、開発者ツールで `X-Admin-Password` ヘッダーを設定して `/api/feedback` にGETリクエスト

**⚠️ 管理者パスワードは他人と共有しないでください。**

## プロジェクト構造

- `pages/` - ページコンポーネント
  - `index.js` - ホームページ
  - `analysis.js` - 助走・ポール分析ページ
  - `advice.js` - 技術アドバイスページ
  - `feedback.js` - フィードバックフォーム
  - `disclaimer.js` - 注意事項ページ
  - `admin/feedback.js` - フィードバック管理画面
  - `api/` - APIルート
    - `analyze.js` - 分析処理API
    - `advice.js` - OpenAI API呼び出し
    - `feedback.js` - フィードバック保存・取得API
- `styles/` - グローバルスタイル
- `public/` - 静的ファイル（画像など）
- `data/` - データファイル（CSV、Excel、Word、フィードバックJSONL）
- `scripts/` - ユーティリティスクリプト
  - `check-secrets.js` - 秘密情報チェックスクリプト

## 使用しているパッケージ

- `next` - Next.jsフレームワーク
- `react` / `react-dom` - Reactライブラリ
- `csv-parse` - CSVファイルの解析
- `xlsx` - Excelファイル（.xlsx）の読み取り
- `openai` - OpenAI API SDK
- `mammoth` - Word文書（.docx）の読み取り
- `tailwindcss` - CSSフレームワーク

## ファイル構造

### 参考資料ファイル

参考資料ファイルは `data/reference/` ディレクトリに配置してください：

- `dj_mid_chart.csv` - 中間マークチャート
- `pole_resistance.csv` - ポール抵抗データ
- `logic_bend_landing_matrix.xlsx` - 湾曲・着地マトリックス
- `logic_takeoff_mid_matrix.xlsx` - 踏切・中間マークマトリックス
- `最終ボウタカ.docx` - 参考資料（Word文書）
- `ボウタカAI　用語集.xlsx` - 用語集（Excel）

**重要**: これらのファイルは `data/reference/` ディレクトリに配置する必要があります。

## GitHubに公開する前に

### セキュリティチェック

GitHubに公開する前に、必ず以下を実行してください：

```bash
npm run check:secrets
```

このコマンドは以下をチェックします：
- `.env.local` がGitに追跡されていないか
- コード内にハードコードされた秘密情報がないか
- `NEXT_PUBLIC_` プレフィックスが誤って使用されていないか

### 公開手順

1. **参考資料ファイルを移動**
   ```bash
   # data/reference/ ディレクトリを作成
   mkdir -p data/reference
   
   # 参考資料ファイルを移動（Windows PowerShell）
   Move-Item dj_mid_chart.csv data/reference/
   Move-Item pole_resistance.csv data/reference/
   Move-Item logic_bend_landing_matrix.xlsx data/reference/
   Move-Item logic_takeoff_mid_matrix.xlsx data/reference/
   Move-Item "最終ボウタカ.docx" data/reference/
   Move-Item "ボウタカAI　用語集.xlsx" data/reference/
   ```

2. **Gitリポジトリの初期化（初回のみ）**
   ```bash
   git init
   git branch -M main
   ```

3. **ファイルの追加とコミット**
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

4. **GitHubリポジトリの作成と接続**
   - GitHubで新しいリポジトリを作成
   - 以下のコマンドでリモートを追加（`YOUR_USERNAME`と`REPO_NAME`を置き換え）：
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   ```

5. **プッシュ**
   ```bash
   git push -u origin main
   ```

**⚠️ 注意: `.env.local` ファイルがコミットされていないことを確認してください！**

## ライセンス

このプロジェクトはプライベートプロジェクトです。
