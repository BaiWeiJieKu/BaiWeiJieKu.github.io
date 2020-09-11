---
layout: post
title: "activeMQ"
categories: MQ
tags: activeMQ
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 概述

[github](https://github.com/BaiWeiJieKu/MK-rabbitmq)

#### MQ比较

|        特性         |  activeMQ  |       RabbitMQ        |        Kafka        |    RocketMQ    |
| :---------------: | :--------: | :-------------------: | :-----------------: | :------------: |
| PRODUCER-CUMSUMER |     支持     |          支持           |         支持          |       支持       |
| PUBLISH-SUBSCRIBE |     支持     |          支持           |         支持          |       支持       |
|   REQUEST-REPLY   |     支持     |          支持           |                     |       支持       |
|      API完备性       |     高      |           高           |          高          |    低（静态配置）     |
|       多语言支持       |  支持java优先  |         语言无关          |      支持java优先       |       支持       |
|       单机吞吐量       |     万级     |          万级           |         十万级         |      单机万级      |
|       消息延迟        |            |          微秒级          |         毫秒级         |                |
|        可用性        |   高（主从）    |         高（主从）         |      非常高（分布式）       |       高        |
|       消息丢失        |            |           低           |       理论上不会丢失       |                |
|       消息重复        |            |          可控性          |       理论上会有重复       |                |
|       文档完备性       |     高      |           高           |          高          |       中        |
|       快速入门        |     有      |           有           |          有          |       无        |
|       部署难度        |            |           低           |          中          |       高        |
|                   | java，中小型项目 | erlang语言，不好修改底层，不建议选用 | 编程语言Scala，大数据领域主流MQ | java，适用于大型集群项目 |



