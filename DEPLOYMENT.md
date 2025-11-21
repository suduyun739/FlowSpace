# WorkFlow 个人工作助手平台 - 部署文档

## 项目概述

WorkFlow 是一个功能完整的个人工作管理平台，集成了工作日记、项目管理、任务分配、每日计划等功能。采用现代化的 Web 技术和优雅的用户界面设计。

## 技术栈

- **前端**: HTML5, CSS3, JavaScript ES6+
- **样式框架**: Tailwind CSS
- **动画库**: Anime.js
- **图表库**: ECharts.js
- **Markdown 解析**: Marked.js
- **容器化**: Docker, Docker Compose
- **Web 服务器**: Nginx

## 部署方式

### 方式一：Docker Compose 部署（推荐）

#### 前提条件

- Docker 20.10+
- Docker Compose 2.0+
- 服务器端口 80 和 8080 可用

#### 部署步骤

1. **克隆或下载项目文件**
   ```bash
   # 确保所有文件都在同一目录下
   ls -la
   # 应该包含：index.html, projects.html, journal.html, planner.html, main.js, Dockerfile, docker-compose.yml 等
   ```

2. **启动应用**
   ```bash
   # 开发环境启动（端口 8080）
   docker-compose up -d
   
   # 生产环境启动（端口 80，带反向代理）
   docker-compose --profile production up -d
   ```

3. **验证部署**
   ```bash
   # 检查容器状态
   docker-compose ps
   
   # 查看日志
   docker-compose logs -f workflow-app
   ```

4. **访问应用**
   - 开发环境: http://localhost:8080
   - 生产环境: http://localhost

#### 常用命令

```bash
# 停止应用
docker-compose down

# 重启应用
docker-compose restart

# 更新应用（重新构建镜像）
docker-compose build --no-cache
docker-compose up -d

# 查看实时日志
docker-compose logs -f

# 进入容器调试
docker exec -it workflow-app sh
```

### 方式二：直接 Docker 部署

#### 构建镜像

```bash
# 构建 Docker 镜像
docker build -t workflow-app:latest .

# 运行容器
docker run -d \
  --name workflow-app \
  -p 8080:80 \
  --restart unless-stopped \
  workflow-app:latest
```

#### 验证部署

```bash
# 检查容器状态
docker ps

# 查看日志
docker logs -f workflow-app

# 访问应用
curl http://localhost:8080
```

### 方式三：传统部署

#### 使用 Nginx 部署

1. **安装 Nginx**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install nginx
   ```

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/workflow;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **部署文件**
   ```bash
   # 创建网站目录
   sudo mkdir -p /var/www/workflow
   
   # 复制文件
   sudo cp -r * /var/www/workflow/
   
   # 设置权限
   sudo chown -R www-data:www-data /var/www/workflow
   sudo chmod -R 755 /var/www/workflow
   ```

4. **重启 Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### 使用 Python HTTP 服务器（开发测试）

```bash
# 进入项目目录
cd /path/to/workflow

# 启动 HTTP 服务器
python -m http.server 8000

# 访问应用
# http://localhost:8000
```

## 配置说明

### 环境变量

在 `docker-compose.yml` 中可以配置以下环境变量：

- `NGINX_HOST`: 主机名（默认: localhost）
- `NGINX_PORT`: 端口（默认: 80）

### 数据持久化

应用使用浏览器的 localStorage 存储数据，不需要额外的数据库配置。如果需要备份数据：

1. **导出数据**: 在应用设置中导出 JSON 文件
2. **导入数据**: 在应用设置中导入 JSON 文件

### SSL/HTTPS 配置

对于生产环境，建议配置 SSL：

1. **使用 Let's Encrypt**
   ```bash
   # 安装 Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # 获取证书
   sudo certbot --nginx -d your-domain.com
   ```

2. **手动配置 SSL**
   - 将 SSL 证书文件放在 `./ssl/` 目录
   - 修改 `nginx-proxy.conf` 配置

## 性能优化

### Nginx 配置优化

```nginx
# Gzip 压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Docker 优化

```dockerfile
# 使用多阶段构建
FROM nginx:alpine

# 删除不必要的文件
RUN apk del --purge \
    apk-tools \
    libc-utils \
    pkgconf \
    zlib-dev

# 优化 Nginx 配置
RUN echo 'worker_processes auto;' > /etc/nginx/nginx.conf
```

## 监控和维护

### 健康检查

```bash
# 检查应用健康状态
curl http://localhost/health

# 检查容器状态
docker-compose ps

# 查看资源使用情况
docker stats
```

### 日志管理

```bash
# 查看应用日志
docker-compose logs -f workflow-app

# 查看 Nginx 访问日志
docker-compose logs -f nginx-proxy

# 清理日志
docker-compose logs --tail 0 > /dev/null
```

### 备份策略

1. **数据备份**: 定期导出应用数据
2. **配置备份**: 备份 docker-compose.yml 和配置文件
3. **镜像备份**: 保存 Docker 镜像
   ```bash
   docker save workflow-app:latest > workflow-app.tar
   ```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口使用情况
   netstat -tlnp | grep :8080
   
   # 修改 docker-compose.yml 中的端口映射
   ports:
     - "8081:80"  # 使用其他端口
   ```

2. **容器无法启动**
   ```bash
   # 查看详细错误信息
   docker-compose logs workflow-app
   
   # 检查配置文件语法
   docker-compose config
   ```

3. **应用无法访问**
   ```bash
   # 检查防火墙设置
   sudo ufw status
   
   # 开放端口
   sudo ufw allow 8080
   ```

4. **性能问题**
   ```bash
   # 检查资源使用情况
   docker stats
   
   # 查看系统资源
   top
   free -h
   ```

### 调试技巧

1. **进入容器调试**
   ```bash
   docker exec -it workflow-app sh
   
   # 检查文件
   ls -la /usr/share/nginx/html/
   
   # 检查 Nginx 配置
   nginx -t
   ```

2. **查看网络连接**
   ```bash
   # 检查容器网络
   docker network ls
   docker network inspect workflow-network
   ```

3. **测试应用**
   ```bash
   # 在容器内测试
   curl http://localhost
   
   # 从外部测试
   curl http://your-server-ip:8080
   ```

## 扩展功能

### 添加自定义域名

1. **修改 docker-compose.yml**
   ```yaml
   environment:
     - NGINX_HOST=your-domain.com
   ```

2. **配置 DNS**
   - 将域名指向服务器 IP
   - 配置 A 记录和 CNAME

### 负载均衡配置

```yaml
# docker-compose.yml
services:
  workflow-app-1:
    build: .
    ports:
      - "8081:80"
  
  workflow-app-2:
    build: .
    ports:
      - "8082:80"
  
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

## 安全建议

1. **定期更新**
   ```bash
   # 更新基础镜像
   docker pull nginx:alpine
   
   # 重新构建应用
   docker-compose build --no-cache
   ```

2. **访问控制**
   - 配置防火墙
   - 使用 VPN 访问
   - 设置基本认证

3. **数据安全**
   - 定期备份数据
   - 使用 HTTPS
   - 限制文件上传

## 支持和维护

### 更新应用

1. **备份数据**: 导出当前数据
2. **停止服务**: `docker-compose down`
3. **更新代码**: 拉取最新代码
4. **重新部署**: `docker-compose up -d`

### 监控告警

建议使用以下工具进行监控：
- Prometheus + Grafana
- ELK Stack
- UptimeRobot

## 总结

本部署文档提供了多种部署方式，推荐使用 Docker Compose 进行部署，因为它提供了：

- 简单的部署流程
- 良好的可扩展性
- 便于维护和更新
- 生产环境就绪

如有问题，请检查日志或参考故障排除部分。建议在生产环境部署前先在测试环境验证。