---
layout: post
title: "springcloud注册中心Eureka"
categories: springcloud
tags: springcloud eureka
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}


## 简介

简介





## 启动过程



### 初始化环境

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/20220913102717.png)



Eureka 服务的启动入口在这里：EurekaBootStrap.java 的 contextInitialized 方法。

初始化环境的方法是 initEurekaEnvironment()：获取配置管理类的一个单例。单例的实现方法用的是 `双重检测` +`volatile`；instance 变量定义成了 volatile，保证可见性。



### 初始化上下文

时序图

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/20220913114137.png)



还是在 EurekaBootStrap.java 类中 contextInitialized 方法中，第二步调用了 initEurekaServerContext() 方法。



