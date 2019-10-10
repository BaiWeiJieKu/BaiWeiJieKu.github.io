---
layout: post
title: "java复习Tomcat"
categories: Tomcat
tags: Tomcat
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
## Tomcat

### 简介

- Tomcat是常见的免费的web服务器. 
- Tomcat 这个名字的来历，Tomcat是一种野外的猫科动物，不依赖人类，独立生活。

### 启动

- 运行批处理文件： D:/tomcat/bin/startup.bat
- 最后如果你看到Server startup in xxx ms，就表明启动成功了。
- 注 Tomcat启动之后，不要关闭。。。。 关闭了就不能访问了

### 部署网页

- 部署一个功能完备的web应用 有很多种方式，但是如果只是部署一个test.html，很简单
- 把test.html 复制到 D:\tomcat\webapps\ROOT 目录下
- 就可以通过 http://127.0.0.1:8080/test.html 访问了



## 改端口

- tomcat默认的端口号是8080，可以通过配置把端口号修改成80
- tomcat的端口配置相关信息在 server.xml中
- server.xml 记录了非常多的tomcat配置信息，其中就包括端口
- `<Connector port="8080" protocol="HTTP/1.1"             connectionTimeout="20000" redirectPort="8543" />`
- 这就表明使用的是8080端口，把它修改为80，保存。
- 接着，必须重启tomcat
- 80端口就是web服务默认的端口号，所以就不需要显式写这个端口号了。



### 端口被占用

- 时候80端口被占用了，无法使用该端口。
- 使用命令`netstat -ano|findstr "80"`
- 查看 端口号包含"80"的占用情况
- 查询结果找到 80，8009，8005 （这三个都包含80）。 
- 对应的pid(process id) 进程id 是1828

![](http://stepimagewm.how2j.cn/1563.png)

- 使用命令: `tasklist|findstr "1828"`
- 1828根据上一步找到的对应的pid
- 发现是一个java.exe程序占用了80端口

![](http://stepimagewm.how2j.cn/1564.png)

- 最后使用`taskkill /f /t /im java.exe`结束java.exe

## 常见问题

### 一闪而过

- 现象：点击startup.bat之后，屏幕一闪而过
- 检验：如图所示, 首先通过cmd命令进入控制台，然后切换到对应的目录执行startup命令，得到JRE_HOME environment .... 这么个提示，就表示JAVA_HOME环境变量没有设置。
- 分析：Tomcat本身是JAVA程序，必须要有JDK才可以执行，所以必须配置JAVA_HOME。
- 检验：如图所示, 首先通过cmd命令进入控制台，然后切换到对应的目录执行startup命令，得到CATALINA_HOME environment .... 这么个提示，就表示CATALINA_HOME环境变量设置错误。
- 分析：Tomcat执行必须依赖CATALINA_HOME或者CATALINA_BASE这两个环境变量。 如果没有在环境变量里配置过，那么会自动采用bin目录的父目录作为CATALINA_HOME和CATALINA_BASE。 如果配置了，而所配置的地方又不是正确的TOMCAT目录，那么就会出现这个错误。
- 解决：
  1. 在环境变量中删除CATALINA_HOME,CATALINA_BASE的配置，记得不仅要检查环境变量，还要检查用户变量。
  2. 或者把CATALINA_HOME设置为正确的TOMCAT目录。



### 404错误

- 现象：Tomcat可以成功启动，但是就是不能访问自己配置的web应用，老是提示404错误
- 检验：如图所示, 在环境变量里，CATALINA_HOME设置在了另一个合法的tomcat目录上，所以无论运行哪个startup.bat，都会导致这个d:/tomcatxxxx目录下的程序被启动，而不是你期望的那个。
- 分析：默认的Tomcat会优先根据环境变量中的CATALINA_HOME来定位目录，并运行。
- 解决：
  1. 在环境变量中删除CATALINA_HOME,CATALINA_BASE的配置，记得不仅要检查环境变量，还要检查用户变量。
  2. 或者使用本站的[纯净版 Tomcat](http://how2j.cn/k/tomcat/tomcat-download/1130.html)，已经取消了对环境变量CATALINA_HOME和CATALINA_BASE的依赖。

![](http://stepimagewm.how2j.cn/4482.png)



### 端口冲突

- 现象：屏幕一闪而过，或者不会关闭，但是提示大量错误，其中会看到如图所示的`Address already in use: JVM_Bind <null>:80`即表示端口被占用了。
- 检验：如果是这个错误，在TOMCAT目录下的logs目录里，会有一个日志文件`：catalina.yyyy-mm-dd.log`（当天时间），在这个日志文件里会记载一样的错误`:Address already in use: JVM_Bind <null>:80。`即表明80端口被占用了。
- 分析：端口是独占式的，一旦一个程序占用了这个端口，其他程序就不能够再去占用它了。而80端口，有可能是被已经存在的Tomcat占用了，也有可能是被其他不知名的软件占用了，比如Apache,IIS,Oracle等等。

### 项目名称

- 这个也是常犯的错误，加入部署的时候，指定了路径，比如：
- `<Context path="/j2ee" docBase="e:\\project\\j2ee\\web" debug="0" reloadable="false" />`
- 那么访问的时候，要记得加上j2ee，像这样：
  http://127.0.0.1:8080/j2ee/hello

### WEB-INF

- 从安全角度出发，TOMCAT不允许访问WEB-INF目录下的HTML,JSP文件。 所以如果你的资源文件放在WEB-INF下，也会提示404错误



## 持久异常

- Tomcat启动的时候会报一个Exception loading sessions from persistent storage异常，但是又不影响正常的业务。
- 该问题的原因是tomcat的session持久化机制引起的，tomcat这个功能本身的用意在于重启tomcat后保存之前的session，Tomcat会把session持久化在`%TOMCAT%/work/Catalina/localhost/session.ser` 这个文件里。 但是因为tomcat非正常关闭，所以这个文件没有正确地结束(无EOF标记)
- 解决办法治标： 只需要删除 session.ser文件即可。
- 解决办法治本：关闭tomcat的持久化功能，就能一劳永逸的解决这个问题。具体为修改conf下的server.xml文件。在项目的context间加入一句代码
- `<Manager className="org.apache.catalina.session.PersistentManager" saveOnRestart="false"/>`
- 重启tomcat以后再也不会报这个错误了。

```xml
	<Context path="/" docBase="D:\\project\\j2ee\\web" debug="0" reloadable="false" >
	    <Manager className="org.apache.catalina.session.PersistentManager" saveOnRestart="false"/>
	</Context>

```



## 部署应用

- 用eclipse或者idea把web项目打包为war格式
- 把war文件放入webapp文件夹下，启动Tomcat
- 去浏览器尝试访问项目



## 目录结构

- **bin目录**：这个目录只要是存放了一些bat文件或者sh文件。比如说我们需要启动tomcat的bat就在这个目录下
- **conf**：这个目录中存放的都是一些配置文件 xml
- **lib**：这个目录中存放的是一些jar文件。tomcat自身的jar，实现javaEE平台下部分标准的实现类(比如：jsp servlet...)
- **log**：存放的都是tomcat的日志文件。如果我们想了解黑窗口在启动时的打印信息，可以进到这个目录下找到cataline.log文件在这个文件中可以看到相关记录。
- **temp**：在这个目录中存放的是tomcat在运行时所产生的一些临时文件。这些文件是否存在并不影响tomcat的运行，所以这个目录下的内容可以被删除掉。但是：temp文件夹不能删。
- **webapps**：这个目录主要是存放需要让tomcat去管理的资源的目录。
- **work**：这个目录主要存放的是tomcat对jsp编译完后得原文件以及class文件。
- **doc**：存放Tomcat文档;



## 配置文件

- **Server.xml配置文件简介**

### server

- 1、port 指定一个端口，这个端口负责监听关闭tomcat的请求
- 2、shutdown 指定向端口发送的命令字符串

### service

- 1、name 指定service的名字

### Connector

- **表示客户端和service之间的连接**
- 1、port 指定服务器端要创建的端口号，并在这个断口监听来自客户端的请求
- 2、minProcessors 服务器启动时创建的处理请求的线程数
- 3、maxProcessors 最大可以创建的处理请求的线程数
- 4、enableLookups 如果为true，则可以通过调用request.getRemoteHost()进行DNS查询来得到远程客户端的实际主机名，若为false则不进行DNS查询，而是返回其ip地址
- 5、redirectPort 指定服务器正在处理http请求时收到了一个SSL传输请求后重定向的端口号
- 6、acceptCount 指定当所有可以使用的处理请求的线程数都被使用时，可以放到处理队列中的请求数，超过这个数的请求将不予处理
- 7、connectionTimeout 指定超时的时间数(以毫秒为单位)

### Engine

- **表示指定service中的请求处理机，接收和处理来自Connector的请求**
- 1、defaultHost 指定缺省的处理请求的主机名，它至少与其中的一个host元素的name属性值是一样的

### Context 

- **表示一个web应用程序**
- 1、docBase 应用程序的路径或者是WAR文件存放的路径
- 2、path 表示此web应用程序的url的前缀，这样请求的url为`http://localhost:8080/path/****`
- 3、reloadable 这个属性非常重要，如果为true，则tomcat会自动检测应用程序的/WEB-INF/lib 和/WEB-INF/classes目录的变化，自动装载新的应用程序，我们可以在不重起tomcat的情况下改变应用程序

### host 

- **表示一个虚拟主机**
- 1、name 指定主机名
- 2、appBase 应用程序基本目录，即存放应用程序的目录
- 3、unpackWARs 如果为true，则tomcat会自动将WAR文件解压，否则不解压，直接从WAR文件中运行应用程序

### Logger 

- **表示日志，调试和错误信息**
- 1、className 指定logger使用的类名，此类必须实现org.apache.catalina.Logger 接口
- 2、prefix 指定log文件的前缀
- 3、suffix 指定log文件的后缀
- 4、timestamp 如果为true，则log文件名中要加入时间，如下例:localhost_log.2001-10-04.txt

### Realm 

- **表示存放用户名，密码及role的数据库**
- 1、className 指定Realm使用的类名，此类必须实现org.apache.catalina.Realm接口

### Valve 

- **功能与Logger差不多，其prefix和suffix属性解释和Logger 中的一样**
- 1、className 指定Valve使用的类名，如用org.apache.catalina.valves.AccessLogValve类可以记录应用程序的访问信息

### directory

- **指定log文件存放的位置**
- 1、pattern 有两个值，common方式记录远程主机名或ip地址，用户名，日期，第一行请求的字符串，HTTP响应代码，发送的字节数。combined方式比common方式记录的值更多



## 架构

### 顶层架构

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t1.png)

- Tomcat中最顶层的容器是Server，代表着整个服务器，从上图中可以看出，一个Server可以包含至少一个Service，用于具体提供服务。

- Service主要包含两个部分：Connector和Container。从上图中可以看出 Tomcat 的心脏就是这两个组件，他们的作用如下：

  1、Connector用于处理连接相关的事情，并提供Socket与Request和Response相关的转化; 

  2、Container用于封装和管理Servlet，以及具体处理Request请求；

- 一个Tomcat中只有一个Server，一个Server可以包含多个Service，一个Service只有一个Container，但是可以有多个Connectors，这是因为一个服务可以有多个连接，如同时提供Http和Https链接，也可以提供向相同协议不同端口的连接,示意图如下（Engine、Host、Context下边会说到）：

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t2.png)

- 多个 Connector 和一个 Container 就形成了一个 Service，有了 Service 就可以对外提供服务了，但是 Service 还要一个生存的环境，必须要有人能够给她生命、掌握其生死大权，那就非 Server 莫属了！所以整个 Tomcat 的生命周期由 Server 控制。
- 另外，上述的包含关系或者说是父子关系，都可以在tomcat的conf目录下的`server.xml`配置文件中看出，下图是删除了注释内容之后的一个完整的`server.xml`配置文件（Tomcat版本为8.0）

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t3.png)

- 详细的配置文件文件内容可以到Tomcat官网查看：http://tomcat.apache.org/tomcat-8.0-doc/index.html
- 上边的配置文件，还可以通过下边的一张结构图更清楚的理解：

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t4.png)

- Server标签设置的端口号为8005，shutdown=”SHUTDOWN” ，表示在8005端口监听“SHUTDOWN”命令，如果接收到了就会关闭Tomcat。一个Server有一个Service，当然还可以进行配置，一个Service有多个，Service左边的内容都属于Container的，Service下边是Connector。

### 小结

- Tomcat中只有一个Server，一个Server可以有多个Service，一个Service可以有多个Connector和一个Container； 
- Server掌管着整个Tomcat的生死大权；
- Service 是对外提供服务的； 
- Connector用于接受请求并将请求封装成Request和Response来具体处理； 
- Container用于封装和管理Servlet，以及具体处理request请求；
- 知道了整个Tomcat顶层的分层架构和各个组件之间的关系以及作用，对于绝大多数的开发人员来说Server和Service对我们来说确实很远，而我们开发中绝大部分进行配置的内容是属于Connector和Container的，所以接下来介绍一下Connector和Container。

### 微妙关系

- 由上述内容我们大致可以知道一个请求发送到Tomcat之后，首先经过Service然后会交给我们的Connector，Connector用于接收请求并将接收的请求封装为Request和Response来具体处理，Request和Response封装完之后再交由Container进行处理，Container处理完请求之后再返回给Connector，最后在由Connector通过Socket将处理的结果返回给客户端，这样整个请求的就处理完了！
- Connector最底层使用的是Socket来进行连接的，Request和Response是按照HTTP协议来封装的，所以Connector同时需要实现TCP/IP协议和HTTP协议！
- Tomcat既然处理请求，那么肯定需要先接收到这个请求，接收请求这个东西我们首先就需要看一下Connector！

### Connector

- Connector用于接受请求并将请求封装成Request和Response，然后交给Container进行处理，
- Container处理完之后在交给Connector返回给客户端
- 因此，我们可以把Connector分为四个方面进行理解：
- Connector如何接受请求的？ 
- 如何将请求封装成Request和Response的？ 
- 封装完之后的Request和Response如何交给Container进行处理的？ 
- Container处理完之后如何交给Connector并返回给客户端的？

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t5.png)

- Connector就是使用ProtocolHandler来处理请求的，不同的ProtocolHandler代表不同的连接类型，比如：Http11Protocol使用的是普通Socket来连接的，Http11NioProtocol使用的是NioSocket来连接的。
- 其中ProtocolHandler由包含了三个部件：Endpoint、Processor、Adapter。
- （1）Endpoint用来处理底层Socket的网络连接，Processor用于将Endpoint接收到的Socket封装成Request，Adapter用于将Request交给Container进行具体的处理。
- （2）Endpoint由于是处理底层的Socket网络连接，因此Endpoint是用来实现TCP/IP协议的，而Processor用来实现HTTP协议的，Adapter将请求适配到Servlet容器进行具体的处理。
- （3）Endpoint的抽象实现AbstractEndpoint里面定义的Acceptor和AsyncTimeout两个内部类和一个Handler接口。Acceptor用于监听请求，AsyncTimeout用于检查异步Request的超时，Handler用于处理接收到的Socket，在内部调用Processor进行处理。

### Container

- Container用于封装和管理Servlet，以及具体处理Request请求，在Connector内部包含了4个子容器

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t6.png)

- （1）Engine：引擎，用来管理多个站点，一个Service最多只能有一个Engine；
- （2）Host：代表一个站点，也可以叫虚拟主机，通过配置Host就可以添加站点；
- （3）Context：代表一个应用程序，对应着平时开发的一套程序，或者一个WEB-INF目录以及下面的web.xml文件；
- （4）Wrapper：每一Wrapper封装着一个Servlet；

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t7.png)

- Context和Host的区别是Context表示一个应用，我们的Tomcat中默认的配置下webapps下的每一个文件夹目录都是一个Context，其中ROOT目录中存放着主应用，其他目录存放着子应用，而整个webapps就是一个Host站点。
- 我们访问应用Context的时候，如果是ROOT下的则直接使用域名就可以访问，例如：www.ledouit.com,如果是Host（webapps）下的其他应用，则可以使用www.ledouit.com/docs进行访问，当然默认指定的根应用（ROOT）是可以进行设定的，只不过Host站点下默认的主营用是ROOT目录下的。
- 看到这里我们知道Container是什么，但是还是不知道Container是如何进行处理的以及处理完之后是如何将处理完的结果返回给Connector的？别急！下边就开始探讨一下Container是如何进行处理的！

### 处理请求

- Container处理请求是使用Pipeline-Valve管道来处理的！（Valve是阀门之意）
- Pipeline-Valve是责任链模式，责任链模式是指在一个请求处理的过程中有很多处理者依次对请求进行处理，每个处理者负责做自己相应的处理，处理完之后将处理后的请求返回，再让下一个处理着继续处理。

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t8.png)

- 但是！Pipeline-Valve使用的责任链模式和普通的责任链模式有些不同！区别主要有以下两点：

- （1）每个Pipeline都有特定的Valve，而且是在管道的最后一个执行，这个Valve叫做BaseValve，BaseValve是不可删除的；

- （2）在上层容器的管道的BaseValve中会调用下层容器的管道

- 我们知道Container包含四个子容器，而这四个子容器对应的BaseValve分别在：StandardEngineValve、StandardHostValve、StandardContextValve、StandardWrapperValve。

  Pipeline的处理流程图如下（图D）：

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/t9.png)

- （1）Connector在接收到请求后会首先调用最顶层容器的Pipeline来处理，这里的最顶层容器的Pipeline就是EnginePipeline（Engine的管道）；
- （2）在Engine的管道中依次会执行EngineValve1、EngineValve2等等，最后会执行StandardEngineValve，在StandardEngineValve中会调用Host管道，然后再依次执行Host的HostValve1、HostValve2等，最后在执行StandardHostValve，然后再依次调用Context的管道和Wrapper的管道，最后执行到StandardWrapperValve。
- （3）当执行到StandardWrapperValve的时候，会在StandardWrapperValve中创建FilterChain，并调用其doFilter方法来处理请求，这个FilterChain包含着我们配置的与请求相匹配的Filter和Servlet，其doFilter方法会依次调用所有的Filter的doFilter方法和Servlet的service方法，这样请求就得到了处理！
- （4）当所有的Pipeline-Valve都执行完之后，并且处理完了具体的请求，这个时候就可以将返回的结果交给Connector了，Connector在通过Socket的方式将结果返回给客户端。

### 总结

- 至此，我们已经对Tomcat的整体架构有了大致的了解，从图A、B、C、D可以看出来每一个组件的基本要素和作用。

本文章参考自：http://how2j.cn

还参考自：https://blog.csdn.net/xlgen157387/article/details/79006434