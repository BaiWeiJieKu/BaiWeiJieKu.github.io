---
layout: post
title: "java基础复习十二Lambda"
categories: java基础
tags: java基础 Lambda
author: 百味皆苦
music-id: 537721600
---

* content
{:toc}
## Lambda

- 假设一个情景： 找出满足条件的Hero 

### 普通方法

- 使用一个普通方法，在for循环遍历中进行条件判断，筛选出满足条件的数据
- `hp>100 && damage<50`

```java

package charactor;
    
public class Hero implements Comparable<Hero>{
    public String name; 
    public float hp;
       
    public int damage;
       
    public Hero(){
          
    }
      
    public Hero(String name) {
        this.name =name;
  
    }
      
    //初始化name,hp,damage的构造方法
    public Hero(String name,float hp, int damage) {
        this.name =name;
        this.hp = hp;
        this.damage = damage;
    }
  
    @Override
    public int compareTo(Hero anotherHero) {
        if(damage<anotherHero.damage)
            return 1;  
        else
            return -1;
    }
  
    @Override
    public String toString() {
        return "Hero [name=" + name + ", hp=" + hp + ", damage=" + damage + "]\r\n";
    }
      
}

```

```java
package lambda;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
 
import charactor.Hero;
 
public class TestLambda {
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 10; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        System.out.println("初始化后的集合：");
        System.out.println(heros);
        System.out.println("筛选出 hp>100 && damange<50的英雄");
        filter(heros);
    }
 
    private static void filter(List<Hero> heros) {
        for (Hero hero : heros) {
            if(hero.hp>100 && hero.damage<50)
                System.out.print(hero);
        }
    }
 
}

```

![](http://stepimagewm.how2j.cn/2551.png)



### 匿名类

- 首先准备一个接口HeroChecker，提供一个test(Hero)方法
- 然后通过匿名类的方式，实现这个接口
- 接着调用filter，传递这个checker进去进行判断，这种方式就很像通过Collections.sort在对一个Hero集合排序，需要传一个[Comparator](http://how2j.cn/k/collection/collection-comparator-comparable/693.html#step828)的匿名类对象进去一样。

```java

package lambda;

import charactor.Hero;

public interface HeroChecker {
	public boolean test(Hero h);
}

```

```java
package lambda;
  
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
  
import charactor.Hero;
  
public class TestLambda {
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 5; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        System.out.println("初始化后的集合：");
        System.out.println(heros);
        System.out.println("使用匿名类的方式，筛选出 hp>100 && damange<50的英雄");
        HeroChecker checker = new HeroChecker() {
            @Override
            public boolean test(Hero h) {
                return (h.hp>100 && h.damage<50);
            }
        };
          
        filter(heros,checker);
    }
  
    private static void filter(List<Hero> heros,HeroChecker checker) {
        for (Hero hero : heros) {
            if(checker.test(hero))
                System.out.print(hero);
        }
    }
  
}

```

![](http://stepimagewm.how2j.cn/2552.png)



### Lambda

- 使用Lambda方式筛选出数据
- `filter(heros,(h)->h.hp>100 && h.damage<50);`
- 同样是调用filter方法，从上一步的传递匿名类对象，变成了传递一个Lambda表达式进去
- `h->h.hp>100 && h.damage<50`

```java
package lambda;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import charactor.Hero;

public class TestLamdba {
	public static void main(String[] args) {
		Random r = new Random();
		List<Hero> heros = new ArrayList<Hero>();
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
		}
		System.out.println("初始化后的集合：");
		System.out.println(heros);
		System.out.println("使用Lamdba的方式，筛选出 hp>100 && damange<50的英雄");
		filter(heros,h->h.hp>100 && h.damage<50);
	}

	private static void filter(List<Hero> heros,HeroChecker checker) {
		for (Hero hero : heros) {
			if(checker.test(hero))
				System.out.print(hero);
		}
	}

}

```

### 匿名方法

- Lambda 其实就是匿名方法，这是一种把方法作为参数进行传递的编程思想。
- `filter(heros, h -> h.hp > 100 && h.damage < 50);`
- 引入Lambda表达式，会使得代码更加紧凑，而不是各种接口和匿名类到处飞。



### 弊端

- Lambda表达式虽然带来了代码的简洁，但是也有其局限性。
- 可读性差，与啰嗦的但是清晰的匿名类代码结构比较起来，Lambda表达式一旦变得比较长，就难以理解
- 便于调试，很难在Lambda表达式中增加调试信息，比如日志
- 版本支持，Lambda表达式在JDK8版本中才开始支持
- Lambda比较适合用在简短的业务代码中，并不适合用在复杂的系统中，会加大维护成本。



## 方法引用

### 静态方法

```java
package lambda;
  
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
  
import charactor.Hero;
  
public class TestLambda {
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 5; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        System.out.println("初始化后的集合：");
        System.out.println(heros);
          
        HeroChecker c = new HeroChecker() {
            public boolean test(Hero h) {
                return h.hp>100 && h.damage<50;
            }
        };
         
        System.out.println("使用匿名类过滤");
        filter(heros, c);
        System.out.println("使用Lambda表达式");
        filter(heros, h->h.hp>100 && h.damage<50);
        System.out.println("在Lambda表达式中使用静态方法");
        filter(heros, h -> TestLambda.testHero(h) );
        System.out.println("直接引用静态方法");
        filter(heros, TestLambda::testHero);
    }
      
    public static boolean testHero(Hero h) {
        return h.hp>100 && h.damage<50;
    }
      
    private static void filter(List<Hero> heros, HeroChecker checker) {
        for (Hero hero : heros) {
            if (checker.test(hero))
                System.out.print(hero);
        }
    }
  
}

```

![](http://stepimagewm.how2j.cn/2560.png)



### 对象方法

```java
package lambda;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import charactor.Hero;

public class TestLambda {
	public static void main(String[] args) {
		Random r = new Random();
		List<Hero> heros = new ArrayList<Hero>();
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
		}
		System.out.println("初始化后的集合：");
		System.out.println(heros);
	
		System.out.println("使用引用对象方法  的过滤结果：");
		//使用类的对象方法
		TestLambda testLambda = new TestLambda();
		filter(heros, testLambda::testHero);
	}
	
	public boolean testHero(Hero h) {
		return h.hp>100 && h.damage<50;
	}
	
	private static void filter(List<Hero> heros, HeroChecker checker) {
		for (Hero hero : heros) {
			if (checker.test(hero))
				System.out.print(hero);
		}
	}

}

```

![](http://stepimagewm.how2j.cn/2561.png)



### 引用容器

```java
package lambda;
  
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
  
import charactor.Hero;
  
public class TestLambda {
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 5; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        System.out.println("初始化后的集合：");
        System.out.println(heros);
        
        System.out.println("Lambda表达式：");        
        filter(heros,h-> h.hp>100 && h.damage<50 );

        System.out.println("Lambda表达式中调用容器中的对象的matched方法：");        
        filter(heros,h-> h.matched() );
 
        System.out.println("引用容器中对象的方法 之过滤结果：");        
        filter(heros, Hero::matched);
    }
      
    public boolean testHero(Hero h) {
        return h.hp>100 && h.damage<50;
    }
      
    private static void filter(List<Hero> heros, HeroChecker checker) {
        for (Hero hero : heros) {
            if (checker.test(hero))
                System.out.print(hero);
        }
    }
  
}

```

![](http://stepimagewm.how2j.cn/2562.png)



### 构造器

```java
package lambda;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

public class TestLambda {
    public static void main(String[] args) {
	Supplier<List> s = new Supplier<List>() {
		public List get() {
			return new ArrayList();
		}
	};

	//匿名类
	List list1 = getList(s);
	
	//Lambda表达式
	List list2 = getList(()->new ArrayList());
	
	//引用构造器
	List list3 = getList(ArrayList::new);

    }
    
    public static List getList(Supplier<List> s){
    	return s.get();
    }
     
}

```



## 聚合操作

- 要了解聚合操作，首先要建立Stream和管道的概念
- Stream 和Collection结构化的数据不一样，Stream是一系列的元素，就像是生产线上的罐头一样，一串串的出来。
- 管道指的是一系列的聚合操作。
- 管道又分3个部分
  管道源：在这个例子里，源是一个List
  中间操作： 每个中间操作，又会返回一个Stream，比如.filter()又返回一个Stream, 中间操作是“懒”操作，并不会真正进行遍历。
  结束操作：当这个操作执行后，流就被使用“光”了，无法再被操作。所以这必定是流的最后一个操作。 结束操作不会返回Stream，但是会返回int、float、String、 Collection或者像forEach，什么都不返回, 结束操作才进行真正的遍历行为，在遍历的时候，才会去进行中间操作的相关判断
- 这个Stream和I/O章节的InputStream,OutputStream是不一样的概念。

```java
package lambda;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import charactor.Hero;

public class TestAggregate {

	public static void main(String[] args) {
		Random r = new Random();
		List<Hero> heros = new ArrayList<Hero>();
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
		}

		System.out.println("初始化后的集合：");
		System.out.println(heros);
		System.out.println("查询条件：hp>100 && damage<50");
		System.out.println("通过传统操作方式找出满足条件的数据：");

		for (Hero h : heros) {
			if (h.hp > 100 && h.damage < 50)
				System.out.println(h.name);
		}

		System.out.println("通过聚合操作方式找出满足条件的数据：");
		heros
			.stream()
			.filter(h -> h.hp > 100 && h.damage < 50)
			.forEach(h -> System.out.println(h.name));

	}
}

```



### 管道源

```java
package lambda;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import charactor.Hero;

public class TestAggregate {

	public static void main(String[] args) {
		Random r = new Random();
		List<Hero> heros = new ArrayList<Hero>();
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
		}
		//管道源是集合
		heros
		.stream()
		.forEach(h->System.out.println(h.name));
		
		//管道源是数组
		Hero hs[] = heros.toArray(new Hero[heros.size()]);
		Arrays.stream(hs)
		.forEach(h->System.out.println(h.name));
		
	}
}

```



### 中间操作

- 每个中间操作，又会返回一个Stream，比如.filter()又返回一个Stream, 中间操作是“懒”操作，并不会真正进行遍历。
- 中间操作比较多，主要分两类
- 对元素进行筛选 和 转换为其他形式的流
- 对元素进行筛选：
  filter 匹配
  distinct 去除重复(根据equals判断)
  sorted 自然排序
  sorted(Comparator<T>) 指定排序
  limit 保留
  skip 忽略
- 转换为其他形式的流
  mapToDouble 转换为double的流
  map 转换为任意类型的流

```java
package charactor;
     
public class Hero implements Comparable<Hero>{
    public String name; 
    public float hp;
        
    public int damage;
        
    public Hero(){
           
    }
    public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getHp() {
		return hp;
	}
	public void setHp(float hp) {
		this.hp = hp;
	}
	public int getDamage() {
		return damage;
	}
	public void setDamage(int damage) {
		this.damage = damage;
	}
	public Hero(String name) {
        this.name =name;
    }
    //初始化name,hp,damage的构造方法
    public Hero(String name,float hp, int damage) {
        this.name =name;
        this.hp = hp;
        this.damage = damage;
    }
   
    @Override
    public int compareTo(Hero anotherHero) {
        if(damage<anotherHero.damage)
            return 1;  
        else
            return -1;
    }
   
    @Override
    public String toString() {
        return "Hero [name=" + name + ", hp=" + hp + ", damage=" + damage + "]\r\n";
    }
       
}

```

```java


package lambda;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import charactor.Hero;
 
public class TestAggregate {
 
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 5; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        //制造一个重复数据
        heros.add(heros.get(0));
        System.out.println("初始化集合后的数据 (最后一个数据重复)：");
        System.out.println(heros);
        System.out.println("满足条件hp>100&&damage<50的数据");
         
        heros
            .stream()
            .filter(h->h.hp>100&&h.damage<50)
            .forEach(h->System.out.print(h));
         
        System.out.println("去除重复的数据，去除标准是看equals");
        heros
            .stream()
            .distinct()
            .forEach(h->System.out.print(h));
        System.out.println("按照血量排序");
        heros
            .stream()
            .sorted((h1,h2)->h1.hp>=h2.hp?1:-1)
            .forEach(h->System.out.print(h));
         
        System.out.println("保留3个");
        heros
            .stream()
            .limit(3)
            .forEach(h->System.out.print(h));
         
        System.out.println("忽略前3个");
        heros
            .stream()
            .skip(3)
            .forEach(h->System.out.print(h));
         
        System.out.println("转换为double的Stream");
        heros
            .stream()
            .mapToDouble(Hero::getHp)
            .forEach(h->System.out.println(h));
         
        System.out.println("转换任意类型的Stream");
        heros
            .stream()
            .map((h)-> h.name + " - " + h.hp + " - " + h.damage)
            .forEach(h->System.out.println(h));
         
    }
}

```

![](http://stepimagewm.how2j.cn/2568.png)



### 结束操作

- 当进行结束操作后，流就被使用“光”了，无法再被操作。所以这必定是流的最后一个操作。 结束操作不会返回Stream，但是会返回int、float、String、 Collection或者像forEach，什么都不返回,。
- 结束操作才真正进行遍历行为，前面的中间操作也在这个时候，才真正的执行。
- 常见结束操作如下：
  forEach() 遍历每个元素
  toArray() 转换为数组
  `min(Comparator<T>)` 取最小的元素
  `max(Comparator<T>) `取最大的元素
  count() 总数
  findFirst() 第一个元素

```java
package lambda;
 
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.omg.Messaging.SYNC_WITH_TRANSPORT;

import charactor.Hero;
 
public class TestAggregate {
 
    public static void main(String[] args) {
        Random r = new Random();
        List<Hero> heros = new ArrayList<Hero>();
        for (int i = 0; i < 5; i++) {
            heros.add(new Hero("hero " + i, r.nextInt(1000), r.nextInt(100)));
        }
        System.out.println("遍历集合中的每个数据");
        heros
            .stream()
            .forEach(h->System.out.print(h));
        System.out.println("返回一个数组");
        Object[] hs= heros
	        .stream()
	        .toArray();
        System.out.println(Arrays.toString(hs));
        System.out.println("返回伤害最低的那个英雄");
        Hero minDamageHero =
        heros
	        .stream()
	        .min((h1,h2)->h1.damage-h2.damage)
	        .get();
        System.out.print(minDamageHero);
        System.out.println("返回伤害最高的那个英雄");

        Hero mxnDamageHero =
                heros
                .stream()
                .max((h1,h2)->h1.damage-h2.damage)
                .get();
        System.out.print(mxnDamageHero);      
        
        System.out.println("流中数据的总数");
        long count = heros
        		.stream()
        		.count();
        System.out.println(count);

        System.out.println("第一个英雄");
        Hero firstHero =
                heros
                .stream()
                .findFirst()
                .get();
        
        System.out.println(firstHero);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2569.png)

本文章参考自：http://how2j.cn