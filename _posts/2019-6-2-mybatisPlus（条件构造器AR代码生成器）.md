---
layout: post
title: "mybatisPlus（条件构造器/AR/代码生成器）"
categories: mybatisPlus
tags: mybatisPlus
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 构造器说明

```
1)	Mybatis-Plus 通过 EntityWrapper（简称 EW，MP 封装的一个查询条件构造器）或者Condition（与EW 类似） 来让用户自由的构建查询条件，简单便捷，没有额外的负担，能够有效提高开发效率

2)	实体包装器，主要用于处理 sql 拼接，排序，实体参数查询等

3)	注意: 使用的是数据库字段，不是 Java 属性!
```



### 方法参数

```

setSqlSelect 	设置 SELECT 查询字段

where 	WHERE 语句，拼接 + WHERE 条件

and 	AND 语句，拼接 + AND 字段=值

andNew 	AND 语句，拼接 + AND (字段=值)

or 	OR 语句，拼接 + OR 字段=值

orNew 	OR 语句，拼接 + OR (字段=值)

注意！ xxNew 都是另起 ( ... ) 括号包裹。

eq 	等于=

allEq 	基于 map 内容等于=

ne 	不等于<>

gt 	大于>

ge 	大于等于>=

lt 	小于<

le 	小于等于<=

like 	模糊查询 LIKE

notLike 	模糊查询 NOT LIKE

in 	IN 查询

notIn 	NOT IN 查询

isNull 	NULL 值查询

isNotNull 	IS NOT NULL

groupBy 	分组 GROUP BY

having 	HAVING 关键词

orderBy 	排序 ORDER BY

orderAsc 	ASC 排序 ORDER BY

orderDesc 	DESC 排序 ORDER BY

exists 	EXISTS 条件语句

notExists 	NOT EXISTS 条件语句

between 	BETWEEN 条件语句

notBetween 	NOT BETWEEN 条件语句

addFilter 	自由拼接 SQL

last 	拼接在最后，例如：last("LIMIT 1")

```



#### 案例

```java
	/**
	 * 条件构造器   查询操作
	 */
	@Test
	public void testEntityWrapperSelect() {
		//我们需要分页查询tbl_employee表中，年龄在18~50之间且性别为男且姓名为Tom的所有用户
		
		List<Employee> emps =employeeMapper.selectPage(new Page<Employee>(1, 2),
					new EntityWrapper<Employee>()
					.between("age", 18, 50)
					.eq("gender", 1)
					.eq("last_name", "Tom")
				);
		System.out.println(emps);
	
		//使用Condition
		List<Employee > emps = employeeMapper.selectPage(
							new Page<Employee>(1,2), 
							Condition.create()
							.between("age", 18, 50)
							.eq("gender", "1")
							.eq("last_name", "Tom")
							
							);
		
		System.out.println(emps);		
		
		
		
		
		
		// 查询tbl_employee表中， 性别为女并且名字中带有"老师" 或者  邮箱中带有"a"
		
		List<Employee> emps = employeeMapper.selectList(
				new EntityWrapper<Employee>()
				.eq("gender", 0)
				.like("last_name", "老师")
				//.or()    // SQL: (gender = ? AND last_name LIKE ? OR email LIKE ?)    				.orNew()   // SQL: (gender = ? AND last_name LIKE ?) OR (email LIKE ?) 
				.like("email", "a")
				);
		System.out.println(emps);
		
		
		// 查询性别为女的, 根据age进行排序(asc/desc), 简单分页
		
		List<Employee> emps  = employeeMapper.selectList(
				new EntityWrapper<Employee>()
				.eq("gender", 0)
				.orderBy("age")
				//.orderDesc(Arrays.asList(new String [] {"age"}))
				.last("desc limit 1,3")
				);
		System.out.println(emps);
		
	}
```



```java
	/**
	 * 条件构造器  修改操作
	 */
	@Test
	public void testEntityWrapperUpdate() {
		
		Employee employee = new Employee();
		employee.setLastName("苍老师");
		employee.setEmail("cls@sina.com");
		employee.setGender(0);
		
		
		employeeMapper.update(employee, 
					new EntityWrapper<Employee>()
					.eq("last_name", "Tom")
					.eq("age", 44)
					);
	}
```



```java
	/**
	 * 条件构造器  删除操作
	 */
	@Test
	public void testEntityWrapperDelete() {
		
		employeeMapper.delete(
					new EntityWrapper<Employee>()
					.eq("last_name", "Tom")
					.eq("age", 22)
				);
	}
```



### AR说明

```
Active Record(活动记录)，是一种领域模型模式，特点是一个模型类对应关系型数据库中的一个表，而模型类的一个实例对应表中的一行记录
```



#### 使用

```java
package com.atguigu.mp.beans;

import java.io.Serializable;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;

/**
 * javaBean
 * 
 * 定义JavaBean中成员变量时所使用的类型: 
 * 	 因为每个基本类型都有一个默认值:  
 * 	   int ==> 0
 * 	   boolean ==> false
 *
 */

/*
 * MybatisPlus会默认使用实体类的类名到数据中找对应的表. 
 * 
 */
public class Employee extends Model<Employee> {
	private Integer id ;   //  int 
	private String  lastName; 
	private String  email ;
	private Integer gender; 
	private Integer age ;
	
	@TableField(exist=false)
	private Double salary ; 
	
    //get set 
    
	@Override
	public String toString() {
		return "Employee [id=" + id + ", lastName=" + lastName + ", email=" + email + ", gender=" + gender + ", age="
				+ age + "]";
	}
	
	/**
	 * 指定当前实体类的主键属性
	 */
	@Override
	protected Serializable pkVal() {
		return id;
	} 
	
}

```

```java
	/**
	 * AR  插入操作
	 */
	@Test
	public void  testARInsert() {
		Employee employee = new Employee();
		employee.setLastName("宋老师");
		employee.setEmail("sls@atguigu.com");
		employee.setGender(1);
		employee.setAge(35);
		
		boolean result = employee.insert();
		System.out.println("result:" +result );
	}
```



```java
	/**
	 * AR 修改操作
	 */
	@Test
	public void testARUpdate() {
		Employee employee = new Employee();
		employee.setId(20);
		employee.setLastName("宋老湿");
		employee.setEmail("sls@atguigu.com");
		employee.setGender(1);
		employee.setAge(36);
		
		
		boolean result = employee.updateById();
		System.out.println("result:" +result );
		
	}
```



```java
	/**
	 * AR 查询操作
	 */
	@Test
	public void testARSelect() {
		Employee employee = new Employee();
		
		//Employee result = employee.selectById(14);
		employee.setId(14);
		Employee result = employee.selectById();
		System.out.println(result );
		
		
		List<Employee> emps = employee.selectAll();
		System.out.println(emps);
		
		List<Employee > emps= 
				employee.selectList(new EntityWrapper<Employee>().like("last_name", "老师"));
		System.out.println(emps);
		
		Integer result = employee.selectCount(new EntityWrapper<Employee>().eq("gender", 0));
		System.out.println("result: " +result );
		
		
		
	}
```



```java
	/**
	 * AR 删除操作
	 * 
	 * 注意: 删除不存在的数据 逻辑上也是属于成功的. 
	 */
	@Test
	public void testARDelete() {
		
		Employee employee = new Employee();
		//boolean result = employee.deleteById(2);
//		employee.setId(2);
//		boolean result = employee.deleteById();
//		System.out.println("result:" +result );
		
		
		boolean result = employee.delete(new EntityWrapper<Employee>().like("last_name", "小"));
		System.out.println(result );
	}
	
```



```java
	/**
	 * AR  分页复杂操作
	 */
	@Test
	public void  testARPage() {
		
		Employee employee = new Employee();
		
		Page<Employee> page = employee.selectPage(new Page<>(1, 1), 
				new EntityWrapper<Employee>().like("last_name", "老"));
		List<Employee> emps = page.getRecords();
		System.out.println(emps);
	}
```



#### 小结

```
1)	AR 模式提供了一种更加便捷的方式实现 CRUD 操作，其本质还是调用的 Mybatis 对应的方法，类似于语法糖
语法糖是指计算机语言中添加的某种语法，这种语法对原本语言的功能并没有影响.可以更方便开发者使用，可以避免出错的机会，让程序可读性更好.
2)	到此，我们简单领略了 Mybatis-Plus 的魅力与高效率，值得注意的一点是：我们提供了强大的代码生成器，可以快速生成各类代码，真正的做到了即开即用
```



###  代码生成器

```
1)	MP 提供了大量的自定义设置，生成的代码完全能够满足各类型的需求
2)	MP 的代码生成器  和 Mybatis MBG 代码生成器:
MP 的代码生成器都是基于 java 代码来生成。
MBG 基于xml 文件进行代码生成
MyBatis 的代码生成器可生成: 实体类、Mapper 接口、Mapper 映射文件
MP的代码生成器可生成: 实体类(可以选择是否支持AR)、Mapper 接口、Mapper 映射文件、 Service 层、Controller 层
```

```
表及字段命名策略选择:
在 MP 中，我们建议数据库表名 和 表字段名采用驼峰命名方式， 如果采用下划线命名方式 请开启全局下划线开关，如果表名字段名命名方式不一致请注解指定，我们建议最好保持一致
这么做的原因是为了避免在对应实体类时产生的性能损耗，这样字段不用做映射就能直接和实体类对应。当然如果项目里不用考虑这点性能损耗，那么你采用下滑线也是没问题的，只需要在生成代码时配置 dbColumnUnderline 属性就可以 
```



#### 依赖

```
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.1.1</version>
</dependency>

<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.1</version>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.7</version>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.7</version>
</dependency>

```



#### 配置

```java
package com.atguigu.mp.test;

import javax.swing.text.DefaultStyledDocument.AttributeUndoableEdit;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

public class TestMP {
	
	
	/**
	 * 代码生成    示例代码
	 */
	@Test
	public void  testGenerator() {
		//1. 全局配置
		GlobalConfig config = new GlobalConfig();
		config.setActiveRecord(true) // 是否支持AR模式
			  .setAuthor("weiyunhui") // 作者
			  .setOutputDir("D:\\workspace_mp\\mp03\\src\\main\\java") // 生成路径
			  .setFileOverride(true)  // 文件覆盖
			  .setIdType(IdType.AUTO) // 主键策略
			  .setServiceName("%sService")  // 设置生成的service接口的名字的首字母是否为I
			  					   // IEmployeeService
 			  .setBaseResultMap(true)
 			  .setBaseColumnList(true);
		
		//2. 数据源配置
		DataSourceConfig  dsConfig  = new DataSourceConfig();
		dsConfig.setDbType(DbType.MYSQL)  // 设置数据库类型
				.setDriverName("com.mysql.jdbc.Driver")
				.setUrl("jdbc:mysql://localhost:3306/mp")
				.setUsername("root")
				.setPassword("1234");
		 
		//3. 策略配置
		StrategyConfig stConfig = new StrategyConfig();
		stConfig.setCapitalMode(true) //全局大写命名
				.setDbColumnUnderline(true)  // 指定表名 字段名是否使用下划线
				.setNaming(NamingStrategy.underline_to_camel) // 数据库表映射到实体的命名策略
				.setTablePrefix("tbl_") //表前缀
				.setInclude("tbl_employee");  // 生成的表
		
		//4. 包名策略配置 
		PackageConfig pkConfig = new PackageConfig();
		pkConfig.setParent("com.atguigu.mp")
				.setMapper("mapper")
				.setService("service")
				.setController("controller")
				.setEntity("beans")
				.setXml("mapper");
		
		//5. 整合配置
		AutoGenerator  ag = new AutoGenerator();
		
		ag.setGlobalConfig(config)
		  .setDataSource(dsConfig)
		  .setStrategy(stConfig)
		  .setPackageInfo(pkConfig);
		
		//6. 执行
		ag.execute();
	}

}
```

