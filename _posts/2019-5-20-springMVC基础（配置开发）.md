---
layout: post
title: "springMVC基础（配置开发）"
categories: springMVC
tags: springMVC
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 处理器映射器

- HandlerMapping

- 多个映射对应一个资源
- andlerMapping 接口负责根据 request 请求找到对应的 Handler 处理器及 Interceptor 拦截器，并将它们封装在 HandlerExecutionChain 对象中，返回给中央调度器
- 其常用的实现类有两种： 
- BeanNameUrlHandlerMapping
- SimpleUrlHandlerMapping

```xml
<!--注册处理器映射器-->
<bean class="org.springframework.web.servlet.handle.SimpleUrlHandlerMapping">
	<property name="mappings">
		<props>
			<prop key="/hello.do">myController</prop>
			<prop key="/hello1.do">myController</prop>
			<prop key="/hello2.do">myController</prop>
		</props>
	</property>
</bean>

<!--注册处理器-->
<bean id="myController" class="com.test.controller.MyController">
```



- SimpleUrlHandlerMapping 处理器映射器，会根据请求的 url 与 Spring 容器中定义的处理器映射器子标签的 key 属性进行匹配。匹配上后，再将该 key 的 value 值与处理器 bean 的 id值进行匹配，从而在 spring 容器中找到处理器 bean



### 处理器适配器

- HandlerAdapter

- 适配器模式解决的问题是，使得原本由于接口不兼容而不能一起工作的那些类可以在一起工作。所以处理器适配器所起的作用是，将多种处理器（实现了不同接口的处理器），通过处理器适配器的适配，使它们可以进行统一标准的工作，对请求进行统一方式的处理。
- 只所以要将 Handler 定义为 Controller 接口的实现类，就是因为这里使用的处理器适配器是 SimpleControllerHandlerAdapter
- 打开其源码，可以看到将 handler 强转为了 Controller
- 中央调度器首先会调用该适配器的 supports()方法，判断该 Handler 是否与Controller 具有 is-a 关系。在具有 is-a 关系的前提下，才会强转

```java
public class SimpleControllerHandlerAdapter implements HandlerAdapter {

	@Override
	public boolean supports(Object handler) {
		return (handler instanceof Controller);
	}

	@Override
	@Nullable
	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		//强转后，就会调用我们自己定义的处理器的 handleRequest()方法
		return ((Controller) handler).handleRequest(request, response);
	}

	@Override
	public long getLastModified(HttpServletRequest request, Object handler) {
		if (handler instanceof LastModified) {
			return ((LastModified) handler).getLastModified(request);
		}
		return -1L;
	}

}
```



- HandlerAdapter 接口会根据处理器所实现接口的不同，对处理器进行适配，适配后即可对处理器进行执行。通过扩展处理器适配器，可以执行多种类型的处理器
- 用的HandlerAdapter 接口实现类有两种： 



#### SimpleControllerHandlerAdapter

- 所有实现了 Controller 接口的处理器 Bean，均是通过此适配器进行适配、执行的。 Controller 接口中有一个方法：

```java
public interface Controller {

	/**
	 * Process the request and return a ModelAndView object which the DispatcherServlet
	 * will render. A {@code null} return value is not an error: it indicates that
	 * this object completed request processing itself and that there is therefore no
	 * ModelAndView to render.
	 * @param request current HTTP request
	 * @param response current HTTP response
	 * @return a ModelAndView to render, or {@code null} if handled directly
	 * @throws Exception in case of errors
	 */
	@Nullable
	ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception;

}
```

- 该方法用于处理用户提交的请求。通过调用 Service 层代码，实现对用户请求的计算响应，并最终将计算所得数据及要响应的页面，封装为一个对象 ModelAndView，返回给中央调度器



#### HttpRequestHandlerAdapter

- 所有实现了 HttpRequestHandler 接口的处理器 Bean，均是通过此适配器进行适配、执行的
- HttpRequestHandler 接口中有一个方法

```java
public interface HttpRequestHandler {

	/**
	 * Process the given request, generating a response.
	 * @param request current HTTP request
	 * @param response current HTTP response
	 * @throws ServletException in case of general errors
	 * @throws IOException in case of I/O errors
	 */
	void handleRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException;

}
```

- 该方法没有返回值，不能像 ModelAndView 一样，将数据及目标视图封装为一个对象。但可以将数据直接放入到 request、session 等域属性中，并由 request 或 response 完成到目标页面的跳转

```java
public class MyController implements HttpRequestHandler {
    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("welcome","welcome to china");
        request.getRequestDispatcher("/WEB-INF/jsp/welcome.jsp").forward(request,response);
    }
}
```



### 处理器

- 处理器除了实现 Controller 接口外，还可以继承自一些其它的类来完成一些特殊的功能。



#### AbstractController

- 若处理器继承自 AbstractController 类，那么该控制器就具有了一些新的功能。因为AbstractController 类还继承自一个父类 WebContentGenerator
- WebContentGenerator 类具有 supportedMethods 属性，可以设置支持的 HTTP 数据提交方式。默认支持 GET、POST

```java
/**
	 * Set the HTTP methods that this content generator should support.
	 * <p>Default is GET, HEAD and POST for simple form controller types;
	 * unrestricted for general controllers and interceptors.
	 */
	public final void setSupportedMethods(@Nullable String... methods) {
		if (!ObjectUtils.isEmpty(methods)) {
			this.supportedMethods = new LinkedHashSet<>(Arrays.asList(methods));
		}
		else {
			this.supportedMethods = null;
		}
		initAllowHeader();
	}
```

- 若处理器继承自 AbstractController 类，那么处理器就可以通过属性 supportedMethods来限制 HTTP 请求提交方式了。例如，指定只支持 POST 的 HTTP 请求提交方式
- 不过，需要注意的是，AbstractController 类中有一个抽象方法需要实现

```java
/**
	 * Template method. Subclasses must implement this.
	 * The contract is the same as for {@code handleRequest}.
	 * @see #handleRequest
	 */
	@Nullable
	protected abstract ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response)
			throws Exception;
```

- 即定义处理器时，就需要实现其抽象方法 handleRequestInternal()。那么我们的处理器中实现的这个方法是什么时候被调用执行的呢？
- 所以 AbstractController 类就实现了 Controller 接口的 handleRequest()方法。但查看AbstractController 类的 handleRequest()方法源码，发现该方法最终返回的却是抽象方法handleRequestInternal()

```java
@Override
	@Nullable
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		if (HttpMethod.OPTIONS.matches(request.getMethod())) {
			response.setHeader("Allow", getAllowHeader());
			return null;
		}

		// Delegate to WebContentGenerator for checking and preparing.
		checkRequest(request);
		prepareResponse(response);

		// Execute handleRequestInternal in synchronized block if required.
		if (this.synchronizeOnSession) {
			HttpSession session = request.getSession(false);
			if (session != null) {
				Object mutex = WebUtils.getSessionMutex(session);
				synchronized (mutex) {
					return handleRequestInternal(request, response);
				}
			}
		}

		return handleRequestInternal(request, response);
	}
```

- 而 AbstractController 抽象类的实现类即我们自定义的子类，实现了该抽象方法。即，我们自定义的处理器的处理器方法 handleRequestInternal()最终被 AbstractController 类的handleRequest()方法调用执行。而 AbstractController 类的 handleRequest()方法是被处理器适配器调用执行的

```java
public class MyController extends AbstractController {

    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.addObject("welcome","hello springmvc");
        mv.setViewName("welcome");
        return mv;
    }
}
```



#### MultiActionController

- MultiActionController 类继承自 AbstractController，所以继承自 MultiActionController 类的子类也可以设置 HTTP 请求提交方式
- 继承自该类的处理器中可以定义多个处理方法。这些方法的签名为公共的方法，返回值为 ModelAndView，包含参数 HttpServletRequest 与 HttpServletResponse，抛出Exception 异常，方法名随意

```java
public class MyController extends MultiActionController  {

    
    protected ModelAndView doFirst(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.addObject("method","doFirst()");
        mv.setViewName("show");
        return mv;
    }
    
    protected ModelAndView doSecond(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.addObject("method","doSecond()");
        mv.setViewName("show");
        return mv;
    }
}
```



- 注意处理器类的映射路径的写法：要求必须以/xxx/*的路径方式定义映射路径。其中*为通配符，在访问时使用要访问的方法名代替

```xml
<!--注册处理器映射器-->
<bean class="org.springframework.web.servlet.handle.SimpleUrlHandlerMapping">
	<property name="mappings">
		<props>
			<prop key="/my/*.do">myController</prop>
		</props>
	</property>
</bean>

<!--配置视图解析器-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">    
   <property name="prefix" value="/WEB-INF/jsp/"/>    
   <property name="suffix" value=".jsp"></property>    
</bean> 

<!--注册处理器-->
<bean id="myController" class="com.test.controller.MyController">
```



- 对doFirst方法的方位格式为：`http://localhost:8080/项目名/my/doFirst.do`
- 对doSecond方法的方位格式为：`http://localhost:8080/项目名/my/doSecond.do`



- 只 所 以 通 过 在 请 求 URI 中 写 上 方 法 名 就 可 以 访 问 到 指 定 方 法 ， 是 因 为 在MultiActionController 类中有一个专门处理方法名称的解析器 MethodNameResolver。该解析器作为一个属性出现，具有 get 与 set 方法。MethodNameResolver 是一个接口，不同的解析器实现类，其对方法名在 URI 中的写法要求也是不同的
- **InternalPathMethodNameResolver**:方法名解析器（默认）

```java
//InternalPathMethodNameResolver:方法名解析器（默认）
//该方法名解析器要求方法名以 URI 中资源名称的身份出现，即方法作为一种可以被请求的资源出现。也就是前面的写法：/xxx/方法名
private MethodNameResolver methodNameResolver = new InternalPathMethodNameResolver();
```



- **PropertiesMethodNameResolver**:方法名解析器 
- 该方法名解析器中的方法名是作为 URI 资源名称中的一部分出现的，即方法名并非单独作为一种资源名称出现。例如请求时可以写为/xxx_doFirst，则会访问 xxx 所映射的处理器的doFirst()方法
- 处理器映射器的请求格式发生了改变
- 另外，还需要配置一个 PropertiesMethodNameResolver 方法名解析器，并指定请求与要执行的方法名之间的映射关系。注意，这里的指定的请求，必须要加上.do，否则，无法完成匹配，将报 404 错误
- 最后，将配置好的方法名解析器，注入给处理器。

```xml
<!--注册处理器映射器-->
<bean class="org.springframework.web.servlet.handle.SimpleUrlHandlerMapping">
	<property name="mappings">
		<props>
			<prop key="/my_*.do">myController</prop>
		</props>
	</property>
</bean>

<!--配置方法名解析器-->
<bean id="propertiesMethodNameResolver" class="org.springframework.web.servlet.mvc.multiaction.PropertiesMethodNameResolver">
        <property name="mappings">
            <props>
                <prop key="/my_doFirst.do">doFirst</prop>
                <prop key="/my_doSecond.do">doSecond</prop>
            </props>
        </property>
</bean>

<!--注册处理器-->
<bean id="myController" class="com.test.controller.MyController">
	<property name="methodNameResolver" ref="propertiesMethodNameResolver" />
</bean>
```



- 对doFirst方法进行访问：`http://localhost:8080/项目名/my_doFirst.do`



- **arameterMethodNameResolver** :方法名解析器
- 该方法名解析器中的方法名作为请求参数的值出现。例如请求时可以写为 /xxx?ooo=doFirst，则会访问 xxx 所映射的处理器的 doFirst()方法。其中 ooo 为该请求所携带的参数名，而 doFirst 则作为其参数值出现

```xml
<!--注册处理器映射器-->
<bean class="org.springframework.web.servlet.handle.SimpleUrlHandlerMapping">
	<property name="mappings">
		<props>
			<prop key="/my.do">myController</prop>
		</props>
	</property>
</bean>

<!--配置方法名解析器-->
<bean id="parameterMethodNameResolver" class="org.springframework.web.servlet.mvc.multiaction.ParameterMethodNameResolver">
        <property name="paramName" value="method" />
</bean>

<!--注册处理器-->
<bean id="myController" class="com.test.controller.MyController">
	<property name="methodNameResolver" ref="parameterMethodNameResolver" />
</bean>
```

- 对doFirst方法进行访问：`http://localhost:8080/项目名/my.do?method=doFirst`



- 不过，打开 ParameterMethodNameResolver 源码，发现该类中有一个默认的参数 action。即若不指定参数名称，则可以使用 action 作为参数

```java
public class ParameterMethodNameResolver implements MethodNameResolver {
    public static final String DEFAULT_PARAM_NAME = "action";
```

- 也就是说，对于方法名称解析器 ParameterMethodNameResolver 的注册，可以修改为如下形式，即不指定 paramName 的属性值

```xml
<!--配置方法名解析器-->
<bean id="parameterMethodNameResolver" class="org.springframework.web.servlet.mvc.multiaction.ParameterMethodNameResolver">
</bean>
```

- 对doFirst方法进行访问：`http://localhost:8080/项目名/my.do?action=doFirst`



### ModelAndView

- ModelAndView 即模型与视图，通过 addObject() 方法向模型中添加数据，通过setViewName()方法向模型添加视图名称



#### 模型

- **模型的本质就是 HashMap** 
- 跟踪 addObject()方法，可以知道这里的模型就是 ModelMap，而 ModelMap 的本质就是个 HashMap，向模型中添加数据，就是向 HashMap 中添加数据。

```java
//ModelAndView类的addObject方法
public ModelAndView addObject(Object attributeValue) {
        this.getModelMap().addAttribute(attributeValue);
        return this;
    }

//获取ModelMap
public ModelMap getModelMap() {
        if (this.model == null) {
            this.model = new ModelMap();
        }

        return this.model;
    }
//而 ModelMap 的本质就是个 HashMap
public class ModelMap extends LinkedHashMap<String, Object>
//而 ModelMap 的本质就是个 HashMap
public class LinkedHashMap<K,V> extends HashMap<K,V> implements Map<K,V>
```

- 从以上代码跟踪可知，向 ModelAndView 中添加数据，就是向 HashMap 中添加数据



- **HashMap 是一个单向查找数组**
- HashMap 的本质是一个单向链表数组，看 HashMap 的源码，其用于存放数据的底层数据结构为一个数组，而数组元素为一个 Node对象

```java
 /**
     * The table, initialized on first use, and resized as
     * necessary. When allocated, length is always a power of two.
     * (We also tolerate length zero in some operations to allow
     * bootstrapping mechanics that are currently not needed.)
     */
    transient Node<K,V>[] table;
```

- 跟踪 Node类可知，其为 HashMap 类的内部类，为一个可单向链表的数据结构：因为其只能通过 next 查找下一个元素，而无法查找上一个元素

```java
static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
```



- **LinkedHashMap**
- LinkedHashMap 的本质是一个 HashMap，但其将 Entry 内部类进行了扩展。HashMap 中
  的 Entry 是单向的，只能通过 next 查找下一个元素。而 LinkedHashMap 中的 Entry 变为了双向的，可以通过 before 查找上一个元素，通过 after 查找下一个元素。即从性能上说， LinkedHashMap 的操作性能要高于 HashMap

```java
transient LinkedHashMap.Entry<K,V> head;
```

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
        Entry<K,V> before, after;
        Entry(int hash, K key, V value, Node<K,V> next) {
            super(hash, key, value, next);
        }
    }
```

- 我们应该掌握的是 ModelAndView 中的模型对象是 ModelMap，其本质是一个 HashMap，向 ModelMap 中添加数据就是向 HashMap 中添加数据。只不过，这个 ModelMap 要比 HashMap 的性能更高



#### 视图

- 通过 setViewName()指定视图名称。注意，这里的视图名称将会对应一个视图对象，一般是不会在这里直接写上要跳转的页面的
- 这个视图对象，将会被封装在ModelAndView中，传给视图解析器来解析，最终转换为相应的页面
- 但需要注意的是，这里的 View 对象本质仅仅是一个 String 而矣。后续的步骤中，还会继续对这个 View 对象进行进一步的封装

```java
//ModelAndView类中有个成员变量：private Object view;
public void setViewName(String viewName) {
        this.view = viewName;
    }
```

- 当然，若处理器方法返回的 ModelAndView 中并没有数据要携带，则可直接通过ModelAndView 的带参构造器将视图名称放入 ModelAndView 中

```java
public ModelAndView(String viewName) {
        this.view = viewName;
    }
```



### 视图解析器

- 视图解析器 ViewResolver 接口负责将处理结果生成 View 视图。常用的实现类有四种：



#### InternalResourceViewResolver

- 该视图解析器用于完成对当前 Web 应用内部资源的封装与跳转
- 对于内部资源的查找规则是，将 ModelAndView 中指定的视图名称与为视图解析器配置的前辍与后辍相结合的方式，拼接成一个 Web 应用内部资源路径
- 接规则是： 前辍 + 视图名称 + 后辍
- InternalResourceView 解析器会把处理器方法返回的模型属性都存放到对应的 request 中，然后将请求转发到目标 URL

```java
mv.addObject("method","doSecond()");
//向ModelAndView对象中添加view，即要跳转的页面
mv.setViewName("show");

//这样写需要配置视图解析器
```

```java
//如果不配置视图解析器也可以这样写
mv.addObject("method","doSecond()");
//向ModelAndView对象中添加view，即要跳转的页面
mv.setViewName("/WEB-INF/admin/show.jsp");
```



#### BeanNameViewResolver

- InternalResourceViewResolver 解析器存在两个问题，使其使用很不灵活： 
- 只可以完成将内部资源封装后的跳转。但无法转向外部资源，如外部网页
- 对于内部资源的定义，也只能定义一种格式的资源：存放于同一目录的同一文件类型的资源文件
- BeanNameViewResolver 视图解析器，顾名思义就是将资源封装为“Spring 容器中注册的Bean 实例”，ModelAndView 通过设置视图名称为该 Bean 的 id 属性值来完成对该资源的访问。所以在 springmvc.xml 中，可以定义多个 View 视图 Bean，让处理器中 ModelAndView 通过对这些 Bean 的 id 的引用来完成向 View 中封装资源的跳转



#### XmlViewResolver

- 当需要定义的 View 视图对象很多时，就会使 springmvc.xml 文件变得很大，很臃肿，不便于管理。所以可以将这些 View 视图对象专门抽取出来，单独定义为一个 xml 文件。这时就需要使用 XmlViewResolver 解析器了



#### ResourceBundleViewResolver

- 对于 View 视图对象的注册，除了使用 xml 文件外，也可以在 properties 文件中进行注册。只不过，此时的视图解析器需要更换为 ResourceBundleViewResolver 解析器。



#### 优先级

- 有时经常需要应用一些视图解析器策略来解析视图名称，即当同时存在多个视图解析器均可解析ModelAndView 中的同一视图名称时，哪个视图解析器会起作用呢？ 
- 视图解析器有一个 **order 属性**，专门用于设置多个视图解析器的优先级。**数字越小，优先级越高。数字相同，先注册的优先级高**。一般不为 InternalResourceViewResolver 解析器指定优先级，即让其优先级是最低的。