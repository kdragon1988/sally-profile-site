#!/usr/bin/env bash
# ────────────────────────────────────────────
# add_update.sh — SALLYタイムラインにエントリを追加
#
# Usage:
#   ./scripts/add_update.sh "2026-02-24" "タイトル" "詳細テキスト"
#
# JSON配列の末尾に新しいオブジェクトを安全に追加する。
# python3（macOS / Linux 標準搭載）を利用。jq 不要。
# ────────────────────────────────────────────
set -euo pipefail

JSON_FILE="$(cd "$(dirname "$0")/.." && pwd)/data/updates.json"

# ── 引数チェック ──
if [ $# -ne 3 ]; then
  echo "Usage: $0 <date> <title> <details>"
  echo "  date    : YYYY-MM-DD 形式"
  echo "  title   : 更新タイトル"
  echo "  details : 詳細説明"
  exit 1
fi

DATE="$1"
TITLE="$2"
DETAILS="$3"

# ── 日付フォーマット検証 ──
if ! echo "$DATE" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "Error: date must be YYYY-MM-DD format." >&2
  exit 1
fi

# ── JSONファイル存在確認 ──
if [ ! -f "$JSON_FILE" ]; then
  echo "Error: $JSON_FILE not found." >&2
  exit 1
fi

# ── python3 で安全にJSONを更新 ──
python3 - "$JSON_FILE" "$DATE" "$TITLE" "$DETAILS" << 'PYEOF'
import json, sys, os, tempfile

json_file, date, title, details = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append({"date": date, "title": title, "details": details})

# Write to temp file then rename for safety
dir_name = os.path.dirname(json_file)
fd, tmp_path = tempfile.mkstemp(suffix='.tmp', dir=dir_name)
try:
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    os.rename(tmp_path, json_file)
except BaseException:
    os.unlink(tmp_path)
    raise
PYEOF

echo "Added: $DATE - $TITLE"
echo "File: $JSON_FILE"
