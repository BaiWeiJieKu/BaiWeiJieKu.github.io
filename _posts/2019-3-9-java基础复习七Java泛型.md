---
layout: post
title: "java基础复习七Java泛型"
categories: java基础
tags: java基础 泛型
author: 百味皆苦
music-id: 29095694
---

* content
{:toc}
## 集合泛型

### 不用泛型

- 不使用泛型带来的问题
- ADHero（物理攻击英雄） APHero（魔法攻击英雄）都是Hero的子类
- ArrayList 默认接受Object类型的对象，所以所有对象都可以放进ArrayList中
- 所以get(0) 返回的类型是Object
- 接着，需要进行强制转换才可以得到APHero类型或者ADHero类型。
- 如果软件开发人员记忆比较好，能记得哪个是哪个，还是可以的。 但是开发人员会犯错误，比如第20行，会记错，把第0个对象转换为ADHero,这样就会出现类型转换异常

```java
package generic;

import java.util.ArrayList;

import charactor.ADHero;
import charactor.APHero;

public class TestGeneric {

	public static void main(String[] args) {
		
		ArrayList heros = new ArrayList();
		
		heros.add(new APHero());
		heros.add(new ADHero());
		
		APHero apHero =  (APHero) heros.get(0);
		ADHero adHero =  (ADHero) heros.get(1);
		
		ADHero adHero2 =  (ADHero) heros.get(0);
	}
}

```

### 使用泛型

- 使用泛型的好处：泛型表示这种容器，只能存放APHero，ADHero就放不进去了。

```java
package generic;

import java.util.ArrayList;

import charactor.APHero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<APHero> heros = new ArrayList<APHero>();
		
		//只有APHero可以放进去		
		heros.add(new APHero());
		
		//ADHero甚至放不进去
		//heros.add(new ADHero());
		
		//获取的时候也不需要进行转型，因为取出来一定是APHero
		APHero apHero =  heros.get(0);
		
	}
}

```

### 子类对象

- 假设容器的泛型是Hero,那么Hero的子类APHero,ADHero都可以放进去
- 和Hero无关的类型Item还是放不进去

```java
package generic;

import java.util.ArrayList;

import property.Item;

import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<Hero> heros = new ArrayList<Hero>();
		
		//只有作为Hero的子类可以放进去		
		heros.add(new APHero());
		heros.add(new ADHero());
		
		//和Hero无关的类型Item还是放不进去
		//heros.add(new Item());
		
	}
}

```

### 泛型简写

- 为了不使编译器出现警告，需要前后都使用泛型，像这样：

```java
ArrayList<Hero> heros = new ArrayList<Hero>();
```

- 不过JDK7提供了一个可以略微减少代码量的泛型简写方式

```java
ArrayList<Hero> heros2 = new ArrayList<>();
```

## 泛型类

- 设计一个支持泛型的栈MyStack
- 设计这个类的时候，在类的声明上，加上一个`<T>`，表示该类支持泛型。
- T是type的缩写，也可以使用任何其他的合法的变量，比如A,B,X都可以，但是一般约定成俗使用T，代表类型。

```java
package generic;
  
import java.util.HashMap;
import java.util.LinkedList;

import charactor.Hero;
import property.Item;
  
public class MyStack<T> {
  
    LinkedList<T> values = new LinkedList<T>();
      
    public void push(T t) {
        values.addLast(t);
    }
  
    public T pull() {
        return values.removeLast();
    }
  
    public T peek() {
        return values.getLast();
    }
      
    public static void main(String[] args) {
    	//在声明这个Stack的时候，使用泛型<Hero>就表示该Stack只能放Hero
    	MyStack<Hero> heroStack = new MyStack<>();
        heroStack.push(new Hero());
        //不能放Item
        heroStack.push(new Item());
        
    	//在声明这个Stack的时候，使用泛型<Item>就表示该Stack只能放Item
    	MyStack<Item> itemStack = new MyStack<>();
    	itemStack.push(new Item());
        //不能放Hero
    	itemStack.push(new Hero());
    }
  
}

```

## 通配符

### ? extends

- ArrayList heroList<? extends Hero> 表示这是一个Hero泛型或者其子类泛型
- heroList 的泛型可能是Hero，可能是APHero，可能是ADHero
- 所以 可以确凿的是，从heroList取出来的对象，一定是可以转型成Hero的

![](http://stepimagewm.how2j.cn/837.png)

```java
package generic;
  
import java.util.ArrayList;
 
import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;
  
public class TestGeneric {
  
    public static void main(String[] args) {
         
        ArrayList<APHero> apHeroList = new ArrayList<APHero>();
        apHeroList.add(new APHero());
        
        ArrayList<? extends Hero> heroList = apHeroList;
         
        //? extends Hero 表示这是一个Hero泛型的子类泛型
         
        //heroList 的泛型可以是Hero
        //heroList 的泛型可以使APHero
        //heroList 的泛型可以使ADHero
         
        //可以确凿的是，从heroList取出来的对象，一定是可以转型成Hero的
         
        Hero h= heroList.get(0);
         
        //但是，不能往里面放东西
        heroList.add(new ADHero()); //编译错误，因为heroList的泛型 有可能是APHero
         
    }
     
}

```

### ? super

- ArrayList heroList<? super Hero> 表示这是一个Hero泛型或者其父类泛型
- heroList的泛型可能是Hero,可能是Object
- 可以往里面插入Hero以及Hero的子类,但是取出来有风险，因为不确定取出来是Hero还是Object

![](http://stepimagewm.how2j.cn/838.png)

```java
package generic;
 
import java.util.ArrayList;
 
import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;
 
public class TestGeneric {
    public static void main(String[] args) {
 
        ArrayList<? super Hero> heroList = new ArrayList<Object>();
         
        //? super Hero 表示 heroList的泛型是Hero或者其父类泛型
         
        //heroList 的泛型可以是Hero
        //heroList 的泛型可以是Object
         
        //所以就可以插入Hero
        heroList.add(new Hero());
        //也可以插入Hero的子类
        heroList.add(new APHero());
        heroList.add(new ADHero());
         
        //但是，不能从里面取数据出来,因为其泛型可能是Object,而Object是强转Hero会失败
        Hero h= heroList.get(0);
         
    }
 
}

```

### 泛型通配符?

- 泛型通配符? 代表任意泛型
- 既然?代表任意泛型，那么换句话说，这个容器什么泛型都有可能
- 所以只能以Object的形式取出来
- 并且不能往里面放对象，因为不知道到底是一个什么泛型的容器

```java
package generic;
 
import java.util.ArrayList;

import property.Item;
import charactor.APHero;
import charactor.Hero;
 
public class TestGeneric {
 
    public static void main(String[] args) {
 
        ArrayList<APHero> apHeroList = new ArrayList<APHero>();
        
        //?泛型通配符，表示任意泛型
        ArrayList<?> generalList = apHeroList;

        //?的缺陷1： 既然?代表任意泛型，那么换句话说，你就不知道这个容器里面是什么类型
        //所以只能以Object的形式取出来
        Object o = generalList.get(0);

        //?的缺陷2： 既然?代表任意泛型，那么既有可能是Hero,也有可能是Item
        //所以，放哪种对象进去，都有风险，结果就什么什么类型的对象，都不能放进去
        generalList.add(new Item()); //编译错误 因为?代表任意泛型，很有可能不是Item
        generalList.add(new Hero()); //编译错误 因为?代表任意泛型，很有可能不是Hero
        generalList.add(new APHero()); //编译错误  因为?代表任意泛型，很有可能不是APHero
 
    }
}

```

### 总结

- 如果希望只取出，不插入，就使用? extends Hero
- 如果希望只插入，不取出，就使用? super Hero
- 如果希望，又能插入，又能取出，就不要用通配符？

## 泛型转型

### 对象转型

- 根据面向对象学习的知识，[子类转父类](http://how2j.cn/k/interface-inheritance/interface-inheritance-casting/308.html#step624) 是一定可以成功的

```java
package generic;

import charactor.ADHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {

		Hero h = new Hero();
		ADHero ad = new ADHero();
		//子类转父类
		h = ad;
	}

}

```

### 子转父

- 子类泛型不可以转换为父类泛型

![](http://stepimagewm.how2j.cn/835.png)

```java
package generic;

import java.util.ArrayList;

import charactor.ADHero;
import charactor.APHero;
import charactor.Hero;

public class TestGeneric {

	public static void main(String[] args) {
		ArrayList<Hero> hs =new ArrayList<>();
		ArrayList<ADHero> adhs =new ArrayList<>();

		//假设能转换成功
		hs = adhs;
		
		//作为Hero泛型的hs,是可以向其中加入APHero的
		//但是hs这个引用，实际上是指向的一个ADHero泛型的容器
		//如果能加进去，就变成了ADHero泛型的容器里放进了APHero，这就矛盾了
		hs.add(new APHero());
	}

}

```

本文章引用自：http://how2j.cn/