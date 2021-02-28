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

- https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html



#### 架构说明

- ![image.png](https://i.loli.net/2021/01/24/8G7muhOsUDtQb92.png)
- 默认nacos使用嵌入式数据库实现数据的存储；所以，如果启动多个默认配置下的nacos节点，数据存储是存在一致性问题的。为了解决这个问题，nacos采用了集中式存储的方式来支持集群化部署，目前只支持MySQL存储。
- nacos支持三种部署模式
  - 单机模式：用于测试和单机使用
  - 集群模式：用于生产环境，确保高可用
  - 多集群模式：用于多数据中心场景
- 单机模式支持MySQL
  - ![image.png](https://i.loli.net/2021/01/24/7inIE38MquGOv14.png)
- https://nacos.io/zh-cn/docs/deployment.html

#### 持久化配置解释

- nacos默认自带的是嵌入式数据库Derby：https://github.com/alibaba/nacos/blob/develop/config/pom.xml

- derby到mysql切换配置步骤

  - nacos-server-1.1.4\nacos\conf目录下找到sql脚本nacos-mysql.sql

  - 在MySQL中执行数据库脚本

  - nacos-server-1.1.4\nacos\conf目录下找到application.properties

  - ```properties
    spring.datasource.platform=mysql
     
    db.num=1
    db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=123456
    ```

  - 启动nacos，可以看到是个全新的空记录界面，以前是记录进derby，现在是记录进MySQL

#### 生产环境配置

- 预计需要，1个nginx+3个nacos注册中心+1个mysql

- 下载Linux版本nacos：https://github.com/alibaba/nacos/releases/tag/1.1.4

- 1.Linux服务器上mysql数据库配置

  - 执行nacos的数据库脚本：nacos-mysql.sql

- 2.application.properties配置

  - ![image.png](https://i.loli.net/2021/01/24/ozjRYKvxbuU2Fa4.png)

  - ```properties
    spring.datasource.platform=mysql
     
    db.num=1
    db.url.0=jdbc:mysql://1.7.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=HF_mysql_654321
    ```

  - ```
    mysql  授权远程访问
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
    flush privileges;
    ```

- 3.Linux服务器上nacos的集群配置cluster.conf

  - 梳理出3台nacos机器的不同服务端口号
  - 复制出cluster.conf
  - ![image.png](https://i.loli.net/2021/01/24/81d5IKObuxGYFai.png)
  - ![image.png](https://i.loli.net/2021/01/24/OL7eyGIrWfcMSX5.png)

- 4.编辑Nacos的启动脚本startup.sh，使它能够接受不同的启动端

  - /mynacos/nacos/bin目录下有startup.sh
  - 在什么地方，修改什么，怎么修改
  - 集群启动，我们希望可以类似其他软件的shell命令，传递不同的端口号启动不同的nacos实例
  - 命令：./startup.sh -p 3333 表示启动端口号为3333的nacos服务器实例。和上一步cluster配置的一致
  - 修改startup.sh
  - ![image.png](https://i.loli.net/2021/01/24/mO5R3Jhl9FMpWvk.png)
  - 按照端口号启动三个nacos实例

- 5.Nginx的配置，由它作为负载均衡器

  - 修改nginx的配置文件/nginx/conf/nginx.conf

  - ```
    upstream cluster{                                                        
     
        server 127.0.0.1:3333;
        server 127.0.0.1:4444;
        server 127.0.0.1:5555;
    }

     server{
                              
        listen 1111;
        server_name localhost;
        location /{
             proxy_pass http://cluster;
                                                            
        }
    ....省略  
    ```

  - 按照配置文件启动./nginx -c /usr/local/nginx/conf/nginx.conf

- 6.截止到此处，1个Nginx+3个nacos注册中心+1个mysql

  - 测试通过nginx访问nacos：https://写你自己虚拟机的ip:1111/nacos/#/login
  - 新建一个nacos配置测试
  - linux服务器的mysql插入一条记录

- 测试

  - 微服务cloudalibaba-provider-payment9002启动注册进nacos集群

  - yml

  - ```yaml
    server-addr:  写你自己的虚拟机ip:1111
    ```

  - 看nacos控制台：https://写你自己虚拟机的ip:1111/nacos/#/login

  - ![image.png](https://i.loli.net/2021/01/24/WNvqEMa5o3rQxzX.png)

- ​

## Sentinel熔断与限流

### 简介

- 中文文档：https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D
- sentinel：一句话解释，之前我们讲解过的Hystrix
- 下载地址：https://github.com/alibaba/Sentinel/releases
- 指导手册：https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_sentinel
- 特性：
  - ![image.png](https://i.loli.net/2021/01/31/gNFhGVtC25x7zmr.png)
- 服务使用中的各种问题：
  - 服务雪崩
  - 服务降级
  - 服务熔断
  - 服务限流



### 安装控制台

- sentinel分为两部分
  - 核心库（java客户端）：不依赖任何框架，能够运行于任何java运行环境，同时对dubbo和spring cloud有较好的支持
  - 控制台（dashboard）：基于springboot开发，打包后可以直接运行，不需要额外的tomcat等应用容器
- 运行环境：java8，8080端口
- 运行命令：`java -jar sentinel-dashboard-1.7.0.jar `
- 访问sentinel管理界面
  - http://localhost:8080
  - 登录账号密码均为sentinel



### 初始化demo

- 启动Nacos8848成功：http://localhost:8848/nacos/#/login
- 新建：cloudalibaba-sentinel-service8401
- pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.atguigu.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-sentinel-service8401</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.atguigu.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.csp</groupId>
            <artifactId>sentinel-datasource-nacos</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
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
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>4.6.3</version>
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

</project>
```

- yml

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719  #默认8719，假如被占用了会自动从8719开始依次+1扫描。直至找到未被占用的端口

management:
  endpoints:
    web:
      exposure:
        include: '*'

```

- 启动类

```java
@EnableDiscoveryClient
@SpringBootApplication
public class MainApp8401
{
    public static void main(String[] args) {
        SpringApplication.run(MainApp8401.class, args);
    }
}
```

- 业务类

```java
@RestController
public class FlowLimitController
{
    @GetMapping("/testA")
    public String testA() {
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {

        return "------testB";
    }
}
```

- 启动Sentinel8080:java -jar sentinel-dashboard-1.7.0
- 启动微服务8401
- 启动8401微服务后查看sentienl控制台
  - Sentinel采用的懒加载说明:需要执行以下接口
  - http://localhost:8401/testA
  - 查看监控效果：sentinel8080正在监控微服务8401
- ​



### 流控规则

- 资源名：唯一的名称，默认请求路径
- 针对来源：sentinel可以针对调用者进行限流，填写微服务名，默认default（不区分来源）
- 阈值类型/单机阈值：
  - QPS（每秒钟的请求数量）：当调用该api的QPS达到阈值后，进行限流
  - 线程数：当调用该api的线程数达到阈值时，进行限流
- 是否集群：不需要集群
- 流控模式：
  - 直接：api达到限流条件时，直接限流
  - 关联：当关联的资源达到阈值时，就限流自己
  - 链路：只记录指定链路上的流量（指定资源从入口资源进来的流量，如果达到阈值，就限流）【api级别的针对来源】
- 流控效果：
  - 快速失败：直接失败，抛出异常
  - warm up：根据codeFactor（冷加载因子，默认为3）的值，从阈值/codeFactor，经过预热时长，才达到设置的QPS阈值
  - 排队等待：匀速排队，让请求以匀速的速度通过，**阈值类型必须设置为QPS，否侧无效**
- 直接流控模式：
  - 直接----快速失败
  - 配置说明
  - ![image.png](https://i.loli.net/2021/01/31/aSnkdiVDgQNtRKu.png)
  - 快速点击访问http://localhost:8401/testA
  - 结果：Blocked by Sentinel (flow limiting)
  - 后续会介绍兜底方法
- 关联流控模式
  - 当关联的资源达到阈值时，就限流自己
  - 当与A关联的资源B达到阈值后，就限流自己
  - B惹事，A挂了
  - 配置A
  - ![image.png](https://i.loli.net/2021/01/31/ibnUZqxIOcHVrLk.png)
  - postman模拟并发密集访问testB
  - 访问testB成功
  - 点击访问http://localhost:8401/testA；运行后发现testA挂了
  - 结果：Blocked by Sentinel (flow limiting)
- 链路流控模式
  - 多个请求调用了同一个微服务
- 快速失败流控效果：
  - 直接失败，抛出异常：Blocked by Sentinel (flow limiting)
- 预热流控效果：
  - 公式：阈值除以coldFactor（默认值为3），经过预热时长后才会达到阈值
  - 默认coldFactor为3，即请求QPS从threshold/3开始，经预热时长逐渐升至设定的QPS阈值。
  - 限流 冷启动
  - https://github.com/alibaba/Sentinel/wiki/%E9%99%90%E6%B5%81---%E5%86%B7%E5%90%AF%E5%8A%A8
  - 源码：com.alibaba.csp.sentinel.slots.block.flow.controller.WarmUpController
  - warmup配置
  - ![image.png](https://i.loli.net/2021/01/31/wUKpLP7cu5jEYZJ.png)
  - 多次点击http://localhost:8401/testB；刚开始不行，后续慢慢OK
  - 应用场景：秒杀活动，开启瞬间会有大量流量，很有可能把系统打死，预热方式是为了保护系统，可慢慢把流量放进来，慢慢把阈值增长到设置的阈值
- 排队等待流控效果：
  - ![image.png](https://i.loli.net/2021/01/31/wxXqYlBCoPUEJcK.png)
  - 匀速排队，阈值必须设置为QPS
  - ![image.png](https://i.loli.net/2021/01/31/XQUF3SzRlJeaWkh.png)



### 降级规则

- 基本介绍

- ![image.png](https://i.loli.net/2021/02/28/E1ZymJKaP6bt83v.png)

- sentinel熔断降级会在调用链路中某个资源出现不稳定状态时（例如调用超时或异常比例升高），对这个资源的调用进行限制，让请求快速失败，避免影响到其他资源而导致级联错误

- 当资源被降级后，在接下来的降级时间窗口之内，对该资源的调用都自动熔断（默认行为是抛出DegradeException）

- sentinel的断路器是没有半开状态的

- 半开的状态系统自动去检测是否请求有异常，没有异常就关闭断路器恢复使用，有异常则继续打开断路器不可用，具体参考hystrix

- ![image.png](https://i.loli.net/2021/02/28/JIcR86tjBFlrmQX.png)

- 降级策略实战

- RT：

  - ![image.png](https://i.loli.net/2021/02/28/ZMk39rsLV47lICf.png)

  - ![image.png](https://i.loli.net/2021/02/28/1YUgEdTBHzO7SRh.png)

  - ```java
        @GetMapping("/testD")
        public String testD()
        {
            try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { e.printStackTrace(); }
            log.info("testD 测试RT");

            return "------testD";
        }
    ```

  - ![image.png](https://i.loli.net/2021/02/28/IMV5GaTFkLcBrod.png)

  - jmeter压测

  - ![image.png](https://i.loli.net/2021/02/28/jN8zaW9TpM4miuR.png)

- 异常比例：

  - ![image.png](https://i.loli.net/2021/02/28/GMpsWIiZChHtycR.png)

  - ```java
    @GetMapping("/testD")
        public String testD()
        {

            log.info("testD 测试RT");
            int age = 10/0;
            return "------testD";
        }
     
    ```

  - ![image.png](https://i.loli.net/2021/02/28/nq1xsYzNaTPyb7G.png)

  - ![image.png](https://i.loli.net/2021/02/28/CuLjr5nIASx4JR2.png)

  - ![image.png](https://i.loli.net/2021/02/28/eSwpj59AURolZ6q.png)

- 异常数：

  - ![image.png](https://i.loli.net/2021/02/28/zkH8PatdFIJjOyq.png)

  - 异常数是按照分钟统计的

  - ```java
    @GetMapping("/testE")
    public String testE()
    {
        log.info("testE 测试异常数");
        int age = 10/0;
        return "------testE 测试异常数";
    }
    ```

  - http://localhost:8401/testE

  - ![image.png](https://i.loli.net/2021/02/28/572KiSD3dcpnIhH.png)

  - ​



### 热点key限流

- 兜底方法，分为系统默认和客户端自定义，两种

- 之前的case，限流出现问题后，都是用sentinel系统默认的提示：blocked by sentinel；我们能不能自定义异常，类似hystrix，某个方法出现问题了，就找对应的兜底降级方法

- 结论：从HystrixCommand到@SenticelResource

- ```java
  @GetMapping("/testHotKey")
  @SentinelResource(value = "testHotKey",blockHandler = "deal_testHotKey")
  public String testHotKey(@RequestParam(value = "p1",required = false) String p1,
                           @RequestParam(value = "p2",required = false) String p2) {
      //int age = 10/0;
      return "------testHotKey";
  }
   
  //兜底方法;com.alibaba.csp.sentinel.slots.block.BlockException
  public String deal_testHotKey (String p1, String p2, BlockException exception){
      return "------deal_testHotKey,o(╥﹏╥)o";  
  }
  ```

- ![image.png](https://i.loli.net/2021/02/28/HmkUWgrYK5SPq3Q.png)

- ```
  @SentinelResource(value = "testHotKey")
  异常打到了前台用户界面看不到，不友好

  @SentinelResource(value = "testHotKey",blockHandler = "deal_testHotKey")
  方法testHostKey里面第一个参数只要QPS超过每秒1次，马上降级处理
  用了我们自己定义的
  ```

- 测试：

  - http://localhost:8401/testHotKey?p1=abc  ：error
  - http://localhost:8401/testHotKey?p1=abc&p2=33   ：error
  - http://localhost:8401/testHotKey?p2=abc   ：right

- 参数例外项：

- 上述案例演示了第一个参数p1,当QPS超过1秒1次点击后马上被限流

- 普通：超过1秒钟一个后，达到阈值1后马上被限流

- 我们期望p1参数当它是某个特殊值时，它的限流值和平时不一样

- 特例：假如当p1的值等于5时，它的阈值可以达到200

- 配置

- ![image.png](https://i.loli.net/2021/02/28/Rzl6fJDGkWLiO3w.png)

- 测试：

  - http://localhost:8401/testHotKey?p1=5   ：正确
  - http://localhost:8401/testHotKey?p1=3   ：错误
  - 当p1等于5的时候，阈值变为200
  - 当p1不等于5的时候，阈值就是平常的1

- 前提条件：热点参数的注意点，参数必须是基本类型或者String

- 其他：

  - @SentinelResource：处理的是Sentinel控制台配置的违规情况，有blockHandler方法配置的兜底处理
  - RuntimeException：int t = 10/0，@SentinelResource不管
  - @SentinelResource主管配置出错，运行出错该走异常走异常



### 系统规则

- 系统保护规则是从应用级别的入口流量进行控制，从单台机嚣的load、CPU 使用率、平均RT、 入口QPS和并发线程数等几个维度监控应用指标，让系统尽可能跑在最大吞吐量的同时保证系统整体的稳定性。
- 系统保护规则是应用整体维度的，而不是资源维度的，并且**仅对入口流量生效**。入口流量指的是进入应用的流量( EntryType.IN)，比如Web服务或Dubbo服务端接收的请求，都属于入口流量。
- 系统规则支持以下的模式:
  - Load自适应(仅对Linux/Unix-like机器生效) :系统的load1作为启发指标，进行自适应系统保护。当系统load1超过设定的启发值，且系统当前的并发线程数超过估算的系统容量时才会触发系统保护(BBR 阶段) .系统容量由系统的maxQps * minRt估算得出。设定参考值- -般是CPU cores*2.5。
  - CPU usage (1.5.0+ 版本) :当系统CPU使用率超过阈值即触发系统保护(取值范围0.0-1.0) .比较灵敏。
  - 平均RT:当单台机器上所有入口流星的平均RT达到阈值即触发系统保护，单位是毫秒。
  - 并发线程数:当单台机器上所有入口流量的并发线程数达到阈值即触发系统保护。
  - 入口QPS:当单台机器上所有入口流量的QPS达到阈值即触发系统保护。
- 配置全局QPS



### 注解详解

- @SentinelResource

- 按资源名称限流+后续处理

  - 启动Nacos成功

  - 启动Sentinel成功

  - 创建cloudalibaba-sentinel-service8401

  - ```xml
    <dependency>
        <groupId>com.atguigu.springcloud</groupId>
        <artifactId>cloud-api-commons</artifactId>
        <version>${project.version}</version>
    </dependency>
    ```

  - ```yaml
    server:
      port: 8401

    spring:
      application:
        name: cloudalibaba-sentinel-service
      cloud:
        nacos:
          discovery:
            server-addr: localhost:8848
        sentinel:
          transport:
            dashboard: localhost:8080
            port: 8719  #默认8719，假如被占用了会自动从8719开始依次+1扫描。直至找到未被占用的端口

    management:
      endpoints:
        web:
          exposure:
            include: '*'
    ```

  - ```java

    @RestController
    public class RateLimitController
    {
        @GetMapping("/byResource")
        @SentinelResource(value = "byResource",blockHandler = "handleException")
        public CommonResult byResource()
        {
            return new CommonResult(200,"按资源名称限流测试OK",new Payment(2020L,"serial001"));
        }
        public CommonResult handleException(BlockException exception)
        {
            return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
        }
    ```

  - ```java
    @EnableDiscoveryClient
    @SpringBootApplication
    public class MainApp8401
    {
        public static void main(String[] args) {
            SpringApplication.run(MainApp8401.class, args);
        }

    }
    ```

  - 配置流控规则

  - ![image.png](https://i.loli.net/2021/02/28/QaPuZXbjMdCYxhp.png)

  - 表示1秒钟内查询次数大于1，就跑到我们自定义的处流，限流

  - 1秒钟点击1下，OK

  - 超过上述问题，疯狂点击，返回了自己定义的限流处理信息，限流发送

  - 此时关闭微服务8401看看，Sentinel控制台，流控规则消失了？？？？？临时/持久？

- 按照Url地址限流+后续处理

  - 通过访问的URL来限流，会返回Sentinel自带默认的限流处理信息

  - 业务类RateLimitController

  - ```java
    @GetMapping("/rateLimit/byUrl")
    @SentinelResource(value = "byUrl")
    public CommonResult byUrl()
    {
        return new CommonResult(200,"按url限流测试OK",new Payment(2020L,"serial002"));
    }
    ```

  - 访问一次

  - Sentinel控制台配置

  - ![image.png](https://i.loli.net/2021/02/28/bYHuQKq7PF2aVxd.png)

  - 疯狂点击http://localhost:8401/rateLimit/byUrl

    会返回sentinel自带的限流处理结果

- 上面兜底方法面临的问题：

  - 系统默认的，没有体现我们自己的业务要求。
  - 按照现有条件，我们自定义的处理方法又和业务代码耦合在一块，不直观
  - 每个业务方法都添加一个兜底的，那代码膨胀加剧
  - 全局统一的处理方法没有体现

- 客户自定义限流处理逻辑：

  - 创建customerBlockHandler类用于自定义限流处理逻辑

  - 自定义限流处理类CustomerBlockHandler

  - ```java
    public class CustomerBlockHandler {

        public static CommonResult handleException(BlockException exception) {
            return new CommonResult(2020, "自定义限流处理信息....CustomerBlockHandler");

        }
    }
    ```

  - RateLimitController

  - ```java
    @GetMapping("/rateLimit/customerBlockHandler")
    @SentinelResource(value = "customerBlockHandler",
            blockHandlerClass = CustomerBlockHandler.class,
            blockHandler = "handlerException2")
    public CommonResult customerBlockHandler()
    {
        return new CommonResult(200,"按客戶自定义",new Payment(2020L,"serial003"));
    }
    ```

  - 启动微服务后先调用一次;http://localhost:8401/rateLimit/customerBlockHandler

  - Sentinel控制台配置

  - 测试后我们自定义的出来了

  - ![image.png](https://i.loli.net/2021/02/28/z4Tyl9Fv3VB1CLN.png)

- 注解属性说明

  - @SentinelResource注解
  - 注意:注解方式埋点不支持private方法。
  - @SentinelResource用于定义资源。并提供可选的异常处理和fllback配置项。eSentinelResource 注解包含以下属性:
    - value: 资源名称，必需项(不能为空)
    - entryType : entry类型， 可选项(默认为EntryType.Out )
    - blockHandler / blockHandlerClass: blockHandler 对应处理BlockException 的函数名称，可选项。blockHandler 函数访问范围需要是public ,返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为BlockException . blockHandler 函数默认需要和原方法在同一个类中，若希望使用其他类的函数，则可以指定bleckHiandlerClass 为对应的类的Class对象，注意对应的函数必需为static函数，否则无法解析。
    - fallback : fllback函数名称,可选项,用于在抛出异常的时候提供fllbalk处理逻辑。fallback函数可以针对所有类型的异常(除了exceptionsTolgnore 里面排阶掉的异常类型)。进行处理.fallback函数签名和位置要求:
      - 返回值类型必须与原函数返回值类型一致;
      - 方法参数列表需要和原函数一致,或者可以额外多-一个 Throuable 类型的参数用于接收对应的异常
      - fllback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数,则可以指定fallbackClass为对应的类的Class 对象，注意对成的函数必需为static函数，否则无法解析
    - defaultFallback (since 1.6.0} :默认的fllback函数名称，可选项，通常用于通用的fllback逻辑(即可以用于很多服务或方法) .默认fllback函数可以针对所有类型的异常(除了exceptlonsTolgnore 里面排除掉的异常类型)进行处理.若同时配置了fllback和defaultallback,则只有allback会生效。defaulFallback 函数签名要求:
      - 返回值类型必须与原函数返回值类型一致;
      - 方法参数列表需要为空，或者可以额外多一 个Throwable 类型的参数用于接收对应的异常。
      - defaultFallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定fallbackClass为对应的类的Class 对象,注意对应的函数必需为static函数，否则无法解析
    - exceptionsToIgnore (since 16.0) :用于指定哪些异常被排除掉,不会计入异常统计中,也不会进入fallback逻辑中,而是会原样抛出。
  - 注: 1.6.0之前的版本 fllbalck函数只针对降级异常( DegradeException)进行处理，不能针对业务异常进行处理
  - 特别地，若blockHandler和fllback都进行了配置，则被限流降级而抛出BlockException 时只会进入blockandler处理逻辑。若末配置blockHandler 、fallback 和defaultFallback ，则被限流降级时会将BlockException 直接抛出(若方法本身未定义throws BlockException 则会被JVM包装一层Undecl aredThrouableException )
  - **所有的代码都要用try-catch-finally方式进行处理**
  - Sentinel主要有三个核心API：SphU定义资源，Tracer定义统计，ContextUtil定义了上下文



### 服务熔断功能

- sentinel整合ribbon+openFeign+fallback



#### ribbon系列

- 启动nacos和sentinel

- 新建cloudalibaba-provider-payment9003/9004

- ```xml
  <dependencies>
      <!--SpringCloud ailibaba nacos -->
      <dependency>
          <groupId>com.alibaba.cloud</groupId>
          <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
      </dependency>
      <dependency><!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
          <groupId>com.atguigu.springcloud</groupId>
          <artifactId>cloud-api-commons</artifactId>
          <version>${project.version}</version>
      </dependency>
      <!-- SpringBoot整合Web组件 -->
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-actuator</artifactId>
      </dependency>
      <!--日常通用jar包配置-->
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

- ```yaml
  server:
    port: 9003 #记得修改不同的端口号

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

- ```java
  @SpringBootApplication
  @EnableDiscoveryClient
  public class PaymentMain9003
  {
      public static void main(String[] args) {
          SpringApplication.run(PaymentMain9003.class, args);
      }
  }
  ```

- ```java
  @RestController
  public class PaymentController
  {
      @Value("${server.port}")
      private String serverPort;

      public static HashMap<Long, Payment> hashMap = new HashMap<>();
      static{
          hashMap.put(1L,new Payment(1L,"28a8c1e3bc2742d8848569891fb42181"));
          hashMap.put(2L,new Payment(2L,"bba8c1e3bc2742d8848569891ac32182"));
          hashMap.put(3L,new Payment(3L,"6ua8c1e3bc2742d8848569891xt92183"));
      }

      @GetMapping(value = "/paymentSQL/{id}")
      public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id){
          Payment payment = hashMap.get(id);
          CommonResult<Payment> result = new CommonResult(200,"from mysql,serverPort:  "+serverPort,payment);
          return result;
      }



  }
  ```

- 测试地址:http://localhost:9003/paymentSQL/1



- 新建cloudalibaba-consumer-nacos-order84

- ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <parent>
          <artifactId>cloud2020</artifactId>
          <groupId>com.atguigu.springcloud</groupId>
          <version>1.0-SNAPSHOT</version>
      </parent>
      <modelVersion>4.0.0</modelVersion>

      <artifactId>cloudalibaba-consumer-nacos-order84</artifactId>

      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-openfeign</artifactId>
          </dependency>
          <dependency>
              <groupId>com.alibaba.cloud</groupId>
              <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
          </dependency>
          <dependency>
              <groupId>com.alibaba.cloud</groupId>
              <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
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


  </project>
  ```

- ```yaml
  server:
    port: 84

  spring:
    application:
      name: nacos-order-consumer
    cloud:
      nacos:
        discovery:
          server-addr: localhost:8848
      sentinel:
        transport:
          dashboard: localhost:8080
          port: 8719

  service-url:
    nacos-user-service: http://nacos-payment-provider
  ```

- ```java
  @EnableDiscoveryClient
  @SpringBootApplication
  @EnableFeignClients
  public class OrderNacosMain84
  {
      public static void main(String[] args) {
          SpringApplication.run(OrderNacosMain84.class, args);
      }
  }
  ```

- ```java
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

- 业务类：

  - ```java
    @RestController
    @Slf4j
    public class CircleBreakerController {
       
        public static final String SERVICE_URL = "http://nacos-payment-provider";

        @Resource
        private RestTemplate restTemplate;

       
        
        @RequestMapping("/consumer/fallback/{id}")
        //@SentinelResource(value = "fallback") //没有配置
        //@SentinelResource(value = "fallback",fallback = "handlerFallback") //fallback只负责业务异常
        //@SentinelResource(value = "fallback",blockHandler = "blockHandler") //blockHandler只负责sentinel控制台配置违规
        @SentinelResource(value = "fallback",fallback = "handlerFallback",blockHandler = "blockHandler",
                exceptionsToIgnore = {IllegalArgumentException.class})
        public CommonResult<Payment> fallback(@PathVariable Long id) {
            CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

            if (id == 4) {
                throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
            }else if (result.getData() == null) {
                throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
            }

            return result;
        }
      
        //fallback
        public CommonResult handlerFallback(@PathVariable  Long id,Throwable e) {
            Payment payment = new Payment(id,"null");
            return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  "+e.getMessage(),payment);
        }
      
        //blockHandler
        public CommonResult blockHandler(@PathVariable  Long id,BlockException blockException) {
            Payment payment = new Payment(id,"null");
            return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
        }
    }

    ```

  - 测试地址：http://localhost:84/consumer/fallback/1

  - 若blockHandler和fallback都进行了配置,则被限流降级而抛出BlockException时只会进入blockHandler处理逻辑。

  - ![image.png](https://i.loli.net/2021/02/28/JfcuLX79SWFrpRT.png)



#### Feign系列

- 修改84模块

- ```xml
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-openfeign</artifactId>
  </dependency>
  ```

- ```yaml
  server:
    port: 84


  spring:
    application:
      name: nacos-order-consumer
    cloud:
      nacos:
        discovery:
          server-addr: localhost:8848
      sentinel:
        transport:
          dashboard: localhost:8080
          port: 8719

  service-url:
    nacos-user-service: http://nacos-payment-provider

  #对Feign的支持
  feign:
    sentinel:
      enabled: true
  ```

- 业务类：

  - 带@FeignClient注解的业务接口

  - ```java
    @FeignClient(value = "nacos-payment-provider",fallback = PaymentFallbackService.class)
    public interface PaymentService
    {
        @GetMapping(value = "/paymentSQL/{id}")
        public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id);
    }
    ```

  - PaymentFallbackService实现类

  - ```java
    // OpenFeign
    @Resource
    private PaymentService paymentService;

    @GetMapping(value = "/consumer/paymentSQL/{id}")
    public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
        return paymentService.paymentSQL(id);
    }
    ```

- 添加@EnableFeignClients启动Feign的功能

- ```java
  @EnableDiscoveryClient
  @SpringBootApplication
  @EnableFeignClients
  public class OrderNacosMain84
  {
      public static void main(String[] args) {
          SpringApplication.run(OrderNacosMain84.class, args);
      }
  }
  ```

- http://lcoalhost:84/consumer/openfeign/1

- http://lcoalhost:84/consumer/paymentSQL/1

- 测试84调用9003，此时故意关闭9003微服务提供者，看84消费侧自动降级，不会被耗死



#### 熔断框架比较

|         | Sentinel                      | Hystrix        | resilience4j      |
| ------- | ----------------------------- | -------------- | ----------------- |
| 隔离策略    | 信号量隔高(并发线程数限流)                | 线程池隔离/信号量隔离    | 信号量隔离             |
| 熔断降级策略  | 甚于响应时间、异常比率、异常数               | 甚于异常比率         | 基于异常比率、响应时间       |
| 实时统计实现  | 滑动窗口(LeapArray)               | 滑动窗口(基于RxJava) | Ring Bit Buffer   |
| 动态规则配置  | 支持多种数据源                       | 支持多种数据源        | 有限支持              |
| 扩展性.    | 多个扩展点                         | 插件的形式          | 接口的形式             |
| 基于注解的支持 | 支持                            | 支持             | 支持                |
| 隈流      | 基于QPS.支持基于调用关系的限流             | 有限的支持          | Rate Limiter      |
| 流量整形    | 支持预热模式、匀速器模式、预热排队模式           | 不支持            | 简单的Rate Limiter模式 |
| 系统自适应保护 | 支持                            | 不支持            | 不支持               |
| 控制台     | 提供开箱即用的控制台，可配置规则、查看秒级监控、机器发现等 | 简单的监控查看        | 不提供控制台，可对接其它监控系统  |



### 规则持久化

- 一旦我们重启应用，Sentinel规则将消失，生产环境需要将配置规则进行持久化

- 将限流配置规则持久化进Nacos保存，只要刷新8401某个rest地址，sentinel控制台的流控规则就能看到，只要Nacos里面的配置不删除，针对8401上Sentinel上的流控规则持续有效

- 修改cloudalibaba-sentinel-service8401

- ```xml
  <dependency>
      <groupId>com.alibaba.csp</groupId>
      <artifactId>sentinel-datasource-nacos</artifactId>
  </dependency>
  ```

- 添加Nacos数据源配置

- ```yaml
  server:
    port: 8401

  spring:
    application:
      name: cloudalibaba-sentinel-service
    cloud:
      nacos:
        discovery:
          server-addr: localhost:8848 #Nacos服务注册中心地址
      sentinel:
        transport:
          dashboard: localhost:8080 #配置Sentinel dashboard地址
          port: 8719
        datasource:
          ds1:
            nacos:
              server-addr: localhost:8848
              dataId: cloudalibaba-sentinel-service
              groupId: DEFAULT_GROUP
              data-type: json
              rule-type: flow

  management:
    endpoints:
      web:
        exposure:
          include: '*'

  feign:
    sentinel:
      enabled: true # 激活Sentinel对Feign的支持
  ```

- 添加Nacos业务规则配置

- ![image.png](https://i.loli.net/2021/02/28/qcUbEtBaLPoMmKN.png)

- 内容解析

- ```
  [
      {
           "resource": "/retaLimit/byUrl",  资源名称
           "limitApp": "default",  来源应用
           "grade":   1,  阈值类型，0表示线程数，1表示QPS
           "count":   1,  单机阈值
           "strategy": 0,  流控模式，0表示直接，1表示关联，2表示链路
           "controlBehavior": 0,  流控效果，0表示快速失败，1表示Warm up，2表示排队等待
           "clusterMode": false    是否集群
      }
  ]
  ```

- 启动8401后刷新sentinel发现业务规则有了

- ![image.png](https://i.loli.net/2021/02/28/PkL5s47frMSa9UA.png)

- 快速访问测试接口：http://localhost:8401/rateLimit/byUrl，显示默认的blocked by sentinel

- 停止8401再看sentinel

- ![image.png](https://i.loli.net/2021/02/28/WpyhZrdzOn9JRPD.png)

- 重新启动8401再看sentinel
  扎一看还是没有，稍等一会儿
  多次调用http://localhost:8401/rateLimit/byUrl
  重新配置出现了，持久化验证通过

- ​