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



#### 需求背景

- 微服务架构后链式调用是我们在写程序时候的一般流程,为了完成一个整体功能会将其拆分成多个函数(或子模块)，比如模块A调用模块B,模块B调用模块C,模块C调用模块D。但在大型分布式应用中，系统间的RPC交互繁杂
- 每新增一个下游功能，都要对上游的相关接口进行改造；每个接口模块的吞吐能力是有限的，这个上限能力如果是堤坝，当大流量（洪水）来临时，容易被冲垮。RPC接口上基本都是同步调用，整体的服务性能遵循“木桶理论”，即整体系统的耗时取决于链路中最慢的那个接口。
- 根据上述的几个问题，在设计系统时可以明确要达到的目标：
  - 1，要做到系统解耦，当新的模块接进来时，可以做到代码改动最小；能够解耦
  - 2，设置流量缓冲池，可以让后端系统按照自身吞吐能力进行消费，不被冲垮；能削峰
  - 3，强弱依赖梳理能将非关键调用链路的操作异步化并提升整体系统的吞吐能力；能够异步



#### 什么是MQ

- 面向消息的中间件（message-oriented middleware）MOM能够很好的解决以上问题，是指利用高效可靠的消息传递机制与平台无关的数据交流，并基于数据通信来进行分布式系统的集成。
- 通过提供消息传递和消息排队模型在分布式环境下提供应用解耦，弹性伸缩，冗余存储、流量削峰，异步通信，数据同步等功能。
- 发送者把消息发送给消息服务器，消息服务器将消息存放在若干队列/主题topic中，在合适的时候，消息服务器回将消息转发给接受者。在这个过程中，发送和接收是异步的，也就是发送无需等待，而且发送者和接受者的生命周期也没有必然的关系；尤其在发布pub/订阅sub模式下，也可以完成一对多的通信，即让一个消息有多个接受者。
- **特点：解耦，削锋，异步**

#### 安装

- ActiveMQ官网：`http://activemq.apache.org/`
- 解压

```
[root@i activemq]# tar -xzvf apache-activemq-5.14.3-bin.tar.gz
```

- 在/etc/init.d/目录增加增加activemq文件

```
cd /etc/init.d/
vi activemq

#!/bin/sh
#
# /etc/init.d/activemq
# chkconfig: 345 63 37
# description: activemq servlet container.
# processname: activemq 5.14.3

# Source function library.
#. /etc/init.d/functions
# source networking configuration.
#. /etc/sysconfig/network

export JAVA_HOME=/usr/local/jdk1.8.0_131
export CATALINA_HOME=/usr/local/activemq/apache-activemq-5.14.3

case $1 in
    start)
        sh $CATALINA_HOME/bin/activemq start
    ;;
    stop)
        sh $CATALINA_HOME/bin/activemq stop
    ;;
    restart)
        sh $CATALINA_HOME/bin/activemq stop
        sleep 1
        sh $CATALINA_HOME/bin/activemq start
    ;;

esac
exit 0

```

- 设置权限

```
[root@ init.d]# chmod 777 activemq

设置开机启动
[root@ init.d]# chkconfig activemq on

启动ActiveMQ
[root@ init.d]# service activemq start

以记录日志方式启动
service activemq start  >  /usr/local/raohao/activemq.log

访问activemq管理页面地址：http://IP地址:8161/
账户admin  密码admin

查看activemq状态
service activemq status

关闭activemq服务
service activemq stop
```



### API编码实现

- pom

```xml
<!-- https://mvnrepository.com/artifact/org.apache.activemq/activemq-all -->
<dependency>
  <groupId>org.apache.activemq</groupId>
  <artifactId>activemq-all</artifactId>
  <version>5.15.11</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.xbean/xbean-spring -->
<dependency>
  <groupId>org.apache.xbean</groupId>
  <artifactId>xbean-spring</artifactId>
  <version>4.15</version>
</dependency>
```

- JMS开发步骤：
  - 创建一个connection factory
  - 通过connection factory来创建JMS connection
  - 启动JMS connection
  - 通过connection创建JMS session
  - 创建JMS destination
  - 创建JMS producer或者创建JMS message并设置destination
  - 创建JMS consumer或者注册一个JMS message listener
  - 发送或者接收JMS message（s）
  - 关闭所有的JMS资源（connection，session，producer，consumer等）
- destination简介：Destination是目的地。目的地，我们可以理解为是数据存储的地方。
- Destination分为两种：队列和主题。
- 在点对点的消息传递域中,目的地被称为队列(queue)
  - 每个消息只能有一个消费者，类似于1对1的关系。好比个人快递自己领自己的。
  - 消息的生产者和消费者之间没有时间上的相关性。无论消费者在生产者发送消息的时候是否处于运行状态，消费者都可以提取消息。好比我们的发送短信，发送者发送后不见得接收者会即收即看。
  - 消息被消费后队列中不会再存储，所以消费者不会消费到已经被消费掉的消息。
- 在发布订阅消息传递域中,目的地被称为主题(topic)
  - 生产者将消息发布到topic中，每个消息可以有多个消费者，属于1：N的关系；
  - 生产者和消费者之间有时间上的相关性。订阅某一个主题的消费者只能消费自它订阅之后发布的消息。
  - 生产者生产时，topic不保存消息它是无状态的不落地，假如无人订阅就去生产，那就是一条废消息，所以，一般先启动消费者再启动生产者。
- JMS规范允许客户创建持久订阅，这在一定程度上放松了时间上的相关性要求。持久订阅允许消费者消费它在未处于激活状态时发送的消息。一句话，好比我们的微信公众号订阅
- 对比队列和主题

|       | topic模式队列                                | queue模式队列                                |
| ----- | ---------------------------------------- | ---------------------------------------- |
| 工作模式  | 订阅-发布模式，如果当前没有订阅者，消息将会被丢弃。如果有多个订阅者，那么这些订阅者都会收到消息 | 负载均衡模式，如果当前没有消费者，消息也不会被丢弃，如果有多个消费者，那么一条消息也只能发送给一个消费者，并且要求消费者ack信息 |
| 有无状态  | 无状态                                      | queue数据默认会在mq服务器上以文件形式保存，比如ActiveMQ一般保存在$AMQ_HOME\data\kr-store\data下面。也可以配置成DB存储。 |
| 传递完整性 | 如果没有订阅者，消息将会被丢弃                          | 消息不会丢弃                                   |
| 处理效率  | 由于消息要按照订阅者的数量进行复制，所以处理性能会随着订阅者的增加而明显降低，而且还要结合不同消息协议自身的性能差异 | 由于一条消息只发送给一个消费者，就算消费者再多，性能也不会有明显下降。不同消息协议的具体性能也是有差异的。 |



#### 队列-生产者

- 队列消息生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce {
    //  linux 上部署的activemq 的 IP 地址 + activemq 的端口号
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    // 目的地的名称
    public static final String QUEUE_NAME = "jdbc01";


    public static void main(String[] args) throws  Exception{
        // 1 按照给定的url创建连接工厂，这个构造器采用默认的用户名密码。该类的其他构造方法可以指定用户名和密码。
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        // 2 通过连接工厂，获得连接 connection 并启动访问。
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        // 3 创建会话session 。第一参数是是否开启事务， 第二参数是消息签收的方式
        Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
        // 4 创建目的地（两种 ：队列/主题）。Destination是Queue和Topic的父类
        Queue queue = session.createQueue(QUEUE_NAME);
        // 5 创建消息的生产者
        MessageProducer messageProducer = session.createProducer(queue);
        // 6 通过messageProducer 生产 3 条 消息发送到消息队列中
        for (int i = 1; i < 4 ; i++) {
            // 7  创建消息
            TextMessage textMessage = session.createTextMessage("msg--" + i);
            // 8  通过messageProducer发送给mq
            messageProducer.send(textMessage);
        }
        // 9 关闭资源
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** 消息发送到MQ完成 ****");
    }
}

```

- 控制台消息
  - Number Of Pending Messages：等待消费的消息，这个是未出队列的数量，公式=总接收数-总出队列数
  - Number Of Consumers：消费者数量，消费者端的消费者数量
  - Messages Enqueued：进队消息数，进队列的总消息量，包括出队列的。这个数只增不减。
  - Messages Dequeued：出队消息数，可以理解为是消费者消费掉的数量。
  - 当有一个消息进入这个队列时，等待消费的消息是1，进入队列的消息是1。
  - 当消息消费后，等待消费的消息是0，进入队列的消息是1，出队列的消息是1。
  - 当再来一条消息时，等待消费的消息是1，进入队列的消息就是2。



#### 队列-同步阻塞消费者

- 队列消息消费者
- 订阅者或接收者抵用MessageConsumer的receive()方法来接收消息，receive方法在能接收到消息之前（或超时之前）将一直阻塞。

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

// 消息的消费者
public class JmsConsumer {

    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String QUEUE_NAME = "jdbc01";

    public static void main(String[] args) throws Exception{
      	//1.创建连接工厂，按照给定的URL，采用默认的用户名密码
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
      	//2.通过连接工厂,获得connection并启动访问
        javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
      	 //3.创建会话session。两个参数transacted=事务,acknowledgeMode=确认模式(签收)
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
      	 //4.创建目的地(具体是队列queue还是主题topic)
        Queue queue = session.createQueue(QUEUE_NAME);
        //5.创建消息的消费者,指定消费哪一个队列里面的消息
        MessageConsumer messageConsumer = session.createConsumer(queue);
      	 //循环获取
        while(true){
            // reveive() 一直等待接收消息，在能够接收到消息之前将一直阻塞。 是同步阻塞方式 。和socket的accept方法类似的。
// reveive(Long time) : 等待n毫秒之后还没有收到消息，就是结束阻塞。
            // 因为消息发送者是 TextMessage，所以消息接受者也要是TextMessage
          	//6.通过消费者调用方法获取队列里面的消息(发送的消息是什么类型,接收的时候就强转成什么类型)
            TextMessage message = (TextMessage)messageConsumer.receive(); 
            if (null != message){
                System.out.println("****消费者的消息："+message.getText());
            }else {
                break;
            }
        }
      	 //7.关闭资源
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



#### 队列-异步监听消费者

- 异步
- 订阅者或接收者通过MessageConsumer的setMessageListener(MessageListener listener)注册一个消息监听器，当消息到达之后，系统会自动调用监听器MessageListener的onMessage(Message message)方法。

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

// 消息的消费者  也就是回答消息的系统
public class JmsConsumer {

    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";

    public static final String QUEUE_NAME = "jdbc01";

    public static void main(String[] args) throws Exception{
      	 //1.创建连接工厂，按照给定的URL，采用默认的用户名密码
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
      	//2.通过连接工厂,获得connection并启动访问
        javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
      	//3.创建会话session
        //两个参数transacted=事务,acknowledgeMode=确认模式(签收)
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
      	//4.创建目的地(具体是队列queue还是主题topic)
        Queue queue = session.createQueue(QUEUE_NAME);
      	//5.创建消息的消费者,指定消费哪一个队列里面的消息
        MessageConsumer messageConsumer = session.createConsumer(queue);
		//6.通过监听的方式消费消息
        /* 通过监听的方式来消费消息，是异步非阻塞的方式消费消息。
           通过messageConsumer 的setMessageListener 注册一个监听器，当有消息发送来时，系统自动调用MessageListener 的 onMessage 方法处理消息
         */
      	/*
        异步非阻塞式方式监听器(onMessage)
        订阅者或消费者通过创建的消费者对象,给消费者注册消息监听器setMessageListener,
        当消息有消息的时候,系统会自动调用MessageListener类的onMessage方法
        我们只需要在onMessage方法内判断消息类型即可获取消息
         */
        messageConsumer.setMessageListener(new MessageListener() {
            public void onMessage(Message message)  {
//  instanceof 判断是否A对象是否是B类的子类
                    if (null != message  && message instanceof TextMessage){
                      	 //7.把message转换成消息发送前的类型并获取消息内容
                        TextMessage textMessage = (TextMessage)message;
                        try {
                            System.out.println("****消费者的消息："+textMessage.getText());
                        }catch (JMSException e) {
                            e.printStackTrace();
                        }
                }
            }
        });
        // 让主线程不要结束。因为一旦主线程结束了，其他的线程（如此处的监听消息的线程）也都会被迫结束。
        // 实际开发中，我们的程序会一直运行，这句代码都会省略。
      	 //保证控制台不关闭,阻止程序关闭
        System.in.read();
      	 //8.关闭资源
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



#### 主题-生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce_topic {

    public static final String ACTIVEMQ_URL = "tcp://192.168.17.3:61616";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws  Exception{
             ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
		
      	//创建目的地(具体是队列queue还是主题topic)
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageProducer messageProducer = session.createProducer(topic);
        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("topic_name--" + i);
            messageProducer.send(textMessage);
            MapMessage mapMessage = session.createMapMessage();
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** TOPIC_NAME消息发送到MQ完成 ****");
    }
}

```



#### 主题-消费者

- **先启动订阅者再启动生产者,不然发送的消息是废消息**

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsConsummer_topic {
    public static final String ACTIVEMQ_URL = "tcp://192.168.17.3:61616";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

        // 4 创建目的地 （两种 ： 队列/主题   这里用主题）
        Topic topic = session.createTopic(TOPIC_NAME);

        MessageConsumer messageConsumer = session.createConsumer(topic);
// MessageListener接口只有一个方法，可以使用lambda表达式
        messageConsumer.setMessageListener( (message) -> {
            if (null != message  && message instanceof TextMessage){
                     TextMessage textMessage = (TextMessage)message;
                    try {
                      System.out.println("****消费者text的消息："+textMessage.getText());
                    }catch (JMSException e) {
                    }
                }
        });

        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



#### activeMQ控制台

- topic有多个消费者时，消费消息的数量≈ 在线消费者数量*生产消息的数量。



### JMS规范

- 什么是java消息服务：Java消息服务指的是两个应用程序之间进行异步通信的API，它为标准协议和消息服务提供了一组通用接口，包括创建、发送、读取消息等，用于支持Java应用程序开发。在JavaEE中，当两个应用程序使用JMS进行通信时，它们之间不是直接相连的，而是通过一个共同的消息收发服务组件关联起来以达到解耦/异步削峰的效果。
- JMS组成结构及特点
  - JMS Provider：实现JMS接口和规范的消息中间件，也就是我们说的MQ服务器
  - JMS Producer：消息生产者，创建和发送JMS消息的客户端应用
  - JMS Consumer：消息消费者，接收和处理JMS消息的客户端应用
  - JMS Message：包括消息头，消息属性，消息体



#### 消息头

- JMS的消息头有哪些属性：
  - JMSDestination：消息目的地，主要是指Queue和Topic
  - JMSDeliveryMode：消息持久化模式；一条持久性的消息：应该被传送“一次仅仅一次”，这就意味着如果JMS提供者出现故障，该消息并不会丢失，它会在服务器恢复之后再次传递；一条非持久的消息：最多会传递一次，这意味着服务器出现故障，该消息将会永远丢失。
  - JMSExpiration：消息过期时间；可以设置消息在一定时间后过期，默认是永不过期；消息过期时间，等于Destination的send方法中的timeToLive值加上发送时刻的GMT时间值；如果timeToLive值等于0，则JMSExpiration被设为0，表示该消息永不过期；如果发送后，在消息过期时间之后还没有被发送到目的地，则该消息被清除。
  - JMSPriority：消息的优先级；消息优先级，从0-9十个级别，0-4是普通消息5-9是加急消息；JMS不要求MQ严格按照这十个优先级发送消息但必须保证加急消息要先于普通消息到达。默认是4级。
  - JMSMessageID：消息的唯一标识符。后面我们会介绍如何解决幂等性。
  - 消息的生产者可以set这些属性，消息的消费者可以get这些属性。这些属性在send方法里面也可以设置

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce_topic {
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageProducer messageProducer = session.createProducer(topic);

        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("topic_name--" + i);
            // 这里可以指定每个消息的目的地
            textMessage.setJMSDestination(topic);
            /*
            持久模式和非持久模式。
            一条持久性的消息：应该被传送“一次仅仅一次”，这就意味着如果JMS提供者出现故障，该消息并不会丢失，它会在服务器恢复之后再次传递。
            一条非持久的消息：最多会传递一次，这意味着服务器出现故障，该消息将会永远丢失。
             */
            textMessage.setJMSDeliveryMode(0);
            /*
            可以设置消息在一定时间后过期，默认是永不过期。
            消息过期时间，等于Destination的send方法中的timeToLive值加上发送时刻的GMT时间值。
            如果timeToLive值等于0，则JMSExpiration被设为0，表示该消息永不过期。
            如果发送后，在消息过期时间之后还没有被发送到目的地，则该消息被清除。
             */
            textMessage.setJMSExpiration(1000);
            /*  消息优先级，从0-9十个级别，0-4是普通消息5-9是加急消息。
            JMS不要求MQ严格按照这十个优先级发送消息但必须保证加急消息要先于普通消息到达。默认是4级。
             */
            textMessage.setJMSPriority(10);
            // 唯一标识每个消息的标识。MQ会给我们默认生成一个，我们也可以自己指定。
            textMessage.setJMSMessageID("ABCD");
            // 上面有些属性在send方法里也能设置
            messageProducer.send(textMessage);
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** TOPIC_NAME消息发送到MQ完成 ****");
    }
}

```



#### 消息体

- 封装具体的消息数据
- 发送和接收的消息体类型必须一致对应
- 5种消息格式：
  - TxtMessage：普通字符串消息，包含一个String
  - MapMessage：一个Map类型的消息，key为Strng类型，而值为Java基本类型
  - BytesMessage：二进制数组消息，包含一个byte[]
  - StreamMessage：Java数据流消息，用标准流操作来顺序填充和读取
  - ObjectMessage：对象消息，包含一个可序列化的Java对象
- 演示TextMessage和MapMessage的用法
- 消息生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce_topic {

    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
         javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
         connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageProducer messageProducer = session.createProducer(topic);

        for (int i = 1; i < 4 ; i++) {
			// 发送TextMessage消息体
            TextMessage textMessage = session.createTextMessage("topic_name--" + i);
            messageProducer.send(textMessage);
            // 发送MapMessage  消息体。set方法: 添加，get方式：获取
            MapMessage  mapMessage = session.createMapMessage();
            mapMessage.setString("name", "张三"+i);
            mapMessage.setInt("age", 18+i);
            messageProducer.send(mapMessage);
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** TOPIC_NAME消息发送到MQ完成 ****");
    }
}

```



- 消息消费者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsConsummer_topic {
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageConsumer messageConsumer = session.createConsumer(topic);

        messageConsumer.setMessageListener( (message) -> {
 // 判断消息是哪种类型之后，再强转。
            if (null != message  && message instanceof TextMessage){
                   TextMessage textMessage = (TextMessage)message;
                    try {
                      System.out.println("****消费者text的消息："+textMessage.getText());
                    }catch (JMSException e) {
                    }
                }
            if (null != message  && message instanceof MapMessage){
                MapMessage mapMessage = (MapMessage)message;
                try {
                    System.out.println("****消费者的map消息："+mapMessage.getString("name"));
                    System.out.println("****消费者的map消息："+mapMessage.getInt("age"));
                }catch (JMSException e) {
                }
            }

        });
        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



#### 消息属性

- 如果需要除消息头字段之外的值，那么可以使用消息属性。他是识别/去重/重点标注等操作，非常有用的方法。
- 他们是以属性名和属性值对的形式制定的。可以将属性视为消息头的扩展，属性指定一些消息头没有包括的附加信息，比如可以在属性里指定消息选择器。消息的属性就像可以分配给一条消息的附加消息头一样。它们允许开发者添加有关消息的不透明附加信息。它们还用于暴露消息选择器在消息过滤时使用的数据。
- 消息生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce_topic {

    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageProducer messageProducer = session.createProducer(topic);

        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("topic_name--" + i);
            // 调用Message的set*Property()方法，就能设置消息属性。根据value的数据类型的不同，有相应的API。
            textMessage.setStringProperty("From","ZhangSan@qq.com");
            textMessage.setByteProperty("Spec", (byte) 1);
            textMessage.setBooleanProperty("Invalide",true);
            messageProducer.send(textMessage);
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** TOPIC_NAME消息发送到MQ完成 ****");
    }
}

```

- 消息消费者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsConsummer_topic {
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageConsumer messageConsumer = session.createConsumer(topic);

        messageConsumer.setMessageListener( (message) -> {
            if (null != message  && message instanceof TextMessage){
                    TextMessage textMessage = (TextMessage)message;
                    try {
                      System.out.println("消息体："+textMessage.getText());
                      System.out.println("消息属性："+textMessage.getStringProperty("From"));
                      System.out.println("消息属性："+textMessage.getByteProperty("Spec"));
                      System.out.println("消息属性："+textMessage.getBooleanProperty("Invalide"));
                    }catch (JMSException e) {
                    }
                }
        });
        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



#### 消息持久化

- 什么是持久化消息：在消息生产者将消息成功发送给MQ消息中间件之后。无论是出现任何问题，如：MQ服务器宕机、消费者掉线等。都保证（topic要之前注册过，queue不用）消息消费者，能够成功消费消息。如果消息生产者发送消息就失败了，那么消费者也不会消费到该消息。
- queue非持久：当服务器宕机，消息不存在（消息丢失了）。即便是非持久，消费者在不在线的话，消息也不会丢失，等待消费者在线，还是能够收到消息的。
- queue持久：queue持久化，当服务器宕机，消息依然存在。queue消息默认是持久化的。
- 可靠性的另一个重要方面是确保持久性消息传送至目标后，消息服务在向消费者传送它们之前不会丢失这些消息。
- 非持久化的生产者：当生产者成功发布消息之后，MQ服务端宕机重启，消息生产者就收不到该消息了

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce {
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String QUEUE_NAME = "jdbc01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(QUEUE_NAME);
        MessageProducer messageProducer = session.createProducer(queue);
        // 非持久化
        messageProducer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("---MessageListener---" + i);
            messageProducer.send(textMessage);
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** 消息发送到MQ完成 ****");
    }
}

```

- 持久化生产者：当生产者成功发布消息之后，MQ服务端宕机重启，消息生产者仍然能够收到该消息

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class JmsProduce {
    public static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    public static final String QUEUE_NAME = "jdbc01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(QUEUE_NAME);
        MessageProducer messageProducer = session.createProducer(queue);
      	//持久化设置
        messageProducer.setDeliveryMode(DeliveryMode.PERSISTENT);
        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("---MessageListener---" + i);
            messageProducer.send(textMessage);
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** 消息发送到MQ完成 ****");
    }
}

```



- topic持久化：topic默认就是非持久化的，因为生产者生产消息时，消费者也要在线，这样消费者才能消费到消息。topic消息持久化，只要消费者向MQ服务器注册过，所有生产者发布成功的消息，该消费者都能收到，不管是MQ服务器宕机还是消费者不在线。
- 注意：
  - 一定要先运行一次消费者，等于向MQ注册，类似我订阅了这个主题
  - 然后再运行生产者发送消息
  - 之后无论消费者是否在线，都会收到消息。如果不在线的话，下次连接的时候，会把没有收过的消息都接收过来
- 持久化topic生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

// 持久化topic 的消息生产者
public class JmsProduce_persistence {

    public static final String ACTIVEMQ_URL = "tcp://192.168.17.3:61616";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws  Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        javax.jms.Connection connection = activeMQConnectionFactory.createConnection();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
        MessageProducer messageProducer = session.createProducer(topic);

        // 设置持久化topic 
        messageProducer.setDeliveryMode(DeliveryMode.PERSISTENT);
        // 设置持久化topic之后再，启动连接
        connection.start();
        for (int i = 1; i < 4 ; i++) {
            TextMessage textMessage = session.createTextMessage("topic_name--" + i);
            messageProducer.send(textMessage);
            MapMessage mapMessage = session.createMapMessage();
        }
        messageProducer.close();
        session.close();
        connection.close();
        System.out.println("  **** TOPIC_NAME消息发送到MQ完成 ****");
    }
}
```

- 持久化topic消费者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

// 持久化topic 的消息消费者
public class JmsConsummer_persistence {
    public static final String ACTIVEMQ_URL = "tcp://192.168.17.3:61616";
    public static final String TOPIC_NAME = "topic01";

    public static void main(String[] args) throws Exception{
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
// 设置客户端ID。向MQ服务器注册自己的名称
        connection.setClientID("marrry");
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Topic topic = session.createTopic(TOPIC_NAME);
// 创建一个topic订阅者对象。一参是topic，二参是订阅者名称
        TopicSubscriber topicSubscriber = session.createDurableSubscriber(topic,"remark...");
         // 之后再开启连接
        connection.start();
        Message message = topicSubscriber.receive();
         while (null != message){
             TextMessage textMessage = (TextMessage)message;
             System.out.println(" 收到的持久化 topic ："+textMessage.getText());
             message = topicSubscriber.receive();
         }
        session.close();
        connection.close();
    }
}

```



#### 消息事务性

-  生产者开启事务后，执行commit方法，这批消息才真正的被提交。不执行commit方法，这批消息不会提交。执行rollback方法，之前的消息会回滚掉。生产者的事务机制，要高于签收机制，当生产者开启事务，签收机制不再重要。
-  消费者开启事务后，执行commit方法，这批消息才算真正的被消费。不执行commit方法，这些消息不会标记已消费，下次还会被消费。执行rollback方法，是不能回滚之前执行过的业务逻辑，但是能够回滚之前的消息，回滚后的消息，下次还会被消费。消费者利用commit和rollback方法，甚至能够违反一个消费者只能消费一次消息的原理。
-  消费者和生产者的事务，完全没有关联，各自是各自的事务。
-  生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class Jms_TX_Producer {
    private static final String ACTIVEMQ_URL = "tcp://192.168.10.130:61616";
    private static final String ACTIVEMQ_QUEUE_NAME = "Queue-TX";

    public static void main(String[] args) throws JMSException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        //1.创建会话session，两个参数transacted=事务,acknowledgeMode=确认模式(签收)
        //设置为开启事务
        Session session = connection.createSession(true, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageProducer producer = session.createProducer(queue);
        try {
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("tx msg--" + i);
              producer.send(textMessage);
if(i == 2){
                    throw new RuntimeException("GG.....");
                }
            }
            // 2. 开启事务后，使用commit提交事务，这样这批消息才能真正的被提交。
            session.commit();
            System.out.println("消息发送完成");
        } catch (Exception e) {
            System.out.println("出现异常,消息回滚");
            // 3. 工作中一般，当代码出错，我们在catch代码块中回滚。这样这批发送的消息就能回滚。
            session.rollback();
        } finally {
            //4. 关闭资源
            producer.close();
            session.close();
            connection.close();
        }
    }
}
```

- 消费者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;
import java.io.IOException;

public class Jms_TX_Consumer {
    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    private static final String ACTIVEMQ_QUEUE_NAME = "Queue-TX";

    public static void main(String[] args) throws JMSException, IOException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        // 创建会话session，两个参数transacted=事务,acknowledgeMode=确认模式(签收)
        // 消费者开启了事务就必须手动提交，不然会重复消费消息
        final Session session = connection.createSession(true, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageConsumer messageConsumer = session.createConsumer(queue);
        messageConsumer.setMessageListener(new MessageListener() {
            int a = 0;
            @Override
            public void onMessage(Message message) {
                if (message instanceof TextMessage) {
                    try {
                        TextMessage textMessage = (TextMessage) message;
                        System.out.println("***消费者接收到的消息:   " + textMessage.getText());
                        if(a == 0){
                            System.out.println("commit");
                            session.commit();
                        }
                        if (a == 2) {
                            System.out.println("rollback");
                            session.rollback();
                        }
                        a++;
                    } catch (Exception e) {
                        System.out.println("出现异常，消费失败，放弃消费");
                        try {
                            session.rollback();
                        } catch (JMSException ex) {
                            ex.printStackTrace();
                        }
                    }
                }
            }
        });
        //关闭资源
        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}
/*
***消费者接收到的消息:   tx msg--0
commit
***消费者接收到的消息:   tx msg--1
***消费者接收到的消息:   tx msg--2
rollback
***消费者接收到的消息:   tx msg--1
***消费者接收到的消息:   tx msg--2

*/
```



#### 消息签收机制

- 自动签收（Session.AUTO_ACKNOWLEDGE）：该方式是默认的。该种方式，无需我们程序做任何操作，框架会帮我们自动签收收到的消息。
- 手动签收（Session.CLIENT_ACKNOWLEDGE）：手动签收。该种方式，需要我们手动调用Message.acknowledge()，来签收消息。如果不签收消息，该消息会被我们反复消费，只到被签收。
- 允许重复消息（Session.DUPS_OK_ACKNOWLEDGE）：多线程或多个消费者同时消费到一个消息，因为线程不安全，可能会重复消费。该种方式很少使用到。
- 事务下的签收（Session.SESSION_TRANSACTED）：开始事务的情况下，可以使用该方式。该种方式很少使用到。
- 在事务性会话中，当一个事务被成功提交则消息被自动签收。如果事务回滚，则消息会被再次传送。事务优先于签收，开始事务后，签收机制不再起任何作用。
- 非事务性会话中，消息何时被确认取决于创建会话时的应答模式。
- 生产者事务开启，只有commit后才能将全部消息变为已消费。
- 事务偏向生产者，签收偏向消费者。也就是说，生产者使用事务更好点，消费者使用签收机制更好点。



- 非事务下的生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class Jms_TX_Producer {

    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    private static final String ACTIVEMQ_QUEUE_NAME = "Queue-ACK";

    public static void main(String[] args) throws JMSException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageProducer producer = session.createProducer(queue);
        try {
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("tx msg--" + i);
                producer.send(textMessage);
            }
            System.out.println("消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            producer.close();
            session.close();
            connection.close();
        }
    }
}

```

- 非事务下的消费者

```java
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;
import java.io.IOException;

public class Jms_TX_Consumer {
    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";
    private static final String ACTIVEMQ_QUEUE_NAME = "Queue-ACK";

    public static void main(String[] args) throws JMSException, IOException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageConsumer messageConsumer = session.createConsumer(queue);
        messageConsumer.setMessageListener(new MessageListener() {
            @Override
            public void onMessage(Message message) {
                if (message instanceof TextMessage) {
                    try {
                        TextMessage textMessage = (TextMessage) message;
                        System.out.println("***消费者接收到的消息:   " + textMessage.getText());
                        /* 设置为Session.CLIENT_ACKNOWLEDGE后，要调用该方法，标志着该消息已被签收（消费）。
                            如果不调用该方法，该消息的标志还是未消费，下次启动消费者或其他消费者还会收到改消息。
                         */
                        textMessage.acknowledge();
                    } catch (Exception e) {
                        System.out.println("出现异常，消费失败，放弃消费");
                    }
                }
            }
        });
        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}
```



#### 点对点总结

- 点对点模型是基于队列的，生产者发消息到队列，消费者从队列接收消息，队列的存在使得消息的异步传输成为可能。和我们平时给朋友发送短信类似。
- 如果在Session关闭时有部分消息己被收到但还没有被签收(acknowledged),那当消费者下次连接到相同的队列时，这些消息还会被再次接收
- 队列可以长久地保存消息直到消费者收到消息。消费者不需要因为担心消息会丢失而时刻和队列保持激活的连接状态，充分体现了异步传输模式的优势

#### 发布订阅总结

- JMS Pub/Sub 模型定义了如何向一个内容节点发布和订阅消息，这些节点被称作topic。
- 主题可以被认为是消息的传输中介，发布者（publisher）发布消息到主题，订阅者（subscribe）从主题订阅消息。
- 主题使得消息订阅者和消息发布者保持互相独立不需要解除即可保证消息的传送
- 非持久订阅：
  - 非持久订阅只有当客户端处于激活状态，也就是和MQ保持连接状态才能收发到某个主题的消息。
  - 如果消费者处于离线状态，生产者发送的主题消息将会丢失作废，消费者永远不会收到。
  - 一句话：先订阅注册才能接受到发布，只给订阅者发布消息。
- 持久订阅：
  - 客户端首先向MQ注册一个自己的身份ID识别号，当这个客户端处于离线时，生产者会为这个ID保存所有发送到主题的消息，当客户再次连接到MQ的时候，会根据消费者的ID得到所有当自己处于离线时发送到主题的消息
  - 当持久订阅状态下，不能恢复或重新派送一个未签收的消息。
  - 持久订阅才能恢复或重新派送一个未签收的消息。
- 当所有的消息必须被接收，则用持久化订阅。当消息丢失能够被容忍，则用非持久订阅。



### ActiveMQ的broker

- broker是什么：相当于一个ActiveMQ服务器实例。说白了，Broker其实就是实现了用代码的形式启动ActiveMQ将MQ嵌入到Java代码中，以便随时用随时启动，在用的时候再去启动这样能节省了资源，也保证了可用性。这种方式，我们**实际开发中很少采用**，因为他缺少太多了东西，如：日志，数据存储等等。
- 启动broker时指定配置文件，可以帮助我们在一台服务器上启动多个broker。实际工作中一般一台服务器只启动一个broker。

```
# pwd
/myactivemq/apache-activemq-5.15.9/conf
# cp activemq.xml activemq02.xml

# pwd
/myactivemq/apache-activemq-5.15.9/bin
# ./activemq start xbean:file:/myactivemq/apache-activemq-5.15.9/conf/activemq02.xml
```

- 用ActiveMQ Broker作为独立的消息服务器来构建Java应用。ActiveMQ也支持在vm中通信基于嵌入的broker，能够无缝的集成其他java应用。
- pom

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.10.1</version>
</dependency>

```

- 启动类

```java
import org.apache.activemq.broker.BrokerService;

public class EmbedBroker {

    public static void main(String[] args) throws Exception {
        //ActiveMQ也支持在vm中通信基于嵌入的broker
        BrokerService brokerService = new BrokerService();
        brokerService.setPopulateJMSXUserID(true);
        brokerService.addConnector("tcp://127.0.0.1:61616");
        brokerService.start();
   }
}

```



### spring整合activeMQ

- 将上面的类注入到Spring中，其他不变。这样既能保持原生的代码，又能集成到spring。
- pom

```xml
<dependencies>
   <!-- activemq核心依赖包  -->
    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-all</artifactId>
        <version>5.10.0</version>
    </dependency>
    <!--  嵌入式activemq的broker所需要的依赖包   -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.10.1</version>
    </dependency>
    <!-- activemq连接池 -->
    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-pool</artifactId>
        <version>5.15.10</version>
    </dependency>
    <!-- spring支持jms的包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jms</artifactId>
        <version>5.2.1.RELEASE</version>
    </dependency>
    <!--spring相关依赖包-->
    <dependency>
        <groupId>org.apache.xbean</groupId>
        <artifactId>xbean-spring</artifactId>
        <version>4.15</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>5.2.1.RELEASE</version>
    </dependency>
    <!-- Spring核心依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
</dependencies>

```

- 配置文件spring-activemq.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!--  开启包的自动扫描  -->
    <context:component-scan base-package="com.activemq.demo"/>
    <!--  配置生产者  -->
    <bean id="connectionFactory" class="org.apache.activemq.pool.PooledConnectionFactory" destroy-method="stop">
        <property name="connectionFactory">
            <!--      正真可以生产Connection的ConnectionFactory,由对应的JMS服务商提供      -->
            <bean class="org.apache.activemq.spring.ActiveMQConnectionFactory">
                <property name="brokerURL" value="tcp://192.168.10.130:61616"/>
            </bean>
        </property>
        <property name="maxConnections" value="100"/>
    </bean>

    <!--  这个是队列目的地,点对点的Queue  -->
    <bean id="destinationQueue" class="org.apache.activemq.command.ActiveMQQueue">
        <!--    通过构造注入Queue名    -->
        <constructor-arg index="0" value="spring-active-queue"/>
    </bean>

    <!--  这个是队列目的地,  发布订阅的主题Topic-->
    <bean id="destinationTopic" class="org.apache.activemq.command.ActiveMQTopic">
        <constructor-arg index="0" value="spring-active-topic"/>
    </bean>

    <!--  Spring提供的JMS工具类,他可以进行消息发送,接收等  -->
    <bean id="jmsTemplate" class="org.springframework.jms.core.JmsTemplate">
        <!--    传入连接工厂    -->
        <property name="connectionFactory" ref="connectionFactory"/>
        <!--    传入目的地    -->
        <property name="defaultDestination" ref="destinationQueue"/>
        <!--    消息自动转换器    -->
        <property name="messageConverter">
            <bean class="org.springframework.jms.support.converter.SimpleMessageConverter"/>
        </property>
    </bean>
</beans>

```

- 队列生产者

```java
@Service
public class SpringProduce {

    @Autowired
    private JmsTemplate jmsTemplate;

    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("spring-activemq.xml");
        SpringProduce springMQ_producer = applicationContext.getBean(SpringProduce.class);
        springMQ_producer.jmsTemplate.send(
                new MessageCreator() {
                    public Message createMessage(Session session) throws JMSException {
                        return session.createTextMessage("***Spring和ActiveMQ的整合case111.....");
                    }
                }
        );
        System.out.println("********send task over");
    }
}

```

- 队列消费者

```java
@Service
public class SpringMQ_Consumer {
 
 
    private JmsTemplate jmsTemplate;
 
    @Autowired
    public void setJmsTemplate(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }
 
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("Application.xml");
        SpringMQ_Consumer springMQ_consumer = applicationContext.getBean(SpringMQ_Consumer.class);
        String returnValue = (String) springMQ_consumer.jmsTemplate.receiveAndConvert();
        System.out.println("****消费者收到的消息:   " + returnValue);
    }
}

```

- 主题生产者
- 生产者和消费者都可以通过jmsTemplate对象实时设置目的地等其他信息

```java
@Service
public class SpringMQ_Topic_Producer {
    private JmsTemplate jmsTemplate;
 
    public SpringMQ_Topic_Producer(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }
 
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("Application.xml");
        SpringMQ_Topic_Producer springMQ_topic_producer = applicationContext.getBean(SpringMQ_Topic_Producer.class);
        //直接调用application.xml里面创建的destinationTopic这个bean设置为目的地就行了
        springMQ_topic_producer.jmsTemplate.setDefaultDestination(((Destination) applicationContext.getBean("destinationTopic")));
        springMQ_topic_producer.jmsTemplate.send(session -> session.createTextMessage("***Spring和ActiveMQ的整合TopicCase111....."));
    }
}

```

- 主题消费者

```java
@Service
public class SpringMQ_Topic_Consumer {
    private JmsTemplate jmsTemplate;
 
    public SpringMQ_Topic_Consumer(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }
 
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("Application.xml");
        SpringMQ_Topic_Consumer springMQConsumer = applicationContext.getBean(SpringMQ_Topic_Consumer.class);
        //直接调用application.xml里面创建的destinationTopic这个bean设置为目的地就行了
        springMQConsumer.jmsTemplate.setDefaultDestination(((Destination) applicationContext.getBean("destinationTopic")));
        String returnValue = (String) springMQConsumer.jmsTemplate.receiveAndConvert();
        System.out.println("****消费者收到的消息:   " + returnValue);
    }
}

```



- 在Spring里面实现消费者不启动，直接通过配置监听完成。类似于前面setMessageListenner实时间提供消息
- spring配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!--  开启包的自动扫描  -->
    <context:component-scan base-package="com.demo.activemq"/>
    <!--  配置生产者  -->
    <bean id="connectionFactory" class="org.apache.activemq.pool.PooledConnectionFactory" destroy-method="stop">
        <property name="connectionFactory">
            <!--      正真可以生产Connection的ConnectionFactory,由对应的JMS服务商提供     -->
            <bean class="org.apache.activemq.spring.ActiveMQConnectionFactory">
                <property name="brokerURL" value="tcp://192.168.10.130:61616"/>
            </bean>
        </property>
        <property name="maxConnections" value="100"/>
    </bean>

    <!--  这个是队列目的地,点对点的Queue  -->
    <bean id="destinationQueue" class="org.apache.activemq.command.ActiveMQQueue">
        <!--    通过构造注入Queue名    -->
        <constructor-arg index="0" value="spring-active-queue"/>
    </bean>

    <!--  这个是队列目的地,  发布订阅的主题Topic-->
    <bean id="destinationTopic" class="org.apache.activemq.command.ActiveMQTopic">
        <constructor-arg index="0" value="spring-active-topic"/>
    </bean>

    <!--  Spring提供的JMS工具类,他可以进行消息发送,接收等  -->
    <bean id="jmsTemplate" class="org.springframework.jms.core.JmsTemplate">
        <!--    传入连接工厂    -->
        <property name="connectionFactory" ref="connectionFactory"/>
        <!--    传入目的地    -->
        <property name="defaultDestination" ref="destinationQueue"/>
        <!--    消息自动转换器    -->
        <property name="messageConverter">
            <bean class="org.springframework.jms.support.converter.SimpleMessageConverter"/>
        </property>
    </bean>

    <!--  配置Jms消息监听器  -->
    <bean id="defaultMessageListenerContainer" class="org.springframework.jms.listener.DefaultMessageListenerContainer">
        <!--  Jms连接的工厂     -->
        <property name="connectionFactory" ref="connectionFactory"/>
        <!--   设置默认的监听目的地     -->
        <property name="destination" ref="destinationTopic"/>
        <!--  指定自己实现了MessageListener的类     -->
        <property name="messageListener" ref="myMessageListener"/>
    </bean>
</beans>

```

- 消息监听类

```java
/**
 * 实现MessageListener的类,需要把这个类交给xml配置里面的DefaultMessageListenerContainer管理
 */
@Component
public class MyMessageListener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        if (message instanceof TextMessage) {
            TextMessage textMessage = (TextMessage) message;
            try {
                System.out.println("消费者收到的消息" + textMessage.getText());
            } catch (JMSException e) {
                e.printStackTrace();
            }
        }
    }
}

```

- 消费者配置了自动监听，就相当于在spring里面后台运行，有消息就运行我们实现监听类里面的方法



### springBoot整合activeMQ

- pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
   <modelVersion>4.0.0</modelVersion>
   <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.1.5.RELEASE</version>
      <relativePath/> <!-- lookup parent from repository -->
   </parent>
   <groupId>com.at.boot.activemq</groupId>
   <artifactId>boot_mq_produce</artifactId>
   <version>1.0-SNAPSHOT</version>


   <properties>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
      <maven.compiler.source>1.8</maven.compiler.source>
      <maven.compiler.target>1.8</maven.compiler.target>
   </properties>

   <dependencies>
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-test</artifactId>
         <scope>test</scope>
      </dependency>
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-web</artifactId>
      </dependency>

      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter</artifactId>
      </dependency>
      <!--spring boot整合activemq的jar包-->
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-activemq</artifactId>
         <version>2.1.5.RELEASE</version>
      </dependency>
   </dependencies>

   <build>
      <plugins>
         <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
         </plugin>
      </plugins>
   </build>
</project>

```

- yml

```yaml
# web占用的端口
server:
  port: 7777

spring:
  activemq:
    # activemq的broker的url
    broker-url: tcp://192.168.17.3:61616
    # 连接activemq的broker所需的账号和密码
    user: admin
    password: admin
  jms:
    # 目的地是queue还是topic， false（默认） = queue    true =  topic
    pub-sub-domain: false

#  自定义队列名称。这只是个常量
myqueue: boot-activemq-queue

```

- 配置目的地的bean和开启springboot的jms功能

```java
// 让spring管理的注解，相当于spring中在xml 中写了个bean
@Component
// 开启jms适配
@EnableJms
public class ConfigBean {

        // 注入配置文件中的 myqueue
        @Value("${myqueue}")
        private String myQueue ;

        @Bean   // bean id=""  class="…"
        public ActiveMQQueue queue(){
             return  new ActiveMQQueue(myQueue);
        }
}

```

- 队列生产者代码。发送消息

```java
@Component
public class Queue_Produce {

    // JMS模板
    @Autowired
    private JmsMessagingTemplate  jmsMessagingTemplate ;

    // 这个是我们配置的队列目的地
    @Autowired
    private Queue queue ;

    // 发送消息
    public void produceMessage(){
        // 一参是目的地，二参是消息的内容
        jmsMessagingTemplate.convertAndSend(queue,"****"+ UUID.randomUUID().toString().substring(0,6));
    }

    // 定时任务。每3秒执行一次。非必须代码，仅为演示。
    @Scheduled(fixedDelay = 3000)
    public void produceMessageScheduled(){
        produceMessage();
    }
}

```

- 主启动类

```java
@SpringBootApplication
// 是否开启定时任务调度功能
@EnableScheduling
public class MainApp_Produce {
    public static void main(String[] args) {
        SpringApplication.run(MainApp_Produce.class,args);
    }
}

```

- 测试

```java
// 加载主类
@SpringBootTest(classes = MainApp_Produce.class)
// 加载spring的junit
@RunWith(SpringJUnit4ClassRunner.class)
// 加载web
@WebAppConfiguration
public class TestActiveMQ {

    @Resource    //  这个是java 的注解，而Autowried 是 spring 的
    private Queue_Produce  queue_produce ;

//  这个是java 的注解，而Autowried 是 spring 的
    @Test
    public  void testSend() throws Exception{
        queue_produce.produceMessage();
    }
}

```

- 队列消费者，注册一个消息监听器。项目开启后监听某个主题的消息。

```java
@Component
public class Queue_consummer {

    // 注册一个监听器。destination指定监听的主题。
    @JmsListener(destination = "${myqueue}")
    public void receive(TextMessage textMessage) throws  Exception{
        System.out.println(" ***  消费者收到消息  ***"+textMessage.getText());
    }
}

```

- 主题生产者

```yaml
server:
  port: 6666
spring:
  activemq:
    broker-url: tcp://192.168.17.3:61616
    user: admin
    password: admin
  jms:
    # 目的地是queue还是topic， false（默认） = queue    true =  topic
    pub-sub-domain: true

 #  自定义主题名称
mytopic: boot-activemq-topic

```

- 配置目的地的bean和开启JMS功能

```java
@Component
@EnableJms
public class ConfigBean {

    @Value("${mytopic}")
    private String  topicName ;

    @Bean
    public Topic topic() {
        return new ActiveMQTopic(topicName);
    }
}

```

- 生产者

```java
@Component
public class Topic_Produce {

    @Autowired
    private JmsMessagingTemplate  jmsMessagingTemplate ;

    @Autowired
    private Topic  topic ;

    @Scheduled(fixedDelay = 3000)
    public void produceTopic(){
        jmsMessagingTemplate.convertAndSend(topic,"主题消息"+ UUID.randomUUID().toString().substring(0,6));
    }
}

```

- 主题消费者

```java
@Component
public class Topic_Consummer {

    @JmsListener(destination = "${mytopic}")
    public void receive(TextMessage textMessage) throws  Exception{
        System.out.println("消费者受到订阅的主题："+textMessage.getText());
    }
}

```



### activeMQ的传输协议

- ActiveMQ支持的client-broker通讯协议有：TVP、NIO、UDP、SSL、Http(s)、VM。其中配置Transport Connector的文件在ActiveMQ安装目录的conf/activemq.xml中的`<transportConnectors>`标签之内。

```xml
<transportConnectors>
	<transportConnector name="openwire" uri="tcp://0.0.0.0:61616?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
	<transportConnector name="amqp" uri="amqp://0.0.0.0:5672?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
	<transportConnector name="stomp" uri="stomp://0.0.0.0:61613?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
	<transportConnector name="mqtt" uri="mqtt://0.0.0.0:1884?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
	<transportConnector name="ws" uri="ws://0.0.0.0:61614?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
</transportConnectors>

```

- ActiveMQ中默认的消息协议就是openwire

| 协议      | 描述                                       |
| ------- | ---------------------------------------- |
| TCP     | 默认的协议，性能相对可以                             |
| NIO     | 基于TCP协议，进行了扩展优化，性能更好                     |
| UDP     | 性能比TCP好，但是不具有可靠性                         |
| SSL     | 安全链接                                     |
| HTTP(S) | 基于HTTP或HTTPS                             |
| VM      | 本身不是一种协议，当客户端和代理在同一个JVM中时，他们之间需要通信，但不想占用网络通道，而是直接通信，可以采用该方式。 |



#### TCP协议

- Transmission Control Protocol(TCP)是默认的。TCP的Client监听端口61616
- 在网络传输数据前，必须要先序列化数据，消息是通过一个叫wire protocol的来序列化成字节流
- TCP连接的URI后面的参数是可选的
- TCP传输的优点：
  - TCP协议传输可靠性高，稳定性强
  - 高效率：字节流方式传递，效率很高
  - 有效性、可用性：应用广泛，支持任何平台



#### AMQP协议

- Advanced Message Queuing Protocol，一个提供统一消息服务的应用层标准高级消息队列协议，是应用层协议的一个开放标准，为面向消息的中间件设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同开发语言等条件限制。



#### STOMP协议

- STOP，Streaming Text Orientation Message Protocol，是流文本定向消息协议，是一种为MOM(Message Oriented Middleware，面向消息中间件)设计的简单文本协议。



#### MQTT协议

- MQTT(Message Queuing Telemetry Transport，消息队列遥测传输)是IBM开发的一个即时通讯协议，有可能成为物联网的重要组成部分。该协议支持所有平台，几乎可以把所有联网物品和外部连接起来，被用来当作传感器和致动器(比如通过Twitter让房屋联网)的通信协议。



#### NIO协议

- NIO协议和TCP协议类似，但NIO更侧重于底层的访问操作。它允许开发人员对同一资源可有更多的client调用和服务器端有更多的负载。
- 适合使用NIO协议的场景：
  - 可能有大量的Client去连接到Broker上，一般情况下，大量的Client去连接Broker是被操作系统的线程所限制的。因此，NIO的实现比TCP需要更少的线程去运行，所以建议使用NIO协议。
  - 可能对于Broker有一个很迟钝的网络传输，NIO比TCP提供更好的性能。
- NIO连接的URI形式：nio://hostname:port?key=value&key=value



### 消息存储和持久化

- MQ高可用：事务、可持久、签收，是属于MQ自身特性，自带的。**这里的持久化是外力，是外部插件**。之前讲的持久化是MQ的外在表现，现在讲的的持久是是底层实现。
- 为了避免意外宕机以后丢失信息，需要做到重启后可以恢复消息队列，消息系统一半都会采用持久化机制。ActiveMQ的消息持久化机制有JDBC，AMQ，KahaDB和LevelDB，无论使用哪种持久化方式，消息的存储逻辑都是一致的。就是在发送者将消息发送出去后，消息中心首先将消息存储到本地数据文件、内存数据库或者远程数据库等。再试图将消息发给接收者，成功则将消息从存储中删除，失败则继续尝试尝试发送。消息中心启动以后，要先检查指定的存储位置是否有未成功发送的消息，如果有，则会先把存储位置中的消息发出去。



#### kahaDB消息存储

- 基于日志文件，从ActiveMQ5.4（含）开始默认的持久化插件。
- 日志文件的存储目录在：%activemq安装目录%/data/kahadb
- KahaDB是目前默认的存储方式，可用于任何场景，提高了性能和恢复能力。
- 消息存储使用一个事务日志和仅仅用一个索引文件来存储它所有的地址。
- KahaDB是一个专门针对消息持久化的解决方案，它对典型的消息使用模型进行了优化。
- 数据被追加到data logs中。当不再需要log文件中的数据的时候，log文件会被丢弃。
- KahaDB在消息保存的目录中有4类文件和一个lock
  - **db-number.log**：KahaDB存储消息到预定大小的数据纪录文件中，文件名为db-number.log。当数据文件已满时，一个新的文件会随之创建，number数值也会随之递增，当不再有引用到数据文件中的任何消息时，文件会被删除或者归档。
  - **db.data**：该文件包含了持久化的BTree索引，索引了消息数据记录中的消息，它是消息的索引文件，本质上是B-Tree（B树），使用B-Tree作为索引指向db-number。log里面存储消息。
  - **db.free**：当问当前db.data文件里面哪些页面是空闲的，文件具体内容是所有空闲页的ID
  - **db.redo**：用来进行消息恢复，如果KahaDB消息存储再强制退出后启动，用于恢复BTree索引。
  - **lock**：文件锁，表示当前kahadb独写权限的broker。



#### JDBC消息存储

- 添加mysql数据库的驱动包到activeMQ的lib文件夹
- 修改activemq.xml

```xml
<persistenceAdapter>  
      <jdbcPersistenceAdapter dataSource="#mysql-ds" createTableOnStartup="true"/> 
</persistenceAdapter>
<!--
dataSource是指定将要引用的持久化数据库的bean名称。
createTableOnStartup是否在启动的时候创建数据库表，默认是true，这样每次启动都会去创建表了，一般是第一次启动的时候设置为true，然后再去改成false。
-->
```

- 数据库连接池配置:之后需要建一个数据库，名为activemq。新建的数据库要采用latin1 或者ASCII编码。

```xml
    </broker>

    <bean id="mysql-ds" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://mysql数据库URL/activemq?relaxAutoCommit=true"/>
        <property name="username" value="mysql数据库用户名"/>
        <property name="password" value="mysql数据库密码"/>
        <property name="poolPreparedStatements" value="true"/>
    </bean>

    <import resource="jetty.xml"/>

```

- 重启activemq。会自动生成如下3张表。如果没有自动生成，需要我们手动执行SQL。ACTIVEMQ_ACKS，ACTIVEMQ_MSGS，ACTIVEMQ_LOCK
- queue模式，非持久化不会将消息持久化到数据库。
- queue模式，持久化会将消息持久化数据库。
- 我们使用queue模式持久化，发布3条消息后，发现ACTIVEMQ_MSGS数据表多了3条数据。
- 启动消费者，消费了所有的消息后，发现数据表的数据消失了。



- 我们先启动一下持久化topic的消费者。看到ACTIVEMQ_ACKS数据表多了一条消息。多了一个消费者的身份信息。一条记录代表：一个持久化topic消费者
- 持久化topic的消息不管是否被消费，是否有消费者，产生的数据永远都存在，且只存储一条。这个是要注意的，持久化的topic大量数据后可能导致性能下降。这里就像公众号一样，消费者消费完后，消息还会保留。



- 总结：
  - 如果是queue，在没有消费者消费的情况下会将消息保存到activemq_msgs表中，只要有任意一个消费者消费了，就会**删除消费过的消息**
  - 如果是topic，一般是先启动消费订阅者然后再生产的情况下**会将持久订阅者永久保存到qctivemq_acks**，而**消息则永久保存在activemq_msgs**，在acks表中的订阅者有一个last_ack_id对应了activemq_msgs中的id字段，这样就知道订阅者最后收到的消息是哪一条。
- 采坑
  - 数据库jar包，注意把对应版本的数据库jar或者你自己使用的非自带的数据库连接池jar包
  - createTablesOnStartup属性：默认为true，每次启动activemq都会自动创建表，在第一次启动后，应改为false，避免不必要的损失。
  - java.lang.IllegalStateException: LifecycleProcessor not initialized：确认计算机主机名名称没有下划线



#### JDBC Message store with ActiveMQ Journal

- 这种方式克服了JDBC Store的不足，JDBC每次消息过来，都需要去写库读库。ActiveMQ Journal，使用高速缓存写入技术，大大提高了性能。当消费者的速度能够及时跟上生产者消息的生产速度时，journal文件能够大大减少需要写入到DB中的消息。
- 举个例子：生产者生产了1000条消息，这1000条消息会保存到journal文件，如果消费者的消费速度很快的情况下，在journal文件还没有同步到DB之前，消费者已经消费了90%的以上消息，那么这个时候只需要同步剩余的10%的消息到DB。如果消费者的速度很慢，这个时候journal文件可以使消息以批量方式写到DB。
- 为了高性能，这种方式使用日志文件存储+数据库存储。**先将消息持久到日志文件，等待一段时间再将未消费的消息持久到数据库**。该方式要比JDBC性能要高。
- 配置

```xml
<persistenceFactory>        
              <journalPersistenceAdapterFactory 
                                   journalLogFiles="5" 
                                   journalLogFileSize="32768" 
                                   useJournal="true" 
                                   useQuickJournal="true" 
                                   dataSource="#mysql-ds" 
                                   dataDirectory="../activemq-data" /> 
</persistenceFactory>
```



#### 总结

- jdbc效率低，kahaDB效率高，jdbc+Journal效率较高。
- 持久化消息主要指的是：MQ所在服务器宕机了消息不会丢试的机制
- ActiveMQ消息持久化机制有：
  - AMQ：基于日志文件
  - KahaDB：基于日志文件，从ActiveMQ5.4开始默认使用
  - JDBC：基于第三方数据库
  - Replicated LevelDB Store ：从5.9开始提供了LevelDB和Zookeeper的数据复制方法，用于Master-slave方式的首选数据复制方案。



### 多节点集群

- 基于zookeeper和LevelDB搭建ActiveMQ集群。集群仅提供主备方式的高可用集群功能，避免单点故障。
- zookeeper+replicated-leveldb-store的主从集群



### 异步投递

- ActiveMQ支持同步，异步两种发送的模式将消息发送到broker，模式的选择对发送延时有巨大的影响。producer能达到怎么样的产出率（产出率=发送数据总量/时间）主要受发送延时的影响，使用异步发送可以显著提高发送的性能。
- ActiveMQ默认使用异步发送的模式：除非明确指定使用同步发送的方式或者在未使用事务的前提下发送持久化的消息，这两种情况都是同步发送的。
- 如果你没有使用事务且发送的是持久化的消息，每一次发送都是同步发送的且会阻塞
- producer知道broker返回一个确认，表示消息已经被安全的持久化到磁盘。确认机制提供了消息安全的保障，但同时会阻塞客户端带来了很大的延时。
- 很多高性能的应用，允许在失败的情况下有少量的数据丢失。如果你的应用满足这个特点，你可以使用异步发送来提高生产率，即使发送的是持久化的消息。
- 异步发送它可以最大化producer端的发送效率。我们通常在发送消息量比较密集的情况下使用异步发送，它可以很大的提升Producer性能；不过这也带来了额外的问题，
  就是需要消耗更多的Client端内存同时也会导致broker端性能消耗增加；
  此外它不能有效的确保消息的发送成功。在userAsyncSend=true的情况下客户端需要容忍消息丢失的可能。

```java
import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import javax.jms.*;

public class Jms_TX_Producer {

    // 方式1。3种方式任选一种
    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626?jms.useAsyncSend=true";
    private static final String ACTIVEMQ_QUEUE_NAME = "Async";

    public static void main(String[] args) throws JMSException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        // 方式2
        activeMQConnectionFactory.setUseAsyncSend(true);
        Connection connection = activeMQConnectionFactory.createConnection();
        // 方式3
        ((ActiveMQConnection)connection).setUseAsyncSend(true);
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageProducer producer = session.createProducer(queue);
        try {
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("tx msg--" + i);
                producer.send(textMessage);
            }
            System.out.println("消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            producer.close();
            session.close();
            connection.close();
        }
    }
}
```

- 异步发送如何确保消息发送成功？
  - 异步发送丢失消息的场景是：生产者设置userAsyncSend=true，使用producer.send(msg)持续发送消息。
  - 如果消息不阻塞，生产者会认为所有send的消息均被成功发送至MQ。
  - 如果MQ突然宕机，此时生产者端内存中尚未被发送至MQ的消息都会丢失。
  - 正确的异步发送方法是需要接收回调的。同步发送和异步发送的区别就在此，同步发送等send不阻塞了就表示一定发送成功了，异步发送需要客户端回执并由客户端再判断一次是否发送成功
- 异步发送回调

```java
public class Jms_TX_Producer {

    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";

    private static final String ACTIVEMQ_QUEUE_NAME = "Async";

    public static void main(String[] args) throws JMSException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        activeMQConnectionFactory.setUseAsyncSend(true);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        ActiveMQMessageProducer activeMQMessageProducer = (ActiveMQMessageProducer)session.createProducer(queue);
        try {
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("tx msg--" + i);
                textMessage.setJMSMessageID(UUID.randomUUID().toString()+"orderAtguigu");
                final String  msgId = textMessage.getJMSMessageID();
                activeMQMessageProducer.send(textMessage, new AsyncCallback() {
                    public void onSuccess() {
                        System.out.println("成功发送消息Id:"+msgId);
                    }

                    public void onException(JMSException e) {
                        System.out.println("失败发送消息Id:"+msgId);
                    }
                });
            }
            System.out.println("消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            activeMQMessageProducer.close();
            session.close();
            connection.close();
        }
    }
}

```



### 延迟投递和定时投递

- 要在activemq.xml中配置schedulerSupport属性为true。之后重启activemq

```xml
<broker xmlns="http://activemq.apache.org/schema/core" brokerName="localhost" dataDirectory="${activemq.data}"  schedulerSupport="true" >
```

- java代码里面封装的辅助消息类型：ScheduleMessage

```java
public class Jms_TX_Producer {

    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";

    private static final String ACTIVEMQ_QUEUE_NAME = "Schedule01";

    public static void main(String[] args) throws JMSException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageProducer messageProducer = session.createProducer(queue);
        long delay =  10*1000;
        long period = 5*1000;
        int repeat = 3 ;
        try {
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("tx msg--" + i);
                // 延迟的时间
                textMessage.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_DELAY, delay);
                // 重复投递的时间间隔
                textMessage.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_PERIOD, period);
                // 重复投递的次数
                textMessage.setIntProperty(ScheduledMessage.AMQ_SCHEDULED_REPEAT, repeat);
                // 此处的意思：该条消息，等待10秒，之后每5秒发送一次，重复发送3次。
                messageProducer.send(textMessage);
            }
            System.out.println("消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            messageProducer.close();
            session.close();
            connection.close();
        }
    }
}

```

- 消费

```java
public class Jms_TX_Consumer {

    private static final String ACTIVEMQ_URL = "tcp://118.24.20.3:61626";

    private static final String ACTIVEMQ_QUEUE_NAME = "Schedule01";

    public static void main(String[] args) throws JMSException, IOException {
        ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        Connection connection = activeMQConnectionFactory.createConnection();
        connection.start();
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue queue = session.createQueue(ACTIVEMQ_QUEUE_NAME);
        MessageConsumer messageConsumer = session.createConsumer(queue);
        messageConsumer.setMessageListener(new MessageListener() {

            public void onMessage(Message message) {
                if (message instanceof TextMessage) {
                    try {
                        TextMessage textMessage = (TextMessage) message;
                        System.out.println("***消费者接收到的消息:   " + textMessage.getText());
                        textMessage.acknowledge();
                    } catch (Exception e) {
                        System.out.println("出现异常，消费失败，放弃消费");
                    }
                }
            }
        });
        System.in.read();
        messageConsumer.close();
        session.close();
        connection.close();
    }
}

```



### 消息消费的重试机制

- 消费者收到消息，之后出现异常了，没有告诉broker确认收到该消息，broker会尝试再将该消息发送给消费者。尝试n次，如果消费者还是没有确认收到该消息，那么该消息将被放到死信队列重，之后broker不会再将该消息发送给消费者。
- 哪些情况会发送消息重发
  - Client用了transactions且再session中调用了rollback
  - Client用了transactions且再调用commit之前关闭或者没有commit
  - Client再CLIENT_ACKNOWLEDGE的传递模式下，session中调用了recover
- 请说说消息重发时间间隔和重发次数
  间隔：1
  次数：6
   每秒发6次
- 有毒消息Poison ACK
  一个消息被redelivedred超过默认的最大重发次数（默认6次）时，消费的回个MQ发一个“poison ack”表示这个消息有毒，告诉broker不要再发了。这个时候broker会把这个消息放到DLQ（私信队列）。



### 死信队列

- 死信队列：异常消息规避处理的集合，主要处理失败的消息。即一条消息在被重发了多次后（默认为重发6次，rediliveryCounter=6）将会被移入“死信队列”。
- 一般生产环境中会设计两个队列，一个核心业务队列，一个死信队列
- 不管是queue还是topic，失败的消息都放到这个队列中。下面修改activemq.xml的配置，可以达到修改队列的名字。
- 可以为queue和topic单独指定两个死信队列。还可以为某个话题，单独指定一个死信队列。



### 消息不被重复消费，幂等性

- 网络延迟传输中，会造成进行MQ重试，在重试过程中，可能会造成重复消费。
- 如果消息是做数据库的插入操作，给这个消息做一个唯一主键，那么就算出现重复消费，就会导致主键冲突，避免数据库出现脏数据。
- 还可以采用第三方服务来做消费记录，比如用redis给消息分配一个全局id，只要消费过该消息，将id和message以键值对的形式写入redis，那消费者在消费前，先去redis中查询有无消费记录即可。