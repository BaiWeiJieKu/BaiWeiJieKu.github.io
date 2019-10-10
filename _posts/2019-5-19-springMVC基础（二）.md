---
layout: post
title: "springMVC基础（二）"
categories: springMVC
tags: springMVC
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 国际化

- i18n.properties：

```properties
i18n.username=Username
i18n.password=Password
```

- i18n_en_US.properties：

```properties
i18n.username=Username
i18n.password=Password
```

- i18n_zh_CN.properties：

```properties
i18n.username=\u7528\u6237\u540D
i18n.password=\u5BC6\u7801
```



#### 配置文件

```xml
	<!-- 配置国际化资源文件 -->
	<bean id="messageSource"
		class="org.springframework.context.support.ResourceBundleMessageSource">
		<property name="basename" value="i18n"></property>	
	</bean>

```



#### 页面

```html
	<fmt:message key="i18n.username"></fmt:message>
	<br><br>
	
	<fmt:message key="i18n.password"></fmt:message>
	<br><br>

```

- 这个时候，我们切换浏览器的语言，就有国际化的效果了；



### view-controller

- 这样配置的话，就直接输入url就可以到指定的页面，而不需要经过Controller的映射
- 果不加`<mvc:annotation-driven></mvc:annotation-driven>`这个配置，那么以前通过`@RequestMapping("/success")`映射的就不好使了
- 通常这两个是需要一起来用的

```xml
	<!-- 配置直接转发的页面 -->
	<!-- 可以直接相应转发的页面, 而无需再经过 Handler 的方法.  -->
	<mvc:view-controller path="/success" view-name="success"/>
	
	<!-- 在实际开发中通常都需配置 mvc:annotation-driven 标签 -->
	<mvc:annotation-driven></mvc:annotation-driven>

```



### 视图

- **视图**的作用是渲染模型数据，将模型里的数据以某种形式呈现给客户
- 为了实现视图模型和具体实现技术的解耦，Spring 在  org.springframework.web.servlet包中定义了一个高度抽象的 **View**  接口
- 视图对象由视图解析器负责实例化。由于视图是无状态的，所以他们不会有线程安全的问题



#### 自定义视图

```java
@Component
public class HelloView implements View{

	@Override
	public String getContentType() {
		return "text/html";
	}

	@Override
	public void render(Map<String, ?> model, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		response.getWriter().print("hello view, time: " + new Date());
	}

}

```

```xml
	
	<!-- 配置视图  BeanNameViewResolver 解析器: 使用视图的名字来解析视图 -->
	<!-- 通过 order 属性来定义视图解析器的优先级, order 值越小优先级越高 -->
	<bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
		<property name="order" value="100"></property>
	</bean>
	

```



### 重定向

- 如果返回的字符串中带 forward: 或 redirect: 前缀  时，SpringMVC会对他们进行特殊处理：将forward: 和  redirect: 当成指示符，其后的字符串作为 URL 来处理

- redirect:success.jsp：会完成一个到success.jsp 的重定向的操作

- forward:success.jsp：会完成一个到success.jsp 的转发操作

```java
	@RequestMapping("/testRedirect")
	public String testRedirect(){
		System.out.println("testRedirect");
		return "redirect:/index.jsp";
	}

```



### RESTFUL-CRUD

#### web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	id="WebApp_ID" version="2.5">

	<!-- 配置 SpringMVC 的 DispatcherServlet -->
	<!-- The front controller of this Spring Web application, responsible for handling all application requests -->
	<servlet>
		<servlet-name>springDispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<!-- Map all requests to the DispatcherServlet for handling -->
	<servlet-mapping>
		<servlet-name>springDispatcherServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
	
	<!-- 配置 HiddenHttpMethodFilter: 把 POST 请求转为 DELETE、PUT 请求 -->
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



#### controller

```java
@Controller
public class EmployeeHandler {

	@Autowired
	private EmployeeDao employeeDao;
	
	@Autowired
	private DepartmentDao departmentDao;


	@RequestMapping("/emps")
	public String list(Map<String, Object> map){
		map.put("employees", employeeDao.getAll());
		return "list";
	}
	

	
}

```



#### jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<!--  
	SpringMVC 处理静态资源:
	1. 为什么会有这样的问题:
	优雅的 REST 风格的资源URL 不希望带 .html 或 .do 等后缀
	若将 DispatcherServlet 请求映射配置为 /, 
	则 Spring MVC 将捕获 WEB 容器的所有请求, 包括静态资源的请求, SpringMVC 会将他们当成一个普通请求处理, 
	因找不到对应处理器将导致错误。
	2. 解决: 在 SpringMVC 的配置文件中配置 <mvc:default-servlet-handler/>
-->
<script type="text/javascript" src="scripts/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
	$(function(){
		$(".delete").click(function(){
			var href = $(this).attr("href");
			$("form").attr("action", href).submit();			
			return false;
		});
	})
</script>
</head>
<body>
	
	<form action="" method="POST">
		<input type="hidden" name="_method" value="DELETE"/>
	</form>
	
	<c:if test="${empty requestScope.employees }">
		没有任何员工信息.
	</c:if>
	<c:if test="${!empty requestScope.employees }">
		<table border="1" cellpadding="10" cellspacing="0">
			<tr>
				<th>ID</th>
				<th>LastName</th>
				<th>Email</th>
				<th>Gender</th>
				<th>Department</th>
				<th>Edit</th>
				<th>Delete</th>
			</tr>
			
			<c:forEach items="${requestScope.employees }" var="emp">
				<tr>
					<td>${emp.id }</td>
					<td>${emp.lastName }</td>
					<td>${emp.email }</td>
					<td>${emp.gender == 0 ? 'Female' : 'Male' }</td>
					<td>${emp.department.departmentName }</td>
					<td><a href="emp/${emp.id}">Edit</a></td>
					<td><a class="delete" href="emp/${emp.id}">Delete</a></td>
				</tr>
			</c:forEach>
		</table>
	</c:if>
	
	<br><br>
	
	<a href="emp">Add New Employee</a>
	
</body>
</html>

```



#### 添加操作

```html
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

	<form action="testConversionServiceConverer" method="POST">
		<!-- lastname-email-gender-department.id 例如: GG-gg@atguigu.com-0-105 -->
		Employee: <input type="text" name="employee"/>
		<input type="submit" value="Submit"/>
	</form>
	<br><br>
	
	<!--  
		1. WHY 使用 form 标签呢 ?
		可以更快速的开发出表单页面, 而且可以更方便的进行表单值的回显
		2. 注意:
		可以通过 modelAttribute 属性指定绑定的模型属性,
		若没有指定该属性，则默认从 request 域对象中读取 command 的表单 bean
		如果该属性值也不存在，则会发生错误。
	-->
	<br><br>
	<form:form action="${pageContext.request.contextPath }/emp" method="POST" 
		modelAttribute="employee">
		
		<form:errors path="*"></form:errors>
		<br>
		
		<c:if test="${employee.id == null }">
			<!-- path 属性对应 html 表单标签的 name 属性值 -->
			LastName: <form:input path="lastName"/>
			<form:errors path="lastName"></form:errors>
		</c:if>
		<c:if test="${employee.id != null }">
			<form:hidden path="id"/>
			<input type="hidden" name="_method" value="PUT"/>
			<%-- 对于 _method 不能使用 form:hidden 标签, 因为 modelAttribute 对应的 bean 中没有 _method 这个属性 --%>
			<%-- 
			<form:hidden path="_method" value="PUT"/>
			--%>
		</c:if>
		
		<br>
		Email: <form:input path="email"/>
		<form:errors path="email"></form:errors>
		<br>
		<% 
			Map<String, String> genders = new HashMap();
			genders.put("1", "Male");
			genders.put("0", "Female");
			
			request.setAttribute("genders", genders);
		%>
		Gender: 
		<br>
		<form:radiobuttons path="gender" items="${genders }" delimiter="<br>"/>
		<br>
		Department: <form:select path="department.id" 
			items="${departments }" itemLabel="departmentName" itemValue="id"></form:select>
		<br>
		<!--  
			1. 数据类型转换
			2. 数据类型格式化
			3. 数据校验. 
			1). 如何校验 ? 注解 ?
			①. 使用 JSR 303 验证标准
			②. 加入 hibernate validator 验证框架的 jar 包
			③. 在 SpringMVC 配置文件中添加 <mvc:annotation-driven />
			④. 需要在 bean 的属性上添加对应的注解
			⑤. 在目标方法 bean 类型的前面添加 @Valid 注解
			2). 验证出错转向到哪一个页面 ?
			注意: 需校验的 Bean 对象和其绑定结果对象或错误对象时成对出现的，它们之间不允许声明其他的入参
			3). 错误消息 ? 如何显示, 如何把错误消息进行国际化
		-->
		Birth: <form:input path="birth"/>
		<form:errors path="birth"></form:errors>
		<br>
		Salary: <form:input path="salary"/>
		<br>
		<input type="submit" value="Submit"/>
	</form:form>
	
</body>
</html>

```

```java
	@RequestMapping(value="/emp", method=RequestMethod.POST)
	public String save(@Valid Employee employee, Errors result, 
			Map<String, Object> map){
		System.out.println("save: " + employee);
		
		if(result.getErrorCount() > 0){
			System.out.println("出错了!");
			
			for(FieldError error:result.getFieldErrors()){
				System.out.println(error.getField() + ":" + error.getDefaultMessage());
			}
			
			//若验证出错, 则转向定制的页面
			map.put("departments", departmentDao.getDepartments());
			return "input";
		}
		
		employeeDao.save(employee);
		return "redirect:/emps";
	}

```



#### 删除操作

```java
	@RequestMapping(value="/emp/{id}", method=RequestMethod.DELETE)
	public String delete(@PathVariable("id") Integer id){
		employeeDao.delete(id);
		return "redirect:/emps";
	}

```



#### 修改操作

```java
	@RequestMapping(value="/emp", method=RequestMethod.PUT)
	public String update(Employee employee){
		employeeDao.save(employee);
		
		return "redirect:/emps";
	}
	
	@RequestMapping(value="/emp/{id}", method=RequestMethod.GET)
	public String input(@PathVariable("id") Integer id, Map<String, Object> map){
		map.put("employee", employeeDao.get(id));
		map.put("departments", departmentDao.getDepartments());
		return "input";
	}
	

```



### 静态资源

- 优雅的REST风格的资源URL不希望带.html或.do等后缀
- 若将 DispatcherServlet 请求映射配置为/，则Spring MVC将捕获  WEB 容器的所有请求，包括静态资源的请求， SpringMVC 会将他 们当成一个普通请求处理，因找不到对应处理器将导致错误
- 可以在 SpringMVC 的配置文件中配置`<mvc:default-servlet-  handler/> `的方式解决静态资源的问题

- `<mvc:default-servlet-handler/>` 将在SpringMVC
  上下文中定义一个  **DefaultServletHttpRequestHandler**，它会对进入DispatcherServlet的  请求进行筛查，如果发现是没有经过映射的请求，就将该请求交由WEB  应用服务器默认的 Servlet 处理，如果不是静态资源的请求，才由  DispatcherServlet继续处理
- 一般 WEB应用服务器默认的Servlet的名称都是default。若所使用的WEB 服务器(比如Tomcat服务器)的默认 Servlet 名称不是 default，则需要通过default-  servlet-name 属性显式指定

```xml
	<!--  
		default-servlet-handler 将在 SpringMVC 上下文中定义一个 DefaultServletHttpRequestHandler,
		它会对进入 DispatcherServlet 的请求进行筛查, 如果发现是没有经过映射的请求, 就将该请求交由 WEB 应用服务器默认的 
		Servlet 处理. 如果不是静态资源的请求，才由 DispatcherServlet 继续处理

		一般 WEB 应用服务器默认的 Servlet 的名称都是 default.
		若所使用的 WEB 服务器的默认 Servlet 名称不是 default，则需要通过 default-servlet-name 属性显式指定
		
	-->
	<mvc:default-servlet-handler/>
	<!-- 注册自定义转换器 -->
	<mvc:annotation-driven conversion-service="conversionService"></mvc:annotation-driven>

```



#### 方式一

- 若将 DispatcherServlet 请求映射配置为/，表示拦截静态资源但不拦截动态资源，若想访问静态资源，可在web.xml中直接进行配置，不需要配置springmvc.xml

```xml
	<!--servlet静态资源配置在Tomcat的web.xml中，名称默认为default-->
	<servlet-mapping>
		<servlet-name>default</servlet-name>
		<url-pattern>*.jpg</url-pattern>
	</servlet-mapping>
	<servlet-mapping>
		<servlet-name>default</servlet-name>
		<url-pattern>*.css</url-pattern>
	</servlet-mapping>
	<servlet-mapping>
		<servlet-name>default</servlet-name>
		<url-pattern>*.js</url-pattern>
	</servlet-mapping>
	
	
	<servlet>
		<servlet-name>springDispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<!-- Map all requests to the DispatcherServlet for handling -->
	<servlet-mapping>
		<servlet-name>springDispatcherServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
```



#### 方式二

- 若将 DispatcherServlet 请求映射配置为/，表示拦截静态资源但不拦截动态资源，若想访问静态资源，可在web.xml中进行配置，并且配合springmvc.xml进行使用

```xml
<servlet>
		<servlet-name>springDispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<!-- Map all requests to the DispatcherServlet for handling -->
	<servlet-mapping>
		<servlet-name>springDispatcherServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
```

```xml
<!--
location表示静态资源的位置
mapping表示实际的请求格式
如果格式对应，他就会把请求交给DefaultServletHttpRequestHandler处理
这种方式存在局限性，不推荐使用
-->
<mvc:resources location="/images/" mapping="/images/**" />
```



#### 路径问题

- 前台路径

```html
<!--
这个路径出现在jsp页面中，所以是前台路径
前台路径的参考路径为：当前web服务器的根：http://127.0.0.1:8080
因为绝对路径=参考路径+相对路径
多以当前超链接提交的请求绝对路径为：
http://127.0.0.1:8080/hello.do
这是访问不到资源的
-->
<a href="/hello.do">

<!--
这个路径没有以/开头，所以其参照路径为当前的访问路径：http://127.0.0.1:8080/testDemo/
因为绝对路径=参考路径+相对路径
多以当前超链接提交的请求绝对路径为：
http://127.0.0.1:8080/testDemo/hello.do
就可以访问到资源了
-->
<a href="hello.do">
```



- 后台路径

```java
/*
这个路径出现在java文件中，所以是后台路径，后台路径的参照路径是：web应用的根目录
当前web应用的根路径是：http://127.0.0.1:8080/testDemo
现在要求的绝对路径是：参照路径+相对路径
http://127.0.0.1:8080/testDemo/hello.do
可以访问
*/
@RequestMapping("/hello.do")
```



### 数据转换

- 前端传一个字符串

```jsp

	<form action="testConversionServiceConverer" method="POST">
		<!-- lastname-email-gender-department.id 例如: GG-gg@atguigu.com-0-105 -->
		Employee: <input type="text" name="employee"/>
		<input type="submit" value="Submit"/>
	</form>

```

- controller

```java
	@RequestMapping("/testConversionServiceConverer")
	public String testConverter(@RequestParam("employee") Employee employee){
		System.out.println("save: " + employee);
		employeeDao.save(employee);
		return "redirect:/emps";
	}

```

- 自定义转换器

```java
@Component
public class EmployeeConverter implements Converter<String, Employee> {

	@Override
	public Employee convert(String source) {
		if(source != null){
			String [] vals = source.split("-");
			//GG-gg@atguigu.com-0-105
			if(vals != null && vals.length == 4){
				String lastName = vals[0];
				String email = vals[1];
				Integer gender = Integer.parseInt(vals[2]);
				Department department = new Department();
				department.setId(Integer.parseInt(vals[3]));
				
				Employee employee = new Employee(null, lastName, email, gender, department);
				System.out.println(source + "--convert--" + employee);
				return employee;
			}
		}
		return null;
	}

}

```

- 配置

```xml

	<mvc:annotation-driven conversion-service="conversionService"></mvc:annotation-driven>
	
	<!-- 配置 ConversionService -->
	<bean id="conversionService"
		class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
		<property name="converters">
			<set>
				<ref bean="employeeConverter"/>
			</set>
		</property>	
	</bean>

```

- 这个时候，我们再来试，就已经把字符串转成了Employee对象了；



### annotation-driven

- `<mvc:annotation-driven />` 会自动注  册RequestMappingHandlerMapping、RequestMappingHandlerAdapter 与ExceptionHandlerExceptionResolver  三个bean
- 支持使用**ConversionService** 实例对表单参数进行类型转换
- 支持使用 @NumberFormat annotation、@DateTimeFormat注解完成数据类型的格式化
- 支持使用 **@Valid** 注解对JavaBean实例进行JSR303验证
- 支持使用**@RequestBody** 和**@ResponseBody** 注解



### @initBinder

- 由 @InitBinder 标识的方法，可以对 WebDataBinder 对  象进行初始化。WebDataBinder是DataBinder的子类，用  于完成由表单字段到 JavaBean 属性的绑定
- @InitBinder方法不能有返回值，它必须声明为void
- @InitBinder方法的参数通常是是 WebDataBinder

```java
	@InitBinder
	public void initBinder(WebDataBinder binder){
		binder.setDisallowedFields("lastName");
	}
//这个时候，lastName是不进行赋值的
```



### 数据格式化

```java
public class Employee {

	private Integer id;
	@NotEmpty
	private String lastName;

	@Email
	private String email;
	//1 male, 0 female
	private Integer gender;
	
	private Department department;
	
	@Past
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private Date birth;
	
	@NumberFormat(pattern="#,###,###.#")
	private Float salary;
}

```

```xml
	<mvc:annotation-driven conversion-service="conversionService"></mvc:annotation-driven>	
	
	<!-- 配置 ConversionService -->
	<bean id="conversionService"
		class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
		<property name="converters">
			<set>
				<ref bean="employeeConverter"/>
			</set>
		</property>	
	</bean>

```

- 这样写的话，我们即能使用自己定义的类型转换器，又能使用`@DateTimeFormat`和`@NumberFormat`这两个注解



### 数据校验

#### 空检查

```properties
@Null 验证对象是否为null 
@NotNull 验证对象是否不为null, 无法查检长度为0的字符串 
@NotBlank 检查约束字符串是不是Null还有被Trim的长度是否大于0,只对字符串,且会去掉前后空格. 
@NotEmpty 检查约束元素是否为NULL或者是EMPTY
```



#### 真假检查

```properties
@AssertTrue 验证 Boolean 对象是否为 true 
@AssertFalse 验证 Boolean 对象是否为 false
```



#### 长度检查

```properties
@Size(min=, max=) 验证对象（Array,Collection,Map,String）长度是否在给定的范围之内
```



#### 日期检查

```properties
@Past 验证 Date 和 Calendar 对象是否在当前时间之前，验证成立的话被注释的元素一定是一个过去的日期

@Future 验证 Date 和 Calendar 对象是否在当前时间之后 ，验证成立的话被注释的元素一定是一个将来的日期

@Pattern 验证 String 对象是否符合正则表达式的规则，被注释的元素符合制定的正则表达式，
regexp:正则表达式 
flags: 指定 Pattern.Flag 的数组，表示正则表达式的相关选项

```



#### 数值检查

```properties
@Min 验证 Number 和 String 对象是否大等于指定的值 

@Max 验证 Number 和 String 对象是否小等于指定的值

@DecimalMax 被标注的值必须不大于约束中指定的最大值. 这个约束的参数是一个通过BigDecimal定义的最大值的字符串表示.小数存在精度

@DecimalMin 被标注的值必须不小于约束中指定的最小值. 这个约束的参数是一个通过BigDecimal定义的最小值的字符串表示.小数存在精度

@Digits 验证 Number 和 String 的构成是否合法

@Digits(integer=,fraction=) 验证字符串是否是符合指定格式的数字，interger指定整数精度，fraction指定小数精度

@Range(min=, max=) 被指定的元素必须在合适的范围内 

@Valid 递归的对关联对象进行校验, 如果关联对象是个集合或者数组,那么对其中的元素进行递归校验,如果是一个map,则对其中的值部分进行校验.(是否进行递归验证) 

@CreditCardNumber信用卡验证 

@Email 验证是否是邮件地址，如果为null,不进行验证，算通过验证。 


```



```java
public class Order {
    // 必须不为 null, 大小是 10
    @NotNull
    @Size(min = 10, max = 10)
    private String orderId;
    // 必须不为空
    @NotEmpty
    private String customer;
    // 必须是一个电子信箱地址
    @Email
    private String email;
    // 必须不为空
    @NotEmpty
    private String address;
    // 必须不为 null, 必须是下面四个字符串'created', 'paid', 'shipped', 'closed'其中之一
    // @Status 是一个定制化的 contraint
    @NotNull
    @Status
    private String status;
    // 必须不为 null
    @NotNull
    private Date createDate;
    // 嵌套验证
    @Valid
    private Product product;
 
   // getter 和setter方法
}
```

```java
    @NotNull(message = "adultTax不能为空")
    private Integer adultTax;
 
    @NotNull(message = "adultTaxType不能为空")
    @Min(value = 0, message = "adultTaxType 的最小值为0")
    @Max(value = 1, message = "adultTaxType 的最大值为1")
    private Integer adultTaxType;
 
    @NotNull(message = "reason信息不可以为空")
    @Pattern(regexp = "[1-7]{1}", message = "reason的类型值为1-7中的一个类型")
    private String reason;//订单取消原因
```

