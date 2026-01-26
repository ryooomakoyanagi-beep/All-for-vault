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

- **開発環境（ローカル）**: フィードバックは `data/feedback.jsonl` ファイルに保存されます
- **Vercel（本番環境）**: フィードバックは**必須**でVercel KVまたはUpstash Redisに保存されます（ファイルシステムは使用できません）

### Vercel KV / Upstash Redisの設定（必須）

Vercelにデプロイする場合、フィードバック機能を動作させるために**必ず**KVストアの設定が必要です：

#### 方法1: Vercel MarketplaceからUpstash Redisを追加（推奨）

1. **Vercelダッシュボードでプロジェクトを開く**
2. **「Storage」タブをクリック**
3. **「Create Database」をクリック**
4. **「Upstash Redis」を選択**（または「KV」が表示されている場合はそれを選択）
5. **データベース名を入力して作成**
6. **環境変数の自動設定**
   - データベースを作成すると、`UPSTASH_REDIS_REST_URL` と `UPSTASH_REDIS_REST_TOKEN` が自動的に設定されます
   - これらは環境変数として自動的に利用可能になります

#### 方法2: 手動で環境変数を設定

1. **Upstash Redisアカウントを作成**（https://upstash.com/）
2. **Redisデータベースを作成**
3. **Vercelダッシュボードの「Settings」→「Environment Variables」から以下を設定**：
   - `UPSTASH_REDIS_REST_URL`: Upstash RedisのREST API URL（例: `https://xxx.upstash.io`）
   - `UPSTASH_REDIS_REST_TOKEN`: Upstash Redisの認証トークン
   
   **注意**: 古いVercel KVを使用している場合は、`KV_REST_API_URL` と `KV_REST_API_TOKEN` もサポートされていますが、`UPSTASH_REDIS_REST_URL` と `UPSTASH_REDIS_REST_TOKEN` を優先的に使用します。

#### トラブルシューティング

- **フィードバック送信が失敗する場合**:
  1. Vercelダッシュボードの「Settings」→「Environment Variables」で以下が設定されているか確認：
     - `UPSTASH_REDIS_REST_URL` と `UPSTASH_REDIS_REST_TOKEN`（推奨）
     - または `KV_REST_API_URL` と `KV_REST_API_TOKEN`（旧形式）
  2. Vercelのログ（「Deployments」→ デプロイメントを選択 → 「Functions」タブ → `/api/feedback`をクリック）でエラーメッセージを確認
  3. ログに「Storage configuration」が表示されているので、`redisInitialized: true`になっているか確認
  4. 環境変数が設定されている場合、Vercelの「Storage」タブでデータベースが正常に作成されているか確認
  5. エラーメッセージに「Redis/KV is not configured」と表示されている場合、環境変数の設定を確認してください

**重要**: Vercel環境ではファイルシステムへの書き込みは不可能なため、KVストアの設定は**必須**です。設定されていない場合、フィードバック機能は動作しません。

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
