# 百味皆苦 - 个人技术博客

基于 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 主题搭建的 Jekyll 静态博客，托管于 GitHub Pages。

## 站点信息

- **站点名称**：百味皆苦
- **站点描述**：Java 后端开发、分布式、数据库、缓存、中间件等学习与实战笔记整理
- **访问地址**：[https://BaiWeiJieKu.github.io](https://BaiWeiJieKu.github.io)

## 内容概览

博客主要涵盖以下技术方向：

- Java 基础与进阶（JUC、JVM、设计模式等）
- Spring 全家桶（Spring Boot、Spring Cloud、Spring Security 等）
- 数据库（MySQL 高级、Redis、MongoDB、Elasticsearch）
- 中间件（RabbitMQ、ActiveMQ、Zookeeper、Dubbo、Nginx）
- 分布式与微服务（Spring Cloud Alibaba、分布式事务、分布式锁）
- 其他（Docker、NIO、Golang、AI 框架、Python FastAPI 等）

## 本地开发

### 环境要求

- Ruby 3.0+
- Bundler
- Git

### 快速启动

```bash
# 克隆仓库
git clone https://github.com/BaiWeiJieKu/BaiWeiJieKu.github.io.git
cd BaiWeiJieKu.github.io

# 安装依赖
bundle install

# 本地预览
bundle exec jekyll serve
```

浏览器访问 `http://127.0.0.1:4000` 即可预览。

## 项目结构

```
.
├── _config.yml          # 站点配置
├── _data/               # 数据文件
│   ├── contact.yml      # 社交链接配置
│   └── share.yml        # 分享按钮配置
├── _plugins/            # 自定义插件
├── _posts/              # 博客文章（Markdown）
├── _tabs/               # 导航标签页
│   ├── about.md         # 关于
│   ├── archives.md      # 归档
│   ├── categories.md    # 分类
│   ├── tags.md          # 标签
│   └── collections.md   # 收藏
├── images/              # 图片资源
├── index.html           # 首页
├── Gemfile              # Ruby 依赖
└── .github/workflows/   # GitHub Actions 部署
```

## 写文章

在 `_posts/` 目录下创建 Markdown 文件，命名格式为 `YYYY-MM-DD-标题.md`，front matter 示例：

```yaml
---
title: "文章标题"
categories: 分类名
tags: [标签1, 标签2]
author: 百味皆苦
---
```

## 部署

推送代码到 GitHub 后，GitHub Actions 会自动构建并部署到 GitHub Pages。

确保仓库 Settings > Pages > Source 设置为 **GitHub Actions**。

## 致谢

- 主题：[jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)
- 托管：[GitHub Pages](https://pages.github.com/)
