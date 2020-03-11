---
layout: post
title: "MK深入理解synchronized"
categories: 并发
tags: 并发
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 简介

- synchronized作用：能够保证在**同一时刻**最多只有**一个**线程执行该段代码，以达到保证并发安全的效果。

#### 对象锁

- 包括方法锁（默认锁对象为this当前实例对象）和同步代码块锁（自己制定锁对象）

#### 类锁

- 指synchronized修饰静态的方法或制定锁为Class对象