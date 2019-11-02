---
layout: post
title: "springMVC基础（三）"
categories: springMVC
tags: springMVC
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### JSON

- 在方法上添加 @ResponseBody 注解
- `HttpMessageConverter<T>` 是 Spring3.0新添加的一个接  口，负责将请求信息转换为一个对象（类型为 T），将对象（  类型为 T）输出为响应信息

```java
	@RequestMapping("/testResponseEntity")
	public ResponseEntity<byte[]> testResponseEntity(HttpSession session) throws IOException{
		byte [] body = null;
		ServletContext servletContext = session.getServletContext();
		InputStream in = servletContext.getResourceAsStream("/files/abc.txt");
		body = new byte[in.available()];
		in.read(body);
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Disposition", "attachment;filename=abc.txt");
		
		HttpStatus statusCode = HttpStatus.OK;
		
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(body, headers, statusCode);
		return response;
	}

```



### 文件上传

```java
	@RequestMapping("/testFileUpload")
	public String testFileUpload(@RequestParam("desc") String desc, 
			@RequestParam("file") MultipartFile file) throws IOException{
		System.out.println("desc: " + desc);
		System.out.println("OriginalFilename: " + file.getOriginalFilename());
		System.out.println("InputStream: " + file.getInputStream());
		return "success";
	}

```



### 拦截器

- 自定义的拦截器必  须实现HandlerInterceptor接口
- **preHandle**()：这个方法在业务处理器处理请求之前被调用，在该  方法中对用户请求request进行处理

- postHandle()：这个方法在业务处理器处理完请求后，但  是DispatcherServlet 向客户端返回响应前被调用，在该方法中对  用户请求request进行处理。

- **afterCompletion**()：这个方法**在** **DispatcherServlet** **完全处理完请  求后被调用**，可以在该方法中进行一些资源清理的操作

```java

public class FirstInterceptor implements HandlerInterceptor{

	/**
	 * 该方法在目标方法之前被调用.
	 * 若返回值为 true, 则继续调用后续的拦截器和目标方法. 
	 * 若返回值为 false, 则不会再调用后续的拦截器和目标方法. 
	 * 
	 * 可以考虑做权限. 日志, 事务等. 
	 */
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		System.out.println("[FirstInterceptor] preHandle");
		return true;
	}

	/**
	 * 调用目标方法之后, 但渲染视图之前. 
	 * 可以对请求域中的属性或视图做出修改. 
	 */
	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println("[FirstInterceptor] postHandle");
	}

	/**
	 * 渲染视图之后被调用. 释放资源
	 */
	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("[FirstInterceptor] afterCompletion");
	}

}


```



### 异常处理

- Spring MVC 通过 **HandlerExceptionResolver** 处理程序  的异常，包括 Handler 映射、数据绑定以及目标方法执行  时发生的异常

```java
	/**
	 * 1. 在 @ExceptionHandler 方法的入参中可以加入 Exception 类型的参数, 该参数即对应发生的异常对象
	 * 2. @ExceptionHandler 方法的入参中不能传入 Map. 若希望把异常信息传导页面上, 需要使用 ModelAndView 作为返回值
	 * 3. @ExceptionHandler 方法标记的异常有优先级的问题. 
	 * 4. @ControllerAdvice: 如果在当前 Handler 中找不到 @ExceptionHandler 方法来出来当前方法出现的异常, 
	 * 则将去 @ControllerAdvice 标记的类中查找 @ExceptionHandler 标记的方法来处理异常. 
	 */
	@ExceptionHandler({ArithmeticException.class})
	public ModelAndView handleArithmeticException(Exception ex){
		System.out.println("出异常了: " + ex);
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("exception", ex);
		return mv;
	}

```



- 全局异常处理

```java
@ControllerAdvice
public class SpringMVCTestExceptionHandler {

	@ExceptionHandler({ArithmeticException.class})
	public ModelAndView handleArithmeticException(Exception ex){
		System.out.println("----> 出异常了: " + ex);
		ModelAndView mv = new ModelAndView("error");
		mv.addObject("exception", ex);
		return mv;
	}
	
}

```



- @ResponseStatus

```java
@ResponseStatus(value=HttpStatus.FORBIDDEN, reason="用户名和密码不匹配!")
public class UserNameNotMatchPasswordException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	
}

```

```java
	@ResponseStatus(reason="测试",value=HttpStatus.NOT_FOUND)
	@RequestMapping("/testResponseStatusExceptionResolver")
	public String testResponseStatusExceptionResolver(@RequestParam("i") int i){
		if(i == 13){
			throw new UserNameNotMatchPasswordException();
		}
		System.out.println("testResponseStatusExceptionResolver...");
		
		return "success";
	}

```



#### 映射异常

```xml
	<!-- 配置使用 SimpleMappingExceptionResolver 来映射异常 -->
	<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
		<property name="exceptionAttribute" value="ex"></property>
		<property name="exceptionMappings">
			<props>
				<prop key="java.lang.ArrayIndexOutOfBoundsException">error</prop>
			</props>
		</property>
	</bean>	


```



### 工作原理

- 客户端发送请求-> 前端控制器 DispatcherServlet 接受客户端请求 -> 找到处理器映射 HandlerMapping 解析请求对应的 Handler-> HandlerAdapter 会根据 Handler 来调用真正的处理器开处理请求，并处理相应的业务逻辑 -> 处理器返回一个模型视图 ModelAndView -> 视图解析器进行解析 -> 返回一个视图对象->前端控制器 DispatcherServlet 渲染数据（Moder）->将得到视图对象返回给用户

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/mvc.png)

- 流程
  - （1）客户端（浏览器）发送请求，直接请求到 DispatcherServlet。
  - （2）DispatcherServlet 根据请求信息调用 HandlerMapping，解析请求对应的 Handler。
  - （3）解析到对应的 Handler（也就是我们平常说的 Controller 控制器）后，开始由 HandlerAdapter 适配器处理。
  - （4）HandlerAdapter 会根据 Handler 来调用真正的处理器开处理请求，并处理相应的业务逻辑。
  - （5）处理器处理完业务后，会返回一个 ModelAndView 对象，Model 是返回的数据对象，View 是个逻辑上的 View。
  - （6）ViewResolver 会根据逻辑 View 查找实际的 View。
  - （7）DispaterServlet 把返回的 Model 传给 View（视图渲染）。
  - （8）把 View 返回给请求者（浏览器）

### 重要组件

#### 前端控制器

- **前端控制器DispatcherServlet（不需要工程师开发）,由框架提供（重要）**
- **Spring MVC 的入口函数。接收请求，响应结果，相当于转发器，中央处理器。**
- **有了 DispatcherServlet 减少了其它组件之间的耦合度。**
- **用户请求到达前端控制器，它就相当于mvc模式中的c，DispatcherServlet是整个流程控制的中心，由它调用其它组件处理用户的请求，DispatcherServlet的存在降低了组件之间的耦合性。**
- DispatcherServlet类中的属性beans：
  - HandlerMapping：用于handles映射请求和一系列的对于拦截器的前处理和后处理，大部分用@Controller注解
  - HandlerAdapter：帮助DispatcherServlet处理映射请求，处理程序的适配器，而不用考虑实际调用的是哪一个处理程序。
  - ViewResolver：根据实际配置解析实际的View类型。
  - ThemeResolver：解决Web应用程序可以使用的主题，例如提供个性化布局。
  - MultipartResolver：解析多部分请求，以支持从HTML表单上传文件。
  - FlashMapManager：存储并检索可用于将一个请求属性传递到另一个请求的input和output的FlashMap，通常用于重定向。

#### 处理器映射器

- **处理器映射器HandlerMapping(不需要工程师开发),由框架提供**
- 根据请求的url查找Handler。
- HandlerMapping负责根据用户请求找到Handler即处理器（Controller）
- SpringMVC提供了不同的映射器实现不同的映射方式，例如：配置文件方式，实现接口方式，注解方式等。
- HandlerMapping接口处理请求的映射HandlerMapping接口的实现类：
  - SimpleUrlHandlerMapping类通过配置文件把URL映射到Controller类。
  - DefaultAnnotationHandlerMapping类通过注解把URL映射到Controller类。

#### 处理器适配器

- **处理器适配器HandlerAdapter**
- 按照特定规则（HandlerAdapter要求的规则）去执行Handler 通过HandlerAdapter对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理器进行执行。
- AnnotationMethodHandlerAdapter：通过注解，把请求URL映射到Controller类的方法上。

#### 处理器

- **处理器Handler(需要工程师开发，也就是我们平常说的Controller控制器)**
- 编写Handler时按照HandlerAdapter的要求去做，这样适配器才可以去正确执行Handler
- Handler 是继DispatcherServlet前端控制器的后端控制器，在DispatcherServlet的控制下Handler对具体的用户请求进行处理。
- 由于Handler涉及到具体的用户业务请求，所以一般情况需要工程师根据业务需求开发Handler。

#### 视图解析器

- **视图解析器View resolver(不需要工程师开发),由框架提供**
- 进行视图解析，根据逻辑视图名解析成真正的视图（view）
- View Resolver首先根据逻辑视图名解析成物理视图名即具体的页面地址，再生成View视图对象，最后对View进行渲染将处理结果通过页面展示给用户。