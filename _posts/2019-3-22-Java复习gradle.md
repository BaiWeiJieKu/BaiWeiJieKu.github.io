---
layout: post
title: "java复习gradle"
categories: maven
tags: maven gradle
author: 百味皆苦
music-id: 2602106546
---


* content
{:toc}

## 介绍

Gradle 是一款Google 推出的**基于 JVM、**通用灵活的**项目构建工具，**支持 Maven，JCenter 多种第三方仓库;支持传递性依赖管理、废弃了繁杂的xml 文件，转而使用**简洁的**、**支持多种语言**(例如：java、groovy 等)的 **build 脚本文件**。



### 工具比较

Ant: 2000 年 Apache 推出的纯Java 编写构建工具，通过 xml[build.xml]文件管理项目优点：使用灵活，速度快(快于 gradle 和 maven)，

缺点：Ant 没有强加任何编码约定的项目目录结构,开发人员需编写繁杂XML 文件构建指令,对开发人员是一个挑战。

Maven: 2004 年Apache 组织推出的再次使用xml 文件[pom.xml]管理项目的构建工具。

优点: 遵循一套约定大于配置的项目目录结构，使用统一的GAV 坐标进行依赖管理,**侧重于包管理**。缺点：项目构建过程僵化,配置文件编写不够灵活、不方便自定义组件,构建速度慢于 gradle。

Gradle: 2012 年Google 推出的基于Groovy 语言的全新项目构建工具，集合了Ant 和 Maven 各自的优势。

优点：集 Ant 脚本的灵活性+Maven 约定大于配置的项目目录优势,支持多种远程仓库和插件**,侧重于****大项目****构建**。缺点：学习成本高、资料少、脚本灵活、版本兼容性差等。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202207071359106.png)



目录结构

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202207071421391.png)



1：只有war工程才有webapp目录，对于普通的jar工程并没有webapp目录

2：radlew与gradlew.bat执行的指定wrapper版本中的gradle指令,不是本地安装的gradle指令



### 安装

1：下载压缩包解压

2：配置环境变量

3：监测版本号

4：修改maven源：

我们可以在gradle 的init.d 目录下创建以.gradle 结尾的文件，.gradle 文件可以实现在build 开始之前执行，所以你可以在这个文件配置一些你想预先加载的操作。

在init.d 文件夹创建init.gradle 文件

```
allprojects {
    repositories {
        mavenLocal()
        maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" } 
        maven { name "Bstek" ; url "https://nexus.bsdn.org/content/groups/public/" } 
        mavenCentral()
    }
    
    buildscript {
        repositories {
            maven { name "Alibaba" ; url 'https://maven.aliyun.com/repository/public' } 
            maven { name "Bstek" ; url 'https://nexus.bsdn.org/content/groups/public/' } 
            maven { name "M2" ; url 'https://plugins.gradle.org/m2/' }
        }
    }
}
```





### 常用指令

gradle命令要在含有build.gradle的目录下执行

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202207071423337.png)



### Wrapper 包装器

Gradle Wrapper 实际上就是对 Gradle 的一层包装，用于解决实际开发中可能会遇到的不同的项目需要不同版本的 Gradle
问题。例如：把自己的代码共享给其他人使用，可能出现如下情况:

1：对方电脑没有安装 gradle

2：对方电脑安装过 gradle，但是版本太旧了

这时候，我们就可以考虑使用 Gradle Wrapper 了。这也是官方建议使用 Gradle Wrapper 的原因。实际上有了 Gradle Wrapper 之后，我们本地是可以不配置 Gradle 的,下载Gradle 项目后，使用 gradle 项目自带的wrapper 操作也是可以的。

那如何使用Gradle Wrapper 呢？
项目中的gradlew、gradlew.cmd脚本用的就是wrapper中规定的gradle版本。参见源码
而我们上面提到的gradle指令用的是本地gradle,所以gradle指令和gradlew指令所使用的gradle版本有可能是不一样的。
gradlew、gradlew.cmd的使用方式与gradle使用方式完全一致，只不过把gradle指令换成了gradlew指令。
当然,我们也可在终端执行 gradlew 指令时，指定指定一些参数,来控制 Wrapper 的生成，比如依赖的版本等

GradleWrapper 的执行流程：
1. 当我们第一次执行 ./gradlew build 命令的时候，gradlew 会读取 gradle-wrapper.properties 文件的配置信息
2. 准确的将指定版本的 gradle 下载并解压到指定的位置(GRADLE_USER_HOME目录下的wrapper/dists目录中)
3. 并构建本地缓存(GRADLE_USER_HOME目录下的caches目录中),下载再使用相同版本的gradle就不用下载了4.之后执行的 ./gradlew 所有命令都是使用指定的 gradle 版本。





