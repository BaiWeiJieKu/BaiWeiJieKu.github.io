---
layout: post
title: "springMVC基础（一）"
categories: springMVC
tags: springMVC
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 概述

- Spring 为展现层提供的基于 MVC 设计理念的优秀的Web 框架，是目前最主流的 MVC 框架之一
- Spring MVC 通过一套 MVC 注解，让POJO 成为处理请  求的控制器，而无须实现任何接口
- 支持 REST 风格的 URL 请求
- 采用了松散耦合可插拔组件结构，比其他 MVC 框架更具扩展性和灵活性



### HelloWorld

#### jar

```
commons-logging-1.1.3.jar
spring-aop-4.0.0.RELEASE.jar
spring-beans-4.0.0.RELEASE.jar
spring-context-4.0.0.RELEASE.jar
spring-core-4.0.0.RELEASE.jar
spring-expression-4.0.0.RELEASE.jar
spring-web-4.0.0.RELEASE.jar
spring-webmvc-4.0.0.RELEASE.jar
```



#### web.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	id="WebApp_ID" version="2.5">

	<!-- 配置 DispatcherServlet:前端分发器 -->
	<servlet>
		<servlet-name>dispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<!-- 配置 DispatcherServlet 的一个初始化参数: 配置 SpringMVC 配置文件的位置和名称 -->
		<!-- 
			实际上也可以不通过 contextConfigLocation 来配置 SpringMVC 的配置文件, 而使用默认的.
			默认的配置文件为: /WEB-INF/<servlet-name>-servlet.xml
		-->
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>dispatcherServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>

</web-app>

```



#### springmvc.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
		http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd">

	<!-- 配置自定扫描的包 -->
	<context:component-scan base-package="com.atguigu.springmvc"></context:component-scan>

	<!-- 配置视图解析器: 如何把 handler 方法返回值解析为实际的物理视图 -->
	<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/WEB-INF/views/"></property>
		<property name="suffix" value=".jsp"></property>
	</bean>
	
	<!-- 配置视图  BeanNameViewResolver 解析器: 使用视图的名字来解析视图 -->
	<!-- 通过 order 属性来定义视图解析器的优先级, order 值越小优先级越高 -->
	<bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
		<property name="order" value="100"></property>
	</bean>
	
	<!-- 配置国际化资源文件 -->
	<bean id="messageSource"
		class="org.springframework.context.support.ResourceBundleMessageSource">
		<property name="basename" value="i18n"></property>	
	</bean>
	
	<!-- 配置直接转发的页面 -->
	<!-- 可以直接相应转发的页面, 而无需再经过 Handler 的方法.  -->
	<mvc:view-controller path="/success" view-name="success"/>
	
	<!-- 在实际开发中通常都需配置 mvc:annotation-driven 标签 -->
	<mvc:annotation-driven></mvc:annotation-driven>

</beans>


```



#### Controller

```java
@Controller
public class HelloWorld {

	/**
	 * 1. 使用 @RequestMapping 注解来映射请求的 URL
	 * 2. 返回值会通过视图解析器解析为实际的物理视图, 对于 InternalResourceViewResolver 视图解析器, 会做如下的解析:
	 * 通过 prefix + returnVal + 后缀 这样的方式得到实际的物理视图, 然会做转发操作
	 * 
	 * /WEB-INF/views/success.jsp
	 * 
	 * @return
	 */
	@RequestMapping("/helloworld")
	public String hello(){
		System.out.println("hello world");
		return "success";
	}
	
}

```



### 映射请求

- Spring MVC 使用@RequestMapping 注解为控制器指定可  以处理哪些URL请求
- 在控制器的**类定义及方法定义处**都可标注
- **类定义处**：提供初步的请求映射信息。相对于 WEB应用的根目录
- **方法处**：提供进一步的细分映射信息。相对于类定义处的 URL。若  类定义处未标注@RequestMapping，则方法处标记的URL相对于  WEB 应用的根目录
- DispatcherServlet 截获请求后，就通过控制器上@RequestMapping提供的映射信息确定请求所对应的处理方法



#### 参数

- @RequestMapping 除了可以使用请求 URL 映射请求外，还可以使用请求方法、请求参数及请求头映射请求
- @RequestMapping 的 value、method、params及 heads  分别表示请求 URL、请求方法、请求参数及请求头的映射条  件，他们之间是**与**的关系，**联合使用多个条件可让请求映射  更加精确化**

```java
	/**
	 * 了解: 可以使用 params 和 headers 来更加精确的映射请求. params 和 headers 支持简单的表达式.
	 * 
	 * @return
	 */
	@RequestMapping(value = "testParamsAndHeaders", params = { "username",
			"age!=10" }, headers = { "Accept-Language=en-US,zh;q=0.8" })
	public String testParamsAndHeaders() {
		System.out.println("testParamsAndHeaders");
		return SUCCESS;
	}

```



- @RequestMapping 还支持 Ant 风格的 URL
- ?：匹配文件名中的一个字符
- *：匹配文件名中的任意字符
- `**`： 匹配多层路径

```java
	@RequestMapping("/testAntPath/*/abc")
	public String testAntPath() {
		System.out.println("testAntPath");
		return SUCCESS;
	}

```



#### @PathVariable

- 通过 @PathVariable可以将 URL 中占位符参数绑定到控  制器处理方法的入参中
- URL 中的 {**xxx**} 占位符可以通过@PathVariable("xxx")绑定到操作方法的入参中

```java
	/**
	 * @PathVariable 可以来映射 URL 中的占位符到目标方法的参数中.
	 * @param id
	 * @return
	 */
	@RequestMapping("/testPathVariable/{id}")
	public String testPathVariable(@PathVariable("id") Integer id) {
		System.out.println("testPathVariable: " + id);
		return SUCCESS;
	}

```



### REST

- **REST**：即RepresentationalState Transfer。（资源）表现层状态转化。是目前  最流行的一种互联网软件架构。它结构清晰、符合标准、易于理解、扩展方便，  所以正得到越来越多网站的采用
- **资源（Resources）**：网络上的一个实体，或者说是网络上的一个具体信息。它  可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的存在。  可以用一个URI（统一资源定位符）指向它，每种资源对应一个特定的 URI 。要  获取这个资源，访问它的URI就可以，因此URI 即为每一个资源的独一无二的识  别符
- **表现层（Representation）**：把资源具体呈现出来的形式，叫做它的表现层（Representation）。比如，文本可以用txt格式表现，也可以用HTML格  式、XML 格式、JSON 格式表现，甚至可以采用二进制格式
- **状态转化（State Transfer）**：每发出一个请求，就代表了客户端和服务器的一次交互过程。HTTP协议，是一个无状态协议，即所有的状态都保存在服务器  端。因此，如果客户端想要操作服务器，必须通过某种手段，让服务器端发生“  状态转化”（State Transfer）。而这种转化是建立在表现层之上的，所以就是“  表现层状态转化”。
- 具体说，就是 HTTP 协议里面，四个表示操作方式的动  词：**GET、POST、PUT、DELETE**。它们分别对应四种基本操作：GET 用来获取资源，POST用来新建资源，PUT 用来更新资源，DELETE 用来删除资源

```
示例：
/order/1	HTTP GET ：得到 id = 1 的 order
/order/1	HTTP DELETE：删除 id = 1的 order
/order/1	HTTP PUT：更新id = 1的 order
/order	HTTP POST：新增 order
```



#### HiddenHttpMethodFilter

- 浏览器 form表单只支持GET  与 POST 请求，而DELETE、PUT 等 method并不支  持，Spring3.0添加了一个过滤器，可以将这些请求转换  为标准的 http 方法，使得支持 GET、POST、PUT与  DELETE 请求

- 源码

```java
public class HiddenHttpMethodFilter extends OncePerRequestFilter {

	private static final List<String> ALLOWED_METHODS =
			Collections.unmodifiableList(Arrays.asList(HttpMethod.PUT.name(),
					HttpMethod.DELETE.name(), HttpMethod.PATCH.name()));

	/** Default method parameter: {@code _method}. */
	public static final String DEFAULT_METHOD_PARAM = "_method";

	private String methodParam = DEFAULT_METHOD_PARAM;


	/**
	 * Set the parameter name to look for HTTP methods.
	 * @see #DEFAULT_METHOD_PARAM
	 */
	public void setMethodParam(String methodParam) {
		Assert.hasText(methodParam, "'methodParam' must not be empty");
		this.methodParam = methodParam;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		HttpServletRequest requestToUse = request;

		if ("POST".equals(request.getMethod()) && request.getAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE) == null) {
			String paramValue = request.getParameter(this.methodParam);
			if (StringUtils.hasLength(paramValue)) {
				String method = paramValue.toUpperCase(Locale.ENGLISH);
				if (ALLOWED_METHODS.contains(method)) {
					requestToUse = new HttpMethodRequestWrapper(request, method);
				}
			}
		}

		filterChain.doFilter(requestToUse, response);
	}


	/**
	 * Simple {@link HttpServletRequest} wrapper that returns the supplied method for
	 * {@link HttpServletRequest#getMethod()}.
	 */
	private static class HttpMethodRequestWrapper extends HttpServletRequestWrapper {

		private final String method;

		public HttpMethodRequestWrapper(HttpServletRequest request, String method) {
			super(request);
			this.method = method;
		}

		@Override
		public String getMethod() {
			return this.method;
		}
	}

}


```



- 需要配置在web.xml中才能使用

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	id="WebApp_ID" version="2.5">

	<!-- 
	配置 org.springframework.web.filter.HiddenHttpMethodFilter: 可以把 POST 请求转为 DELETE 或 POST 请求 
	-->
	<filter>
		<filter-name>HiddenHttpMethodFilter</filter-name>
		<filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
	</filter>
	
	<filter-mapping>
		<filter-name>HiddenHttpMethodFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	

</web-app>

```



- 表单页面

```
<form action="springmvc/test/1" method="post">
	<input type="hidden" name="_method" value="PUT" />
	<input type="submit" value="test PUT" />
</form>
```

```java
	/**
	 * Rest 风格的 URL. 以 CRUD 为例: 
	 *	新增: /order   POST 
	 *	修改: /order/1 PUT      update?id=1 
	 *	获取:/order/1  GET      get?id=1 
	 *	删除: /order/1 DELETE   delete?id=1
	 * 
	 * 如何发送 PUT 请求和 DELETE 请求呢 ? 1. 需要配置 HiddenHttpMethodFilter 2. 需要发送 POST 请求
	 * 3. 需要在发送 POST 请求时携带一个 name="_method" 的隐藏域, 值为 DELETE 或 PUT
	 * 
	 * 在 SpringMVC 的目标方法中如何得到 id 呢? 使用 @PathVariable 注解
	 * 
	 */
	@RequestMapping(value = "/testRest/{id}", method = RequestMethod.PUT)
	public String testRestPut(@PathVariable Integer id) {
		System.out.println("testRest Put: " + id);
		return SUCCESS;
	}

	@RequestMapping(value = "/testRest/{id}", method = RequestMethod.DELETE)
	public String testRestDelete(@PathVariable Integer id) {
		System.out.println("testRest Delete: " + id);
		return SUCCESS;
	}

	@RequestMapping(value = "/testRest", method = RequestMethod.POST)
	public String testRest() {
		System.out.println("testRest POST");
		return SUCCESS;
	}

	@RequestMapping(value = "/testRest/{id}", method = RequestMethod.GET)
	public String testRest(@PathVariable Integer id) {
		System.out.println("testRest GET: " + id);
		return SUCCESS;
	}

```



### 方法签名

- Spring MVC 通过分析处理方法的签名，将 HTTP 请求信  息绑定到处理方法的相应人参中



#### @RequestParam

- 在处理方法入参处使用 @RequestParam 可以把请求参  数传递给请求方法
- **value**：参数名
- **required**：是否必须。默认为true,表示请求参数中必须包含对应  的参数，若不存在，将抛出异常

```java
	/**
	 * @RequestParam 来映射请求参数. 
	 *	 value 值即请求参数的参数名 
	 *	 required 该参数是否必须. 默认为 true
	 *   defaultValue 请求参数的默认值 , 参数如果是int的话，前端如果没有传，为null，则传不过来，要么写Integer，要么给它一个默认值：defaultValue = "0"
	 */
	@RequestMapping(value = "/testRequestParam")
	public String testRequestParam(
			@RequestParam(value = "username") String un,
			@RequestParam(value = "age", required = false, defaultValue = "0") int age) {
		System.out.println("testRequestParam, username: " + un + ", age: "
				+ age);
		return SUCCESS;
	}

```



#### @RequestHeader

- 通过 @RequestHeader即可将请求头中的属性值绑定到处理方法的入参中

```java
	/**
	 * 了解: 映射请求头信息 用法同 @RequestParam
	 */
	@RequestMapping("/testRequestHeader")
	public String testRequestHeader(
			@RequestHeader(value = "Accept-Language") String al) {
		System.out.println("testRequestHeader, Accept-Language: " + al);
		return SUCCESS;
	}

```



#### @CookieValue

- **@CookieValue** 可让处理方法入参绑定某个Cookie值

```java
	/**
	 * 了解:
	 * 
	 * @CookieValue: 映射一个 Cookie 值. 属性同 @RequestParam
	 */
	@RequestMapping("/testCookieValue")
	public String testCookieValue(@CookieValue("JSESSIONID") String sessionId) {
		System.out.println("testCookieValue: sessionId: " + sessionId);
		return SUCCESS;
	}

```



### 对象参数

- Spring MVC 会按请求参数名和 POJO 属性名进行自动匹配，自动为该对象填充属性值。支持级联属性。  如：dept.deptId、dept.address.tel等

```java
	/**
	 * Spring MVC 会按请求参数名和 POJO 属性名进行自动匹配， 自动为该对象填充属性值。支持级联属性。
	 * 如：dept.deptId、dept.address.tel 等
	 */
	@RequestMapping("/testPojo")
	public String testPojo(User user) {
		System.out.println("testPojo: " + user);
		return SUCCESS;
	}

```



### servlet参数

```
MVC 的 Handler 方法可以接受:
HttpServletRequest
HttpServletResponse
HttpSession
java.security.Principal
Locale
InputStream
OutputStream
Reader
Writer

```



```java
@RequestMapping("/testServlet")
	public String testServlet(HttpServletRequest request,HttpServletResponse response) {
		
		return SUCCESS;
	}
```



### 模型数据

- **ModelAndView**: 处理方法返回值类型为 ModelAndView时,方法体即可通过该对象添加模型数据
- **Map** **及** **Model**:入参为  org.springframework.ui.Model、org.springframework.ui.  ModelMap 或 java.uti.Map 时，处理方法返回时，Map  中的数据会自动添加到模型中
- **@SessionAttributes**: 将模型中的某个属性暂存到HttpSession 中，以便多个请求之间可以共享这个属性
- **@ModelAttribute**: 方法入参标注该注解后, 入参的对象  就会放到数据模型中



#### ModelAndView

- 控制器处理方法的返回值如果为ModelAndView,则其既  包含视图信息，也包含模型数据信息

```java
	/**
	 * 目标方法的返回值可以是 ModelAndView 类型。 
	 * 其中可以包含视图和模型信息
	 * SpringMVC 会把 ModelAndView 的 model 中数据放入到 request 域对象中. 
	 * @return
	 */
	@RequestMapping("/testModelAndView")
	public ModelAndView testModelAndView(){
		String viewName = SUCCESS;
		ModelAndView modelAndView = new ModelAndView(viewName);
		
		//添加模型数据到 ModelAndView 中.
		modelAndView.addObject("time", new Date());
		
		return modelAndView;
	}

```



#### Map&Model

- Spring MVC 在内部使用了一个  org.springframework.ui.Model接口存  储模型数据
- SpringMVC在调用方法前会创建一个隐  含的模型对象作为模型数据的存储容器
- 如果方法的入参为 Map 或 Model 类  型，SpringMVC 会将隐含模型的引用传递给这些入参
- 在方法体内，开发者可以  通过这个入参对象访问到模型中的所有数  据，也可以向模型中添加新的属性数据

```java
	/**
	 * 目标方法可以添加 Map 类型(实际上也可以是 Model 类型或 ModelMap 类型)的参数. 
	 * @param map
	 * @return
	 */
	@RequestMapping("/testMap")
	public String testMap(Map<String, Object> map){
		System.out.println(map.getClass().getName()); 
		map.put("names", Arrays.asList("Tom", "Jerry", "Mike"));
		return SUCCESS;
	}

```



#### @SessionAttributes

- 若希望在多个请求之间共用某个模型属性数据，则可以在  控制器类上标注一个 @SessionAttributes,Spring MVC将在模型中对应的属性暂存到HttpSession中
- @SessionAttributes除了可以通过**属性名**指定需要放到会  话中的属性外，还可以通过模型属性的**对象类型**指定哪些  模型属性需要放到会话中

```
@SessionAttributes(types=User.class) 会将隐含模型中所有类型为 User.class 的属性添加到会话中。
@SessionAttributes(value={“user1”, “user2”})
@SessionAttributes(types={User.class, Dept.class})
@SessionAttributes(value={“user1”, “user2”},  types={Dept.class})
```

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SessionAttribute {

	/**
	 * Alias for {@link #name}.
	 */
	@AliasFor("name")
	String value() default "";

	/**
	 * The name of the session attribute to bind to.
	 * <p>The default name is inferred from the method parameter name.
	 */
	@AliasFor("value")
	String name() default "";

	/**
	 * Whether the session attribute is required.
	 * <p>Defaults to {@code true}, leading to an exception being thrown
	 * if the attribute is missing in the session or there is no session.
	 * Switch this to {@code false} if you prefer a {@code null} or Java 8
	 * {@code java.util.Optional} if the attribute doesn't exist.
	 */
	boolean required() default true;

}

```

```java
@SessionAttributes(value={"user"}, types={String.class})
@RequestMapping("/springmvc")
@Controller
public class SpringMVCTest {
	/**
	 * @SessionAttributes 除了可以通过属性名指定需要放到会话中的属性外(实际上使用的是 value 属性值),
	 * 还可以通过模型属性的对象类型指定哪些模型属性需要放到会话中(实际上使用的是 types 属性值)
	 * 
	 * 注意: 该注解只能放在类的上面. 而不能修饰放方法. 
	 */
	@RequestMapping("/testSessionAttributes")
	public String testSessionAttributes(Map<String, Object> map){
		User user = new User("Tom", "123456", "tom@atguigu.com", 15);
		map.put("user", user);
		map.put("school", "atguigu");
		return SUCCESS;
	}
}

```



#### 异常

- SpringMVC会先从标注 @ModelAttribute 注解的方法里面去找，查找是否有对应的值，如果没有 ，则会强制从@SessionAttributes里面去找，如果还没有找到，那么就会抛出异常

#### @ModelAttribute

- 在方法定义上使用 @ModelAttribute 注解：Spring MVC在调用目标处理方法前，会先逐个调用在方法级上标注了@ModelAttribute的方法
- 在方法的入参前使用 @ModelAttribute 注解：可以从隐含对象中获取隐含的模型数据中获取对象，再将请求参数绑定到对象中，再传入入参.将方法入参对象添加到模型中
  

```
	<!--  
		模拟修改操作
		1. 原始数据为: 1, Tom, 123456,tom@atguigu.com,12
		2. 密码不能被修改.
		3. 表单回显, 模拟操作直接在表单填写对应的属性值
	-->
	<form action="springmvc/testModelAttribute" method="Post">
		<input type="hidden" name="id" value="1"/>
		username: <input type="text" name="username" value="Tom"/>
		<br>
		email: <input type="text" name="email" value="tom@atguigu.com"/>
		<br>
		age: <input type="text" name="age" value="12"/>
		<br>
		<input type="submit" value="Submit"/>
	</form>

```

```java

	/**
	 * 1. 有 @ModelAttribute 标记的方法, 会在每个目标方法执行之前被 SpringMVC 调用! 
	 * 2. @ModelAttribute 注解也可以来修饰目标方法 POJO 类型的入参, 其 value 属性值有如下的作用:
	 * 1). SpringMVC 会使用 value 属性值在 implicitModel 中查找对应的对象, 若存在则会直接传入到目标方法的入参中.
	 * 2). SpringMVC 会以 value 为 key, POJO 类型的对象为 value, 存入到 request 中. 
	 */
	@ModelAttribute
	public void getUser(@RequestParam(value="id",required=false) Integer id, 
			Map<String, Object> map){
		System.out.println("modelAttribute method");
		if(id != null){
			//模拟从数据库中获取对象
			User user = new User(1, "Tom", "123456", "tom@atguigu.com", 12);
			System.out.println("从数据库中获取一个对象: " + user);
			
			map.put("user", user);
		}
	}
	
	/**
	  运行流程:
	  1. 执行 @ModelAttribute 注解修饰的方法: 从数据库中取出对象, 把对象放入到了 Map 中. 键为: user
	  2. SpringMVC 从 Map 中取出 User 对象, 并把表单的请求参数赋给该 User 对象的对应属性.
	  3. SpringMVC 把上述对象传入目标方法的参数. 
	  
	  注意: 在 @ModelAttribute 修饰的方法中, 放入到 Map 时的键需要和目标方法入参类型的第一个字母小写的字符串一致!
----------------------------------------------------------------------------------	  
	  SpringMVC 确定目标方法 POJO 类型入参的过程
	  1. 确定一个 key:
	  1). 若目标方法的 POJO 类型的参数木有使用 @ModelAttribute 作为修饰, 则 key 为 POJO 类名第一个字母的小写
	  2). 若使用了  @ModelAttribute 来修饰, 则 key 为 @ModelAttribute 注解的 value 属性值. 
	  
	  2. 在 implicitModel 中查找 key 对应的对象, 若存在, 则作为入参传入
	  1). 若在 @ModelAttribute 标记的方法中在 Map 中保存过, 且 key 和 1 确定的 key 一致, 则会获取到. 
	  
	  3. 若 implicitModel 中不存在 key 对应的对象, 则检查当前的 Handler 是否使@SessionAttributes 注解修饰, 若使用了该注解, 且 @SessionAttributes 注解的 value 属性值中包含了 key, 则会从HttpSession 中来获取 key 所对应的 value 值, 若存在则直接传入到目标方法的入参中. 若不存在则将抛出异常. 
	  
	  4. 若 Handler 没有标识 @SessionAttributes 注解或 @SessionAttributes 注解的 value 值中不包含 key, 则会通过反射来创建 POJO 类型的参数, 传入为目标方法的参数
	  
	  5. SpringMVC 会把 key 和 POJO 类型的对象保存到 implicitModel 中, 进而会保存到 request 中. 

---------------------------------------------------------------------------------
	  源代码分析的流程
	  1. 调用 @ModelAttribute 注解修饰的方法. 实际上把 @ModelAttribute 方法中 Map 中的数据放在了 implicitModel 中.
	  2. 解析请求处理器的目标参数, 实际上该目标参数来自于 WebDataBinder 对象的 target 属性
	  1). 创建 WebDataBinder 对象:
	  ①. 确定 objectName 属性: 若传入的 attrName 属性值为 "", 则 objectName 为类名第一个字母小写. 
	 注意: attrName. 若目标方法的 POJO 属性使用了 @ModelAttribute 来修饰, 则 attrName 值即为 @ModelAttribute 的 value 属性值 
	  
	  ②. 确定 target 属性:
	  	 在 implicitModel 中查找 attrName 对应的属性值. 若存在, ok，若不存在: 则验证当前 Handler 是否使用了 @SessionAttributes 进行修饰, 若使用了, 则尝试从 Session 中获取 attrName 所对应的属性值. 若 session 中没有对应的属性值, 则抛出了异常.  若 Handler 没有使用 @SessionAttributes 进行修饰, 或 @SessionAttributes 中没有使用 value 值指定的 key和 attrName 相匹配, 则通过反射创建了 POJO 对象
	  
	  2). SpringMVC 把表单的请求参数赋给了 WebDataBinder 的 target 对应的属性. 
	  3). SpringMVC 会把 WebDataBinder 的 attrName 和 target 给到 implicitModel. 
	  近而传到 request 域对象中. 
	  4). 把 WebDataBinder 的 target 作为参数传递给目标方法的入参. 
	 */
	@RequestMapping("/testModelAttribute")
	public String testModelAttribute(User user){
		System.out.println("修改: " + user);
		return SUCCESS;
	}

```

