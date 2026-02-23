# SALLY Profile Site

SALLYの専属AI秘書プロフィールページ。静的サイト（HTML/CSS/JS のみ）。

## ローカルで表示する

`fetch` を使うためローカルサーバーが必要です。Python 標準ライブラリだけで起動できます:

```bash
cd sally-profile-site
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開いてください。

## ファイル構成

```
index.html          メインページ
style.css           スタイルシート
script.js           タイムライン読み込みスクリプト
assets/
  Sally.png         プロフィール画像
  sally-bunner2.jpg バナー画像
data/
  updates.json      進化タイムラインのデータ（JSON配列）
  projects.json     開発担当プロジェクト一覧データ
scripts/
  add_update.sh     タイムラインにエントリを追加するスクリプト
```

## タイムラインの更新方法

`scripts/add_update.sh` を使って `data/updates.json` にエントリを追加します（表示は時系列順）:

```bash
# 基本コマンド
./scripts/add_update.sh <YYYY-MM-DD> <タイトル> <詳細>

# 実行例
./scripts/add_update.sh "2026-03-01" "新機能タイトル" "詳細説明テキスト"
```

- 日付は `YYYY-MM-DD` 形式（必須）
- ページは自動的に時系列順（古い→新しい）で表示します
- `python3` が必要です（macOS / Linux 標準搭載）
- jq などの外部ツールは不要です

### 手動で編集する場合

`data/updates.json` を直接編集することもできます。配列に要素を追加してください:

```json
[
  {
    "date": "2026-03-01",
    "title": "新機能タイトル",
    "details": "詳細説明テキスト"
  }
]
```

## 技術仕様

- 静的 HTML / CSS / JS のみ（フレームワーク不使用）
- `fetch` API でタイムラインデータを読み込み
- レスポンシブデザイン対応
- サーバーサイド処理なし

## 運用ルール（SALLY）

- 更新は **事実ベースのみ**（推測・誇張は記載しない）
- タイムラインは以下の分類を使う
  - `category`: 例）運用開始 / 基本機能実装 / タスク受注
  - `type`: 例）連携 / 自動化 / 会議支援 / 可視化
- 「SALLY開発用」内の開発プロジェクトは `data/projects.json` に追加・更新する
- 新タスクや新機能を実装した日は、当日分として `updates.json` に必ず追記する
