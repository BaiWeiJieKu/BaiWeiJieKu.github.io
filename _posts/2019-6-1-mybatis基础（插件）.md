---
layout: post
title: "mybatis基础（插件）"
categories: mybatis
tags: mybatis
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 插件原理

```
插件原理
	  在四大对象创建的时候
	  1、每个创建出来的对象不是直接返回的，而是
	  		interceptorChain.pluginAll(parameterHandler);
	  2、获取到所有的Interceptor（拦截器）（插件需要实现的接口）；
	  		调用interceptor.plugin(target);返回target包装后的对象
	  3、插件机制，我们可以使用插件为目标对象创建一个代理对象；AOP（面向切面）
	  		我们的插件可以为四大对象创建出代理对象；
	  		代理对象就可以拦截到四大对象的每一个执行；
	  
		public Object pluginAll(Object target) {
		    for (Interceptor interceptor : interceptors) {
		      target = interceptor.plugin(target);
		    }
		    return target;
		  }
		

	 * 插件编写：
	 * 1、编写Interceptor的实现类
	 * 2、使用@Intercepts注解完成插件签名
	 * 3、将写好的插件注册到全局配置文件中
```



#### 自定义插件 

- 实现类

```java
package com.atguigu.mybatis.dao;

import java.util.Properties;

import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;

/**
 * 完成插件签名：
 *		告诉MyBatis当前插件用来拦截哪个对象的哪个方法
 */
@Intercepts(
		{
			@Signature(type=StatementHandler.class,method="parameterize",args=java.sql.Statement.class)
		})
public class MyFirstPlugin implements Interceptor{

	/**
	 * intercept：拦截：
	 * 		拦截目标对象的目标方法的执行；
	 */
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		// TODO Auto-generated method stub
		System.out.println("MyFirstPlugin...intercept:"+invocation.getMethod());
		//动态的改变一下sql运行的参数：以前1号员工，实际从数据库查询3号员工
		Object target = invocation.getTarget();
		System.out.println("当前拦截到的对象："+target);
		//拿到：StatementHandler==>ParameterHandler===>parameterObject
		//拿到target的元数据
		MetaObject metaObject = SystemMetaObject.forObject(target);
		Object value = metaObject.getValue("parameterHandler.parameterObject");
		System.out.println("sql语句用的参数是："+value);
		//修改完sql语句要用的参数
		metaObject.setValue("parameterHandler.parameterObject", 11);
		//执行目标方法
		Object proceed = invocation.proceed();
		//返回执行后的返回值
		return proceed;
	}

	/**
	 * plugin：
	 * 		包装目标对象的：包装：为目标对象创建一个代理对象
	 */
	@Override
	public Object plugin(Object target) {
		// TODO Auto-generated method stub
		//我们可以借助Plugin的wrap方法来使用当前Interceptor包装我们目标对象
		System.out.println("MyFirstPlugin...plugin:mybatis将要包装的对象"+target);
		Object wrap = Plugin.wrap(target, this);
		//返回为当前target创建的动态代理
		return wrap;
	}

	/**
	 * setProperties：
	 * 		将插件注册时 的property属性设置进来
	 */
	@Override
	public void setProperties(Properties properties) {
		// TODO Auto-generated method stub
		System.out.println("插件配置的信息："+properties);
	}

}

```



- 注册插件

```
<!--plugins：注册插件  -->
	<plugins>
		<plugin interceptor="com.atguigu.mybatis.dao.MyFirstPlugin">
			<property name="username" value="root"/>
			<property name="password" value="123456"/>
		</plugin>
		<!--第二个插件-->
		<plugin interceptor="com.atguigu.mybatis.dao.MySecondPlugin"></plugin>
	</plugins>
```



### pageHelper

#### 配置文件

```
<plugins>
		<plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

#### 测试

```java
@Test
	public void test01() throws IOException {
		// 1、获取sqlSessionFactory对象
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		// 2、获取sqlSession对象
		SqlSession openSession = sqlSessionFactory.openSession();
		try {
			EmployeeMapper mapper = openSession.getMapper(EmployeeMapper.class);
			Page<Object> page = PageHelper.startPage(5, 1);
			
			List<Employee> emps = mapper.getEmps();
			//传入要连续显示多少页
			PageInfo<Employee> info = new PageInfo<>(emps, 5);
			for (Employee employee : emps) {
				System.out.println(employee);
			}
			/*System.out.println("当前页码："+page.getPageNum());
			System.out.println("总记录数："+page.getTotal());
			System.out.println("每页的记录数："+page.getPageSize());
			System.out.println("总页码："+page.getPages());*/
			///xxx
			System.out.println("当前页码："+info.getPageNum());
			System.out.println("总记录数："+info.getTotal());
			System.out.println("每页的记录数："+info.getPageSize());
			System.out.println("总页码："+info.getPages());
			System.out.println("是否第一页："+info.isIsFirstPage());
			System.out.println("连续显示的页码：");
			int[] nums = info.getNavigatepageNums();
			for (int i = 0; i < nums.length; i++) {
				System.out.println(nums[i]);
			}
			
			
			//xxxx
		} finally {
			openSession.close();
		}

	}
```



### 批量存储

- applicationContext.xml

```
<!--配置一个可以进行批量执行的sqlSession  -->
	<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
		<constructor-arg name="sqlSessionFactory" ref="sqlSessionFactoryBean">		</constructor-arg>
		<constructor-arg name="executorType" value="BATCH"></constructor-arg>
	</bean>
```

- service

```java
package com.atguigu.mybatis.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.mybatis.bean.Employee;
import com.atguigu.mybatis.dao.EmployeeMapper;

@Service
public class EmployeeService {
	
	@Autowired
	private EmployeeMapper employeeMapper;
	
	@Autowired
	private SqlSession sqlSession;
	
	public List<Employee> getEmps(){
		//执行mapp的方法进行批量操作即可
		//EmployeeMapper mapper = sqlSession.getMapper(EmployeeMapper.class);
		return employeeMapper.getEmps();
	}

}

```

```java
@Test
	public void testBatch() throws IOException{
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		
		//可以执行批量操作的sqlSession
		SqlSession openSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
		long start = System.currentTimeMillis();
		try{
			EmployeeMapper mapper = openSession.getMapper(EmployeeMapper.class);
			for (int i = 0; i < 10000; i++) {
				mapper.addEmp(new Employee(UUID.randomUUID().toString().substring(0, 5), "b", "1"));
			}
			openSession.commit();
			long end = System.currentTimeMillis();
			//批量：（预编译sql一次==>设置参数===>10000次===>执行（1次））
			//Parameters: 616c1(String), b(String), 1(String)==>4598
			//非批量：（预编译sql=设置参数=执行）==》10000    10200
			System.out.println("执行时长："+(end-start));
		}finally{
			openSession.close();
		}
		
	}
```



### 处理枚举类型

#### 枚举类

```java
package com.atguigu.mybatis.bean;

import com.sun.org.apache.bcel.internal.generic.RETURN;

/**
 * 希望数据库保存的是100,200这些状态码，而不是默认0,1或者枚举的名
 * @author lfy
 *
 */
public enum EmpStatus {
	LOGIN(100,"用户登录"),LOGOUT(200,"用户登出"),REMOVE(300,"用户不存在");
	
	
	private Integer code;
	private String msg;
	private EmpStatus(Integer code,String msg){
		this.code = code;
		this.msg = msg;
	}
	public Integer getCode() {
		return code;
	}
	
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	//按照状态码返回枚举对象
	public static EmpStatus getEmpStatusByCode(Integer code){
		switch (code) {
			case 100:
				return LOGIN;
			case 200:
				return LOGOUT;	
			case 300:
				return REMOVE;
			default:
				return LOGOUT;
		}
	}
	
	
}

```



#### 类型处理器

```java
package com.atguigu.mybatis.typehandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

import com.atguigu.mybatis.bean.EmpStatus;

/**
 * 1、实现TypeHandler接口。或者继承BaseTypeHandler
 * @author lfy
 *
 */
public class MyEnumEmpStatusTypeHandler implements TypeHandler<EmpStatus> {

	/**
	 * 定义当前数据如何保存到数据库中
	 */
	@Override
	public void setParameter(PreparedStatement ps, int i, EmpStatus parameter,
			JdbcType jdbcType) throws SQLException {
		// TODO Auto-generated method stub
		System.out.println("要保存的状态码："+parameter.getCode());
		ps.setString(i, parameter.getCode().toString());
	}

	@Override
	public EmpStatus getResult(ResultSet rs, String columnName)
			throws SQLException {
		// TODO Auto-generated method stub
		//需要根据从数据库中拿到的枚举的状态码返回一个枚举对象
		int code = rs.getInt(columnName);
		System.out.println("从数据库中获取的状态码："+code);
		EmpStatus status = EmpStatus.getEmpStatusByCode(code);
		return status;
	}

	@Override
	public EmpStatus getResult(ResultSet rs, int columnIndex)
			throws SQLException {
		// TODO Auto-generated method stub
		int code = rs.getInt(columnIndex);
		System.out.println("从数据库中获取的状态码："+code);
		EmpStatus status = EmpStatus.getEmpStatusByCode(code);
		return status;
	}

	@Override
	public EmpStatus getResult(CallableStatement cs, int columnIndex)
			throws SQLException {
		// TODO Auto-generated method stub
		int code = cs.getInt(columnIndex);
		System.out.println("从数据库中获取的状态码："+code);
		EmpStatus status = EmpStatus.getEmpStatusByCode(code);
		return status;
	}

}

```



#### 配置

```
<typeHandlers>
		<!--1、配置我们自定义的TypeHandler  -->
		<typeHandler handler="com.atguigu.mybatis.typehandler.MyEnumEmpStatusTypeHandler" javaType="com.atguigu.mybatis.bean.EmpStatus"/>
		<!--2、也可以在处理某个字段的时候告诉MyBatis用什么类型处理器
				保存：#{empStatus,typeHandler=xxxx}
				查询：
					<resultMap type="com.atguigu.mybatis.bean.Employee" id="MyEmp">
				 		<id column="id" property="id"/>
				 		<result column="empStatus" property="empStatus" typeHandler=""/>
				 	</resultMap>
				注意：如果在参数位置修改TypeHandler，应该保证保存数据和查询数据用的TypeHandler是一样的。
		  -->
</typeHandlers>
```



#### 测试

```java
@Test
	public void testEnumUse(){
		EmpStatus login = EmpStatus.LOGIN;
		System.out.println("枚举的索引："+login.ordinal());
		System.out.println("枚举的名字："+login.name());
		
		System.out.println("枚举的状态码："+login.getCode());
		System.out.println("枚举的提示消息："+login.getMsg());
	}
	
	/**
	 * 默认mybatis在处理枚举对象的时候保存的是枚举的名字：EnumTypeHandler
	 * 改变使用：EnumOrdinalTypeHandler：
	 * @throws IOException
	 */
	@Test
	public void testEnum() throws IOException{
		SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
		SqlSession openSession = sqlSessionFactory.openSession();
		try{
			EmployeeMapper mapper = openSession.getMapper(EmployeeMapper.class);
			Employee employee = new Employee("test_enum", "enum@atguigu.com","1");
			//mapper.addEmp(employee);
			//System.out.println("保存成功"+employee.getId());
			//openSession.commit();
			Employee empById = mapper.getEmpById(30026);
			System.out.println(empById.getEmpStatus());
		}finally{
			openSession.close();
		}
	}
```

