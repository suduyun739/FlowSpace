#!/bin/bash

echo "🚀 FlowSpace GitHub 推送脚本"
echo "=============================="

# 检查git是否已安装
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

# 检查是否在项目目录中
if [ ! -f "index.html" ]; then
    echo "❌ 请在 FlowSpace 项目根目录中运行此脚本"
    exit 1
fi

# 初始化git仓库（如果还没有初始化）
if [ ! -d ".git" ]; then
    echo "📁 初始化 Git 仓库..."
    git init
    git branch -M main
else
    echo "📁 Git 仓库已存在"
fi

# 添加所有文件
echo "📦 添加文件到 Git..."
git add .

# 检查是否有更改需要提交
if git diff --cached --quiet; then
    echo "✅ 没有新的更改需要提交"
else
    # 提交更改
    echo "💾 提交更改..."
    read -p "请输入提交信息 (默认: 'Initial commit'): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Initial commit"
    fi
    git commit -m "$commit_msg"
fi

# 添加远程仓库
read -p "是否添加远程仓库? (y/n): " add_remote
if [ "$add_remote" = "y" ]; then
    read -p "请输入 GitHub 仓库 URL: " repo_url
    if [ -n "$repo_url" ]; then
        echo "🔗 添加远程仓库..."
        git remote add origin "$repo_url"
        
        # 推送到GitHub
        echo "🚀 推送到 GitHub..."
        git push -u origin main
        
        echo "✅ 推送完成！"
        echo "🌐 仓库地址: $repo_url"
    else
        echo "❌ 未提供仓库 URL"
    fi
else
    echo "ℹ️  您可以稍后手动推送:"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
fi

echo ""
echo "🎉 FlowSpace 项目 GitHub 推送完成！"
echo "📚 记得更新 README.md 中的截图和详细信息"