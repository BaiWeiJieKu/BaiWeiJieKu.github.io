---
layout: post
title: "周阳springcloudAlibaba"
categories: 微服务
tags: springcloud Alibaba
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}
## 简介

- 官网：https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md
- springcloud-Alibaba能做什么？
  - 服务限流降级：默认支持servlet，feign，restTemplate，dubbo和rocketMQ限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级Metrics监控
  - 服务注册和发现：适配springcloud服务注册和发现标准，默认继承了Ribbon的支持
  - 分布式配置管理：支持分布式系统中的外部化配置，配置更改时自动刷新。
  - 消息驱动能力：基于spring cloud stream为服务应用构建消息驱动能力
  - 阿里云对象存储：阿里云提供的海量，安全，低成本，高可靠的云存储服务。支持在任何应用，任何时间，任何地点存储和访问任意类型的数据
  - 分布式任务调度：提供秒级，精准，高可靠，高可用的定时（基于cron表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网络任务支持海量子任务均匀分配到所有worker（schedule-client）上执行
- 都有哪些组件：
  - Sentinel：把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
  - Nacos：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
  - RocketMQ：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
  - Dubbo：Apache Dubbo™ 是一款高性能 Java RPC 框架。
  - Seata：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。
  - Alibaba Cloud ACM：一款在分布式架构环境中对应用配置进行集中管理和推送的应用配置中心产品。
  - Alibaba Cloud OSS: 阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。
  - Alibaba Cloud SchedulerX: 阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。
  - Alibaba Cloud SMS: 覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。



## Nacos服务注册与配置中心

### 简介

- Nacos：Dynamic Naming and Configuration Service；前四个字母分别为Naming和Configuration的前两个字母，最后的s为Service
- Nacos是一个更易于构建云原生应用的动态服务发现，配置管理和服务管理中心
- Nacos就是注册中心+配置中心的组合；Nacos = Eureka+Config+Bus；替代Eureka做服务注册中心；替代Config做服务配置中心
- 比较各种注册中心

| 服务注册与发现框架 | cap模型 | 控制台管理 | 社区活跃度 |
| --------- | ----- | ----- | ----- |
| eureka    | ap    | 支持    | 低     |
| zookeeper | cp    | 不支持   | 中     |
| consul    | cp    | 支持    | 高     |
| nacos     | ap    | 支持    | 高     |



### 安装并运行

- 环境：java8+maven
- 官网下载：https://github.com/alibaba/nacos/releases/tag/1.1.4
- 解压安装包，直接运行bin目录下的startup.cmd
- 账号密码默认都是nacos
- 命令行成功后直接访问：http://localhost:8848/nacos



### 作为服务注册中心

- ​

#### 服务提供者

- 新建model：cloudalibaba-provider-payment9001
- 父pom

```xml
<!--spring cloud alibaba 2.1.0.RELEASE-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-dependencies</artifactId>
  <version>2.1.0.RELEASE</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```

- 本模块pom

```xml
<dependencies>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency><dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
 </dependencies>
```

- yml

```yaml
server:
  port: 9001

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

- 启动类

```java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PaymentMain9001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain9001.class,args);
    }
}
```

- 业务类

```java
package com.atguigu.springcloud.alibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PaymentController
{
    @Value("${server.port}")
    private String serverPort;

    @GetMapping(value = "/payment/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id)
    {
        return "nacos registry, serverPort: "+ serverPort+"\t id"+id;
    }
}
```

- 测试
  - http://lcoalhost:9001/payment/nacos/1
  - nacos控制台查看服务是否注册成功
  - nacos服务注册中心+服务提供者9001都ok了
- 为了演示nacos的负载均衡，参照9001新建9002
  - 新建cloudalibaba-provider-payment9002
  - 9002其他步骤你懂的
  - 或者取巧不想新建重复体力劳动，直接拷贝虚拟端口映射



#### 服务消费者

- 新建model：cloudalibaba-consumer-nacos-order83
- pom

```xml
<dependencies>
    <!--SpringCloud ailibaba nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
        <dependency>
        <groupId>com.atguigu.springcloud</groupId>
        <artifactId>cloud-api-commons</artifactId>
        <version>${project.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

- 为什么nacos支持负载均衡：因为自动集成来ribbon
- yml

```yaml
server:
  port: 83


spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848

# 消费者将要去访问的微服务名称（注册成功进nacos的微服务提供者）
service-url:
  nacos-user-service: http://nacos-payment-provider
```

- 主启动类

```java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class OrderNacosMain83
{
    public static void main(String[] args)
    {
        SpringApplication.run(OrderNacosMain83.class,args);
    }
}
```

- 配置类

```java
package com.atguigu.springcloud.alibaba.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;


@Configuration
public class ApplicationContextConfig
{
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate()
    {
        return new RestTemplate();
    }
}
```

- 业务类

```java
package com.atguigu.springcloud.alibaba.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;


@RestController
@Slf4j
public class OrderNacosController
{
    @Resource
    private RestTemplate restTemplate;

    @Value("${service-url.nacos-user-service}")
    private String serverURL;

    @GetMapping(value = "/consumer/payment/nacos/{id}")
    public String paymentInfo(@PathVariable("id") Long id)
    {
        return restTemplate.getForObject(serverURL+"/payment/nacos/"+id,String.class);
    }

}
```

- 测试：
  - nacos控制台显示有两个服务提供者，一个服务消费者
  - http://localhost:83/consumer/payment/nacos/13
  - 83访问9001/9002，轮询负载OK

### 对比注册中心

- nacos

![image.png](https://i.loli.net/2021/01/23/pFQki3az7nJHMhd.png)

- 特性对比

![image.png](https://i.loli.net/2021/01/23/kZIo7j8tpvYgJFG.png)

- 切换ap和cp

![image.png](https://i.loli.net/2021/01/23/HZgYowtTSQnBxDF.png)





### 作为服务配置中心

- ​

#### 基础配置

- model：cloudalibaba-config-nacos-client3377
- pom

```xml
<dependencies>
    <!--nacos-config-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <!--nacos-discovery-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!--web + actuator-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <!--一般基础配置-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

- application.yml

```yaml
spring:
  profiles:
    active: dev
```

- bootstrap.yml

```yaml
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #服务注册中心地址
      config:
        server-addr: localhost:8848 #配置中心地址
        file-extension: yaml #指定yaml格式的配置
```

- 为什么配置两个？
  - nacos和springcloud-config一样，在项目初始化时，要保证先从配置中心进行配置拉取，才能保证项目正常启动
  - springboot中配置文件的加载是存在优先级顺序的，bootstrap优先级高于application
- 主启动类

```java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class NacosConfigClientMain3377
{
    public static void main(String[] args) {
        SpringApplication.run(NacosConfigClientMain3377.class, args);
    }
}
```

- 业务类

```java
package com.atguigu.springcloud.alibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RefreshScope //通过此注解实现配置自动更新
public class ConfigClientController
{
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }
}
```

- 在nacos中添加配置信息
  - Nacos中的dataid的组成格式与SpringBoot配置文件中的匹配规则： https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html
  - ![image.png](https://i.loli.net/2021/01/23/X5RFOhp6A9cLbSM.png)
  - 新增配置
  - ![image.png](https://i.loli.net/2021/01/23/FlSnVKskNGw2IDf.png)
  - ![image.png](https://i.loli.net/2021/01/23/SbY4HoMR5yFcv9l.png)
  - ![image.png](https://i.loli.net/2021/01/23/udxVE9cGIsipkRQ.png)
- 测试
  - 启动前需要在nacos客户端-配置管理-配置管理栏目下有没有对应的yaml配置文件
  - 运行cloud-config-nacos-client3377的主启动类
  - 调用接口查看配置信息http://localhost:3377/config/info
- 自带动态刷新：修改下Nacos中的yaml配置文件，再次调用查看配置的接口，就会发现配置已经刷新



#### 分类配置

- 多项目多环境管理问题
  - 实际开发有test，pre，prod环境，如何保证指定环境启动时服务正确读取到nacos上相应的环境配置文件
  - 一个大型分布式微服务系统会有很多微服务子项目，每个小项目也有test，pre，prod环境
- 配置管理与命名空间
  ![image.png](https://i.loli.net/2021/01/23/AgmrLqlEOHsTRGY.png)
- Namespace+Group+Data ID三者关系？为什么这么设计？
- ![image.png](https://i.loli.net/2021/01/23/MQ2UwbqEIFC3Txv.png)
- ![image.png](https://i.loli.net/2021/01/23/LecEro1pI7HBZ6K.png)
- DataId方案
  - 指定spring.profile.active和配置文件的DataID来使不同环境下读取不同的配置
  - 默认空间+默认分组+新建dev和test两个DataID
  - ![image.png](https://i.loli.net/2021/01/23/oNPAuBpxqaV2tFb.png)
  - 通过spring.profile.active属性就能进行多环境下配置文件的读取
  - ![image.png](https://i.loli.net/2021/01/23/VdR1pxnljP8UqAz.png)
  - 测试：http://localhost:3377/config/info
- Group方案
  - 新建group
  - ![image.png](https://i.loli.net/2021/01/23/QR9cDFuWojKYxA5.png)
  - 在nacos图形界面控制台上面新建配置文件DataID
  - ![image.png](https://i.loli.net/2021/01/23/eF2rxf7sPazSGQM.png)
  - ![image.png](https://i.loli.net/2021/01/23/1AKjRtnoQBqIS7E.png)
  - 测试
- Namespace方案
  - 新建dev/test的Namespace
  - ![image.png](https://i.loli.net/2021/01/23/qZ38UAXFYeIJEOC.png)
  - ![image.png](https://i.loli.net/2021/01/23/oQkFpJyHIqtfslv.png)
  - ![image.png](https://i.loli.net/2021/01/23/Qb2ZpOBug9lyGMh.png)
  - ![image.png](https://i.loli.net/2021/01/23/QjBdt72Pc5RikHf.png)
  - ![image.png](https://i.loli.net/2021/01/23/v6HuoaSbYxZn9A8.png)



### Nacos集群和持久化配置

