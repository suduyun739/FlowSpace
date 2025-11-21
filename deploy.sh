#!/bin/bash

# WorkFlow 个人工作助手平台 - 部署脚本

set -e

echo "🚀 WorkFlow 部署脚本启动"
echo "=================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 显示菜单
echo "请选择部署方式："
echo "1) 开发环境部署 (端口 8080)"
echo "2) 生产环境部署 (端口 80)"
echo "3) 仅构建 Docker 镜像"
echo "4) 停止服务"
echo "5) 查看日志"
echo "6) 清理数据"
read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo "🛠️  开始开发环境部署..."
        
        # 构建镜像
        echo "📦 构建 Docker 镜像..."
        docker-compose build
        
        # 启动服务
        echo "🚀 启动服务..."
        docker-compose up -d
        
        echo "✅ 开发环境部署完成！"
        echo "🌐 应用地址: http://localhost:8080"
        ;;
        
    2)
        echo "🏭 开始生产环境部署..."
        
        # 检查端口 80 是否被占用
        if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null ; then
            echo "⚠️  端口 80 已被占用，请检查是否有其他服务运行"
            echo "您可以使用以下命令查看占用进程："
            echo "sudo lsof -i :80"
            exit 1
        fi
        
        # 构建镜像
        echo "📦 构建 Docker 镜像..."
        docker-compose build
        
        # 启动生产环境
        echo "🚀 启动生产环境服务..."
        docker-compose --profile production up -d
        
        echo "✅ 生产环境部署完成！"
        echo "🌐 应用地址: http://localhost"
        ;;
        
    3)
        echo "🔨 仅构建 Docker 镜像..."
        docker-compose build
        echo "✅ 镜像构建完成！"
        ;;
        
    4)
        echo "🛑 停止服务..."
        docker-compose down
        echo "✅ 服务已停止！"
        ;;
        
    5)
        echo "📋 查看日志..."
        docker-compose logs -f
        ;;
        
    6)
        echo "🧹 清理数据..."
        read -p "确定要清理所有容器和数据吗？(y/N): " confirm
        if [[ $confirm == [yY] ]]; then
            docker-compose down -v
            docker system prune -f
            echo "✅ 数据清理完成！"
        else
            echo "❌ 取消清理操作"
        fi
        ;;
        
    *)
        echo "❌ 无效的选项，请重新运行脚本"
        exit 1
        ;;
esac

# 显示服务状态
if [[ $choice -ge 1 && $choice -le 2 ]]; then
    echo ""
    echo "📊 服务状态："
    docker-compose ps
    
    echo ""
    echo "📋 快速命令："
    echo "查看日志: docker-compose logs -f"
    echo "停止服务: docker-compose down"
    echo "重启服务: docker-compose restart"
fi

echo ""
echo "🎉 部署脚本执行完成！"