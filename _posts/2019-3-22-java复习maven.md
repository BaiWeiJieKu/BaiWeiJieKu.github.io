---
layout: post
title: "java复习maven"
categories: maven
tags: maven
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
## 介绍

- Maven 是专门用于构建和管理Java相关项目的工具。
- Maven是意第绪语，依地语（犹太人使用的国际语），表示专家的意思
- 使用Maven管理的Java 项目都有着相同的项目结构
  1. 有一个pom.xml 用于维护当前项目都用了哪些jar包
  2. 所有的java代码都放在 src/main/java 下面
  3. 所有的测试代码都放在src/test/java 下面
- maven风格的项目，首先把所有的jar包都放在"仓库“ 里，然后哪个项目需要用到这个jar包，只需要给出jar包的名称和版本号就行了。 这样jar包就实现了共享

## 目前技术

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m1.png)

## 为啥使用

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m2.png)

## maven简介

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m3.1.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m3.2.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m3.3.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m3.4.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m3.5.png)

## 安装

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m4.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m4.2.png)

## 核心概念

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m5.png)

## 简单工程

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m6.png)

## 常用命令

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m7.png)

## 联网下载

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m8.png)

## POM

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m9.png)

## 坐标

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m10.png)

## 仓库

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m11.png)

## 初步依赖

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m12.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m12.2.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m12.3.png)

## 生命周期

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m13.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m13.2.png)



## eclipse

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m14.png)

## 高级依赖

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m15.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m15.2.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m15.3.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m15.4.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m15.5.png)

## 继承

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m16.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m16.2.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m16.3.png)



## 聚合

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/m17.png)



## 面试

```
什么是依赖冲突？处理依赖冲突的手段是什么？

首先来说，对于Maven而言，同一个groupId同一个artifactId下，只能使用一个version！
依赖冲突是由依赖传递引起的版本冲突。比如工程中需要引入A、B，而A依赖1.0版本的C，B依赖2.0版本的C，那么问题来了，C使用的版本将由引入A、B的顺序而定？这显然不靠谱！如果A的依赖写在B的依赖后面，将意味着最后引入的是1.0版本的C，很可能在运行阶段出现类（ClassNotFoundException）、方法（NoSuchMethodError）找不到的错误（因为B使用的是高版本的C）！

依赖传递：如果A依赖B，B依赖C，那么引入A，意味着B和C都会被引入。
Maven的最近依赖策略：如果一个项目依赖相同的groupId、artifactId的多个版本，那么在依赖树（mvn dependency:tree）中离项目最近的那个版本将会被使用。

方法一：使用IDEA的maven helper插件，选择pom文件下面的dependency analyzer选项，选择冲突选项conflicts。下面列出的就是存在冲突的包。选择一个包，右边会显示被依赖的版本，标注为红色的是当前项目没有用到的依赖，右键选择exclude进行排除就可以解决冲突了

方法二：锁定jar版本（RELEASE）：版本锁定后则不考虑依赖的声明顺序或依赖的路径，以锁定的版本的为准添加到工程中，此方法在企业开发中常用。
在工程中锁定依赖的版本并不代表在工程中添加了依赖，如果工程需要添加锁定版本的依赖则需要单独添加标签
```

```
Maven规范化目录结构?

/pom.xml
/src/main/java
/src/main/resources
/src/test/java
/src/test/resources

src/main下内容最终会打包到Jar/War中，而src/test下是测试内容，并不会打包进去。
src/main/resources中的资源文件会COPY至目标目录，这是Maven的默认生命周期中的一个规定动作。
```

```
scope依赖范围有哪些？

compile：默认的scope，运行期有效，需要打入包中。
provided：编译期有效，运行期不需要提供，不会打入包中。
runtime：编译不需要，在运行期有效，需要导入包中。（接口与实现分离）
test：测试需要，不会打入包中。
system：非本地仓库引入、存在系统的某个路径下的jar。（一般不使用）
```



