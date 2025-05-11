#!/bin/bash

# 拉取远程仓库的代码
git fetch origin

# 检查是否有更新
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "has updated to latest."
else
    echo "local repository has updated."
    # 使用 origin 来拉取远程仓库的更新
    git pull origin master
fi

