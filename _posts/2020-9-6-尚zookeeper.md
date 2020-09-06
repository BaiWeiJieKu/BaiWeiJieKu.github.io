---
layout: post
title: "尚zookeeper"
categories: zookeeper
tags: zookeeper
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}
### 入门

#### 概述

- Zookeeper是一个开源的分布式的，为分布式应用提供协调服务的Apache项目。
- 工作机制：Zookeeper从设计模式角度来理解：是一个**基于观察者模式**设计的分布式服务管理框架，它**负责存储和管理大家都关心的数据**，然后接受观察者的注册，一旦这些数据的状态发生变化，Zookeeper就将**负责通知已经在Zookeeper上注册的那些观察者做出相应的反应**，从而实现集群中类似Master/Slave管理模式

![image.png](https://i.loli.net/2020/09/06/BVd15Tc6KIAi2rX.png)



#### 特点

![image.png](https://i.loli.net/2020/09/06/xEidmoUOjAcw8W3.png)



- 1）Zookeeper：一个领导者（leader），多个跟随者（follower）组成的集群。
- 2）Leader负责进行投票的发起和决议，更新系统状态
- 3）Follower用于接收客户请求并向客户端返回结果，在选举Leader过程中参与投票
- 4）集群中只要有**半数以上**节点存活，Zookeeper集群就能正常服务。
- 5）全局数据一致：每个server保存一份相同的数据副本，client无论连接到哪个server，数据都是一致的。
- 6）更新请求顺序进行，来自同一个client的更新请求按其发送顺序依次执行。
- 7）数据更新原子性，一次数据更新要么成功，要么失败。
- 8）实时性，在一定时间范围内，client能读到最新数据。




#### session原理

- 1 客户端与服务端之间的连接存在会话
- 2 每个会话都会设置一个超时时间
- 3 心跳结束，session过期
- 4 session过期，则临时节点znode会被抛弃
- 5 心跳机制：客户端向服务器的ping包请求


#### 数据结构

- ZooKeeper数据模型的结构与Unix文件系统很类似，整体上可以看作是一棵树，每个节点称做一个ZNode。每一个ZNode默认能够存储**1MB的数据**，每个ZNode都可以通过其路径唯一标识

- 每一个节点都称为znode，它可以有子节点，也可以有数据。

  每个节点分为临时节点和永久节点，临时节点在客户端断开后消失。

  每个zk节点都有各自的版本号，可以通过命令行来显示节点信息

  每当节点数据发生变化，那么该节点的版本号会累加（乐观锁）

  删除/修改过时节点，版本号不匹配则会报错

  每个zk节点存储的数据不宜过大，几K即可

  节点可以设置权限acl，可以通过权限来限制用户的访问

![image.png](https://i.loli.net/2020/09/06/sU4abRCkLQO2qNB.png)



#### 应用场景

- 提供的服务包括：统一命名服务、统一配置管理、统一集群管理、服务器节点动态上下线、软负载均衡等
- 统一命名服务：在分布式环境下，经常需要对应用/服务进行统一命名，便于识别不同服务。类似于域名与ip之间对应关系，ip不容易记住，而域名容易记住。通过名称来获取资源或服务的地址，提供者等信息

![image.png](https://i.loli.net/2020/09/06/rl9EQ6MUysop8qk.png)

- ​
- 统一配置管理：分布式环境下，配置文件管理和同步是一个常见问题。一个集群中，所有节点的配置信息是一致的，比如 Hadoop 集群。对配置文件修改后，希望能够快速同步到各个节点上。
- 配置管理可交由ZooKeeper实现。可将配置信息写入ZooKeeper上的一个Znode。各个节点监听这个Znode。一旦Znode中的数据被修改，ZooKeeper将通知各个节点。

![image.png](https://i.loli.net/2020/09/06/1ryT5amSMnP4eCj.png)



- 统一集群管理：分布式环境中，实时掌握每个节点的状态是必要的。可根据节点实时状态做出一些调整。可将节点信息写入ZooKeeper上的一个Znode。监听这个Znode可获取它的实时状态变化。例如HBase中Master状态监控与选举。



- 服务器动态上下线：客户端能实时洞察到服务器上下线的变化

![image.png](https://i.loli.net/2020/09/06/ZUCisQdKemSgJY8.png)



- 软负载均衡：

![image.png](https://i.loli.net/2020/09/06/3cnwkZ6NPK7iVOe.png)



#### 安装

- （1）安装Jdk

- （2）拷贝Zookeeper安装包到Linux系统下

- （3）解压到指定目录

  ` tar -zxvf zookeeper-3.4.10.tar.gz -C /opt/module/`

- （4）将/opt/module/zookeeper-3.4.10/conf这个路径下的zoo_sample.cfg修改为zoo.cfg；

  ` mv zoo_sample.cfg zoo.cfg`

- （5）打开zoo.cfg文件，修改dataDir路径`vim zoo.cfg`修改如下内容:

  `dataDir=[/opt/module/zookeeper-3.4.10/zkData]()`

- （6）在/opt/module/zookeeper-3.4.10/这个目录上创建zkData文件夹

  `mkdir zkData`

- （7）启动Zookeeper

  `bin/zkServer.sh start`

- （8）查看进程是否启动

```
[atguigu@hadoop102 zookeeper-3.4.10]$ jps
4020 Jps
4001 QuorumPeerMain
```

- （9）查看状态

```
[atguigu@hadoop102 zookeeper-3.4.10]$ bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/module/zookeeper-3.4.10/bin/../conf/zoo.cfg
Mode: standalone
```

- （10）启动客户端

```
[atguigu@hadoop102 zookeeper-3.4.10]$ bin/zkCli.sh
```

- （11）退出客户端

```
[zk: localhost:2181(CONNECTED) 0] quit
```

- （12）停止Zookeeper

```
[atguigu@hadoop102 zookeeper-3.4.10]$ bin/zkServer.sh stop
```



#### 主要目录

- bin：主要的一些运行命令
- conf：存放配置文件，其中我们需要修改zk.cfg
- contrib：附加的一些功能
- dist-maven：mvn编译后的文件
- docs：文档
- lib：依赖jar包
- recipes：案例demo
- src：源码

#### 参数解读

- **tickTime =2000**：通信心跳数，Zookeeper服务器与客户端心跳时间，单位毫秒。

  Zookeeper使用的基本时间，服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个tickTime时间就会发送一个心跳，时间单位为毫秒。它用于心跳机制，并且设置最小的session超时时间为两倍心跳时间。(session的最小超时时间是2*tickTime)

- **initLimit =10**：LF初始通信时限。

  集群中的Follower跟随者服务器与Leader领导者服务器之间初始连接时能容忍的最多心跳数（tickTime的数量），用它来限定集群中的Zookeeper服务器连接到Leader的时限。

- **syncLimit =5**：LF同步通信时限。

  集群中Leader与Follower之间的最大响应时间单位，假如响应超过syncLimit * tickTime，Leader认为Follwer死掉，从服务器列表中删除Follwer

- **dataDir**：数据文件目录+数据持久化路径

  主要用于保存Zookeeper中的数据。

- **clientPort =2181**：客户端连接端口

  监听客户端连接的端口



### 内部原理

#### 选举机制

- 1）**半数机制**：集群中半数以上机器存活，集群可用。所以Zookeeper适合安装奇数台服务器。
- 2）Zookeeper虽然在配置文件中并没有指定Master和Slave。但是，Zookeeper工作时，是有一个节点为Leader，其他则为Follower，Leader是通过内部的选举机制临时产生的。
- 假设有五台服务器组成的Zookeeper集群，它们的id从1-5，同时它们都是最新启动的，也就是没有历史数据，在存放数据量这一点上，都是一样的。假设这些服务器依序启动

![image.png](https://i.loli.net/2020/09/06/VKDWdvUiRCwJ3GO.png)



- 服务器1启动，此时只有它一台服务器启动了，它发出去的报文没有任何响应，所以它的选举状态一直是LOOKING状态
- 服务器2启动，它与最开始启动的服务器1进行通信，互相交换自己的选举结果，由于两者都没有历史数据，所以id值较大的服务器2胜出，但是由于没有达到超过半数以上的服务器都同意选举它(这个例子中的半数以上是3)，所以服务器1、2还是继续保持LOOKING状态。
- 服务器3启动，根据前面的理论分析，服务器3成为服务器1、2、3中的老大，而与上面不同的是，此时有三台服务器选举了它，所以它成为了这次选举的Leader。
- 服务器4启动，根据前面的分析，理论上服务器4应该是服务器1、2、3、4中最大的，但是由于前面已经有半数以上的服务器选举了服务器3，所以它只能接收当小弟的命了。服务器5启动，同4一样当小弟。



#### 节点类型

- Znode有两种类型：

  短暂（ephemeral）：客户端和服务器端断开连接后，创建的节点自动删除

  持久（persistent）：客户端和服务器端断开连接后，创建的节点不删除

- Znode有四种形式的目录节点（默认是persistent ）

  - （1）持久化目录节点（PERSISTENT）：客户端与zookeeper断开连接后，该节点依旧存在
  - （2）持久化顺序编号目录节点（PERSISTENT_SEQUENTIAL）：客户端与zookeeper断开连接后，该节点依旧存在，只是Zookeeper给该节点名称进行顺序编号
  - （3）临时目录节点（EPHEMERAL）：客户端与zookeeper断开连接后，该节点被删除
  - （4）临时顺序编号目录节点（EPHEMERAL_SEQUENTIAL）：客户端与zookeeper断开连接后，该节点被删除，只是Zookeeper给该节点名称进行顺序编号

- 说明：创建znode时设置顺序标识，znode名称后会附加一个值，顺序号是一个单调递增的计数器，由父节点维护

- 注意：在分布式系统中，顺序号可以被用于为所有的事件进行全局排序，这样客户端可以通过顺序号推断事件的顺序



#### stat结构体

- czxid-创建节点的事务zxid

  每次修改ZooKeeper状态都会收到一个zxid形式的时间戳，也就是ZooKeeper事务ID

  事务ID是ZooKeeper中所有修改总的次序。每个修改都有唯一的zxid，如果zxid1小于zxid2，那么zxid1在zxid2之前发生

- ctime - znode被创建的毫秒数(从1970年开始)

- mzxid - znode最后更新的事务zxid

- mtime - znode最后修改的毫秒数(从1970年开始)

- pZxid-znode最后更新的子节点zxid

- cversion - znode子节点变化号，znode子节点修改次数

- dataversion - znode数据变化号

- aclVersion - znode访问控制列表的变化号

- ephemeralOwner- 如果是临时节点，这个是znode拥有者的session id。如果不是临时节点则是0

- **dataLength- znode的数据长度**

- **numChildren - znode子节点数量**



#### 监听器原理

![image.png](https://i.loli.net/2020/09/06/tvEKoDa8SFP2JIM.png)



- 监听器原理详解
  - 1）首先要有一个main()线程
  - 2）在main线程中创建Zookeeper客户端，这时就会创建两个线程，一个负责网络连接通信（connet），一个负责监听（listener）
  - 3）通过connect线程将注册的监听事件发送给Zookeeper
  - 4）在Zookeeper的注册监听器列表中将注册的监听事件添加到列表中
  - 5）Zookeeper监听到有数据或路径变化，就会将这个消息发送给listener线程
  - 6）listener线程内部调用了process（）方法

- 常见监听：
  - （1）监听节点数据的变化：`get path [watch]`
  - （2）监听子节点增减的变化：`ls path [watch]`

- 针对每个节点的操作，都会有一个监督者---》watcher

  当监控的某个对象（znode）发生了变化，则触发watcher事件

  zk中的watcher是一次性的，触发后立即销毁

  父节点，子节点增删改查都能够触发watcher


![image.png](https://i.loli.net/2020/09/06/ApDnRjmy2hGv6QT.png)



![image.png](https://i.loli.net/2020/09/06/zs42reP57Vx6iXL.png)



![image.png](https://i.loli.net/2020/09/06/FWuz4MnDt3O2GJp.png)





#### 权限控制

- 开发/测试环境分离，开发者无权操作测试库的节点，只能看
  生产环境上控制指定ip的服务可以访问相关节点，防止混乱


- ACL（access control lists）权限控制

  针对节点可以设置相关读写等权限，目的是为了保障数据安全性

  权限permission可以指定不同的权限范围以及角色

- getAcl：获取某个节点的acl权限信息

- setAcl：设置某个节点的acl权限信息

- addauth：输入认证授权信息，注册时输入明文密码（登录），但是在zk系统里，密码是以加密的形式存在的

- zk的acl通过`[scheme:id:permissions]`来构成权限列表

  scheme：代表采用的某种权限机制

  id：代表允许访问的用户

  permissions：权限组合字符串

- acl构成之scheme：

  - world：world下只有一个id，即只有一个用户，也就是anyone，那么组合的写法就是`world:anyone:[permissions]`
  - auth：代表认证登录，需要注册用户有权限就可以，形式为：`auth:user:passowrd:[permissions]`
  - digest：需要对密码进行加密才能访问，组合形式为：`digest:username:BASE64(SH1(passowrd)):[permissions]`
  - 简而言之，auth与digest区别是，前者明文，后者密文
  - ip：当设置ip为指定的ip地址，此时限制ip访问，比如：`ip:192.168.1.1:[permissions]`
  - super：代表超级管理员，拥有所有权限

![image.png](https://i.loli.net/2020/09/06/WskOEqnBRVCe1Uj.png)



![image.png](https://i.loli.net/2020/09/06/reKaJcOWgB7INM5.png)





- acl构成之permissions
  - CREATE:创建子节点
  - READ：获取节点或子节点
  - WRITE：设置节点数据
  - DELETE：删除子节点
  - ADMIN：设置权限



#### 四字命令

- zk可以通过它自身提供的简写命令来和服务器进行交互
- 需要使用到nc命令，安装：yum install nc
- `echo [commond] | nc [ip] [port]`

![image.png](https://i.loli.net/2020/09/06/mg9pP2bvYKMSXq8.png)



![image.png](https://i.loli.net/2020/09/06/SyrXK3BM8AVEnj2.png)



![image.png](https://i.loli.net/2020/09/06/NHavDpnJzKPAZgO.png)



![image.png](https://i.loli.net/2020/09/06/8JyZ9Hzof71F3mr.png)




#### 写数据流程

![image.png](https://i.loli.net/2020/09/06/RMW9lF3dpm5PYBt.png)



### 实战demo

#### 分布式安装部署

- 集群规划：在hadoop102、hadoop103和hadoop104三个节点上部署Zookeeper
- 解压Zookeeper安装包到/opt/module/目录下

```
[atguigu@hadoop102 software]$ tar -zxvf zookeeper-3.4.10.tar.gz -C /opt/module/
```

- 同步/opt/module/zookeeper-3.4.10目录内容到hadoop103、hadoop104

```
[atguigu@hadoop102 module]$ xsync zookeeper-3.4.10/
```

- 在/opt/module/zookeeper-3.4.10/这个目录下创建zkData

```
[atguigu@hadoop102 zookeeper-3.4.10]$ mkdir -p zkData
```

- 在/opt/module/zookeeper-3.4.10/zkData目录下创建一个myid的文件

```
[atguigu@hadoop102 zkData]$ touch myid
```

- 编辑myid文件

```
[atguigu@hadoop102 zkData]$ vi myid

在文件中添加与server对应的编号：
2
```

- 拷贝配置好的zookeeper到其他机器上,并分别在hadoop102、hadoop103上修改myid文件中内容为3、4

```
[atguigu@hadoop102 zkData]$ xsync myid
```

- 重命名/opt/module/zookeeper-3.4.10/conf这个目录下的zoo_sample.cfg为zoo.cfg

```
[atguigu@hadoop102 conf]$ mv zoo_sample.cfg zoo.cfg
```

- 打开zoo.cfg文件,修改数据存储路径配置

```
[atguigu@hadoop102 conf]$ vim zoo.cfg
dataDir=/opt/module/zookeeper-3.4.10/zkData

增加如下配置
#######################cluster##########################
server.2=hadoop102:2888:3888
server.3=hadoop103:2888:3888
server.4=hadoop104:2888:3888

server.A=B:C:D
A是一个数字，表示这个是第几号服务器
集群模式下配置一个文件myid，这个文件在dataDir目录下，这个文件里面有一个数据就是A的值，Zookeeper启动时读取此文件，拿到里面的数据与zoo.cfg里面的配置信息比较从而判断到底是哪个server
B是这个服务器的ip地址
C是这个服务器与集群中的Leader服务器交换信息的端口
D是万一集群中的Leader服务器挂了，需要一个端口来重新进行选举，选出一个新的Leader，而这个端口就是用来执行选举时服务器相互通信的端口
```

- 同步zoo.cfg配置文件

```
[atguigu@hadoop102 conf]$ xsync zoo.cfg
```

- 分别启动Zookeeper

```
[atguigu@hadoop102 zookeeper-3.4.10]$ bin/zkServer.sh start
[atguigu@hadoop103 zookeeper-3.4.10]$ bin/zkServer.sh start
[atguigu@hadoop104 zookeeper-3.4.10]$ bin/zkServer.sh start

```

- 查看状态

```
[atguigu@hadoop102 zookeeper-3.4.10]# bin/zkServer.sh status
JMX enabled by default
Using config: /opt/module/zookeeper-3.4.10/bin/../conf/zoo.cfg
Mode: follower

[atguigu@hadoop103 zookeeper-3.4.10]# bin/zkServer.sh status
JMX enabled by default
Using config: /opt/module/zookeeper-3.4.10/bin/../conf/zoo.cfg
Mode: leader

[atguigu@hadoop104 zookeeper-3.4.5]# bin/zkServer.sh status
JMX enabled by default
Using config: /opt/module/zookeeper-3.4.10/bin/../conf/zoo.cfg
Mode: follower

```

- 重启与关闭

```
./zkServer.sh restart
./zkServer.sh stop
```



#### 客户端命令行操作

|      命令基本语法      |            功能描述            |
| :--------------: | :------------------------: |
|       help       |          显示所有操作命令          |
| ls path [watch]  | 使用 ls 命令来查看当前znode中所包含的内容  |
| ls2 path [watch] |    查看当前节点数据并能看到更新次数等数据     |
|      create      | 普通创建</br>-s 含有序列</br>-e 临时 |
| get path [watch] |           获得节点的值           |
|       set        |          设置节点的具体值          |
|       stat       |           查看节点状态           |
|      delete      |            删除节点            |
|       rmr        |           递归删除节点           |



- 启动客户端

```
[atguigu@hadoop103 zookeeper-3.4.10]$ bin/zkCli.sh
```

- 显示所有操作命令

```
[zk: localhost:2181(CONNECTED) 1] help
```

- 查看当前znode中所包含的内容

```
[zk: localhost:2181(CONNECTED) 0] ls /
[zookeeper]
```

- 查看当前节点详细数据

```
[zk: localhost:2181(CONNECTED) 1] ls2 /
[zookeeper]
cZxid = 0x0
ctime = Thu Jan 01 08:00:00 CST 1970
mZxid = 0x0
mtime = Thu Jan 01 08:00:00 CST 1970
pZxid = 0x0
cversion = -1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 1

```

- 分别创建2个普通节点

```
[zk: localhost:2181(CONNECTED) 3] create /sanguo "jinlian"
Created /sanguo
[zk: localhost:2181(CONNECTED) 4] create /sanguo/shuguo "liubei"
Created /sanguo/shuguo
```

- 获得节点的值

```
[zk: localhost:2181(CONNECTED) 5] get /sanguo
jinlian
cZxid = 0x100000003
ctime = Wed Aug 29 00:03:23 CST 2018
mZxid = 0x100000003
mtime = Wed Aug 29 00:03:23 CST 2018
pZxid = 0x100000004
cversion = 1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 7
numChildren = 1
[zk: localhost:2181(CONNECTED) 6]
[zk: localhost:2181(CONNECTED) 6] get /sanguo/shuguo
liubei
cZxid = 0x100000004
ctime = Wed Aug 29 00:04:35 CST 2018
mZxid = 0x100000004
mtime = Wed Aug 29 00:04:35 CST 2018
pZxid = 0x100000004
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 6
numChildren = 0

```

- 创建短暂节点

```
[zk: localhost:2181(CONNECTED) 7] create -e /sanguo/wuguo "zhouyu"
Created /sanguo/wuguo

```

- 在当前客户端是能查看到的

```
[zk: localhost:2181(CONNECTED) 3] ls /sanguo 
[wuguo, shuguo]
```

- 退出当前客户端然后再重启客户端

```
[zk: localhost:2181(CONNECTED) 12] quit
[atguigu@hadoop104 zookeeper-3.4.10]$ bin/zkCli.sh
```

- 再次查看根目录下短暂节点已经删除

```
[zk: localhost:2181(CONNECTED) 0] ls /sanguo
[shuguo]
```

- 先创建一个普通的根节点/sanguo/weiguo

```
[zk: localhost:2181(CONNECTED) 1] create /sanguo/weiguo "caocao"
Created /sanguo/weiguo
```

- 创建带序号的节点。如果原来没有序号节点，序号从0开始依次递增。如果原节点下已有2个节点，则再排序时从2开始，以此类推

```
[zk: localhost:2181(CONNECTED) 2] create -s /sanguo/weiguo/xiaoqiao "jinlian"
Created /sanguo/weiguo/xiaoqiao0000000000
[zk: localhost:2181(CONNECTED) 3] create -s /sanguo/weiguo/daqiao "jinlian"
Created /sanguo/weiguo/daqiao0000000001
[zk: localhost:2181(CONNECTED) 4] create -s /sanguo/weiguo/diaocan "jinlian"
Created /sanguo/weiguo/diaocan0000000002

```

- 修改节点数据值

```
[zk: localhost:2181(CONNECTED) 6] set /sanguo/weiguo "simayi"
```

- 在hadoop104主机上注册监听/sanguo节点数据变化

```
[zk: localhost:2181(CONNECTED) 26] [zk: localhost:2181(CONNECTED) 8] get /sanguo watch
```

- 在hadoop103主机上修改/sanguo节点的数据

```
[zk: localhost:2181(CONNECTED) 1] set /sanguo "xisi"
```

- 观察hadoop104主机收到数据变化的监听

```
WATCHER::
WatchedEvent state:SyncConnected type:NodeDataChanged path:/sanguo

```

- 在hadoop104主机上注册监听/sanguo节点的子节点变化

```
[zk: localhost:2181(CONNECTED) 1] ls /sanguo watch
[aa0000000001, server101]

```

- 在hadoop103主机/sanguo节点上创建子节点

```
[zk: localhost:2181(CONNECTED) 2] create /sanguo/jin "simayi"
Created /sanguo/jin
```

- 观察hadoop104主机收到子节点变化的监听

```
WATCHER::
WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/sanguo

```

- 删除节点

```
[zk: localhost:2181(CONNECTED) 4] delete /sanguo/jin
```

- 递归删除节点

```
[zk: localhost:2181(CONNECTED) 15] rmr /sanguo/shuguo
```

- 查看节点状态

```
[zk: localhost:2181(CONNECTED) 17] stat /sanguo
cZxid = 0x100000003
ctime = Wed Aug 29 00:03:23 CST 2018
mZxid = 0x100000011
mtime = Wed Aug 29 00:21:23 CST 2018
pZxid = 0x100000014
cversion = 9
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 4
numChildren = 1

```

- ​



#### API

##### 环境搭建

- pom

```xml
<dependencies>
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-core</artifactId>
			<version>2.8.2</version>
		</dependency>
		<!-- https://mvnrepository.com/artifact/org.apache.zookeeper/zookeeper -->
		<dependency>
			<groupId>org.apache.zookeeper</groupId>
			<artifactId>zookeeper</artifactId>
			<version>3.4.10</version>
		</dependency>
</dependencies>

```

- 需要在项目的src/main/resources目录下，新建一个文件，命名为“log4j.properties”，在文件中填入

```properties
log4j.rootLogger=INFO, stdout  
log4j.appender.stdout=org.apache.log4j.ConsoleAppender  
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout  
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n  
log4j.appender.logfile=org.apache.log4j.FileAppender  
log4j.appender.logfile.File=target/spring.log  
log4j.appender.logfile.layout=org.apache.log4j.PatternLayout  
log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n  

```



##### 创建客户端

```java
	private static String connectString ="hadoop102:2181,hadoop103:2181,hadoop104:2181";
	private static int sessionTimeout = 2000;
	private ZooKeeper zkClient = null;

	@Before
	public void init() throws Exception {

	zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {

			@Override
			public void process(WatchedEvent event) {

				// 收到事件通知后的回调函数（用户的业务逻辑）
				System.out.println(event.getType() + "--" + event.getPath());

				// 再次启动监听
				try {
					zkClient.getChildren("/", true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

```



##### 创建子节点

```java
// 创建子节点
@Test
public void create() throws Exception {

		// 参数1：要创建的节点的路径； 参数2：节点数据 ； 参数3：节点权限 ；参数4：节点的类型
		String nodeCreated = zkClient.create("/atguigu", "jinlian".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
}

```



##### 监听节点

```java
// 获取子节点
@Test
public void getChildren() throws Exception {

		List<String> children = zkClient.getChildren("/", true);

		for (String child : children) {
			System.out.println(child);
		}

		// 延时阻塞
		Thread.sleep(Long.MAX_VALUE);
}

```



##### 判断节点存在

```java
// 判断znode是否存在
@Test
public void exist() throws Exception {

	Stat stat = zkClient.exists("/eclipse", false);

	System.out.println(stat == null ? "not exist" : "exist");
}

```



##### 监听服务器上下线

- 某分布式系统中，主节点可以有多台，可以动态上下线，任意一台客户端都能实时感知到主节点服务器的上下线
- 先在集群上创建/servers节点

```
[zk: localhost:2181(CONNECTED) 10] create /servers "servers"
Created /servers
```

- 服务器端向Zookeeper注册代码

```java
import java.io.IOException;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.ZooDefs.Ids;

public class DistributeServer {

	private static String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
	private static int sessionTimeout = 2000;
	private ZooKeeper zk = null;
	private String parentNode = "/servers";
	
	// 创建到zk的客户端连接
	public void getConnect() throws IOException{
		
		zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {

			@Override
			public void process(WatchedEvent event) {

			}
		});
	}
	
	// 注册服务器
	public void registServer(String hostname) throws Exception{

		String create = zk.create(parentNode + "/server", hostname.getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
		
		System.out.println(hostname +" is online "+ create);
	}
	
	// 业务功能
	public void business(String hostname) throws Exception{
		System.out.println(hostname+" is working ...");
		
		Thread.sleep(Long.MAX_VALUE);
	}
	
	public static void main(String[] args) throws Exception {
		
// 1获取zk连接
		DistributeServer server = new DistributeServer();
		server.getConnect();
		
		// 2 利用zk连接注册服务器信息
		server.registServer(args[0]);
		
		// 3 启动业务功能
		server.business(args[0]);
	}
}

```

- 客户端代码

```java
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

public class DistributeClient {

	private static String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
	private static int sessionTimeout = 2000;
	private ZooKeeper zk = null;
	private String parentNode = "/servers";

	// 创建到zk的客户端连接
	public void getConnect() throws IOException {
		zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {

			@Override
			public void process(WatchedEvent event) {

				// 再次启动监听
				try {
					getServerList();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	// 获取服务器列表信息
	public void getServerList() throws Exception {
		
		// 1获取服务器子节点信息，并且对父节点进行监听
		List<String> children = zk.getChildren(parentNode, true);

        // 2存储服务器信息列表
		ArrayList<String> servers = new ArrayList<>();
		
        // 3遍历所有节点，获取节点中的主机名称信息
		for (String child : children) {
			byte[] data = zk.getData(parentNode + "/" + child, false, null);

			servers.add(new String(data));
		}

        // 4打印服务器列表信息
		System.out.println(servers);
	}

	// 业务功能
	public void business() throws Exception{

		System.out.println("client is working ...");
Thread.sleep(Long.MAX_VALUE);
	}

	public static void main(String[] args) throws Exception {

		// 1获取zk连接
		DistributeClient client = new DistributeClient();
		client.getConnect();

		// 2获取servers的子节点信息，从中获取服务器信息列表
		client.getServerList();

		// 3业务进程启动
		client.business();
	}
}

```

