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

- Ruby 3.0+（macOS 系统自带 Ruby 2.6 版本过低，需通过 Homebrew 安装）
- Bundler
- Git

### 快速启动

```bash
# 克隆仓库
git clone https://github.com/BaiWeiJieKu/BaiWeiJieKu.github.io.git
cd BaiWeiJieKu.github.io

# 安装依赖（确保使用 Ruby 3.0+ 的 bundler）
bundle install

# 本地预览（--incremental 开启增量构建，大幅加快二次构建速度）
bundle exec jekyll serve --incremental
```

浏览器访问 `http://127.0.0.1:4000` 即可预览。

### macOS 用户注意事项

macOS 系统自带 Ruby 2.6，版本过低会导致 bundler 报错。需通过 Homebrew 安装新版：

```bash
# 通过 Homebrew 安装 Ruby
brew install ruby

# 将 Homebrew Ruby 加入 PATH（添加到 ~/.zshrc 中持久化）
export PATH="/opt/homebrew/Cellar/ruby/3.4.4/bin:$PATH"

# 验证版本
ruby --version  # 应输出 3.0+
bundler --version

# 然后执行 bundle install 和 jekyll serve
```

### 加快构建速度

- **`--incremental`**：增量构建，只重新生成变更的文件，二次构建从 ~40s 降至 ~5s
- **`--limit_posts N`**：限制加载的文章数，适合写文章时快速预览
  ```bash
  # 只加载最近 5 篇文章，启动更快
  bundle exec jekyll serve --incremental --limit_posts 5
  ```

## 项目结构

```
.
├── _config.yml          # 站点配置
├── _data/               # 数据文件
│   ├── contact.yml      # 社交链接配置
│   └── share.yml        # 分享按钮配置
├── _plugins/            # 自定义插件
├── _posts/              # 博客文章（Markdown）
├── _favorites/          # 收藏文档（动态加载）
├── _yixue/              # 易学文档（动态加载）
├── _zhongyi/            # 中医文档（动态加载）
├── _tabs/               # 导航标签页
│   ├── categories.md    # 分类
│   ├── tags.md          # 标签
│   ├── archives.md      # 归档
│   ├── about.md         # 关于
│   ├── collections.md   # 收藏
│   ├── yixue.md         # 易学
│   └── zhongyi.md       # 中医
├── images/              # 图片资源
├── index.html           # 首页
├── Gemfile              # Ruby 依赖
└── .github/workflows/   # GitHub Actions 部署
```

## 写文章

### 博客文章

在 `_posts/` 目录下创建 Markdown 文件，命名格式为 `YYYY-MM-DD-标题.md`，front matter 示例：

```yaml
---
title: "文章标题"
categories: 分类名
tags: [标签1, 标签2]
author: 百味皆苦
---
```

### 收藏 / 易学 / 中医文档

在对应文件夹（`_favorites/`、`_yixue/`、`_zhongyi/`）下直接新建 `.md` 文件，front matter 示例：

```yaml
---
title: "文档标题"
date: 2025-01-01
categories: 分类名
tags: [标签1, 标签2]
author: 百味皆苦
---
```

侧边栏对应菜单页会自动读取并展示文件夹下的所有文档，按日期倒序排列。新文章的分类和标签也会自动出现在【分类】和【标签】页面中。

> **收藏类文档**（`_favorites/`）不需要 `date`，使用 `order` 控制排序即可。

## 部署

推送代码到 GitHub 后，GitHub Actions 会自动构建并部署到 GitHub Pages。

确保仓库 Settings > Pages > Source 设置为 **GitHub Actions**。

## 注意事项

### 需要清缓存的场景

以下操作后需执行 `rm -rf .jekyll-cache` 再重新启动，否则变更可能不生效：

- 修改了 `_plugins/` 下的插件代码
- 修改了 `_config.yml` 中的 `collections` 或 `defaults` 配置

```bash
rm -rf .jekyll-cache && bundle exec jekyll serve --incremental
```

### 不需要清缓存的场景

- 新增或编辑 `_posts/` 下的博客文章
- 编辑集合文件夹中**已有文章**的内容或 front matter
- 修改图片、CSS 等静态资源

以上场景 `--incremental` 可正常热更新，保存文件后等待几秒即可刷新页面。

## 致谢

- 主题：[jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)
- 托管：[GitHub Pages](https://pages.github.com/)
