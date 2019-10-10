---
layout: post
title: "java基础复习六Java异常断言和日志调试"
categories: java基础
tags: java基础 异常 断言 日志 调试
author: 百味皆苦
music-id: 30039520
---

* content
{:toc}
## 异常

- 导致程序的正常流程被中断的事件，叫做异常
- Java使用异常处理的错误捕获机制处理
- 如果由于出现错误而使得某些操作没有完成，程序应该：返回到一种安全状态，并能够让用户执行一些其他的命令，或者允许用户保存所有操作的结果，并以适当的形式终止程序
- 异常处理的任务就是将控制权从错误产生的地方转移到能够处理这种情况的错误处理器
- 常见的错误和问题有：1、用户输入错误。2、设备错误。3、物理限制。4、代码错误。
- 异常对象都是派生于throwable类的一个实例，如果Java中内置的异常类不能够满足需求，用户可以创建自己的异常类
- 所有的异常都是由Throwable继承而来，但是在下一层立刻分解为两个分支：error和exception
- error类层次结构描述了Java运行时系统内部错误和资源耗尽错误
- exception层次机构又分解为两个分支：一个分支派生于RuntimeException；另一个分支是其他异常
- 由程序错误导致的异常属于RuntimeException；而程序本身没问题，但有I/O错误这一类问题导致的异常属于其他异常
- RuntimeException异常包含下面几种情况：
- 1）错误的类型转换
- 2）数组访问越界
- 3）访问空指针
- 其他异常包含下面几种情况：
- 1）试图在文件尾部后面读取数据
- 2）试图打开一个不存在的文件
- 3）试图根据指定的字符串查找Class对象，而这个字符串表示的类并不存在
- 在遇到下面情况时应该抛出异常：
- 1）调用一个抛出已检查异常的方法，如FileInputStream构造器
- 2）程序运行过程中发生错误，并且利用throw语句抛出一个已检查异常
- 3）程序出现错误
- 4）Java虚拟机和运行时库出现的内部错误
- 如果一个方法有可能抛出多个已检查异常，那么就必须在方法的首部列出所有的异常类，每个异常类之间用逗号隔开
- 不需要声明Java的内部错误，即从error继承的错误，也不应该声明从RuntimeException继承的未检查异常
- 一个方法必须声明所有可能抛出的已检查异常，而未检查异常要么不可控制（error），要么就应该避免发生（RuntimeException）。如果方法没有声明所有可能发生的已检查异常，编译器就会给出一个错误消息
- 除了声明异常之外，还可以捕获异常
- 子类方法中可以抛出更特定的异常，或者根本不抛出任何异常。如果超类方法没有抛出任何已检查异常，子类也不能抛出任何已检查异常

### 异常处理

- 异常处理常见手段： try catch finally throws

#### try catch

- 将可能抛出FileNotFoundException 文件不存在异常的代码放在try里
- 如果文件存在，就会顺序往下执行，并且不执行catch块中的代码
- 如果文件不存在，try 里的代码会立即终止，程序流程会运行到对应的catch块中
- e.printStackTrace(); 会打印出方法的调用痕迹，如此例，会打印出异常开始于TestException的第16行，这样就便于定位和分析到底哪里出了异常

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		
		File f= new File("d:/LOL.exe");
		
		try{
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
		}
		catch(FileNotFoundException e){
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		}
		
	}
}

```

![](http://stepimagewm.how2j.cn/735.png)

#### 父类catch

- FileNotFoundException是Exception的子类，使用Exception也可以catch住FileNotFoundException

```java
package exception;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
 
public class TestException {
 
    public static void main(String[] args) {
         
        File f= new File("d:/LOL.exe");
         
        try{
            System.out.println("试图打开 d:/LOL.exe");
            new FileInputStream(f);
            System.out.println("成功打开");
        }
        
        catch(Exception e){
            System.out.println("d:/LOL.exe不存在");
            e.printStackTrace();
        }
         
    }
}

```

#### 多异常

- 有的时候一段代码会抛出多种异常，比如

```java
new FileInputStream(f);
Date d = sdf.parse("2016-06-03");
```

- 这段代码，会抛出 文件不存在异常 FileNotFoundException 和 解析异常ParseException 
  解决办法之一是分别进行catch

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date d = sdf.parse("2016-06-03");
		} catch (FileNotFoundException e) {
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		} catch (ParseException e) {
			System.out.println("日期格式解析错误");
			e.printStackTrace();
		}
	}
}

```

- 另一个种办法是把多个异常，放在一个catch里统一捕捉
- 这种方式从 JDK7开始支持，好处是捕捉的代码更紧凑，不足之处是，一旦发生异常，不能确定到底是哪种异常，需要通过instanceof 进行判断具体的异常类型

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date d = sdf.parse("2016-06-03");
		} catch (FileNotFoundException | ParseException e) {
			if (e instanceof FileNotFoundException)
				System.out.println("d:/LOL.exe不存在");
			if (e instanceof ParseException)
				System.out.println("日期格式解析错误");

			e.printStackTrace();
		}

	}
}

```

#### finally

- 当代码抛出一个异常时，就会终止方法中剩余代码的处理，并退出这个方法的执行
- 假设利用return语句从try语句块中退出，在方法返回前，finally子句的内容将被执行，如果finally子句中也有一个return语句，这个返回值将会覆盖原始的返回值
- 无论是否出现异常，finally中的代码都会被执行

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		
		File f= new File("d:/LOL.exe");
		
		try{
			System.out.println("试图打开 d:/LOL.exe");
			new FileInputStream(f);
			System.out.println("成功打开");
		}
		catch(FileNotFoundException e){
			System.out.println("d:/LOL.exe不存在");
			e.printStackTrace();
		}
		finally{
			System.out.println("无论文件是否存在， 都会执行的代码");
		}
	}
}

```

#### throws

- 考虑如下情况：
  主方法调用method1
  method1调用method2
  method2中打开文件
- method2中需要进行异常处理
  但是method2不打算处理，而是把这个异常通过throws抛出去
  那么method1就会接到该异常。 处理办法也是两种，要么是try catch处理掉，要么也是抛出去。
  method1选择本地try catch住 一旦try catch住了，就相当于把这个异常消化掉了，主方法在调用method1的时候，就不需要进行异常处理了

```java
package exception;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class TestException {

	public static void main(String[] args) {
		method1();

	}

	private static void method1() {
		try {
			method2();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private static void method2() throws FileNotFoundException {

		File f = new File("d:/LOL.exe");

		System.out.println("试图打开 d:/LOL.exe");
		new FileInputStream(f);
		System.out.println("成功打开");

	}
}

```

- throw和throws的区别
- 1)throws 出现在方法声明上，而throw通常都出现在方法体内。
- 2) throws 表示出现异常的一种可能性，并不一定会发生这些异常；throw则是抛出了异常，执行throw则一定抛出了某个异常对象。

### 异常分类

- 异常分类： 可查异常，运行时异常和错误3种 ，其中，运行时异常和错误又叫非可查异常

#### 可查异常

- 可查异常： CheckedException
- 可查异常即必须进行处理的异常，要么try catch住,要么往外抛，谁调用，谁处理，比如 FileNotFoundException
- 如果不处理，编译器，就不让你通过

```java
package exception;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
 
public class TestException {
 
    public static void main(String[] args) {
         
        File f= new File("d:/LOL.exe");
         
        try{
            System.out.println("试图打开 d:/LOL.exe");
            new FileInputStream(f);
            System.out.println("成功打开");
        }
        catch(FileNotFoundException e){
            System.out.println("d:/LOL.exe不存在");
            e.printStackTrace();
        }
         
    }
}

```

#### 运行异常

- 运行时异常RuntimeException指： 不是必须进行try catch的异常
- 常见运行时异常: 
  除数不能为0异常:ArithmeticException 
  下标越界异常:ArrayIndexOutOfBoundsException 
  空指针异常:NullPointerException 
- 在编写代码的时候，依然可以使用try catch throws进行处理，与可查异常不同之处在于，即便不进行try catch，也不会有编译错误
- Java之所以会设计运行时异常的原因之一，是因为下标越界，空指针这些运行时异常太过于普遍，如果都需要进行捕捉，代码的可读性就会变得很糟糕。

```java
package exception;
 
public class TestException {
 
    public static void main(String[] args) {
    	
    	//任何除数不能为0:ArithmeticException
    	int k = 5/0; 
    	
    	//下标越界异常：ArrayIndexOutOfBoundsException
    	int j[] = new int[5];
    	j[10] = 10;
    	
    	//空指针异常：NullPointerException
    	String str = null;
    	str.length();
   }
}

```

#### 错误

- 错误Error，指的是系统级别的异常，通常是内存用光了
- 在默认设置下，一般java程序启动的时候，最大可以使用16m的内存
- 如例不停的给StringBuffer追加字符，很快就把内存使用光了。抛出OutOfMemoryError
- 与运行时异常一样，错误也是不要求强制捕捉的

```java
package exception;
 
public class TestException {
 
    public static void main(String[] args) {
    
    	StringBuffer sb =new StringBuffer();
    	
    	for (int i = 0; i < Integer.MAX_VALUE; i++) {
			sb.append('a');
		}
    	
    }

}

```

![](http://stepimagewm.how2j.cn/2412.png)

### Throwable

- Throwable是类，Exception和Error都继承了该类
- 所以在捕捉的时候，也可以使用Throwable进行捕捉
- 异常分Error和Exception,Exception里又分运行时异常和可查异常。

```java
package exception;

import java.io.File;
import java.io.FileInputStream;

public class TestException {

	public static void main(String[] args) {

		File f = new File("d:/LOL.exe");

		try {
			new FileInputStream(f);
			//使用Throwable进行异常捕捉
		} catch (Throwable t) {
			// TODO Auto-generated catch block
			t.printStackTrace();
		}

	}
}

```

![](http://stepimagewm.how2j.cn/742.png)

### 自定义异常

#### 创建

- 一个英雄攻击另一个英雄的时候，如果发现另一个英雄已经挂了，就会抛出EnemyHeroIsDeadException
- 创建一个类EnemyHeroIsDeadException，并继承Exception
- 提供两个构造方法：无参的构造方法，带参的构造方法，并调用父类的对应的构造方法

```java
class EnemyHeroIsDeadException extends Exception{
    
	public EnemyHeroIsDeadException(){
		
	}
    public EnemyHeroIsDeadException(String msg){
        super(msg);
    }
}

```

#### 抛出

- 在Hero的attack方法中，当发现敌方英雄的血量为0的时候，抛出该异常
- 创建一个EnemyHeroIsDeadException实例
- 通过throw 抛出该异常
- 当前方法通过 throws 抛出该异常
- 在外部调用attack方法的时候，就需要进行捕捉，并且捕捉的时候，可以通过e.getMessage() 获取当时出错的具体原因

```java
package charactor;
 
public class Hero {
    public String name; 
    protected float hp;

    public void attackHero(Hero h) throws EnemyHeroIsDeadException{
    	if(h.hp == 0){
    		throw new EnemyHeroIsDeadException(h.name + " 已经挂了,不需要施放技能" );
    	}
    }

    public String toString(){
    	return name;
    }
    
    class EnemyHeroIsDeadException extends Exception{
        
    	public EnemyHeroIsDeadException(){
    		
    	}
        public EnemyHeroIsDeadException(String msg){
            super(msg);
        }
    }
     
    public static void main(String[] args) {
    	
        Hero garen =  new Hero();
        garen.name = "盖伦";
        garen.hp = 616;

        Hero teemo =  new Hero();
        teemo.name = "提莫";
        teemo.hp = 0;
        
        try {
			garen.attackHero(teemo);
			
		} catch (EnemyHeroIsDeadException e) {
			// TODO Auto-generated catch block
			System.out.println("异常的具体原因:"+e.getMessage());
			e.printStackTrace();
		}
        
    }
}

```

![](http://stepimagewm.how2j.cn/744.png)

[特别感谢](http://how2j.cn/k/exception/exception-tutorial/332.html)

### API

```java
"Throwable构造方法摘要 "
Throwable() 
         " 构造一个将 null 作为其详细消息的新 throwable。" 
Throwable(String message) 
          "构造带指定详细消息的新 throwable。" 
Throwable(String message, Throwable cause) 
          "构造一个带指定详细消息和 cause 的新 throwable。" 
Throwable(Throwable cause) 
          "构造一个带指定 cause 和 (cause==null ? null :cause.toString())（它通常包含类和 cause 的			详细消息）的详细消息的新 throwable。" 

```

```java
"Throwable方法摘要" 
 Throwable fillInStackTrace() 
          "在异常堆栈跟踪中填充。" 
 Throwable getCause() 
          "返回此 throwable 的 cause；如果 cause 不存在或未知，则返回 null。" 
 String getLocalizedMessage() 
         " 创建此 throwable 的本地化描述。" 
 String getMessage() 
          "返回此 throwable 的详细消息字符串。" 
 StackTraceElement[] getStackTrace() 
         " 提供编程访问由 printStackTrace() 输出的堆栈跟踪信息。" 
 Throwable initCause(Throwable cause) 
          "将此 throwable 的 cause 初始化为指定值。" 
 void printStackTrace() 
          "将此 throwable 及其追踪输出至标准错误流。" 
 void printStackTrace(PrintStream s) 
         " 将此 throwable 及其追踪输出到指定的输出流。" 
 void printStackTrace(PrintWriter s) 
         " 将此 throwable 及其追踪输出到指定的 PrintWriter。" 
 void setStackTrace(StackTraceElement[] stackTrace) 
         " 设置将由 getStackTrace() 返回，并由 printStackTrace() 和相关方法输出的堆栈跟踪元素。" 
 String toString() 
         " 返回此 throwable 的简短描述。" 

```



## 断言

- 在防御式编程中经常会用断言（Assertion）对参数和环境做出判断，避免程序因不当的输入或错误的环境而产生逻辑异常，断言在很多语言中都存在
- 在Java中的断言使用的是assert关键字

[详细参考](http://www.cnblogs.com/DreamDrive/p/5417283.html)

## 日志

- 一般在最开始写代码的时候总是会在代码中加入一些System.out.println方法的语句来观察代码运行的情况。这样需要反复加入和修改，日志API就是为了解决这个问题。
- **java.util.logging**包就是JDK的日志开发包。

[详细参考](https://www.cnblogs.com/xt0810/p/3659045.html)

## 调试

### JavaDebug

- 这是一个有for循环的Java代码，利于观察设置断点的效果

```java
public class HelloWorld {
    public static void main(String[] args) {
 
        int moneyEachDay = 0;
        int day = 10;
        int sum=0;
        for (int i = 1; i <= day; i++) {
            if(0==moneyEachDay)
                moneyEachDay = 1;
            else
                moneyEachDay *= 2;
             
            sum+=moneyEachDay;
             
            System.out.println(i + " 天之后，洪帮主手中的钱总数是: " + sum );
        }
    }
 
}

```

- 断点概念： 断点就是指在调试模式下，当代码运行到断点这个位置的时候，就会停下来，便于开发者观察相关数据，进行代码逻辑的分析，排错。

![](http://stepimagewm.how2j.cn/5609.png)

- 在平时用运行按钮左边， 有个虫子按钮，就是debug按钮。
- 需要注意的是，当前类，一定要有主方法，否则就会调试到 上一次成功运行的程序

![](http://stepimagewm.how2j.cn/5610.png)

- 如果是第一次运行，会弹出一个对话框询问是否要切换到调试视觉, 点击YES。

![](http://stepimagewm.how2j.cn/5611.png)

- 点击右上角的Debug旁边的 Java，就可以切换回原来熟悉的Java 开发环境了

![](http://stepimagewm.how2j.cn/5612.png)

- 在调试视觉，需要关注的是这么4个区域
- 1)当前是哪个线程，因为是非多线程程序，所以就是主线程
- 2)对第八行运行有影响的几个变量的值，这个就是调试的主要作用，观察这些值的多少，进行分析问题所在或者理解代码逻辑
- 3)当前代码，表示马上就要运行第八行，但是还没有来得及运行第八行
- 4)控制台输出

![](http://stepimagewm.how2j.cn/5613.png)

- 点击这个按钮，就可以一行一行的执行了，或者用快捷键F6

![](http://stepimagewm.how2j.cn/5614.png)

- 这是调试期间主要需要注意的区域，通过观察，分析，理解这些值的变化来加强对代码的理解，或者寻找代码的错误所在

![](http://stepimagewm.how2j.cn/5615.png)

- 红色按钮，点击退出

![](http://stepimagewm.how2j.cn/5616.png)

### WebDebug

![](http://stepimagewm.how2j.cn/5621.png)

- 1)当前是哪个线程，Tomcat里有个线程池，所以会有多个线程，而当前线程是 :http-bio-8080=exec-3。
- 2)对第13行运行有影响的几个变量的值，比如request和response对象。
- 3)当前代码，表示马上就要运行第13行，但是还没有来得及运行第13行
- 4)控制台输出

参考自：http://how2j.cn/k/debug/debug-multipe-console/1717.html