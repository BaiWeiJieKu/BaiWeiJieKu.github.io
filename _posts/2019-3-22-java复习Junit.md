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

- @Test：在junit3中，是通过对测试类和测试方法的命名来确定是否是测试，且所有的测试类必须继承junit的测试基类。在junit4中，定义一个测试方法变得简单很多，只需要在方法前加上@Test就行了。
- @Ignore：有时候我们想暂时不运行某些测试方法\测试类，可以在方法前加上这个注解。在运行结果中，junit会统计忽略的用例数，来提醒你。但是不建议经常这么做
- @BeforeClass：当我们运行几个有关联的用例时，可能会在数据准备或其它前期准备中执行一些相同的命令，这个时候为了让代码更清晰，更少冗余，可以将公用的部分提取出来，放在一个方法里，并为这个方法注解@BeforeClass。意思是在测试类里所有用例运行之前，运行一次这个方法。
- @AfterClass：跟@BeforeClass对应，在测试类里所有用例运行之后，运行一次。用于处理一些测试后续工作
- @Before：与@BeforeClass的区别在于，@Before不止运行一次，它会在每个用例运行之前都运行一次。
- @After：与@Before对应。

### Assert

![](http://stepimagewm.how2j.cn/8832.png)

| assertArrayEquals(expecteds, actuals) |                  查看两个数组是否相等。                  |
| :-----------------------------------: | :------------------------------------------------------: |
|    assertEquals(expected, actual)     | 查看两个对象是否相等。类似于字符串比较使用的equals()方法 |
|    assertNotEquals(first, second)     |                 查看两个对象是否不相等。                 |
|          assertNull(object)           |                    查看对象是否为空。                    |
|         assertNotNull(object)         |                   查看对象是否不为空。                   |
|     assertSame(expected, actual)      |  查看两个对象的引用是否相等。类似于使用“==”比较两个对象  |
|   assertNotSame(unexpected, actual)   | 查看两个对象的引用是否不相等。类似于使用“!=”比较两个对象 |
|         assertTrue(condition)         |                 查看运行结果是否为true。                 |
|        assertFalse(condition)         |                查看运行结果是否为false。                 |
|      assertThat(actual, matcher)      |               查看实际值是否满足指定的条件               |
|                fail()                 |                        让测试失败                        |



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