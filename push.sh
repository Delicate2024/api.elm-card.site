#!/bin/bash

# 设置变量
COMMIT_MESSAGE="auto: update"
BRANCH_NAME="master"
GITEA_REMOTE="origin"
GITHUB_REMOTE="github"

# 添加并提交
git add .
git commit -m "$COMMIT_MESSAGE"

# 推送到 Gitea
git push $GITEA_REMOTE "$BRANCH_NAME"

# 推送到 GitHub
git push $GITHUB_REMOTE "$BRANCH_NAME"

# 确保同步远程标签
git fetch --tags

# 获取 Gitea 上最新 tag（可选，也可以统一用本地）
LATEST_TAG=$(git ls-remote --tags "$GITEA_REMOTE" | \
  grep -E 'refs/tags/[0-9]+\.[0-9]+' | sed 's/.*refs\/tags\///' | sort -V | tail -n 1)

# 计算新 tag
if [[ -z "$LATEST_TAG" ]]; then
    NEW_TAG="0.01"
else
    NEW_TAG=$(printf "%.2f" "$(echo "$LATEST_TAG + 0.01" | bc)")
fi

# 检查是否已有该 tag
if git ls-remote --tags "$GITEA_REMOTE" | grep -q "refs/tags/$NEW_TAG"; then
    echo "Tag $NEW_TAG already exists on remote, skipping tag creation."
else
    git tag "$NEW_TAG"
    git push $GITEA_REMOTE "$NEW_TAG"
    git push $GITHUB_REMOTE "$NEW_TAG"
    echo "Pushed to $BRANCH_NAME with tag $NEW_TAG"
fi
