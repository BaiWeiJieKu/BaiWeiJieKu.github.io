---
layout: post
title: "java面试web篇"
categories: 面试
tags: 面试
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### servlet

```
91.什么是 Servlet？

Servlet 是用来处理客户端请求并产生动态网页内容的 Java 类。Servlet 主要是用来处理或者是存储 HTML 表单提交的数据，产生动态内容，在无状态的 HTTP 协议下管理状态信息。
```

```
92.说一下 Servlet 的体系结构。

所有的 Servlet 都必须要实现的核心的接口是 javax.servlet.Servlet。每一个 Servlet 都必须要直接或者是间接实现这个接口， 或者是继承 javax.servlet.GenericServlet 或者javax.servlet.http.HTTPServlet。最后，Servlet 使用多线程可以并行的为多个请求服务。
```

```
93.Applet 和 Servlet 有什么区别？

Applet 是运行在客户端主机的浏览器上的客户端 Java 程序。而 Servlet 是运行在 web 服务器上的服务端的组件。applet 可以使用用户界面类，而 Servlet 没有用户界面，相反，Servlet是等待客户端的 HTTP 请求，然后为请求产生响应。
```

```
94.GenericServlet 和 HttpServlet 有什么区别？

GenericServlet 是一个通用的协议无关的 Servlet，它实现了 Servlet 和 ServletConfig 接口。继承自 GenericServlet 的 Servlet 应该要覆盖 service()方法。最后，为了开发一个能用在网页上服务于使用 HTTP 协议请求的 Servlet，你的 Servlet 必须要继承自 HttpServlet。这里有 Servlet的例子。
```

```
95.解释下 Servlet 的生命周期。

对每一个客户端的请求，Servlet 引擎载入 Servlet，调用它的 init()方法，完成 Servlet 的初始化。然后，Servlet 对象通过为每一个请求单独调用 service()方法来处理所有随后来自客户端的请求，最后，调用Servlet(译者注：这里应该是Servlet 而不是server)的destroy()方法把Servlet删除掉。
```

```
96.doGet()方法和 doPost()方法有什么区别？

doGet：GET 方法会把名值对追加在请求的 URL 后面。因为 URL 对字符数目有限制，进而限制了用在客户端请求的参数值的数目。并且请求中的参数值是可见的，因此，敏感信息不能用这种方式传递。 
doPOST：POST 方法通过把请求参数值放在请求体中来克服 GET 方法的限制，因此，可以发送的参数的数目是没有限制的。最后，通过 POST 请求传递的敏感信息对外部客户端是不可见的。
```

```
97.什么是 Web 应用程序？

Web 应用程序是对 Web 或者是应用服务器的动态扩展。有两种类型的 Web 应用：面向表现的和面向服务的。面向表现的 Web 应用程序会产生包含了很多种标记语言和动态内容的交互的web页面作为对请求的响应。而面向服务的Web应用实现了 Web服务的端点(endpoint)。一般来说，一个 Web 应用可以看成是一组安装在服务器 URL 名称空间的特定子集下面的Servlet 的集合。
```

```
98.什么是服务端包含(Server Side Include)？

服务端包含(SSI)是一种简单的解释型服务端脚本语言，大多数时候仅用在 Web 上，用 servlet标签嵌入进来。SSI 最常用的场景把一个或多个文件包含到 Web 服务器的一个 Web 页面中。当浏览器访问 Web 页面的时候，Web 服务器会用对应的 servlet 产生的文本来替换 Web 页面中的 servlet 标签。
```

```
99.什么是 Servlet 链(Servlet Chaining)？

Servlet 链是把一个 Servlet 的输出发送给另一个 Servlet 的方法。第二个 Servlet 的输出可以发送给第三个 Servlet，依次类推。链条上最后一个 Servlet 负责把响应发送给客户端。 
```

```
100.如何知道是哪一个客户端的机器正在请求你的 Servlet？

ServletRequest 类可以找出客户端机器的 IP 地址或者是主机名。getRemoteAddr()方法获取客户端主机的 IP 地址，getRemoteHost()可以获取主机名。
```

```
101.HTTP 响应的结构是怎么样的？

状态码(Status Code)：描述了响应的状态。可以用来检查是否成功的完成了请求。请求失败的情况下，状态码可用来找出失败的原因。如果 Servlet 没有返回状态码，默认会返回成功的状态码 HttpServletResponse.SC_OK。
HTTP 头部(HTTP Header)：它们包含了更多关于响应的信息。比如：头部可以指定认为响应过期的过期日期，或者是指定用来给用户安全的传输实体内容的编码格式。如何在 Serlet中检索 HTTP 的头部看这里。 
主体(Body)：它包含了响应的内容。它可以包含 HTML 代码，图片，等等。主体是由传输在HTTP 消息中紧跟在头部后面的数据字节组成的。
```

```
102.什么是 cookie？session 和 cookie 有什么区别？

cookie 是 Web 服务器发送给浏览器的一块信息。浏览器会在本地文件中给每一个 Web 服务器存储 cookie。以后浏览器在给特定的 Web 服务器发请求的时候，同时会发送所有为该服务器存储的 cookie。下面列出了 session 和 cookie 的区别： 
无论客户端浏览器做怎么样的设置，session 都应该能正常工作。客户端可以选择禁用 cookie，但是，session 仍然是能够工作的，因为客户端无法禁用服务端的 session。 
在存储的数据量方面 session 和 cookies 也是不一样的。session 能够存储任意的 Java 对象， cookie 只能存储 String 类型的对象。 
```

```
浏览器和 Servlet 通信使用的是什么协议？

浏览器和 Servlet 通信使用的是 HTTP 协议。
```

```
什么是 HTTP 隧道？

HTTP 隧道是一种利用 HTTP 或者是 HTTPS 把多种网络协议封装起来进行通信的技术。因此， HTTP 协议扮演了一个打通用于通信的网络协议的管道的包装器的角色。把其他协议的请求掩盖成 HTTP 的请求就是 HTTP 隧道。
```

```
105.sendRedirect()和 forward()方法有什么区别？

sendRedirect()方法会创建一个新的请求，而 forward()方法只是把请求转发到一个新的目标上。重定向(redirect)以后，之前请求作用域范围以内的对象就失效了，因为会产生一个新的请求，而转发(forwarding)以后，之前请求作用域范围以内的对象还是能访问的。一般认为sendRedirect()比 forward()要慢。
```

```
106.什么是 URL 编码和 URL 解码？

URL 编码是负责把 URL 里面的空格和其他的特殊字符替换成对应的十六进制表示，反之就是解码。
```



### JSP

```
107.什么是 JSP 页面？

JSP 页面是一种包含了静态数据和 JSP 元素两种类型的文本的文本文档。静态数据可以用任
何基于文本的格式来表示，比如：HTML 或者 XML。JSP 是一种混合了静态内容和动态产生
的内容的技术。
```

```
108.JSP 请求是如何被处理的？

浏览器首先要请求一个以.jsp 扩展名结尾的页面，发起 JSP 请求，然后，Web 服务器读取这个请求，使用 JSP 编译器把 JSP 页面转化成一个 Servlet 类。需要注意的是，只有当第一次请求页面或者是 JSP 文件发生改变的时候 JSP 文件才会被编译，然后服务器调用 servlet 类，处理浏览器的请求。一旦请求执行结束，servlet 会把响应发送给客户端。
```

```
109.JSP 有什么优点？

JSP 页面是被动态编译成 Servlet 的，因此，开发者可以很容易的更新展现代码。 
JSP 页面可以被预编译。 
JSP 页面可以很容易的和静态模板结合，包括：HTML 或者 XML，也可以很容易的和产生动态内容的代码结合起来。 
开发者可以提供让页面设计者以类 XML 格式来访问的自定义的 JSP 标签库。 
开发者可以在组件层做逻辑上的改变，而不需要编辑单独使用了应用层逻辑的页面。
```

```
110.什么是 JSP 指令(Directive)？JSP 中有哪些不同类型的指令？

Directive 是当 JSP 页面被编译成 Servlet 的时候，JSP 引擎要处理的指令。Directive 用来设置页面级别的指令，从外部文件插入数据，指定自定义的标签库。Directive是定义在<%@ 和 %>之间的。下面列出了不同类型的 Directive： 
包含指令(Include directive)：用来包含文件和合并文件内容到当前的页面。 
页面指令(Page directive)：用来定义 JSP 页面中特定的属性，比如错误页面和缓冲区。 Taglib 指令： 用来声明页面中使用的自定义的标签库。
```

```
111.什么是 JSP 动作(JSP action)？

JSP 动作以 XML 语法的结构来控制 Servlet 引擎的行为。当 JSP 页面被请求的时候，JSP 动作会被执行。它们可以被动态的插入到文件中，重用 JavaBean 组件，转发用户到其他的页面，或者是给 Java 插件产生 HTML 代码。下面列出了可用的动作： 
jsp:include-当 JSP 页面被请求的时候包含一个文件。 
jsp:useBean-找出或者是初始化 Javabean。 
jsp:setProperty-设置 JavaBean 的属性。 
jsp:getProperty-获取 JavaBean 的属性。 
jsp:forward-把请求转发到新的页面。 
jsp:plugin-产生特定浏览器的代码。
```

```
112.什么是 Scriptlets？

JSP 技术中，scriptlet 是嵌入在 JSP 页面中的一段 Java 代码。scriptlet 是位于标签内部的所有的东西，在标签与标签之间，用户可以添加任意有效的 scriplet。 
```

```
113.声明(Decalaration)在哪里？

声明跟 Java 中的变量声明很相似，它用来声明随后要被表达式或者 scriptlet 使用的变量。添加的声明必须要用开始和结束标签包起来。
```

```
114.什么是表达式(Expression)？

JSP 表达式是 Web 服务器把脚本语言表达式的值转化成一个 String 对象，插入到返回给客户端的数据流中。表达式是在<%=和%>这两个标签之间定义的。 
```

```
115.隐含对象是什么意思？有哪些隐含对象？

JSP 隐含对象是页面中的一些 Java 对象，JSP 容器让这些 Java 对象可以为开发者所使用。开发者不用明确的声明就可以直接使用他们。JSP 隐含对象也叫做预定义变量。下面列出了 JSP页面中的隐含对象： 
application 
page 
request 
response 
session 
exception 
out 
config 
pageContext
```

```
jsp 和Servlet 有什么区别？

jsp是html页面中内嵌的Java代码，侧重页面显示；
Servlet是html代码和Java代码分离，侧重逻辑控制，mvc设计思想中jsp位于视图层，servlet位于控制层
JVM只能识别Java类，并不能识别jsp代码！web容器收到以.jsp为扩展名的url请求时，会将访问请求交给tomcat中jsp引擎处理，每个jsp页面第一次被访问时，jsp引擎将jsp代码解释为一个servlet源程序，接着编译servlet源程序生成.class文件，再有web容器servlet引擎去装载执行servlet程序，实现页面交互
```



### Tomcat

```
Tomcat的缺省端口是多少，怎么修改？

tomcat默认的端口是8080，还会占用8005，8009和8443端口。在server.xml中修改
```

```
tomcat容器是如何创建servlet类实例？用到了什么原理？

当容器启动时，会读取在webapps目录下所有的web应用中的web.xml文件，然后对xml文件进行解析，
并读取servlet注册信息。然后，将每个应用中注册的servlet类都进行加载，并通过反射的方式实例化。
（有时候也是在第一次请求时实例化）在servlet注册时加上如果为正数，则在一开始就实例化，
如果不写或为负数，则第一次请求实例化。
```

```
怎样进行内存调优?

内存方式的设置是在catalina.sh，在catalina.bat中，调整一下JAVA_OPTS变量即可，因为后面的启动参数会把JAVA_OPTS作为JVM的启动参数来处理。
```

```
tomcat 有那几种Connector 运行模式？

bio(blocking I/O)是指阻塞式I/O操作，Tomcat在默认情况下就是以bio模式运行的。当客户端多时，会创建大量的处理线程。每个线程都要占用栈空间和一些CPU时间。阻塞可能带来频繁的上下文切换，而大部分的上下文切换是无意义的。就一般而言，bio模式是三种运行模式中性能最低的一种。

nio(non-blocking I/O)是非阻塞I/O操作。nio是一个基于缓冲区并能提供非阻塞I/O操作的Java API，它拥有比bio更好的并发运行性能。由一个专门的线程来处理所有的 I/O 事件、并负责分发。 事件驱动机制，而不再同步地去监视事件。 线程之间通过 wait,notify 等方式通讯。保证每次上下文切换都是有意义的，减少无谓的线程切换。NIO采用了双向通道(channel)进行数据传输，而不是单向的流(stream)。

apr(Apache portable Run-time libraries/Apache可移植运行库)是Apache HTTP服务器的支持库。在apr模式下，Tomcat将以JNI(Java Native Interface)的形式调用Apache HTTP服务器的核心动态链接库来处理文件读取或网络传输操作，从而大大提高Tomcat对静态文件的处理性能。Tomcat apr是在Tomcat上运行高并发应用的首选模式。
```

### JDBC

```
72.什么是 JDBC？

JDBC 是允许用户在不同数据库之间做选择的一个抽象层。JDBC 允许开发者用 JAVA 写数据库应用程序，而不需要关心底层特定数据库的细节。
```

```
73.解释下驱动(Driver)在 JDBC 中的角色。

JDBC 驱动提供了特定厂商对 JDBC API 接口类的实现，驱动必须要提供 java.sql 包下面这些类的实现：Connection, Statement, PreparedStatement,CallableStatement, ResultSet 和 Driver。
```

```
74.Class.forName()方法有什么作用？

这个方法用来载入跟数据库建立连接的驱动。 
```

```
75.PreparedStatement 比 Statement 有什么优势？

PreparedStatements 是预编译的，因此，性能会更好。
代码的可读性和可维护性。Statement需要不断地拼接，而PreparedStatement不会。
PreparedStatement尽最大可能提高性能。DB有缓存机制，相同的预编译语句再次被调用不会再次需要编译
最重要的一点是极大地提高了安全性。Statement容易被SQL注入，而PreparedStatement传入的内容不会和sql 语句发生任何匹配关系
```

```
76.什么时候使用 CallableStatement？用来准备 CallableStatement 的方法是什么？

CallableStatement 用来执行存储过程。存储过程是由数据库存储和提供的。存储过程可以接受输入参数，也可以有返回结果。非常鼓励使用存储过程，因为它提供了安全性和模块化。
准备一个 CallableStatement 的方法是： 
CallableStament.prepareCall();
```

```
77.数据库连接池是什么意思？

像打开关闭数据库连接这种和数据库的交互可能是很费时的，尤其是当客户端数量增加的时候，会消耗大量的资源，成本是非常高的。可以在应用服务器启动的时候建立很多个数据库连接并维护在一个池中。连接请求由池中的连接提供。在连接使用完毕以后，把连接归还到池中，以用于满足将来更多的请求。 
```

```
数据库连接池的工作机制是什么？

因为创建连接和关闭连接的行为是非常耗时的，会显著降低软件的性能表现。解决办法就是先创建N条数据库连接Connection，循环使用，但是不进行关闭，这样再执行sql语句，就不需要额外创建连接了，直接使用现成的连接就可以了，从而节约了创建连接和关闭连接的时间开销。
```

```
说下原生JDBC操作数据库流程？

第一步：Class.forName()加载数据库连接驱动
第二步：DriverManager.getConnection()获取数据连接对象
第三步：根据SQL获取sql会话对象，有2种方式 Statement、PreparedStatement 
第四步：执行SQL，执行SQL前如果有参数值就设置参数值setXXX()
第五步：处理结果集
第六步：关闭结果集、关闭会话、关闭连接
```

```
http的长连接和短连接区别？

HTTP协议有HTTP/1.0版本和HTTP/1.1版本。HTTP1.1默认保持长连接（HTTP persistent connection，也翻译为持久连接），数据传输完成了保持TCP连接不断开（不发RST包、不四次握手），等待在同域名下继续用这个通道传输数据；相反的就是短连接。
在 HTTP/1.0 中，默认使用的是短连接。也就是说，浏览器和服务器每进行一次HTTP操作，就建立一次连接，任务结束就中断连接。从HTTP/1.1起，默认使用的是长连接，用以保持连接特性。
```

```
http常见的状态码有哪些？

200 OK 客户端请求成功
301 Moved Permanently（永久移除)，请求的URL已移走
302 found 重定向
400 Bad Request 客户端请求有语法错误，不能被服务器所理解
401 Unauthorized 请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
403 Forbidden 服务器收到请求，但是拒绝提供服务
404 Not Found 请求资源不存在，eg：输入了错误的URL
500 Internal Server Error 服务器发生不可预期的错误
503 Server Unavailable 服务器当前不能处理客户端的请求，一段时间后可能恢复正常
```

```
session共享怎么做的（分布式如何实现session共享）？

问题描述：一个用户在登录成功以后会把用户信息存储在session当中，这时session所在服务器为server1，那么用户在session失效之前如果再次使用app，那么可能会被路由到 server2，这时问题来了，server2没有该用户的session，所以需要用户重新登录，这时的用户体验会非常不好，所以我们想如何实现多台server之间共享session，让用户状态得以保存。

可以利用gemfire实现session复制共享，还可以session维护在redis中实现session共享，同时可以将session维护在客户端的cookie中，但是前提是数据要加密。这三种方式可以迅速切换，而不影响应用正常执行。我们在实践中，首选gemfire或者redis作为session共享的载体，一旦session不稳定出现问题的时候，可以紧急切换cookie维护session作为备用，不影响应用提供服务。
```

```
在单点登录中，如果cookie被禁用了怎么办？

单点登录的原理是后端生成一个sessionID，然后设置到cookie，后面的所有请求浏览器都会带上cookie，然后服务端从cookie里获取sessionID，再查询到用户信息。所以，保持登录的关键不是cookie，而是通过cookie保存和传输的sessionID，其本质是能获取用户信息的数据。除了cookie，还通常使用HTTP请求头来传输。但是这个请求头浏览器不会像cookie一样自动携带，需要手工处理。
```

### Linux

```
说一下常用的Linux命令？

列出文件列表：ls【参数 -a -l】
创建目录和移除目录：mkdir rmdir
用于显示文件后几行内容：tail打包：tar -xvf
打包并压缩：tar -zcvf
查找字符串：grep
显示当前所在目录：pwd创建空文件：touch
编辑器：vim vi
```

```
Linux中如何查看日志？

动态打印日志信息：tail –f 日志文件
```

```
Linux怎么关闭进程？

通常用ps查看进程PID，用kill命令终止进程。ps命令用于查看当前正在运行的进程。grep是搜索；-aux显示所有状态；

例如：
ps –ef | grep java表示查看所有进程里CMD是java的进程信息。
ps –aux | grep java
kill命令用于终止进程。例如：kill -9 [PID]   -9表示强迫进程立即停止。
```

### mysql

```
SQL中聚合函数有哪些？

聚合函数是对一组值进行计算并返回单一的值的函数，它经常与select语句中的group by子句一同使用。
avg()：返回的是指定组中的平均值，空值被忽略。
count()：返回的是指定组中的项目个数。
max()：返回指定数据中的最大值。
min()：返回指定数据中的最小值。
sum()：返回指定数据的和，只能用于数字列，空值忽略。
```

```
SQL之连接查询（左连接和右连接的区别）？

左连接（左外连接）：以左表作为基准进行查询，左表数据会全部显示出来，右表如果和左表匹配的数据则显示相应字段的数据，如果不匹配则显示为null。
右连接（右外连接）：以右表作为基准进行查询，右表数据会全部显示出来，左表如果和右表匹配的数据则显示相应字段的数据，如果不匹配则显示为null。
全连接：先以左表进行左外连接，再以右表进行右外连接。
内连接：显示表之间有连接匹配的所有行。
```

```
SQL之sql注入是什么？

通过在Web表单中输入（恶意）SQL语句得到一个存在安全漏洞的网站上的数据库，而不是按照设计者意图去执行SQL语句。
举例：
当执行的sql为select * from user where username = “admin” or “a” = “a”时，sql语句恒成立，参数username毫无意义。
```

```
防止sql注入的方式?

预编译语句：如，select * from user where username = ？，sql语句语义不会发生改变，sql语句中变量用?表示，即使传递参数时为“admin or ‘a’ = ‘a’”，也会把这整体当做一个字符串去查询。
Mybatis框架中的mapper方式中的#也能很大程度的防止sql注入（$无法防止sql注入）
```

```
MySQL性能优化有哪些？

当只要一行数据时使用limit 1 :查询时如果已知会得到一条数据，这种情况下加上limit 1会增加性能。因为MySQL数据库引擎会在找到一条结果停止搜索，而不是继续查询下一条是否符合标准直到所有记录查询完毕。

选择正确的数据库引擎:MyISAM适用于一些大量查询的应用，但对于有大量写功能的应用不是很好。甚至你只需要update一个字段整个表都会被锁起来。而别的进程就算是读操作也不行要等到当前update操作完成之后才能继续进行。另外，MyISAM对于select count(*)这类操作是超级快的。InnoDB的趋势会是一个非常复杂的存储引擎，对于一些小的应用会比MyISAM还慢，但是支持“行锁”，所以在写操作比较多的时候会比较优秀。并且，它支持事务。

用not exists代替not in :not exists用到了连接能够发挥已经建立好的索引的作用，not in不能使用索引。not in是最慢的方式要同每条记录比较，在数据量比较大的操作红不建议使用这种方式。

对操作符的优化，尽量不采用不利于索引的操作符:如：in、not in、is null、is not null 、<> 等某个字段总要拿来搜索，为其建立索引：MySQL中可以利用alter table语句来为表中的字段添加索引，语法为：alter table表名add index(字段名)
```

```
MyISAM存储引擎了解吗？

MyISAM是MySQL官方提供默认的存储引擎，其特点是不支持事务、表锁和全文索引，对于一些OLAP（联机分析处理）系统，操作速度快。
每个MyISAM在磁盘上存储成三个文件。文件名都和表名相同，扩展名分别是.frm（存储表定义）、.MYD(MYData，存储数据)、.MYI(MYIndex，存储索引)。这里特别要注意的是MyISAM不缓存数据文件，只缓存索引文件。
```

```
InnoDB存储引擎了解吗？

InnoDB存储引擎支持事务，主要面向OLTP（联机事务处理过程）方面的应用，其特点是行锁设置、支持外键，并支持类似于Oracle的非锁定读，即默认情况下读不产生锁。InnoDB将数据放在一个逻辑表空间中（类似Oracle）。
InnoDB通过多版本并发控制来获得高并发性，实现了ANSI标准的4种隔离级别，默认为Repeatable，使用一种被称为next-keylocking的策略避免幻读。
对于表中数据的存储，InnoDB采用类似Oracle索引组织表Clustered的方式进行存储。InnoDB存储引擎提供了具有提交、回滚和崩溃恢复能力的事务安全。但是对比myisam的存储引擎，InnoDB写的处理效率差一些并且会占用更多的磁盘空间以保留数据和索引。
```

```
MySQL中四种隔离级别分别是什么？

读未提交（READ UNCOMMITTED）：未提交读隔离级别也叫读脏，就是事务可以读取其它事务未提交的数据。
读已提交（READ COMMITTED）：在其它数据库系统比如SQL Server默认的隔离级别就是提交读，已提交读隔离级别就是在事务未提交之前所做的修改其它事务是不可见的。
可重复读（REPEATABLE READ）：保证同一个事务中的多次相同的查询的结果是一致的，比如一个事务一开始查询了一条记录然后过了几秒钟又执行了相同的查询，保证两次查询的结果是相同的，可重复读也是MySQL的默认隔离级别。
可串行化（SERIALIZABLE）：可串行化就是保证读取的范围内没有新的数据插入，比如事务第一次查询得到某个范围的数据，第二次查询也同样得到了相同范围的数据，中间没有新的数据插入到该范围中。
```

### spring

```
谈谈你对Spring的理解?

Spring是一个开源框架，为简化企业级应用开发而生。Spring可以是使简单的JavaBean实现以前只有EJB才能实现的功能。Spring是一个IOC和AOP容器框架
```

```
Spring容器的主要核心是什么？

控制反转（IOC），传统的java开发模式中，当需要一个对象时，我们会自己使用new或者getInstance等直接或者间接调用构造方法创建一个对象。而在spring开发模式中，spring容器使用了工厂模式为我们创建了所需要的对象，不需要我们自己创建了，直接调用spring提供的对象就可以了，这是控制反转的思想。

依赖注入（DI），spring使用JavaBean对象的set方法或者带参数的构造方法为我们在创建所需对象时将其属性自动设置所需要的值的过程，就是依赖注入的思想。

面向切面编程（AOP），在面向对象编程（oop）思想中，我们将事物纵向抽成一个个的对象。而在面向切面编程中，我们将一个个的对象某些类似的方面横向抽成一个切面，对这个切面进行一些如权限控制、事物管理，记录日志等公用操作处理的过程就是面向切面编程的思想。
```

```
Spring中的设计模式有哪些？

单例模式——spring中两种代理方式，若目标对象实现了若干接口，spring使用jdk的java.lang.reflect.Proxy类代理。若目标对象没有实现任何接口，spring使用CGLIB库生成目标类的子类。单例模式——在spring的配置文件中设置bean默认为单例模式。

模板方式模式——用来解决代码重复的问题。比如：RestTemplate、JmsTemplate、JpaTemplate

前端控制器模式——spring提供了前端控制器DispatherServlet来对请求进行分发。

试图帮助（viewhelper）——spring提供了一系列的JSP标签，高效宏来帮助将分散的代码整合在试图中。

依赖注入——贯穿于BeanFactory/ApplacationContext接口的核心理念。

工厂模式——在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用同一个接口来指向新创建的对象。Spring中使用beanFactory来创建对象的实例。
```

```
Spring的常用注解有哪些？

注解注入将会被容器在XML注入之前被处理，所以后者会覆盖掉前者对于同一个属性的处理结果。
注解装配在spring中默认是关闭的。所以需要在spring的核心配置文件中配置一下才能使用基于注解的装配模式。配置方式如下：<context:annotation-config/>
@Required：该注解应用于设值方法。
@Autowired：该注解应用于有值设值方法、非设值方法、构造方法和变量。
@Qualifier：该注解和@Autowired搭配使用，用于消除特定bean自动装配的歧义。
```

```
介绍一下spring bean的生命周期?

bean定义---bean初始化---bean调用---bean销毁

1:Bean 容器找到配置文件中 Spring Bean 的定义。
2:Bean 容器利用 Java Reflection API 创建一个Bean的实例。
3:如果涉及到一些属性值 利用 set()方法设置一些属性值。
4:如果 Bean 实现了 BeanNameAware 接口，调用 setBeanName()方法，传入Bean的名字。
5:如果 Bean 实现了 BeanClassLoaderAware 接口，调用 setBeanClassLoader()方法，传入 ClassLoader对象的实例。
6:如果Bean实现了 BeanFactoryAware 接口，调用 setBeanClassLoader()方法，传入 ClassLoade r对象的实例。
7:如果实现了其他 *.Aware接口，就调用相应的方法。
8:如果有和加载这个 Bean 的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessBeforeInitialization() 方法
9:如果Bean实现了InitializingBean接口，执行afterPropertiesSet()方法。
10:如果 Bean 在配置文件中的定义包含 init-method 属性，执行指定的方法。
11:如果有和加载这个 Bean的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessAfterInitialization() 方法
12:当要销毁 Bean 的时候，如果 Bean 实现了 DisposableBean 接口，执行 destroy() 方法。
13:当要销毁 Bean 的时候，如果 Bean 在配置文件中的定义包含 destroy-method 属性，执行指定的方法。

总结：
实例化bean对象---设置对象属性---检查Aware相关接口并设置相关依赖---BeanPostProcessor前置处理---
检查是否是InitializingBean以决定是否调用afterPropertiesSet方法---检查是否配置有自定义的init-method
---BeanPostProcessor后置处理---注册必要的Destruction相关回调接口---使用中---是否实现DisposableBean接口---是否配置有自定义的destroy方法
```

```
分析一下Spring结构图？

Core模块：封装了框架依赖的最底层部分，包括资源访问、类型转换及一些常用工具类。

Beans模块：提供了框架的基础部分，包括反转控制和依赖注入。其中BeanFactory是容器核心，本质是“工厂设计模式”的实现，而且无需编程实现“单例设计模式”，单例完全由容器控制，而且提倡面向接口编程；所有应用程序对象及对象间关系由框架管理，从而真正把你从程序逻辑中把维护对象之间的依赖关系提取出来，这些依赖关系都由BeanFactory来维护。

Context模块：以Core和Beans为基础，集成Beans模块功能并添加资源绑定、数据验证、国际化、JavaEE支持、容器生命周期、事件传播等；核心接口是ApplicationContext。

EL模块：提供强大的表达式语言支持，支持访问和修改属性值，方法调用，支持从Spring容器获取Bean

AOP模块：SpringAOP模块提供了面向方面的编程实现，提供比如日志记录、权限控制、性能统计等通用功能和业务逻辑分离的技术，并且能动态的把这些功能添加到需要的代码中；这样各专其职，降低业务逻辑和通用功能的耦合。

Aspects模块：提供了对AspectJ的集成，AspectJ提供了比SpringASP更强大的功能。数据访问/集成模块：该模块包括了JDBC、ORM、OXM、JMS和事务管理。

事务模块：该模块用于Spring管理事务，只要是Spring管理对象都能得到Spring管理事务的好处，无需在代码中进行事务控制了，而且支持编程和声明性的事务管理。

JDBC模块：提供了一个JBDC的样例模板，使用这些模板能消除传统冗长的JDBC编码还有必须的事务控制，而且能享受到Spring管理事务的好处。

ORM模块：提供与流行的“对象-关系”映射框架的无缝集成，包括Hibernate、JPA、MyBatis等。而且可以使用Spring事务管理，无需额外控制事务。

OXM模块：提供了一个对Object/XML映射实现，将java对象映射成XML数据，或者将XML数据映射成java对象，Object/XML映射实现包括JAXB、Castor、XMLBeans和XStream。

JMS模块：用于JMS(JavaMessagingService)，提供一套“消息生产者、消息消费者”模板用于更加简单的使用JMS，JMS用于用于在两个应用程序之间，或分布式系统中发送消息，进行异步通信。

Web模块：提供了基础的web功能。例如多文件上传、集成IoC容器、远程过程访问（RMI、Hessian、Burlap）以及WebService支持，并提供一个RestTemplate类来提供方便的Restfulservices访问。

Web-Servlet模块：提供了一个SpringMVCWeb框架实现。SpringMVC框架提供了基于注解的请求资源注入、更简单的数据绑定、数据验证等及一套非常易用的JSP标签，完全无缝与Spring其他技术协作。

Web-Struts模块：提供了与Struts无缝集成，Struts1.x和Struts2.x都支持

Test模块：Spring支持Junit和TestNG测试框架，而且还额外提供了一些基于Spring的测试功能，比如在测试Web框架时，模拟Http请求的功能。
```

```
Spring能帮我们做什么？

Spring能帮我们根据配置文件创建及组装对象之间的依赖关系。

Spring面向切面编程能帮助我们无耦合的实现日志记录，性能统计，安全控制。

Spring能非常简单的帮我们管理数据库事务。采用Spring，我们只需获取连接，执行SQL，其他事务相关的都交给Spring来管理了

Spring还能与第三方数据库访问框架（如Hibernate、JPA）无缝集成，而且自己也提供了一套JDBC访问模板，来方便数据库访问。

Spring还能与第三方Web（如Struts、JSF）框架无缝集成，而且自己也提供了一套SpringMVC框架，来方便web层搭建。

Spring能方便的与JavaEE（如JavaMail、任务调度）整合，与更多技术整合（比如缓存框架）。
```

```
@RestController和@Controller的区别?

Controller 返回一个页面，单独使用 @Controller 不加 @ResponseBody的话一般使用在要返回一个视图的情况，这种情况属于比较传统的Spring MVC 的应用，对应于前后端不分离的情况。

@RestController返回JSON或XML形式数据，但@RestController只返回对象，对象数据直接以 JSON 或 XML 形式写入 HTTP 响应(Response)中，这种情况属于 RESTful Web服务，这也是目前日常开发所接触的最常用的情况（前后端分离）。

@Controller +@ResponseBody 返回JSON 或 XML 形式数据
@ResponseBody 注解的作用是将 Controller 的方法返回的对象通过适当的转换器转换为指定的格式之后，写入到HTTP 响应(Response)对象的 body 中，通常用来返回 JSON 或者 XML 数据
```

```
@Component 和 @Bean 的区别是什么？

作用对象不同: @Component 注解作用于类，而@Bean注解作用于方法
@Component通常是通过类路径扫描来自动侦测以及自动装配到Spring容器中（我们可以使用 @ComponentScan 注解定义要扫描的路径从中找出标识了需要装配的类自动装配到 Spring 的 bean 容器中）。
@Bean 注解通常是我们在标有该注解的方法中定义产生这个 bean,@Bean告诉了Spring这是某个类的示例，当我需要用它的时候还给我。
@Bean 注解比 Component 注解的自定义性更强，而且很多地方我们只能通过 @Bean 注解来注册bean。比如当我们引用第三方库中的类需要装配到 Spring容器时，则只能通过 @Bean来实现。
```

```
将一个类声明为Spring的 bean 的注解有哪些?

@Component ：通用的注解，可标注任意类为 Spring 组件。如果一个Bean不知道属于哪个层，可以使用@Component 注解标注。
@Repository : 对应持久层即 Dao 层，主要用于数据库相关操作。
@Service : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao层。
@Controller : 对应 Spring MVC 控制层，主要用户接受用户请求并调用 Service 层返回数据给前端页面。
```



```
谈谈自己对于 Spring IoC 的理解?初始化过程是怎样的？

IoC（Inverse of Control:控制反转）是一种设计思想，就是 将原本在程序中手动创建对象的控制权，交由Spring框架来管理。
IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。
IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。

xml--（读取）-->Resource--（解析）-->BeanDefinition--（注册）-->BeanFactory
```

[IOC源码分析](https://javadoop.com/post/spring-ioc)

```
谈谈自己对于 AOP 的理解?

AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP就是基于动态代理的，如果要代理的对象，实现了某个接口，那么Spring AOP会使用JDK Proxy，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候Spring AOP会使用Cglib ，这时候Spring AOP会使用 Cglib 生成一个被代理对象的子类来作为代理
```

```
Spring AOP 和 AspectJ AOP 有什么区别？

Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。
Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)
Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了
AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单
```

```
Spring 中的 bean 的作用域有哪些?

singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
prototype : 每次请求都会创建一个新的 bean 实例。
request : 每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP request内有效。
session : 每一次HTTP请求都会产生一个新的 bean，该bean仅在当前 HTTP session 内有效。
```

```
Spring 中的单例 bean 的线程安全问题了解吗？

单例 bean 存在线程问题，主要是因为当多个线程操作同一个对象的时候，对这个对象的非静态成员变量的写操作会存在线程安全问题。
常见的有两种解决办法：
1.在Bean对象中尽量避免定义可变的成员变量（不太现实）。
2.在类中定义一个ThreadLocal成员变量，将需要的可变成员变量保存在 ThreadLocal 中（推荐的一种方式）。
```

