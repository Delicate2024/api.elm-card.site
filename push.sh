#!/bin/bash

COMMIT_MESSAGE="auto: update"
BRANCH_NAME="master"
GITEA_REMOTE="origin"
GITHUB_REMOTE="github"

echo "=== Starting Git Auto Push Script ==="
echo "Commit message: $COMMIT_MESSAGE"
echo "Branch: $BRANCH_NAME"
echo "Gitea remote: $GITEA_REMOTE"
echo "GitHub remote: $GITHUB_REMOTE"

# 提交变更
echo "[1] Adding and committing changes..."
git add .
git commit -m "$COMMIT_MESSAGE"

echo "[2] Pushing to remotes..."
git push $GITEA_REMOTE "$BRANCH_NAME"
git push $GITHUB_REMOTE "$BRANCH_NAME"

# 获取 Gitea 上最新 tag（只提取数字格式的）
echo "[3] Fetching tags from $GITEA_REMOTE ..."
LATEST_TAG=$(git ls-remote --tags "$GITEA_REMOTE" | \
  grep -oE 'refs/tags/[0-9]+\.[0-9]+' | sed 's/refs\/tags\///' | \
  sort -V | tail -n 1)

echo "Latest tag on remote is: $LATEST_TAG"

# 将版本号转为整数（*100）以避免浮点问题
if [[ -z "$LATEST_TAG" ]]; then
    echo "No existing tag found, starting from 0.01"
    LATEST_INT=0
else
    LATEST_INT=$(echo "$LATEST_TAG" | awk -F. '{printf("%d", $1*100 + $2)}')
    echo "Converted latest tag to integer: $LATEST_INT"
fi

# 计算新 tag 的整数形式并格式化为 X.XX
NEW_INT=$((LATEST_INT + 1))
NEW_TAG=$(printf "%d.%02d" $((NEW_INT / 100)) $((NEW_INT % 100)))

echo "Calculated new tag: $NEW_TAG"

# 检查远程是否已有该 tag
echo "[4] Checking if tag $NEW_TAG already exists on remote..."
if git ls-remote --tags "$GITEA_REMOTE" | grep -q "refs/tags/$NEW_TAG"; then
    echo "Tag $NEW_TAG already exists on remote, skipping tag creation."
else
    echo "[5] Creating and pushing new tag: $NEW_TAG"
    git tag "$NEW_TAG"
    git push $GITEA_REMOTE "$NEW_TAG"
    git push $GITHUB_REMOTE "$NEW_TAG"
    echo "✅ Pushed to $BRANCH_NAME with tag $NEW_TAG"
fi

echo "=== Script Finished ==="
