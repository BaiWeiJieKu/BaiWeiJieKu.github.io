---
layout: post
title: "java复习Junit"
categories: Junit
tags: Junit
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
## 入门使用

- 为了应付这种测试的需求，我们就需要使用 junit 测试框架来进行测试工作
- 首先下载 jar 包:  junit-4.9.jar， 导入到项目中。
- 它是由 @Test 进行了注解，表示这个方法是一个测试方法

```java
package junit;

import org.junit.Test;

import junit.framework.Assert;

public class TestCase1 {

    @Test
    public void testSum1() {
    	int result = SumUtil.sum1(1, 2);
    	Assert.assertEquals(result, 3);
        /*
        Assert.assertEquals(result, 3); 表示对 result 数值的期待是 3，如果是其他数值，就无法通过		 测试。
        */
    }

}

```

- 与main方法运行不一样，运行测试用例的时候，需要选择 `Run As -> JUnit Test `方式

- 新增加的测试，对原来的测试没有影响
- 如果测试失败了，会立即得到通知



### 注解

- @Before @After 也是常见的测试框架注解，分别用来在测试开始之前做的事情，和结束之后做的事情。

```java
package junit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import junit.framework.Assert;

public class TestCase1 {

	@Before
	public void before() {
		System.out.println("测试前的准备工作，比如链接数据库等等");
	}
	@After
	public void after() {
		System.out.println("测试结束后的工作，比如关闭链接等等");
	}
	
    @Test
    public void testSum1() {
    	int result = SumUtil.sum1(1, 2);
    	Assert.assertEquals(result, 3);
    }

    @Test
    public void testSum2() {
    	int result = SumUtil.sum2(1, 2,3);
    	Assert.assertEquals(result, 5);
    }
}

```



### Assert

![](http://stepimagewm.how2j.cn/8832.png)



## TestSuite

- 如果有很多工具类需要被测试，那么就会有 TestCase2, TestCase3, TestCase4,
- 如果不得不挨个去执行这些单独的测试类，也是比较麻烦的，所以就有了 TestSuite的概念
- TestSuite 其实就是一下执行多个测试类

```java
package junit;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({TestCase1.class,TestCase2.class})
public class TestSuite {

}

```



## maven

```
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.3.1</version>
    <scope>test</scope>
</dependency>
```

## spring

```java
package com.how2java.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.how2java.pojo.Category;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class TestSpring {
	@Autowired
	Category c;

	@Test
	public void test(){
		System.out.println(c.getName());
	}
}

```



## springboot

- 修改junit 版本为 4.12
- 增加 spring-boot-starter-test

```java
package com.how2java.springboot.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import com.how2java.springboot.Application;
import com.how2java.springboot.dao.CategoryDAO;
import com.how2java.springboot.pojo.Category;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class TestJPA {

	@Autowired CategoryDAO dao;
	
	@Test
	public void test() {
		List<Category> cs=  dao.findAll();
		for (Category c : cs) {
			System.out.println("c.getName():"+ c.getName());
		}
		
	}
}

```

本文章参考自：http://how2j.cn