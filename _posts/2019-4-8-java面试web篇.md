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

Web容器加载Servlet并将其实例化后，Servlet生命周期开始，容器运行其init()方法进行Servlet的初始化；
请求到达时调用Servlet的service()方法，service()方法会根据需要调用与请求对应的doGet或doPost等方法；
当服务器关闭或项目被卸载时服务器会将Servlet实例销毁，此时会调用Servlet的destroy()方法。
init方法和destroy方法只会执行一次，service方法客户端每次请求Servlet都会执行。
Servlet中有时会用到一些需要初始化与销毁的资源，因此可以把初始化资源的代码放入init方法中，销毁资源的代码放入destroy方法中
```

```
96.doGet()方法和 doPost()方法有什么区别？

①get请求用来从服务器上获得资源，而post是用来向服务器提交数据；

②get将表单中数据按照name=value的形式，添加到action 所指向的URL 后面，并且两者使用"?"连接，而各个变量之间使用"&"连接；post是将表单中的数据放在HTTP协议的请求头或消息体中，传递到action所指向URL；

③get传输的数据要受到URL长度限制（最大长度是 2048 个字符）；而post可以传输大量的数据，上传文件通常要使用post方式；

④使用get时参数会显示在地址栏上，如果这些数据不是敏感数据，那么可以使用get；对于敏感数据还是应用使用post；
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

Cookie 和 Session都是用来跟踪浏览器用户身份的会话方式
Cookie 一般用来保存用户信息 比如①我们在 Cookie 中保存已经登录过得用户信息，下次访问网站的时候页面可以自动帮你登录的一些基本信息给填了；②一般的网站都会有保持登录也就是说下次你再访问网站的时候就不需要重新登录了，这是因为用户登录的时候我们可以存放了一个 Token 在 Cookie 中，下次登录的时候只需要根据 Token 值来查找用户即可(为了安全考虑，重新登录一般要将 Token 重写)；③登录一次网站后访问网站其他页面不需要重新登录。

Session 的主要作用就是通过服务端记录用户的状态。 典型的场景是购物车，当你要添加商品到购物车的时候，系统不知道是哪个用户操作的，因为 HTTP 协议是无状态的。服务端给特定的用户创建特定的 Session 之后就可以标识这个用户并且跟踪这个用户了。

Cookie 数据保存在客户端(浏览器端)，如果使用 Cookie 的一些敏感信息不要写入 Cookie 中，最好能将 Cookie 信息加密然后使用到的时候再去服务器端解密。只能存放字符串
Session 数据保存在服务器端。安全性更高，可以存放对象
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

转发是服务器行为，重定向是客户端行为。
转发（Forward） 通过RequestDispatcher对象的forward方法实现的。
request.getRequestDispatcher("login_success.jsp").forward(request, response);
forward是服务器请求资源,服务器直接访问目标地址的URL,把那个URL的响应内容读取过来,然后把这些内容再发给浏览器.浏览器根本不知道服务器发送的内容从哪里来的,所以它的地址栏还是原来的地址。
forward:转发页面和转发到的页面可以共享request里面的数据
forward:一般用于用户登陆的时候,根据角色转发到相应的模块。

重定向（Redirect） 是利用服务器返回的状态码来实现的。客户端浏览器请求服务器的时候，服务器会返回一个状态码。服务器通过 HttpServletResponse 的 setStatus(int status) 方法设置状态码。如果服务器返回301或者302，则浏览器会到新的网址重新请求该资源。
redirect是服务端根据逻辑,发送一个状态码,告诉浏览器重新去请求那个地址.所以地址栏显示的是新的URL。
redirect:不能共享数据。
redirect:一般用于用户注销登陆时返回主页面和跳转到其它的网站等
```

```
106.什么是 URL 编码和 URL 解码？

URL 编码是负责把 URL 里面的空格和其他的特殊字符替换成对应的十六进制表示，反之就是解码。
```

```
如何让页面做到自动刷新？

自动刷新不仅可以实现一段时间之后自动跳转到另一个页面，还可以实现一段时间之后自动刷新本页面。
Servlet中通过HttpServletResponse对象设置Header属性实现自动刷新

Response.setHeader("Refresh","5;URL=http://localhost:8080/servlet/example.htm");
其中5为时间，单位为秒。URL指定就是要跳转的页面（如果设置自己的路径，就会实现每过5秒自动刷新本页面一次）
```

```
如何解决servlet的线程安全问题？

Servlet不是线程安全的，多线程并发的读写会导致数据不同步的问题。
解决的办法是尽量不要定义name属性，而是要把name变量分别定义在doGet()和doPost()方法内。
多线程的并发的读写Servlet类属性会导致数据不同步。但是如果只是并发地读取属性而不写入，则不存在数据不同步的问题。因此Servlet里的只读属性最好定义为final类型的。
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
110.include指令include的行为的区别?

include指令： JSP可以通过include指令来包含其他文件。被包含的文件可以是JSP文件、HTML文件或文本文件。包含的文件就好像是该JSP文件的一部分，会被同时编译执行。 语法格式如下： <%@ include file="文件相对 url 地址" %>

include动作： <jsp:include>动作元素用来包含静态和动态的文件。该动作把指定文件插入正在生成的页面。语法格式如下： <jsp:include page="相对 URL 地址" flush="true" />
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
application ：封装服务器运行环境的对象；
page ：JSP页面本身（相当于Java程序中的this）；
request ：封装客户端的请求，其中包含来自GET或POST请求的参数；
response ：封装服务器对客户端的响应；
session ：封装用户会话的对象；
exception ：封装页面抛出异常的对象。
out ：输出服务器响应的输出流对象；
config ：Web应用的配置对象；
pageContext：通过该对象可以获取其他对象；
```

```
jsp 和Servlet 有什么区别？

jsp是html页面中内嵌的Java代码，侧重页面显示；
Servlet是html代码和Java代码分离，侧重逻辑控制，mvc设计思想中jsp位于视图层，servlet位于控制层
JVM只能识别Java类，并不能识别jsp代码！web容器收到以.jsp为扩展名的url请求时，会将访问请求交给tomcat中jsp引擎处理，每个jsp页面第一次被访问时，jsp引擎将jsp代码解释为一个servlet源程序，接着编译servlet源程序生成.class文件，再有web容器servlet引擎去装载执行servlet程序，实现页面交互
```

```
request.getAttribute()和 request.getParameter()有何区别?

从获取方向来看：
getParameter()是获取 POST/GET 传递的参数值；
getAttribute()是获取对象容器中的数据值；

从用途来看：
getParameter()用于客户端重定向时，即点击了链接或提交按扭时传值用，即用于在用表单或url重定向传值时接收数据用。返回的是String,用于读取提交的表单中的值;
getAttribute() 用于服务器端重定向时,返回的是Object，需进行转换,可用setAttribute()设置成任意对象，使用很灵活，可随时用
```

```
JSP中的四种作用域是那几个？

page代表与一个页面相关的对象和属性。
request代表与Web客户机发出的一个请求相关的对象和属性。一个请求可能跨越多个页面，涉及多个Web组件；需要在页面显示的临时数据可以置于此作用域。
session代表与某个用户与服务器建立的一次会话相关的对象和属性。跟某个用户相关的数据应该放在用户自己的session中。
application代表与整个Web应用程序相关的对象和属性，它实质上是跨越整个Web应用程序，包括多个页面、请求和会话的一个全局作用域。
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

```
mysql怎样优化分页查询？

根据主键id，可以用到索引
select * from table where id > ? order by id  limit  ? ,?
```



### spring

[Spring常见面试题总结](https://blog.csdn.net/a745233700/article/details/80959716)

```
谈谈你对Spring的理解?

Spring是一个轻量级的IoC和AOP容器框架。是为Java应用程序提供基础性服务的一套框架，目的是用于简化企业应用程序的开发，它使得开发者只需要关心业务需求。常见的配置方式有三种：基于XML的配置、基于注解的配置、基于Java的配置。
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

代理模式：Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术；
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

OOP面向对象，允许开发者定义纵向的关系，但并适用于定义横向的关系，导致了大量代码的重复，而不利于各个模块的重用。
AOP，一般称为面向切面，作为面向对象的一种补充，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重用的模块，这个模块被命名为“切面”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。可用于权限认证、日志、事务处理。
AOP实现的关键在于 代理模式，AOP代理主要分为静态代理和动态代理。静态代理的代表为AspectJ；动态代理则以Spring AOP为代表。
（1）AspectJ是静态代理的增强，所谓静态代理，就是AOP框架会在编译阶段生成AOP代理类，因此也称为编译时增强，他会在编译阶段将AspectJ(切面)织入到Java字节码中，运行的时候就是增强之后的AOP对象。
（2）Spring AOP使用的动态代理，所谓的动态代理就是说AOP框架不会去修改字节码，而是每次运行时在内存中临时为方法生成一个AOP对象，这个AOP对象包含了目标对象的全部方法，并且在特定的切点做了增强处理，并回调原对象的方法。
Spring AOP中的动态代理主要有两种方式，JDK动态代理和CGLIB动态代理：
①JDK动态代理只提供接口的代理，不支持类的代理。核心InvocationHandler接口和Proxy类，InvocationHandler 通过invoke()方法反射来调用目标类中的代码，动态地将横切逻辑和业务编织在一起；接着，Proxy利用 InvocationHandler动态创建一个符合某一接口的的实例,  生成目标类的代理对象。
 ②如果代理类没有实现 InvocationHandler 接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library），是一个代码生成的类库，可以在运行时动态的生成指定类的一个子类对象，并覆盖其中特定方法并添加增强代码，从而实现AOP。CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。
（3）静态代理与动态代理区别在于生成AOP代理对象的时机不同，相对来说AspectJ的静态代理方式具有更好的性能，但是AspectJ需要特定的编译器进行处理，而Spring AOP则无需特定的编译器处理。
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

```
BeanFactory和ApplicationContext有什么区别？

 BeanFactory和ApplicationContext是Spring的两大核心接口，都可以当做Spring的容器。其中ApplicationContext是BeanFactory的子接口。
 
 （1）BeanFactory：是Spring里面最底层的接口，包含了各种Bean的定义，读取bean配置文档，管理bean的加载、实例化，控制bean的生命周期，维护bean之间的依赖关系。ApplicationContext接口作为BeanFactory的派生，除了提供BeanFactory所具有的功能外，还提供了更完整的框架功能：①继承MessageSource，因此支持国际化。②统一的资源文件访问方式。③提供在监听器中注册bean的事件。④同时加载多个配置文件。⑤载入多个（有继承关系）上下文 ，使得每一个上下文都专注于一个特定的层次，比如应用的web层。
 
 （2）①BeanFactroy采用的是延迟加载形式来注入Bean的，即只有在使用到某个Bean时(调用getBean())，才对该Bean进行加载实例化。②ApplicationContext，它是在容器启动时，一次性创建了所有的Bean。③相对于基本的BeanFactory，ApplicationContext 唯一的不足是占用内存空间。当应用程序配置Bean较多时，程序启动较慢。
 
 （3）BeanFactory通常以编程的方式被创建，ApplicationContext还能以声明的方式创建，如使用ContextLoader。
 
 （4）BeanFactory和ApplicationContext都支持BeanPostProcessor、BeanFactoryPostProcessor的使用，但两者之间的区别是：BeanFactory需要手动注册，而ApplicationContext则是自动注册。
```

### springmvc

```
什么是Spring MVC ？简单介绍下你对springMVC的理解?

Spring MVC是一个基于Java的实现了MVC设计模式的请求驱动类型的轻量级Web框架，通过把Model，View，Controller分离，将web层进行职责解耦，把复杂的web应用分成逻辑清晰的几部分，简化开发，减少出错，方便组内开发人员之间的配合。
```

```
SpringMVC的流程？

（1）用户发送请求至前端控制器DispatcherServlet；
（2） DispatcherServlet收到请求后，调用HandlerMapping处理器映射器，请求获取Handle；
（3）处理器映射器根据请求url找到具体的处理器(controller)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet；
（4）DispatcherServlet 调用 HandlerAdapter处理器适配器；
（5）HandlerAdapter 经过适配调用 具体处理器(Handler，也叫后端控制器controller)；
（6）Handler执行完成返回ModelAndView；
（7）HandlerAdapter将Handler执行结果ModelAndView返回给DispatcherServlet；
（8）DispatcherServlet将ModelAndView传给ViewResolver视图解析器进行解析；
（9）ViewResolver解析后返回具体View；
（10）DispatcherServlet对View进行渲染视图（即将模型数据填充至视图中）
（11）DispatcherServlet响应用户。
```

```
Springmvc的优点有哪些？

（1）可以支持各种视图技术,而不仅仅局限于JSP；
（2）与Spring框架集成（如IoC容器、AOP等）；
（3）清晰的角色分配：前端控制器(dispatcherServlet) , 请求到处理器映射（handlerMapping), 处理器适配器（HandlerAdapter), 视图解析器（ViewResolver）。
（4） 支持各种请求资源的映射策略。
```

```
Spring MVC的主要组件？

（1）前端控制器 DispatcherServlet（不需要程序员开发）:接收请求、响应结果，相当于转发器，有了DispatcherServlet 就减少了其它组件之间的耦合度。
（2）处理器映射器HandlerMapping（不需要程序员开发）:根据请求的URL来查找Handler
（3）处理器适配器HandlerAdapter:在编写Handler的时候要按照HandlerAdapter要求的规则去编写，这样适配器HandlerAdapter才可以正确的去执行Handler。
（4）处理器Handler（需要程序员开发）
（5）视图解析器 ViewResolver（不需要程序员开发）:进行视图的解析，根据视图逻辑名解析成真正的视图（view）
（6）视图View（需要程序员开发jsp）
```

```
SpringMVC怎么样设定重定向和转发的？

（1）转发：在返回值前面加"forward:"，譬如"forward:user.do?name=method4"
（2）重定向：在返回值前面加"redirect:"，譬如"redirect:http://www.baidu.com"
```

```
SpringMvc怎么和AJAX相互调用的？

通过Jackson框架就可以把Java里面的对象直接转化成Js可以识别的Json对象
（1）加入Jackson.jar
（2）在配置文件中配置json的映射
（3）在接受Ajax方法里面可以直接返回Object,List等,但方法前面要加上@ResponseBody注解。
```

```
SpringMVC常用的注解有哪些？

@RequestMapping：用于处理请求 url 映射的注解，可用于类或方法上。用于类上，则表示类中的所有响应请求的方法都是以该地址作为父路径。
@RequestBody：注解实现接收http请求的json数据，将json转换为java对象。
@ResponseBody：注解实现将conreoller方法返回对象转化为json对象响应给客户。
```

```
如果在拦截请求中，我想拦截get方式提交的方法,怎么配置？

可以在@RequestMapping注解里面加上method=RequestMethod.GET。
```

```
怎样接收前台传入的参数？如果这些参数都是一个对象的呢？

直接在形参里面声明这个参数就可以,但必须名字和传过来的参数一样。
直接在方法中声明这个对象,SpringMvc就自动会把属性赋值到这个对象里面。
```

```
SpringMvc中函数的返回值是什么？

返回值可以有很多类型,有String, ModelAndView。ModelAndView类把视图和数据都合并的一起的，但一般用String比较好。
```

```
怎么样把ModelMap里面的数据放入Session里面？

可以在类上面加上@SessionAttributes注解,里面包含的字符串就是要放入session里面的key。
```



### mybatis

```
什么是mybatis？

Mybatis是一个半ORM（对象关系映射）框架，它内部封装了JDBC，开发时只需要关注SQL语句本身，不需要花费精力去处理加载驱动、创建连接、创建statement等繁杂的过程。程序员直接编写原生态sql，可以严格控制sql执行性能，灵活度高。
MyBatis 可以使用 XML 或注解来配置和映射原生信息，将 POJO映射成数据库中的记录，避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。
通过xml 文件或注解的方式将要执行的各种 statement 配置起来，并通过java对象和 statement中sql的动态参数进行映射生成最终执行的sql语句，最后由mybatis框架执行sql并将结果映射为java对象并返回。（从执行sql到返回result的过程）。
```

```
为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？

Hibernate属于全自动ORM映射工具，使用Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。
而Mybatis在查询关联对象或关联集合对象时，需要手动编写sql来完成，所以，称之为半自动ORM映射工具。
```

```
mybatis的优点有哪些？缺点有哪些？

基于SQL语句编程，相当灵活，不会对应用程序或者数据库的现有设计造成任何影响，SQL写在XML里，解除sql与程序代码的耦合，便于统一管理；提供XML标签，支持编写动态SQL语句，并可重用。
与JDBC相比，减少了50%以上的代码量，消除了JDBC大量冗余的代码，不需要手动开关连接；
很好的与各种数据库兼容（因为MyBatis使用JDBC来连接数据库，所以只要JDBC支持的数据库MyBatis都支持）。
能够与Spring很好的集成；
提供映射标签，支持对象与数据库的ORM字段关系映射；提供对象关系映射标签，支持对象关系组件维护。

SQL语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写SQL语句的功底有一定要求。
SQL语句依赖于数据库，导致数据库移植性差，不能随意更换数据库。
```

```
#{}和${}的区别是什么？

#{}是预编译处理，${}是字符串替换。
Mybatis在处理#{}时，会将sql中的#{}替换为?号，调用PreparedStatement的set方法来赋值；
Mybatis在处理${}时，就是把${}替换成变量的值。
使用#{}可以有效的防止SQL注入，提高系统安全性。
```

```
当实体类中的属性名和表中的字段名不一样 ，怎么办 ？

第1种：通过在查询的sql语句中定义字段名的别名，让字段名的别名和实体类的属性名一致。
第2种：通过 <resultMap>来映射字段名和实体类属性名的一一对应的关系。
```

```
模糊查询like语句该怎么写?

第1种：在Java代码中添加sql通配符。推荐使用，不会引起sql注入
string wildcardname = “%smi%”;
list<name> names = mapper.selectlike(wildcardname);

第2种：在sql语句中拼接通配符，会引起sql注入
select * from foo where bar like "%"#{value}"%"
```

```
通常一个Xml映射文件，都会写一个Dao接口与之对应，请问，这个Dao接口的工作原理是什么？Dao接口里的方法，参数不同时，方法能重载吗？

Dao接口即Mapper接口。接口的全限名，就是映射文件中的namespace的值；接口的方法名，就是映射文件中Mapper的Statement的id值；接口方法内的参数，就是传递给sql的参数。
Mapper接口是没有实现类的，当调用接口方法时，接口全限名+方法名拼接字符串作为key值，可唯一定位一个MapperStatement。在Mybatis中，每一个 <select>、<insert>、<update>、<delete>标签，都会被解析为一个MapperStatement对象。
Mapper接口里的方法，是不能重载的，因为是使用 全限名+方法名 的保存和寻找策略。
Mapper 接口的工作原理是JDK动态代理，Mybatis运行时会使用JDK动态代理为Mapper接口生成代理对象proxy，代理对象会拦截接口方法，转而执行MapperStatement所代表的sql，然后将sql执行结果返回。
```

```
什么是MyBatis的接口绑定？有哪些实现方式？

接口绑定，就是在MyBatis中任意定义接口,然后把接口里面的方法和SQL语句绑定, 我们直接调用接口方法就可以,这样比起原来了SqlSession提供的方法我们可以有更加灵活的选择和设置。
接口绑定有两种实现方式,一种是通过注解绑定，就是在接口的方法上面加上 @Select、@Update等注解，里面包含Sql语句来绑定；
另外一种就是通过xml里面写SQL来绑定, 在这种情况下,要指定xml映射文件里面的namespace必须为接口的全路径名。
当Sql语句比较简单时候,用注解绑定, 当SQL语句比较复杂时候,用xml绑定,一般用xml绑定的比较多。
```

```
使用MyBatis的mapper接口调用时有哪些要求？

Mapper接口方法名和mapper.xml中定义的每个sql的id相同；
Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql 的parameterType的类型相同；
Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql的resultType的类型相同；
Mapper.xml文件中的namespace即是mapper接口的类路径。
```

```
Mapper编写有哪几种方式？

第一种：接口实现类继承SqlSessionDaoSupport：使用此种方法需要编写mapper接口，mapper接口实现类、mapper.xml文件。
在sqlMapConfig.xml中配置mapper.xml的位置
<mappers>
    <mapper resource="mapper.xml文件的地址" />
    <mapper resource="mapper.xml文件的地址" />
</mappers>
定义mapper接口,实现类集成SqlSessionDaoSupport,mapper方法中可以this.getSqlSession()进行数据增删改查。
spring 配置
<bean id=" " class="mapper接口的实现">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"></property>
</bean>

第二种：使用 org.mybatis.spring.mapper.MapperFactoryBean
在sqlMapConfig.xml中配置mapper.xml的位置，如果mapper.xml和mappre接口的名称相同且在同一个目录，这里可以不用配置
<mappers>
    <mapper resource="mapper.xml文件的地址" />
    <mapper resource="mapper.xml文件的地址" />
</mappers>
定义mapper接口,mapper.xml中的namespace为mapper接口的地址,mapper接口中的方法名和mapper.xml中的定义的statement的id保持一致
Spring中定义
<bean id="" class="org.mybatis.spring.mapper.MapperFactoryBean">
    <property name="mapperInterface" value="mapper接口地址" />
    <property name="sqlSessionFactory" ref="sqlSessionFactory" />
</bean>

第三种：使用mapper扫描器：最常使用
mapper.xml中的namespace为mapper接口的地址；mapper接口中的方法名和mapper.xml中的定义的statement的id保持一致；如果将mapper.xml和mapper接口的名称保持一致则不用在sqlMapConfig.xml中进行配置。
定义mapper接口：注意mapper.xml的文件名和mapper的接口名称保持一致，且放在同一个目录
spring中定义：
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="mapper接口包地址"></property>
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory" />
</bean>
```

```
Mybatis是如何进行分页的？分页插件的原理是什么？

Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的内存分页，而非物理分页。可以在sql内直接书写带有物理分页的参数来完成物理分页功能，也可以使用分页插件来完成物理分页。
分页插件的基本原理是使用Mybatis提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的sql，然后重写sql，根据dialect方言，添加对应的物理分页语句和物理分页参数。
```

```
简述Mybatis的插件运行原理，以及如何编写一个插件?

Mybatis仅可以编写针对ParameterHandler、ResultSetHandler、StatementHandler、Executor这4种接口的插件，Mybatis使用JDK的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行这4种接口对象的方法时，就会进入拦截方法，具体就是InvocationHandler的invoke()方法，当然，只会拦截那些你指定需要拦截的方法。
编写插件：实现Mybatis的Interceptor接口并复写intercept()方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法即可，记住，别忘了在配置文件中配置你编写的插件。
```

```
Mybatis是如何将sql执行结果封装为目标对象并返回的？都有哪些映射形式？

第一种是使用 <resultMap>标签，逐一定义数据库列名和对象属性名之间的映射关系。
第二种是使用sql列的别名功能，将列的别名书写为对象属性名。
有了列名与属性名的映射关系后，Mybatis通过反射创建对象，同时使用反射给对象的属性逐一赋值并返回，那些找不到映射关系的属性，是无法完成赋值的。
```

```java
//如何执行批量插入?

/*
<insert id=”insertname”>
	insert into names (name) values (#{value})
</insert>
*/
list < string> names = new arraylist();

names.add(“fred”);
names.add(“barney”);
names.add(“betty”);
names.add(“wilma”);
// 注意这里 executortype.batch
sqlsession sqlsession = sqlsessionfactory.opensession(executortype.batch);
try
 {
    namemapper mapper = sqlsession.getmapper(namemapper.class);    
    for (string name: names) {
            mapper.insertname(name);
        }
    sqlsession.commit();
} 
catch(Exception e) {
    e.printStackTrace();
    sqlSession.rollback();  
	throw e;
}
finally{
    sqlsession.close();
}
```

```
如何获取自动生成的(主)键值?

如果采用自增长策略，自动生成的键值在 insert 方法执行完后可以被设置到传入的参数对象中。
<insert id=”insertname” usegeneratedkeys=”true” keyproperty=”id”>
     insert into names (name) values (#{name})
</insert>

Name name = new Name();
name.setName = "admin";
int rows = mapper.insertName(name);
//插入成功后主键会赋值给name对象的id属性
System.out.println("generator id=:"+name.getId());
```

```
在mapper中如何传递多个参数?

第一种：DAO层的函数:
对应的xml,#{0}代表接收的是dao层中的第一个参数，#{1}代表dao层中第二参数，更多参数一致往后加即可。
第二种：DAO层的函数的参数使用 @param 注解进行数据绑定
第三种：多个参数封装成map，在xml中通过#{key}就能拿到对应的值了
```

```
Mybatis动态sql有什么用？执行原理？有哪些动态sql？

Mybatis动态sql可以在Xml映射文件内，以标签的形式编写动态sql，执行原理是根据表达式的值 完成逻辑判断并动态拼接sql的功能。
Mybatis提供了9种动态sql标签：trim|where|set|foreach|if|choose|when|otherwise|bind。
```

```
Xml映射文件中，除了常见的select|insert|updae|delete标签之外，还有哪些标签？

<resultMap>、<parameterMap>、<sql>、<include>、<selectKey>，加上动态sql的9个标签，其中 <sql>为sql片段标签，通过 <include>标签引入sql片段， <selectKey>为不支持自增的主键生成策略标签。
```

```
Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？

不同的Xml映射文件，如果配置了namespace，那么id可以重复；如果没有配置namespace，那么id不能重复；
原因就是namespace+id是作为Map <String,MapperStatement>的key使用的，如果没有namespace，就剩下id，那么，id重复会导致数据互相覆盖。有了namespace，自然id就可以重复，namespace不同，namespace+id自然也就不同。
```

```xml
<-- 一对一、一对多的关联查询 ？-->
<mapper namespace="com.lcb.mapping.userMapper">
	<!--association 一对一关联查询 -->
	<select id="getClass" parameterType="int" resultMap="ClassesResultMap">
        select * from class c,teacher t where c.teacher_id=t.t_id and c.c_id=#{id}		     </select>
	<resultMap type="com.lcb.user.Classes" id="ClassesResultMap">
		<!-- 实体类的字段名和数据表的字段名映射 -->
		<id property="id" column="c_id" />
		<result property="name" column="c_name" />
		<association property="teacher" javaType="com.lcb.user.Teacher">
			<id property="id" column="t_id" />
			<result property="name" column="t_name" />
		</association>
	</resultMap>
	<!--collection 一对多关联查询 -->
	<select id="getClass2" parameterType="int" resultMap="ClassesResultMap2">
        select * from class c,teacher t,student s where c.teacher_id=t.t_id and 		  c.c_id=s.class_id and c.c_id=#{id}
    </select>
	<resultMap type="com.lcb.user.Classes" id="ClassesResultMap2">
		<id property="id" column="c_id" />
		<result property="name" column="c_name" />
		<association property="teacher" javaType="com.lcb.user.Teacher">
			<id property="id" column="t_id" />
			<result property="name" column="t_name" />
		</association>
		<collection property="student" ofType="com.lcb.user.Student">
			<id property="id" column="s_id" />
			<result property="name" column="s_name" />
		</collection>
	</resultMap>
</mapper>
```

```
MyBatis实现一对一有几种方式?具体怎么操作的？

有联合查询和嵌套查询,联合查询是几个表联合查询,只查询一次, 通过在resultMap里面配置association节点配置一对一的类就可以完成；
嵌套查询是先查一个表，根据这个表里面的结果的 外键id，去再另外一个表里面查询数据,也是通过association配置，但另外一个表的查询通过select属性配置。
```

```
MyBatis实现一对多有几种方式,怎么操作的？

有联合查询和嵌套查询。联合查询是几个表联合查询,只查询一次,通过在resultMap里面的collection节点配置一对多的类就可以完成；
嵌套查询是先查一个表,根据这个表里面的 结果的外键id,去再另外一个表里面查询数据,也是通过配置collection,但另外一个表的查询通过select节点配置。
```

```
Mybatis是否支持延迟加载？如果支持，它的实现原理是什么？

Mybatis仅支持association关联对象和collection关联集合对象的延迟加载，association指的就是一对一，collection指的就是一对多查询。
在Mybatis配置文件中，可以配置是否启用延迟加载lazyLoadingEnabled=true|false。

它的原理是，使用CGLIB创建目标对象的代理对象，当调用目标方法时，进入拦截器方法，比如调用a.getB().getName()，拦截器invoke()方法发现a.getB()是null值，那么就会单独发送事先保存好的查询关联B对象的sql，把B查询上来，然后调用a.setB(b)，于是a的对象b属性就有值了，接着完成a.getB().getName()方法的调用。这就是延迟加载的基本原理。
```

```
Mybatis的一级、二级缓存?

一级缓存: 基于 PerpetualCache 的 HashMap 本地缓存，其存储作用域为 Session，当 Session flush 或 close 之后，该 Session 中的所有 Cache 就将清空，默认打开一级缓存。

二级缓存与一级缓存其机制相同，默认也是采用 PerpetualCache，HashMap 存储，不同在于其存储作用域为 Mapper(Namespace)，并且可自定义存储源，如 Ehcache,redis。默认不打开二级缓存，要开启二级缓存，使用二级缓存属性类需要实现Serializable序列化接口(可用来保存对象的状态),可在它的映射文件中配置 <cache/> ；

对于缓存数据更新机制，当某一个作用域(一级缓存 Session/二级缓存Namespaces)的进行了C/U/D 操作后，默认该作用域下所有 select 中的缓存将被 clear。
```



### redis

```
redis有哪些优势？

redis的数据是存在内存中的，所以读写速度非常快，因此 redis 被广泛应用于缓存方向。另外，redis也经常用来做分布式锁。redis 提供了多种数据类型来支持不同的业务场景。除此之外，redis 支持事务 、持久化、LUA 脚本、LRU驱动事件、多种集群方案。
```

```
为什么要使用redis缓存？

主要从“高性能”和“高并发”这两点来看待这个问题。
高性能：假如用户第一次访问数据库中的某些数据。这个过程会比较慢，因为是从硬盘上读取的。将该用户访问的数据存在缓存中，这样下一次再访问这些数据的时候就可以直接从缓存中获取了。操作缓存就是直接操作内存，所以速度相当快。如果数据库中的对应数据改变的之后，同步改变缓存中相应的数据即可！
高并发：直接操作缓存能够承受的请求是远远大于直接访问数据库的，所以我们可以考虑把数据库中的部分数据转移到缓存中去，这样用户的一部分请求会直接到缓存这里而不用经过数据库。
```

```
为什么要用 redis 而不用 map/guava 做缓存?

缓存分为本地缓存和分布式缓存。以 Java 为例，使用自带的 map 或者 guava 实现的是本地缓存，最主要的特点是轻量以及快速，生命周期随着 jvm 的销毁而结束，并且在多实例的情况下，每个实例都需要各自保存一份缓存，缓存不具有一致性。
使用 redis 或 memcached 之类的称为分布式缓存，在多实例的情况下，各实例共用一份缓存数据，缓存具有一致性。缺点是需要保持 redis 或 memcached 服务的高可用，整个程序架构上较为复杂。
```

```
redis 和 memcached 的区别?

redis 支持更丰富的数据类型（支持更复杂的应用场景）：Redis 不仅仅支持简单的 k/v 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储。memcache 支持简单的数据类型，String。

Redis 支持数据的持久化，可以将内存中的数据保持在磁盘中，重启的时候可以再次加载进行使用,而 Memecache 把数据全部存在内存之中。

集群模式：memcached 没有原生的集群模式，需要依靠客户端来实现往集群中分片写入数据；但是 redis 目前是原生支持 cluster 模式的.

Memcached 是多线程，非阻塞 IO 复用的网络模型；Redis 使用单线程的多路 IO 复用模型。
```

```
redis 常见数据结构以及使用场景分析?

String
常用命令: set,get,decr,incr,mget 等。
String 数据结构是简单的 key-value 类型，value 其实不仅可以是 String，也可以是数字。 常规 key-value 缓存应用； 常规计数：微博数，粉丝数等。

Hash
常用命令： hget,hset,hgetall 等。
hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象，后续操作的时候，你可以直接仅仅修改这个对象中的某个字段的值。 比如我们可以 hash 数据结构来存储用户信息，商品信息等等。

List
常用命令: lpush,rpush,lpop,rpop,lrange 等
list 就是链表，Redis list 的应用场景非常多，也是 Redis 最重要的数据结构之一，比如微博的关注列表，粉丝列表，消息列表等功能都可以用 Redis 的 list 结构来实现。Redis list 的实现为一个双向链表，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销。另外可以通过 lrange 命令，就是从某个元素开始读取多少个元素，可以基于 list 实现分页查询，这个很棒的一个功能，基于 redis 实现简单的高性能分页，可以做类似微博那种下拉不断分页的东西（一页一页的往下走），性能高。

Set
常用命令： sadd,spop,smembers,sunion 等
Redis 中的 set 类型是一种无序集合，集合中的元素没有先后顺序。可以基于 set 轻易实现交集、并集、差集的操作。比如：在微博应用中，可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。Redis 可以非常方便的实现如共同关注、共同粉丝、共同喜好等功能。

Sorted Set
常用命令： zadd,zrange,zrem,zcard 等
和 set 相比，sorted set 增加了一个权重参数 score，使得集合中的元素能够按 score 进行有序排列。在直播系统中，实时排行信息包含直播间在线用户列表，各种礼物排行榜，弹幕消息（可以理解为按消息维度的消息排行榜）等信息，适合使用 Redis 中的 Sorted Set 结构进行存储。
```

