---
layout: post
title: "java复习servlet"
categories: JDBC+servlet+jsp+MVC
tags: servlet
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
## what?

- 如果把 Web 应用比作一个餐厅，Servlet 就是餐厅中的服务员——负责接待顾客、上菜、结账。
- 从广义上来讲，Servlet 规范是 Sun 公司制定的一套技术标准，包含与 Web 应用相关的一系列接口，是 Web 应用实现方式的宏观解决方案。而具体的 Servlet 容器负责提供标准的实现。
- 从狭义上来讲，Servlet 指的是 javax.servlet.Servlet 接口及其子接口，也可以指实现了 Servlet 接口的实现类。
- Servlet 作为服务器端的一个组件，它的本意是“服务器端的小程序”。Servlet 的实例对象由 Servlet 容器负责创建；Servlet 的方法由容器在特定情况下调用；Servlet 容器会在 Web 应用卸载时销毁 Servlet 对象的实例。
- Servlet 本身不能独立运行，需要在一个web应用中运行的,而一个web应用是部署在tomcat中的
- 所以开发一个servlet需要如下几个步骤
  创建web应用项目
  编写servlet代码
  部署到tomcat中

## Demo

### servlet



```java
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloServlet extends HttpServlet{

	public void doGet(HttpServletRequest request, HttpServletResponse response){
		
		try {
			response.getWriter().println("<h1>Hello Servlet!</h1>");
			response.getWriter().println(new Date().toLocaleString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}

```

### web.xml

- 在WEB-INF目录中创建 web.xml
- web.xml提供路径与servlet的映射关系
- 把/hello这个路径，映射到 HelloServlet这个类上
- `<servlet> 标签下的 <servlet-name>与 <servlet-mapping> 标签下的 <servlet-name> 必须一样`
- `<servlet-name>与<servlet-class>可以不一样，但是为了便于理解与维护，一般都会写的一样。 一目了然`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app>

	<servlet>
		<servlet-name>HelloServlet</servlet-name>
		<servlet-class>HelloServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>HelloServlet</servlet-name>
		<url-pattern>/hello</url-pattern>
	</servlet-mapping>

</web-app>

```

- http://127.0.0.1/hello

## 获取参数

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>登录页面</title>
</head>
<body>
 
<form action="login" method="post">
账号: <input type="text" name="name"> <br>
密码: <input type="password" name="password"> <br>
<input type="submit" value="登录">
</form>
 
</body>
</html>

```

- 创建一个LoginServlet,因为浏览器中的form的method是post,所以LoginServlet需要提供一个doPost方法
- 在doPost方法中，通过request.getParameter 根据name取出对应的账号和密码

```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String password = request.getParameter("password");
 
        System.out.println("name:" + name);
        System.out.println("password:" + password);
    }
}

```

- 在web.xml中新增映射

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app>

	<servlet>
		<servlet-name>HelloServlet</servlet-name>
		<servlet-class>HelloServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>HelloServlet</servlet-name>
		<url-pattern>/hello</url-pattern>
	</servlet-mapping>
	
	<servlet>
		<servlet-name>LoginServlet</servlet-name>
		<servlet-class>LoginServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>LoginServlet</servlet-name>
		<url-pattern>/login</url-pattern>
	</servlet-mapping>	

</web-app>

```

## 返回响应

- 根据浏览器提交的账号密码返回登录成功或者失败 
- 注: 比较的时候把常量字符串"admin" "123"放前面，因为用户可能没有输入账号密码就提交，servlet会获取到null。 这样就规避了空指针异常的问题。

```java
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class LoginServlet extends HttpServlet {
 
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
 
        String name = request.getParameter("name");
        String password = request.getParameter("password");
 
        String html = null;
 
        if ("admin".equals(name) && "123".equals(password))
            html = "<div style='color:green'>success</div>";
        else
            html = "<div style='color:red'>fail</div>";
 
        PrintWriter pw = response.getWriter();
        pw.println(html);
 
    }
 
}

```

## 调用流程

![](http://stepimagewm.how2j.cn/7461.png)

- Tomcat 定位到了LoginServlet后，发现并没有LoginServlet的实例存在，于是就调用LoginServlet的public无参的构造方法LoginServlet()实例化一个LoginServlet对象以备后续使用
- Tomcat从上一步拿到了LoginServlet的实例之后，根据页面login.html提交信息的时候带的method="post"，去调用对应的doPost方法。
- 接着流程进入了doPost方法中
- 然后把html字符串通过如下方式，设置在了response对象上。
- 在Servlet完成工作之后，tomcat拿到被Servlet修改过的response，根据这个response生成html 字符串，然后再通过[HTTP协议](http://how2j.cn/k/http/http-tutorials/568.html)，这个html字符串，回发给浏览器，浏览器再根据HTTP协议获取这个html字符串，并渲染在界面上。

## service

- Servlet 需要提供对应的doGet() 与 doPost()方法

### doGet

- 当浏览器使用get方式提交数据的时候，servlet需要提供doGet()方法

- 哪些是get方式呢？

  form默认的提交方式
  如果通过一个超链访问某个地址
  如果在地址栏直接输入某个地址
  ajax指定使用get方式的时候

### doPost

- 当浏览器使用post方式提交数据的时候，servlet需要提供doPost()方法
- 哪些是post方式呢？
  在form上显示设置 method="post"的时候
  ajax指定post方式的时候

### service

- LoginServlet继承了HttpServlet,同时也继承了一个方法 
- `service(HttpServletRequest , HttpServletResponse )`
- 实际上，在执行doGet()或者doPost()之前，都会先执行service()
- 由service()方法进行判断，到底该调用doGet()还是doPost()
- 可以发现，service(), doGet(), doPost() 三种方式的参数列表都是一样的。
- 所以，有时候也会直接重写service()方法，在其中提供相应的服务，就不用区分到底是get还是post了。

```java
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String name = request.getParameter("name");
		String password = request.getParameter("password");

		String html = null;

		if ("admin".equals(name) && "123".equals(password))
			html = "<div style='color:green'>success</div>";
		else
			html = "<div style='color:red'>fail</div>";

		PrintWriter pw = response.getWriter();
		pw.println(html);

	}

}

```



## 中文问题

- 为了成功获取中文参数，需要做如下操作
- login.html中加上`<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`这句话的目的是告诉浏览器，等下发消息给服务器的时候，使用UTF-8编码
- login.html中form的method修改为post
- 在servlet进行解码和编码`byte[] bytes=  name.getBytes("ISO-8859-1");`,`name = new String(bytes,"UTF-8");`
- 先根据ISO-8859-1解码，然后用UTF-8编码,这样就可以得到正确的中文参数了
- 这样需要对每一个提交的数据都进行编码和解码处理，如果觉得麻烦，也可以使用一句话代替：
- `request.setCharacterEncoding("UTF-8"); `并且把这句话放在request.getParameter()之前
- 向浏览器返回中文时：在Servlet中，加上`response.setContentType("text/html; charset=UTF-8");`

```java
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String name = request.getParameter("name");
		String password = request.getParameter("password");

		String html = null;

		if ("admin".equals(name) && "123".equals(password))
			html = "<div style='color:green'>登录成功</div>";
		else
			html = "<div style='color:red'>登录失败</div>";

		response.setContentType("text/html; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.println(html);

	}

}

```

## 生命周期

- 一个Servlet的生命周期由 [实例化](http://how2j.cn/k/servlet/servlet-lifecycle/550.html#step1594)，[初始化](http://how2j.cn/k/servlet/servlet-lifecycle/550.html#step1595)，[提供服务](http://how2j.cn/k/servlet/servlet-lifecycle/550.html#step1596)，[销毁](http://how2j.cn/k/servlet/servlet-lifecycle/550.html#step1597)，[被回收](http://how2j.cn/k/servlet/servlet-lifecycle/550.html#step1597) 几个步骤组成

### 实例化

- 当用户通过浏览器输入一个路径，这个路径对应的servlet被调用的时候，该Servlet就会被实例化
- 为LoginServlet显式提供一个构造方法 LoginServlet()
- 然后通过浏览器访问，就可以观察到"LoginServlet 构造方法 被调用"
- 无论访问了多少次LoginServlet，LoginServlet构造方法 只会执行一次，所以Servlet是单实例的

```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {
	
	public LoginServlet(){
		System.out.println("LoginServlet 构造方法 被调用");
	}

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		//略

	}

}

```

### 初始化

- LoginServlet 继承了HttpServlet，同时也继承了init(ServletConfig) 方法
- init 方法是一个实例方法，所以会在构造方法执行后执行。
- 无论访问了多少次LoginSerlvet，init初始化 只会执行一次

```java
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	public LoginServlet() {
		System.out.println("LoginServlet 构造方法 被调用");
	}

	public void init(ServletConfig config) {
		System.out.println("init(ServletConfig)");
	}

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// 略

	}

}

```

### 提供服务

- 接下来就是执行service()方法，然后通过浏览器传递过来的信息进行判断，是调用doGet()还是doPost()方法
- 在service()中就会编写我们的业务代码，在本例中就是判断用户输入的账号和密码是否正确

```java
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	public LoginServlet() {
		System.out.println("LoginServlet 构造方法 被调用");
	}

	public void init(ServletConfig config) {
		System.out.println("init(ServletConfig)");
	}

	protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
 
        String name = request.getParameter("name");
        String password = request.getParameter("password");
 
        String html = null;
 
        if ("admin".equals(name) && "123".equals(password))
            html = "<div style='color:green'>success</div>";
        else
            html = "<div style='color:red'>fail</div>";
 
        PrintWriter pw = response.getWriter();
        pw.println(html);
 
    }

}

```

### 销毁

- 接着是销毁destroy()
- 在如下几种情况下，会调用destroy()
- 该Servlet所在的web应用重新启动，在serverl.xml中配置该web应用的时候用到了
- 关闭tomcat的时候 destroy()方法会被调用，但是这个一般都发生的很快，不易被发现。

```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	public void destroy() {
		System.out.println("destroy()");
	}

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// 略
	}

}

```

### 被回收

- 当该Servlet被销毁后，就满足垃圾回收的条件了。 当下一次垃圾回收GC来临的时候，就有可能被回收。



## 跳转

- 页面跳转是开发一个web应用经常会发生的事情。 
- 比如登录成功或是失败后，分别会跳转到不同的页面。 
- 跳转的方式有两种，服务端跳转和客户端跳转



### 服务端

- 在Servlet中进行服务端跳转的方式：`request.getRequestDispatcher("success.html").forward(request, response);`

```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String name = request.getParameter("name");
		String password = request.getParameter("password");

		if ("admin".equals(name) && "123".equals(password)) {
			request.getRequestDispatcher("success.html").forward(request, response);
		}

	}

}

```

### 客户端

- 在Servlet中进行客户端跳转的方式：`response.sendRedirect("fail.html");`

```java
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String name = request.getParameter("name");
		String password = request.getParameter("password");

		if ("admin".equals(name) && "123".equals(password)) {
			request.getRequestDispatcher("success.html").forward(request, response);
		}
		else{
			response.sendRedirect("fail.html");
		}

	}

}

```

![](http://stepimagewm.how2j.cn/1602.png)

## 自启动

- 有的时候会有这样的业务需求： tomcat一启动，就需要执行一些初始化的代码，比如校验数据库的完整性等。 
- 但是Servlet的生命周期是在用户访问浏览器对应的路径开始的。如果没有用户的第一次访问，就无法执行相关代码。
- 这个时候，就需要Servlet实现自启动 即，伴随着tomcat的启动，自动启动初始化，在初始化方法init()中，就可以进行一些业务代码的工作了。

### web.xml

- 在web.xml中，配置Hello Servlet的地方，增加一句`<load-on-startup>10</load-on-startup>`,10表示启动顺序,如果有多个Servlet都配置了自动启动，数字越小，启动的优先级越高
- 取值范围是1-99,即表明该Servlet会随着Tomcat的启动而初始化。同时，为HelloServlet提供一个init(ServletConfig) 方法，验证自启动

```xml


<?xml version="1.0" encoding="UTF-8"?>
<web-app>

	<servlet>
		<servlet-name>HelloServlet</servlet-name>
		<servlet-class>HelloServlet</servlet-class>
		<load-on-startup>10</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>HelloServlet</servlet-name>
		<url-pattern>/hello</url-pattern>
	</servlet-mapping>
	
	<servlet>
		<servlet-name>LoginServlet</servlet-name>
		<servlet-class>LoginServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>LoginServlet</servlet-name>
		<url-pattern>/login</url-pattern>
	</servlet-mapping>	

</web-app>


```

```java

import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class HelloServlet extends HttpServlet{
	
	public void init(ServletConfig config){
		System.out.println("init of Hello Servlet");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response){
		
		try {
			response.getWriter().println("<h1>Hello Servlet!</h1>");
			response.getWriter().println(new Date().toLocaleString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}

```



## request

- request对象的类是HttpServletRequest，提供了很多有实用价值的方法
- 获取URL：`String basePath=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"`

### 常见方法

```java
request.getRequestURL(): "浏览器发出请求时的完整URL，包括协议 主机名 端口(如果有)" 
request.getRequestURI(): "浏览器发出请求的资源名部分，去掉了协议和主机名" 
request.getQueryString(): "请求行中的参数部分，只能显示以get方式发出的参数，post方式的看不到"
request.getRemoteAddr(): "浏览器所处于的客户机的IP地址"
request.getRemoteHost(): "浏览器所处于的客户机的主机名"
request.getRemotePort(): "浏览器所处于的客户机使用的网络端口"
request.getLocalAddr(): "服务器的IP地址"
request.getLocalName(): "服务器的主机名"
request.getMethod(): "得到客户机请求方式一般是GET或者POST"
    
setAttribute(String name,Object)："设置名字为name的request的參数值"
getAttribute(String name)："返回由name指定的属性值"
getAttributeNames()："返回request对象全部属性的名字集合，结果是一个枚举的实例"
getCookies()："返回client的全部Cookie对象，结果是一个Cookie数组"
getCharacterEncoding()："返回请求中的字符编码方式"
getContentLength()："返回请求的Body的长度"
getHeader(String name)："获得HTTP协议定义的文件头信息"
getHeaders(String name)："返回指定名字的request Header的全部值，结果是一个枚举的实例"
getHeaderNames()："返回所以request Header的名字，结果是一个枚举的实例"
getInputStream()："返回请求的输入流，用于获得请求中的数据"
getMethod()："获得client向server端传送数据的方法"
getParameter(String name)："获得client传送给server端的有name指定的參数值"
getParameterNames()："获得client传送给server端的全部參数的名字，结果是一个枚举的实例"
getParameterValues(String name)："获得有name指定的參数的全部值"
getProtocol()："获取client向server端传送数据所根据的协议名称"
getQueryString()："获得查询字符串"
getRequestURI()："获取发出请求字符串的client地址"
getRemoteAddr()："获取client的IP地址"
getRemoteHost()："获取client的名字"
getSession([Boolean create])："返回和请求相关Session"
getServerName()："获取server的名字"
getServletPath()："获取client所请求的脚本文件的路径"
getServerPort()："获取server的port号"
removeAttribute(String name)："删除请求中的一个属性"
```

![](http://stepimagewm.how2j.cn/1606.png)

### 获取参数

```java
request.getParameter(): "是常见的方法，用于获取单值的参数"
request.getParameterValues(): "用于获取具有多值的参数，比如注册时候提交的 "hobits"，可以是多选的。"
request.getParameterMap(): "用于遍历所有的参数，并返回Map类型。"
```

```java


import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RegisterServlet extends HttpServlet {

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		System.out.println("获取单值参数name:" + request.getParameter("name"));

		String[] hobits = request.getParameterValues("hobits");
		System.out.println("获取具有多值的参数hobits: " + Arrays.asList(hobits));

		System.out.println("通过 getParameterMap 遍历所有的参数： ");
		Map<String, String[]> parameters = request.getParameterMap();

		Set<String> paramNames = parameters.keySet();
		for (String param : paramNames) {
			String[] value = parameters.get(param);
			System.out.println(param + ":" + Arrays.asList(value));
		}

	}

}

```

![](http://stepimagewm.how2j.cn/1608.png)

### 头信息

- request.getHeader() 获取浏览器传递过来的头信息。
- request.getHeaderNames() 获取浏览器所有的头信息名称，根据头信息名称就能遍历出所有的头信息

```java
import java.io.IOException;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloServlet extends HttpServlet{
	
	public void init(ServletConfig config){
		System.out.println("init of Hello Servlet");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response){
	
		Enumeration<String> headerNames= request.getHeaderNames();
		while(headerNames.hasMoreElements()){
			String header = headerNames.nextElement();
			String value = request.getHeader(header);
			System.out.printf("%s\t%s%n",header,value);
		}
		
		try {
			response.getWriter().println("<h1>Hello Servlet!</h1>");
			response.getWriter().println(new Date().toLocaleString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}

```

- 访问HelloServlet获取如下头信息:
  host: 主机地址
  user-agent: 浏览器基本资料
  accept: 表示浏览器接受的数据类型
  accept-language: 表示浏览器接受的语言
  accept-encoding: 表示浏览器接受的压缩方式，是压缩方式，并非编码
  connection: 是否保持连接
  cache-control: 缓存时限

![](http://stepimagewm.how2j.cn/1609.png)



## response

- response是HttpServletResponse的实例，用于提供给浏览器的响应信息
- **response.getWriter();**：可以使用println(),append(),write(),format()等等方法设置返回给浏览器的html内容。
- `response.setContentType("text/html");`"text/html" 是即格式 ，在[request获取头信息](http://how2j.cn/k/servlet/servlet-request/555.html#step1609) 中对应的request.getHeader("accept")
- 设置响应编码有两种方式:`1. response.setContentType("text/html; charset=UTF-8");`,`2. response.setCharacterEncoding("UTF-8");`
- 这两种方式都需要在response.getWriter调用之前执行才能生效。
- 他们的区别在于1不仅发送到浏览器的内容会使用UTF-8编码，而且还通知浏览器使用UTF-8编码方式进行显示。所以总能正常显示中文,2仅仅是发送的浏览器的内容是UTF-8编码的，至于浏览器是用哪种编码方式显示不管。 所以当浏览器的显示编码方式不是UTF-8的时候，就会看到乱码，需要手动再进行一次设置。
- 302临时跳转：`response.sendRedirect("fail.html");`
- 301永久性跳转：`response.setStatus(301);response.setHeader("Location", "fail.html");`
- 设置不使用缓存

```java
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) {

		try {
			response.setDateHeader("Expires", 0);
			response.setHeader("Cache-Control", "no-cache");
			response.setHeader("pragma", "no-cache");
			response.getWriter().println("<h1>Hello Servlet!</h1>");
			response.getWriter().println(new Date().toLocaleString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

```

```java
void addCookie(Cookie cookie）"给客户端添加一个Cookie对象，以保存客户端的信息"

void addDateHeader(String name,long value) "添加一个日期类型的HTTP首部信息，覆盖同名的HTTP首部"

void addIntHeader(String name,int value) "添加一个整型的HTTP首部，并覆盖旧的HTTP首部"

String encodeRedirectURL(String url)"对使用的URL进行编译"

String encodeURL(String url)"封装URL并返回到客户端，实现URL重写"

void flushBuffer() "清空缓冲区"

int getCharacterEncoding() "取得字符编码类型"

String getContentType() "取得MIME类型"

Locale getLocale() "取得本地化信息"

ServletOutputStream getOutputStream() "返回一个二进制输出字节流"

PrintWriter getWriter() "返回一个输出字符流"

void reset() "重设response对象"

void resetBuffer()"重设缓冲区"

void sendError(int sc) "向客户端发送HTTP状态码的出错信息"

void sendRedirect() "重定向客户的请求到指定页面"

void setBufferSize(int size) "设置缓冲区的大小为size"

void setCharacterEncoding(String encoding) "设置字符编码类型为encoding"

void setContentLength(int length)"设置响应数据的大小为size"

void setContentType(String type) "设置MIME类型"

void setDateHeader(String s1,long l) "设置日期类型的HTPP首部信息"

void setLocale(Locale locale) "设置本地化为locale"

void setStatus(int status)  "设置状态码为status"
```



## 上传文件

- form 的**method必须是post**的，get不能上传文件。 还需要加上**enctype="multipart/form-data"** 表示提交的数据是二进制文件
- 需要提供**type="file"** 的字段进行上传

```html
<!DOCTYPE html>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<form action="uploadPhoto" method="post" enctype="multipart/form-data">
  英雄名称:<input type="text" name="heroName" /> <br> 
  上传头像 : <input type="file" name="filepath" /> <br> 
  <input type="submit" value="上传">
</form>

```

- 需要用到两个第三方的jar包，**commons-io-1.4.jar**和**commons-fileupload-1.2.2.jar**
- 前部分代码是固定写法，用来做一些准备工作。 直到遍历出Item,一个Item就是对应一个浏览器提交的数据，通过item.getInputStream可以打开浏览器上传的文件的输入流
- 客户提交的文件名有可能是一样的，所以在服务端保存文件的时候，不能使用客户提交的文件名。这里使用的是一种粗糙的解决文件名重复的办法，即使用时间戳
- 读取输入流中的数据，保存在服务端的目录下 e:/project/j2ee/web/uploaded，这个目录是通过getRealPath获取到的。 如果项目部署在其他地方，那么会自动做相应的变化
- 根据临时生成的文件名，创建一个html img元素，然后通过response返回浏览器

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
 
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
 
public class UploadPhotoServlet extends HttpServlet {
 
    public void doPost(HttpServletRequest request, HttpServletResponse response) {
 
        String filename = null;
        try {
            DiskFileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            // 设置上传文件的大小限制为1M
            factory.setSizeThreshold(1024 * 1024);
            
            List items = null;
            try {
                items = upload.parseRequest(request);
            } catch (FileUploadException e) {
                e.printStackTrace();
            }
 
            Iterator iter = items.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                if (!item.isFormField()) {
 
                    // 根据时间戳创建头像文件
                    filename = System.currentTimeMillis() + ".jpg";
                    
                    //通过getRealPath获取上传文件夹，如果项目在e:/project/j2ee/web,那么就会自动获取到 e:/project/j2ee/web/uploaded
                    String photoFolder =request.getServletContext().getRealPath("uploaded");
                    
                    File f = new File(photoFolder, filename);
                    f.getParentFile().mkdirs();
 
                    // 通过item.getInputStream()获取浏览器上传的文件的输入流
                    InputStream is = item.getInputStream();
 
                    // 复制文件
                    FileOutputStream fos = new FileOutputStream(f);
                    byte b[] = new byte[1024 * 1024];
                    int length = 0;
                    while (-1 != (length = is.read(b))) {
                        fos.write(b, 0, length);
                    }
                    fos.close();
 
                } else {
                	System.out.println(item.getFieldName());
                    String value = item.getString();
                    value = new String(value.getBytes("ISO-8859-1"), "UTF-8");
                    System.out.println(value);
                }
            }
            
            String html = "<img width='200' height='150' src='uploaded/%s' />";
            response.setContentType("text/html");
            PrintWriter pw= response.getWriter();
            
            pw.format(html, filename);
            
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}

```

```xml
	<servlet>
		<servlet-name>UploadPhotoServlet</servlet-name>
		<servlet-class>UploadPhotoServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>UploadPhotoServlet</servlet-name>
		<url-pattern>/uploadPhoto</url-pattern>
	</servlet-mapping>	

```



### 非文件字段

- 因为浏览器指定了以二进制的形式提交数据，那么就不能通过常规的手段获取非File字段：`request.getParameter("heroName")`
- 在遍历Item时(Item即对应浏览器提交的字段)，可以通过:`item.isFormField`来判断是否是常规字段还是提交的文件。 当item.isFormField返回true的时候，就表示是常规字段。
- 然后通过item.getFieldName()和item.getString()就知道分别是哪个字段，以及字段的值了。

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
 
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
 
public class UploadPhotoServlet extends HttpServlet {
 
    public void doPost(HttpServletRequest request, HttpServletResponse response) {
 
        String filename = null;
        try {
            DiskFileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            // 设置上传文件的大小限制为1M
            factory.setSizeThreshold(1024 * 1024);
            
            List items = null;
            try {
                items = upload.parseRequest(request);
            } catch (FileUploadException e) {
                e.printStackTrace();
            }
 
            Iterator iter = items.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                if (!item.isFormField()) {
 
                    // 根据时间戳创建头像文件
                    filename = System.currentTimeMillis() + ".jpg";
                    String photoFolder = "e:\\project\\j2ee\\web\\uploaded";
                    File f = new File(photoFolder, filename);
                    f.getParentFile().mkdirs();
 
                    // 通过item.getInputStream()获取浏览器上传的文件的输入流
                    InputStream is = item.getInputStream();
 
                    // 复制文件
                    FileOutputStream fos = new FileOutputStream(f);
                    byte b[] = new byte[1024 * 1024];
                    int length = 0;
                    while (-1 != (length = is.read(b))) {
                        fos.write(b, 0, length);
                    }
                    fos.close();
 
                } else {
                	System.out.println(item.getFieldName());
                    String value = item.getString();
                    value = new String(value.getBytes("ISO-8859-1"), "UTF-8");
                    System.out.println(value);
                }
            }
            
            String html = "<img width='200' height='150' src='uploaded/%s' />";
            PrintWriter pw= response.getWriter();
            pw.format(html, filename);
            
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}

```

本文章参考自：http://how2j.cn