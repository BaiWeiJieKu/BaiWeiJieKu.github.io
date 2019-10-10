---
layout: post
title: "mybatisPlus（插件扩展）"
categories: mybatisPlus
tags: mybatisPlus
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 插件机制

```properties
1)	插件机制:
Mybatis 通过插件(Interceptor) 可以做到拦截四大对象相关方法的执行,根据需求，完成相关数据的动态改变。
Executor
StatementHandler
ParameterHandler
ResultSetHandler

2)	插件原理
四大对象的每个对象在创建时，都会执行 interceptorChain.pluginAll()，会经过每个插件对象的plugin()方法，目的是为当前的四大对象创建代理。代理对象就可以拦截到四大对象相关方法的执行，因为要执行四大对象的方法需要经过代理
```



### 分页插件

- com.baomidou.mybatisplus.plugins.PaginationInterceptor
- 在spring配置文件中进行配置

```xml
<!--  配置SqlSessionFactoryBean 
		Mybatis提供的: org.mybatis.spring.SqlSessionFactoryBean
		MP提供的:com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean
	 -->
	<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
		<!-- 数据源 -->
		<property name="dataSource" ref="dataSource"></property>
		<property name="configLocation" value="classpath:mybatis-config.xml"></property>
		<!-- 别名处理 -->
		<property name="typeAliasesPackage" value="com.atguigu.mp.beans"></property>		
		
		<!-- 注入全局MP策略配置 -->
		<property name="globalConfig" ref="globalConfiguration"></property>
		
		<!-- 插件注册 -->
		<property name="plugins">
			<list>
				<!-- 注册分页插件 -->
				<bean class="com.baomidou.mybatisplus.plugins.PaginationInterceptor"></bean>
				
				<!-- 注册执行分析插件 -->
				<bean class="com.baomidou.mybatisplus.plugins.SqlExplainInterceptor">
					<property name="stopProceed" value="true"></property>
				</bean>
				
				<!-- 注册性能分析插件 -->
				<bean class="com.baomidou.mybatisplus.plugins.PerformanceInterceptor">
					<property name="format" value="true"></property>
					<!-- <property name="maxTime" value="5"></property> -->
				</bean>
				
				<!-- 注册乐观锁插件 -->
				<bean class="com.baomidou.mybatisplus.plugins.OptimisticLockerInterceptor">
				</bean>
			
			</list>
			
		</property>
		
	</bean>
```



```java
	/**
	 * 测试分页插件
	 */
	@Test
	public void testPage() {
		
		Page<Employee> page = new Page<>(1,1);
		
		List<Employee > emps = 
				employeeMapper.selectPage(page, null);
		System.out.println(emps);
				
		System.out.println("===============获取分页相关的一些信息======================");
		
		System.out.println("总条数:" +page.getTotal());
		System.out.println("当前页码: "+  page.getCurrent());
		System.out.println("总页码:" + page.getPages());
		System.out.println("每页显示的条数:" + page.getSize());
		System.out.println("是否有上一页: " + page.hasPrevious());
		System.out.println("是否有下一页: " + page.hasNext());
		
		//将查询的结果封装到page对象中
		page.setRecords(emps);
				
	}
```



### 执行分析插件

```properties
1)	com.baomidou.mybatisplus.plugins.SqlExplainInterceptor

2)	SQL 执行分析拦截器，只支持MySQL5.6.3 以上版本

3)	该插件的作用是分析 DELETE  UPDATE 语句,防止小白
或者恶意进行DELETE  UPDATE 全表操作

4)	只建议在开发环境中使用，不建议在生产环境使用

5)	在插件的底层 通过SQL 语句分析命令:Explain 分析当前的 SQL 语句，根据结果集中的Extra 列来断定当前是否全表操作。
```



### 性能分析插件

```properties
1)	com.baomidou.mybatisplus.plugins.PerformanceInterceptor

2)	性能分析拦截器，用于输出每条 SQL 语句及其执行时间

3) SQL 性能执行分析,开发环境使用，超过指定时间，停止运行。有助于发现问题
```



### 全局注入

```properties
根据MybatisPlus 的 AutoSqlInjector 可以自定义各种你想要的 sql ,注入到全局中，相当于自定义Mybatisplus 自动注入的方法
```



- 1) 在Mapper 接口中定义相关的CRUD 方法

```java
package com.atguigu.mp.mapper;

import com.atguigu.mp.beans.Employee;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author weiyunhui
 * @since 2018-06-21
 */
public interface EmployeeMapper extends BaseMapper<Employee> {
	
	int  deleteAll();
}

```



- 2) 扩展AutoSqlInjector inject 方法，实现Mapper 接口中方法要注入的SQL

```java
package com.atguigu.mp.injector;

import org.apache.ibatis.builder.MapperBuilderAssistant;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.session.Configuration;

import com.baomidou.mybatisplus.entity.TableInfo;
import com.baomidou.mybatisplus.mapper.AutoSqlInjector;

/**
 * 自定义全局操作
 */
public class MySqlInjector  extends AutoSqlInjector{
	
	/**
	 * 扩展inject 方法，完成自定义全局操作
	 */
	@Override
	public void inject(Configuration configuration, MapperBuilderAssistant builderAssistant, Class<?> mapperClass,
			Class<?> modelClass, TableInfo table) {
		//将EmployeeMapper中定义的deleteAll， 处理成对应的MappedStatement对象，加入到configuration对象中。
		
		//注入的SQL语句
		String sql = "delete from " +table.getTableName();
		//注入的方法名   一定要与EmployeeMapper接口中的方法名一致
		String method = "deleteAll" ;
		
		//构造SqlSource对象
		SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);
		
		//构造一个删除的MappedStatement
		this.addDeleteMappedStatement(mapperClass, method, sqlSource);
		
	}
}

```



- 3) 在MP 全局策略中，配置 自定义注入器

```xml
<!-- 定义MybatisPlus的全局策略配置-->
	<bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
		<!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
		<property name="dbColumnUnderline" value="true"></property>
		
		<!-- Mysql 全局的主键策略 -->
		<!-- <property name="idType" value="0"></property> -->
		

		<!--注入自定义全局操作 -->
		<property name="sqlInjector" ref="mySqlInjector"></property>
	 	
	</bean>
	
	
	<!-- 定义自定义注入器 -->
	<bean id="mySqlInjector" class="com.atguigu.mp.injector.MySqlInjector"></bean>
```



### 逻辑删除

```properties
假删除、逻辑删除: 并不会真正的从数据库中将数据删除掉，而是将当前被删除的这条数据中的一个逻辑删除字段置为删除状态.

tbl_user   logic_flag = 1   →  -1
```



```xml
	<!-- 定义MybatisPlus的全局策略配置-->
	<bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
		<!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
		<property name="dbColumnUnderline" value="true"></property>

	 	<!-- 注入逻辑删除 -->
	 	<property name="sqlInjector" ref="logicSqlInjector"></property>
	 	
	 	<!-- 注入逻辑删除全局值 -->
	 	<property name="logicDeleteValue" value = "-1"></property>
	 	<property name="logicNotDeleteValue" value="1"></property>
	</bean>
	
		<!-- 逻辑删除 -->
	<bean id="logicSqlInjector" class="com.baomidou.mybatisplus.mapper.LogicSqlInjector"></bean>
```

```java
package com.atguigu.mp.beans;

import com.baomidou.mybatisplus.annotations.KeySequence;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;
import com.baomidou.mybatisplus.enums.FieldFill;
import com.baomidou.mybatisplus.enums.IdType;

//@KeySequence(value="seq_user",clazz=Integer.class)
public class User extends Parent {
	//@TableId(type=IdType.INPUT)
	private Integer id  ;

	private String name ;
	
	@TableLogic   // 逻辑删除属性
	private Integer logicFlag ;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getLogicFlag() {
		return logicFlag;
	}
	public void setLogicFlag(Integer logicFlag) {
		this.logicFlag = logicFlag;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", logicFlag=" + logicFlag + "]";
	}
	
}

```



- 测试user的删除方法，查看sql语句是update语句而不是删除语句



### 字段填充

- 1)注解填充字段  @TableFile(fill = FieldFill.INSERT)

```java
package com.atguigu.mp.beans;

import com.baomidou.mybatisplus.annotations.KeySequence;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;
import com.baomidou.mybatisplus.enums.FieldFill;
import com.baomidou.mybatisplus.enums.IdType;

//@KeySequence(value="seq_user",clazz=Integer.class)
public class User extends Parent {
	//@TableId(type=IdType.INPUT)
	private Integer id  ;
	
    //需要被自动填充的字段
	@TableField(fill=FieldFill.INSERT_UPDATE)
	private String name ;
	
	@TableLogic   // 逻辑删除属性
	private Integer logicFlag ;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getLogicFlag() {
		return logicFlag;
	}
	public void setLogicFlag(Integer logicFlag) {
		this.logicFlag = logicFlag;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", logicFlag=" + logicFlag + "]";
	}
	
}

```



- 2)自定义公共字段填充处理器

```java
package com.atguigu.mp.metaObjectHandler;

import org.apache.ibatis.reflection.MetaObject;

import com.baomidou.mybatisplus.mapper.MetaObjectHandler;

/**
 * 自定义公共字段填充处理器
 */
public class MyMetaObjectHandler extends MetaObjectHandler {
	
	/**
	 * 插入操作 自动填充
	 */
	@Override
	public void insertFill(MetaObject metaObject) {
		//获取到需要被填充的字段的值
		Object fieldValue = getFieldValByName("name", metaObject);
		if(fieldValue == null) {
			System.out.println("*******插入操作 满足填充条件*********");
			setFieldValByName("name", "weiyunhui", metaObject);
		}
		
	}
	/**
	 * 修改操作 自动填充
	 */
	@Override
	public void updateFill(MetaObject metaObject) {
		Object fieldValue = getFieldValByName("name", metaObject);
		if(fieldValue == null) {
			System.out.println("*******修改操作 满足填充条件*********");
			setFieldValByName("name", "weiyh", metaObject);
		}
	}

}

```



- 3)MP 全局注入  自定义公共字段填充处理器

```xml
	<!-- 定义MybatisPlus的全局策略配置-->
	<bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
		<!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
		<property name="dbColumnUnderline" value="true"></property>

	 	<!-- 注入公共字段填充处理器 -->
	 	<property name="metaObjectHandler" ref="myMetaObjectHandler"></property>
	</bean>
	
	<!-- 公共字段填充 处理器 -->
	<bean id="myMetaObjectHandler" class="com.atguigu.mp.metaObjectHandler.MyMetaObjectHandler"> </bean>
```



- 测试，执行插入语句，无论该字段是否有值，都会被填充为指定的值