---
layout: post
title: "springcloud注册中心Nacos"
categories: springcloud
tags: springcloud nacos
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}


## 简介

简介



## 注册中心

组件依赖

```xml
<!-- nacos discovery 服务发现组件-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>

```



工具包

https://github.com/alibaba/nacos/releases

启动 Server，进入解压后文件夹或编译打包好的文件夹，找到如下相对文件夹 nacos/bin，并对照操作系统实际情况之下如下命令。

Linux/Unix/Mac 操作系统，执行命令 `sh startup.sh -m standalone`

Windows 操作系统，执行命令 `cmd startup.cmd`



在微服务中配置nacos地址

```yaml
spring:
   cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
   application:
    name: java-nacos
```



开启服务注册与发现功能

```java
@EnableDiscoveryClient
public class PassjavaQuestionApplication {

    public static void main(String[] args) {
        SpringApplication.run(PassjavaQuestionApplication.class, args);
    }

}
```



访问后台

http://localhost:8848/nacos/index.html#/login

用户名：nacos

密码：nacos





## 配置中心

组件依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

```



添加bootstrap.properties 配置文件

```properties
spring.application.name=java-member
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```



去nacos界面配置

**Data ID:** java-member.properties

**Group:** DEFAULT_GROUP

内容

```properties
member.nick="配置"
member.age=10
```



开启动态刷新：在启动类上添加注解@RefreshScope开启动态刷新配置功能



### 命名空间

每个微服务用到的配置可能都不一样，我们针对每个微服务，都创建一个命名空间。

在bootstrap.properties配置命名空间

```properties
spring.cloud.nacos.config.namespace=java-member
```



### 分组

如果我们有多套环境，比如开发环境，测试环境，生产环境，每一套环境的配置参数不一样，我们可以使用配置中心的`分组`功能。每一套环境都是一套分组。

在bootstrap.properties配置当前使用的分组

```properties
spring.cloud.nacos.config.group=prod
```



### 多配置集

可以将application.yml文件中的datasource、mybatis-plus等配置进行拆解，放到配置中心。group可以创建3套，dev/test/prod。

在bootstrap.properties配置

```yaml
spring.application.name=passjava-member
spring.cloud.nacos.config.server-addr=127.0.0.1:8848

spring.cloud.nacos.config.namespace=passjava-member
spring.cloud.nacos.config.group=prod

spring.cloud.nacos.config.extension-configs[0].data-id=datasource.yml
spring.cloud.nacos.config.extension-configs[0].group=dev
spring.cloud.nacos.config.extension-configs[0].refresh=true

spring.cloud.nacos.config.extension-configs[1].data-id=mybatis.yml
spring.cloud.nacos.config.extension-configs[1].group=dev
spring.cloud.nacos.config.extension-configs[1].refresh=true

spring.cloud.nacos.config.extension-configs[2].data-id=more.yml
spring.cloud.nacos.config.extension-configs[2].group=dev
spring.cloud.nacos.config.extension-configs[2].refresh=true

```



更多配置项

|                          |                                           |               |                                                              |
| ------------------------ | ----------------------------------------- | ------------- | ------------------------------------------------------------ |
| 配置项                   | key                                       | 默认值        | 说明                                                         |
| 服务端地址               | spring.cloud.nacos.config.server-addr     |               |                                                              |
| DataId前缀               | spring.cloud.nacos.config.prefix          |               | spring.application.name                                      |
| Group                    | spring.cloud.nacos.config.group           | DEFAULT_GROUP |                                                              |
| dataID后缀及内容文件格式 | spring.cloud.nacos.config.file-extension  | properties    | dataId的后缀，同时也是配置内容的文件格式，目前只支持 properties |
| 配置内容的编码方式       | spring.cloud.nacos.config.encode          | UTF-8         | 配置的编码                                                   |
| 获取配置的超时时间       | spring.cloud.nacos.config.timeout         | 3000          | 单位为 ms                                                    |
| 配置的命名空间           | spring.cloud.nacos.config.namespace       |               | 常用场景之一是不同环境的配置的区分隔离，例如开发测试环境和生产环境的资源隔离等。 |
| AccessKey                | spring.cloud.nacos.config.access-key      |               |                                                              |
| SecretKey                | spring.cloud.nacos.config.secret-key      |               |                                                              |
| 相对路径                 | spring.cloud.nacos.config.context-path    |               | 服务端 API 的相对路径                                        |
| 接入点                   | spring.cloud.nacos.config.endpoint        | UTF-8         | 地域的某个服务的入口域名，通过此域名可以动态地拿到服务端地址 |
| 是否开启监听和自动刷新   | spring.cloud.nacos.config.refresh-enabled | true          |                                                              |



## 注册请求过程

注册流程

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220412071400192DVNL4d.png)



先组装一个instance实例对象，包含了注册信息

![](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220411160413112vLIk1i.png)



组装注册请求request：发起注册的核心方法是 doRegisterService()，组装的 request 如下图所示，里面有之前组装的实例信息 instance，还有指定的 namespace（Nacos 的命名空间）、serviceName（服务名），groupName（Nacos 的分组）。

![image-20220411162322668](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-202204111623226683NnG6U.png)



发起远程调用

requestToServer() 方法里面会调用 RpcClient 的 request() 方法



## 客户端如何处理注册

如果是 Nacos 集群环境，客户端会随机选择一个 Nacos 节点发起注册。

在 Client 发起注册之前，会有一个后台线程随机拿到 Nacos 集群服务列表中的一个地址。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220412085821355AZgLcJ.png)



Nacos 的有多个节点可以分别处理请求，当节点发现这个请求不是属于自己的，就会进行转发。

![img](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20220412215250738gU1BYV.png)



路由转发逻辑：

1：Nacos 节点从客户端发起的 request 中拿到客户端的实例信息生成 distroTag，如 IP + port 或 service name。

2：Nacos 根据 distroTag 生成 hash 值。

3：用 hash 值对 Nacos 节点数进行`取余`，拿到余数，比如 0、1、2、3。

4：根据余数从 Nacos 节点列表中拿到指定的节点地址。



## 客户端如何存储注册实例

![image-20230109182045557](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/image-20230109182045557.png)



1：将实例信息存放到内存缓存 concurrentHashMap 里面

2：添加一个任务到 BlockingQueue 里面，这个任务就是将最新的实例列表通过 UDP 的方式推送给所有客户端（服务实例），这样客户端就拿到了最新的服务实例列表

3：开启 1s 的延迟任务，将数据通过给其他 Nacos 节点



## 一致性模块

Nacos 它是支持两种分布式定理的：`CP`（分区一致性）和 `AP`（分区可用性） 的，而 AP 是通过 Nacos 自研的 `Distro` 协议来保证的，CP 是通过 Nacos 的 `JRaft` 协议来保证的。

因为注册中心作为系统中很重要的的一个服务，需要尽最大可能对外提供可用的服务，所以选择 AP 来保证服务的高可用，另外 Nacos 还采取了心跳机制来自动完成服务数据补偿的机制，所以说 Distro 协议是弱一致性的。

如果采用 CP 协议，则需要当前集群可用的节点数过半才能工作。



nacos中哪些地方用到了AP和CP？

针对`临时服务`实例（临时服务实例就是我们默认使用的 Nacos 注册中心模式，客户端注册后，客户端需要定时上报心跳进行服务实例续约。这个在注册的时候，可以通过传参设置是否是临时实例），采用 `AP` 来保证注册中心的可用性，`Distro` 协议

针对`持久化服务`实例（持久化服务实例就是不需要上报心跳的，不会被自动摘除，除非手动移除实例，如果实例宕机了，Nacos 只会将这个客户端标记为不健康），采用 `CP` 来保证各个节点的强一致性，`JRaft` 协议

针对`配置中心`，无 Database 作为存储的情况下，Nacos 节点之间的内存数据为了保持一致，采用 `CP`。Nacos 提供这种模式只是为了方便用户本机运行，降低对存储依赖，生产环境一般都是通过外置存储组件来保证数据一致性

针对`配置中心`，有 Database 作为存储的情况下，Nacos 通过持久化后通知其他节点到数据库拉取数据来保证数据一致性，另外采用读写分离架构来保证高可用

针对 `异地多活`，采用 `AP` 来保证高可用



## Distro 的设计思想和六大机制

`Distro` 协议是 Nacos 对于`临时实例数据`开发的一致性协议。Distro 协议是集 Gossip + Eureka 协议的优点并加以优化后出现的。

**Gossip 协议有什么坑？**由于随机选取发送的节点，不可避免的存在消息重复发送给同一节点的情况，增加了网络的传输的压力，给消息节点带来额外的处理负载。

**Distro 协议的优化：**每个节点负责一部分数据，然后将数据同步给其他节点，有效的降低了消息冗余的问题。

关于临时实例数据：临时数据其实是存储在`内存缓存`中的，并且在其他节点在启动时会进行全量数据同步，然后节点也会定期进行数据校验。

**Distro 的设计机制**：

- **平等机制**：Nacos 的每个节点是平等的，都可以处理写请求。
- **异步复制机制**：Nacos 把变更的数据异步复制到其他节点。
- **健康检查机制**：每个节点只存了部分数据，定期检查客户端状态保持数据一致性。
- **本地读机制**： 每个节点独立处理读请求，及时从本地发出响应。
- **新节点同步机制**： Nacos 启动时，从其他节点同步数据。
- **路由转发机制**：客户端发送的写请求，如果属于自己则处理，否则路由转发给其他节点。



## 异步复制机制

入口

![image-20230313143045957](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202303131431941.png)



添加任务核心逻辑分为以下几步。

- 遍历其他节点，拿到节点信息。
- 判断这个任务在 map 中是否存在，如果存在则合并这个 task。
- 如果不存在，则加到 map 中。
- 后台线程遍历这个 map，拿到任务。



![sync 的核心代码时序图](https://baiweijieku-1253737556.cos.ap-beijing.myqcloud.com/images/202303131435772.png)



后台线程异步复制数据核心步骤：

- 遍历其他节点，创建一个同步的任务，加到 map 中。
- 后台线程不断从 map 中拿到 task，然后移除这个 task。
- 把这个 task 加到一个队列里面。
- 有个 worker 专门从队列里面拿到 task 来执行。
- 这个 task 就是发送 http 请求给其他节点，请求参数中包含注册的实例信息（序列化后的二进制数据）。



其他节点处理同步请求：

注册信息会存放到一个 `datum` 中，然后 datum 放到一个 `dataStore` 中。

- datum 包含 value、key（服务名称）、timestamp。value 就是注册的客户端信息（是一个 ArrayList，包含客户端ID，IP，port）
- datastore 是一个 ConcurrentHashMap，包含多个 datum。



## 定时同步保持数据一致性

在集群模式下，客户端只需要和其中一个 Nacos 节点通信就可以了，但是每个节点其实是包含所有客户端信息的，这样做的好处是每个 Nacos 节点只需要负责自己的客户端就可以（分摊压力），而当客户端想要拉取全量注册表到本地时，从任意节点都可以读取到（数据一致性）。

Nacos 各个节点会有一个心跳任务，定期向其他机器发送一次数据检验请求，在校验的过程中，当某个节点发现其他机器上的数据的元信息和本地数据的元信息不一致，则会发起一次全量拉取请求，将数据补齐。



## 新节点同步机制

新加入的 Distro 节点会进行全量数据拉取，轮询所有的 Distro 节点，向其他节点发送请求拉取全量数据。

在全量拉取操作完成之后，每台机器上都维护了当前的所有注册上来的非持久化实例数据。

每个 Nacos 节点虽然只负责属于自己的客户端，但是每个节点都是包含有所有的客户端信息的，所以当客户端想要查询注册信息时，可以直接从请求的 Nacos 的节点拿到全量数据，这样设计的好处是保证了高可用（AP），分为两个方面：

- ① 读操作都能进行及时的响应，不需要到其他节点拿数据。
- ② 当脑裂发生时，Nacos 的节点也能正常返回数据，即使数据可能不一致，当网络恢复时，通过健康检查机制或数据检验也能达到数据一致性。



