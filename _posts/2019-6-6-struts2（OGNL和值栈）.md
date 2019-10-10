---
layout: post
title: "struts2（OGNL和值栈）"
categories: struts2
tags: struts2
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### OGNL

- 使用struts2标签时候，在jsp中引入标签库

```
<%@ taglib uri="/struts-tags" prefix="s"%>
```

- 使用struts2标签实现操作

```
<body>
	<!-- 使用ognl+struts2标签实现计算字符串长度 
		value属性值：ognl表达式
	-->
	<s:property value="'haha'.length()"/>
</body>
```



#### 井号使用

- 使用#获取context里面数据

```
	<s:iterator value="list" var="user">
		<!-- 
			遍历值栈list集合，得到每个user对象
			机制： 把每次遍历出来的user对象放到 context里面
			获取context里面数据特点：写ognl表达式，
			使用特殊符号 #
		 -->
		<s:property value="#user.username"/>
		<s:property value="#user.password"/>
		<s:property value="#user.address"/>
		<br/>
	</s:iterator>

```

- 用ognl获取request中的数据

```java
public class ContextAction extends ActionSupport {

	public String execute() throws Exception {
		
		HttpServletRequest request = ServletActionContext.getRequest();
		request.setAttribute("req", "reqValue");
		return "success";
	}
}

```

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<!-- 获取context里面数据，写ognl时候，首先添加符号  
		#context的key名称.域对象名称
	-->
	 <s:property value="#request.req"/> 
</body>
</html>
```



#### %使用

- 在struts2表单标签里面使用ognl表达式，如果直接在struts2表单标签里面使用ognl表达式不识别，只有%之后才会识别

```
<s:textfield name="username" value="%{#request.req}"></s:textfield>
```



### 值栈

- 之前在web阶段，在servlet里面进行操作，把数据放到域对象里面，在页面中使用el表达式获取到，域对象在一定范围内，存值和取值
- 在struts2里面提供本身一种存储机制，类似于域对象，是值栈，可以存值和取值，在action里面把数据放到值栈里面，在页面中获取到值栈数据
- 每次访问action时候，都会创建action对象
- 在每个action对象里面都会有一个值栈对象（只有一个）



### 值栈对象

```java
package cn.itcast.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.util.ValueStack;

public class UserAction extends ActionSupport {


	@Override
	public String execute() throws Exception {
		// 1 获取ActionContext类的对象
		ActionContext context = ActionContext.getContext();
		//2 调用方法得到值栈对象
		ValueStack stack1 = context.getValueStack();
		
		ValueStack stack2 = context.getValueStack();
		
		System.out.println(stack1==stack2);//true
		return NONE;
	}
}

```



### 值栈结构

- 值栈分为两部分：第一部分 root，结构是list集合，一般操作都是root里面数据。第二部分 context，结构map集合
-  struts2里面标签 s:debug，使用这个标签可以查看值栈结构和存储值
- 访问action，执行action的方法有返回值，配置返回值到jsp页面中，在jsp页面中使用这个标签
- 点击超链接看到结构
- 在action没有做任何操作，栈顶元素是 action引用



### 值栈放数据

#### set 方法

```java
	@Override
	public String execute() throws Exception {
		//第一种方式 使用值栈对象里面的 set方法
		//1 获取值栈对象
		ActionContext context = ActionContext.getContext();
		ValueStack stack = context.getValueStack();
//		//2 调用方法set方法
		stack.set("itcast", "itcastitheima");
    }
```



#### push方法

```java
	@Override
	public String execute() throws Exception {
		//1 获取值栈对象
		ActionContext context = ActionContext.getContext();
		ValueStack stack = context.getValueStack();	
//		//3 调用方法push方法
		stack.push("abcd");
		
		return "success";
	}

```



#### get方法

```java
package cn.itcast.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.util.ValueStack;

public class ValueStackDemoAction extends ActionSupport {

	//1 定义变量
	private String name;
	//2 生成变量的get方法
	public String getName() {
		return name;
	}
	
	@Override
	public String execute() throws Exception {
		
		//在执行的方法里面向变量设置值
		name = "abcdefgh";
		return "success";
	}

}

```



#### 放对象

- 第一步 定义对象变量
- 第二步 生成变量的get方法
- 第三步 在执行的方法里面向对象中设置值

```java
package cn.itcast.action;

import com.opensymphony.xwork2.ActionSupport;

import cn.itcast.entity.User;

public class ObjectDemoAction extends ActionSupport {

	//1 定义对象变量
	private User user = new User();
	//2 生成get方法
	public User getUser() {
		return user;
	}
	
	public String execute() throws Exception {
		//3 向值栈的user里面放数据
		user.setUsername("lucy");
		user.setPassword("123");
		user.setAddress("美国");
		
		return "success";
	}

}

```



#### 放list

- 第一步 定义list集合变量
- 第二步 生成变量的get方法
- 第三步 在执行的方法里面向list集合设置值

```java
package cn.itcast.action;

import java.util.ArrayList;
import java.util.List;

import com.opensymphony.xwork2.ActionSupport;

import cn.itcast.entity.User;

public class ListDemoAction extends ActionSupport {

	// 1 定义list变量
	private List<User> list = new ArrayList<User>();
	// 2 get方法
	public List<User> getList() {
		return list;
	}
	
	public String execute() throws Exception {
		//3 向list中设置值
		User user1 = new User();
		user1.setUsername("小奥");
		user1.setPassword("123");
		user1.setAddress("美国");
		
		User user2 = new User();
		user2.setUsername("小王");
		user2.setPassword("250");
		user2.setAddress("越南");
		
		list.add(user1);
		list.add(user2);
		
		return "success";
	}

}

```



### 值栈取数据

- 使用struts2的标签+ognl表达式获取值栈数据`<s:property value=”ognl表达式”/>`



#### 取字符串

```java
package cn.itcast.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.util.ValueStack;

public class ValueStackDemoAction extends ActionSupport {

	//1 定义变量
	private String name;
	//2 生成变量的get方法
	public String getName() {
		return name;
	}
	
	@Override
	public String execute() throws Exception {
		
		//在执行的方法里面向变量设置值
		name = "abcdefgh";
		return "success";
	}

}

```

```
	<!-- 1 获取字符串值 -->
	<s:property value="username"/>
```



#### 取对象

```
	<!-- 2 获取值栈对象的值 -->
	<br/>
	获取对象的值：user是变量名
	<br/>
	<s:property value="user.username"/>
	<s:property value="user.password"/>
	<s:property value="user.address"/>
	
	<br/>

```



#### 取list

```
	获取list的值第一种方式：
	<br/>
	<!-- 3 获取值栈list集合数据 -->
	<!-- 第一种方式实现  -->
	<s:property value="list[0].username"/>
	<s:property value="list[0].password"/>
	<s:property value="list[0].address"/>
	<br/>
	<s:property value="list[1].username"/>
	<s:property value="list[1].password"/>
	<s:property value="list[1].address"/>
	
	<br/>
	获取list的值第二种方式：
	<br/>
	<!-- 使用struts2标签 类似jstl的foreach标签
		s:iterator：遍历值栈的list集合
	 -->
	 <s:iterator value="list">
	 	<!-- 遍历list得到list里面每个user对象 -->
	 	<s:property value="username"/>
	 	<s:property value="password"/>
	 	<s:property value="address"/>
	 	<br/>
	 </s:iterator>
	 
	  <br/>
	 <br/>
	获取list的值第三种方式：
	<br/>
	<s:iterator value="list" var="user">
		<!-- 
			遍历值栈list集合，得到每个user对象
			机制： 把每次遍历出来的user对象放到 context里面
			获取context里面数据特点：写ognl表达式，
			使用特殊符号 #
		 -->
		<s:property value="#user.username"/>
		<s:property value="#user.password"/>
		<s:property value="#user.address"/>
		<br/>
	</s:iterator>
	
	<br/>
	<br/>

```



#### 其他操作

- 使用set方法向值栈放数据，获取

```java
stack.set("keydemo","valuedemo");
```

```
	<!-- 获取set方法设置的值  根据名称获取值-->
	<s:property value="keydemo"/> 
```

- 使用push方法向值栈放数据，获取
- 向值栈放数据，把向值栈放数据存到数组里面，数组名称 top，根据数组获取值

```java
stack.push("abcd");
```

```\
<!-- 获取push方法设置的值 [0].top表示获取栈顶元素-->
<s:property value="[0].top"/> 
```



#### el获取

```
	<!-- 使用foreach标签+el表达式获取值栈list集合数据 -->
	<c:forEach items="${list }" var="user">
		${user.username }
		${user.password }
		${user.address }
		<br/>
	</c:forEach>
```

-  EL表达式获取域对象值
- 向域对象里面放值使用setAttribute方法，获取值使用getAttribute方法
- 底层增强request对象里面的方法getAttribute方法
- 首先从request域获取值，如果获取到，直接返回
- 如果从request域获取不到值，到值栈中把值获取出来，把值放到域对象里面