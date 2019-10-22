---
layout: post
title: "java基础复习八Java集合"
categories: java基础
tags: java基础 集合
author: 百味皆苦
music-id: 139718
---

* content
{:toc}
## ArrayList

### 区别数组

#### 数组局限

- 如果要存放多个对象，可以使用数组，但是数组有局限性
- 比如 声明长度是10的数组，不用的数组就浪费了，超过10的个数，又放不下

```java
package collection;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		//数组的局限性
		Hero heros[] = new Hero[10];
		//声明长度是10的数组
		//不用的数组就浪费了
		//超过10的个数，又放不下
		heros[0] = new Hero("盖伦");
                //放不下要报错
		heros[20] = new Hero("提莫");
		
	}
	
}


```

#### 存放对象

- 为了解决数组的局限性，引入容器类的概念。 最常见的容器类就是 ArrayList 
- [容器的容量](http://how2j.cn/k/number-string/number-string-stringbuilder/328.html#step724)"capacity"会随着对象的增加，自动增长 
- 只需要不断往容器里增加英雄即可，不用担心会出现数组的边界问题

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	@SuppressWarnings("rawtypes")
	public static void main(String[] args) {
		//容器类ArrayList，用于存放对象
		ArrayList heros = new ArrayList();
		heros.add( new Hero("盖伦"));
		System.out.println(heros.size());
		
		//容器的容量"capacity"会随着对象的增加，自动增长
		//只需要不断往容器里增加英雄即可，不用担心会出现数组的边界问题。
		heros.add( new Hero("提莫"));
		System.out.println(heros.size());
		
	}
	
}

```

### 常用方法

#### 增加

- add 有两种用法
- 第一种是直接add对象，把对象加在最后面`heros.add(new Hero("hero " + i));`
- 第二种是在指定位置加对象`heros.add(3, specialHero);`

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 把5个对象加入到ArrayList中
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		System.out.println(heros);

		// 在指定位置增加对象
		Hero specialHero = new Hero("special hero");
		heros.add(3, specialHero);

		System.out.println(heros.toString());

	}

}

```

![](http://stepimagewm.how2j.cn/2453.png)

#### 判断

- 通过方法contains 判断一个对象是否在容器中
- 判断标准： 是否是同一个对象，而不是name是否相同

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);

		System.out.println(heros);
		// 判断一个对象是否在容器中
		// 判断标准： 是否是同一个对象，比较的是内存地址，而不是name是否相同
		System.out.print("虽然一个新的对象名字也叫 hero 1，但是contains的返回是:");
		System.out.println(heros.contains(new Hero("hero 1")));
		System.out.print("而对specialHero的判断，contains的返回是:");
		System.out.println(heros.contains(specialHero));
	}

}

```

![](http://stepimagewm.how2j.cn/2454.png)

#### 获取

- 通过get获取指定位置的对象（从0开始），如果输入的下标越界，一样会报错

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);
		
		//获取指定位置的对象
		System.out.println(heros.get(5));
		//如果超出了范围，依然会报错
		System.out.println(heros.get(6));

	}

}

```

![](http://stepimagewm.how2j.cn/2455.png)

#### 位置

- indexOf用于判断一个对象在ArrayList中所处的位置
- 与[contains](http://how2j.cn/k/collection/collection-arraylist-method/685.html#step2454)一样，判断标准是对象是否相同，而非对象的name值是否相等

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);

		System.out.println(heros);
		System.out.println("specialHero所处的位置:"+heros.indexOf(specialHero));
		System.out.println("新的英雄，但是名字是\"hero 1\"所处的位置:"+heros.indexOf(new Hero("hero 1")));

	}
}

```

![](http://stepimagewm.how2j.cn/2456.png)

#### 删除

- remove用于把对象从ArrayList中删除
- remove可以根据下标删除ArrayList的元素`heros.remove(2);`
- 也可以根据对象删除,`heros.remove(specialHero);`

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);
		
		System.out.println(heros);
		heros.remove(2);
		System.out.println("删除下标是2的对象");
		System.out.println(heros);
		System.out.println("删除special hero");
		heros.remove(specialHero);
		System.out.println(heros);
		
	}
}

```

![](http://stepimagewm.how2j.cn/2457.png)

#### 替换

- set用于替换指定位置的元素

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);
		
		System.out.println(heros);
		System.out.println("把下标是5的元素，替换为\"hero 5\"");
		heros.set(5, new Hero("hero 5"));
		System.out.println(heros);
	}
}

```

![](http://stepimagewm.how2j.cn/2458.png)

#### 大小

- size 用于获取ArrayList的大小

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}
		Hero specialHero = new Hero("special hero");
		heros.add(specialHero);
		System.out.println(heros);
		System.out.println("获取ArrayList的大小：");
		System.out.println(heros.size());
	}
}

```

![](http://stepimagewm.how2j.cn/2459.png)

#### 变数组

- toArray可以把一个ArrayList对象转换为数组。
- 需要注意的是，该方法是一个泛型方法：`<T> T[] toArray(T[] a);` 如果`toArray`方法中没有传递任何参数的话返回的是`Object`类型数组。

```java
String [] s= new String[]{
    "dog", "lazy", "a", "over", "jumps", "fox", "brown", "quick", "A"
};
List<String> list = Arrays.asList(s);
Collections.reverse(list);
s=list.toArray(new String[0]);//没有指定类型的话会报错

/*
由于JVM优化，new String[0]作为Collection.toArray()方法的参数现在使用更好，new String[0]就是起一个模板的作用，指定了返回数组的类型，0是为了节省空间，因为它只是为了说明返回的类型。
*/
```

#### 加所有

- addAll 把另一个容器所有对象都加进来

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}

		System.out.println("ArrayList heros:\t" + heros);
		 
		//把另一个容器里所有的元素，都加入到该容器里来
		ArrayList anotherHeros = new ArrayList();
		anotherHeros.add(new Hero("hero a"));
		anotherHeros.add(new Hero("hero b"));
		anotherHeros.add(new Hero("hero c"));
		System.out.println("anotherHeros heros:\t" + anotherHeros);
		heros.addAll(anotherHeros);
		System.out.println("把另一个ArrayList的元素都加入到当前ArrayList:");
		System.out.println("ArrayList heros:\t" + heros);
		
	}
}

```

![](http://stepimagewm.how2j.cn/2461.png)

#### 清空

- clear 清空一个ArrayList

```java
package collection;

import java.util.ArrayList;

import charactor.Hero;

public class TestCollection {
	public static void main(String[] args) {
		ArrayList heros = new ArrayList();

		// 初始化5个对象
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero " + i));
		}

		System.out.println("ArrayList heros:\t" + heros);
		System.out.println("使用clear清空");
		heros.clear();
		System.out.println("ArrayList heros:\t" + heros);
		 
	}
}

```

![](http://stepimagewm.how2j.cn/2462.png)

### List接口

- ArrayList实现了接口List
- 常见的写法会把引用声明为接口List类型
- 注意：是java.util.List,而不是java.awt.List

```java
package collection;
 
import java.util.ArrayList;
import java.util.List;

import charactor.Hero;
 
public class TestCollection {

    public static void main(String[] args) {
    	//ArrayList实现了接口List
    	
    	//常见的写法会把引用声明为接口List类型
    	//注意：是java.util.List,而不是java.awt.List
    	//接口引用指向子类对象（多态）
    	
        List heros = new ArrayList();
        heros.add( new Hero("盖伦"));
        System.out.println(heros.size());
        
    }
     
}

```

#### API

```java
"方法摘要 "
 void add(String item) 
         " 向滚动列表的末尾添加指定的项。 "
 void add(String item, int index) 
         " 向滚动列表中索引指示的位置添加指定的项。 "
 void addActionListener(ActionListener l) 
          "添加指定的动作侦听器以从此列表接收动作事件。 "
 void addItemListener(ItemListener l) 
          "添加指定的项侦听器以接收此列表的项事件。" 
 void addNotify() 
          "创建列表的同位体。"  
 void deselect(int index) 
         " 取消选择指定索引处的项。 "
 AccessibleContext getAccessibleContext() 
         " 获取与此 List 关联的 AccessibleContext。" 
 ActionListener[] getActionListeners() 
         " 返回已在此列表上注册的所有动作侦听器的数组。" 
 String getItem(int index) 
         " 获取与指定索引关联的项。" 
 int getItemCount() 
          "获取列表中的项数。 "
 ItemListener[] getItemListeners() 
         " 返回已在此列表上注册的所有项侦听器的数组。" 
 String[] getItems() 
          "获取列表中的项。" 
<T extends EventListener> T[] 
 getListeners(Class<T> listenerType) 
          "返回目前已在此 List 上注册为 FooListener 的所有对象的数组。 "
 Dimension getMinimumSize() 
          "确定此滚动列表的最小大小。" 
 Dimension getMinimumSize(int rows) 
         " 获取具有指定行数的列表的最少维数。" 
 Dimension getPreferredSize() 
          "获取此滚动列表的首选大小。" 
 Dimension getPreferredSize(int rows) 
         " 获取具有指定行数的列表的首选维数。 "
 int getRows() 
         " 获取此列表中的可视行数。 "
 int getSelectedIndex() 
         " 获取列表中选中项的索引。" 
 int[] getSelectedIndexes() 
         " 获取列表中选中的索引。" 
 String getSelectedItem() 
         " 获取此滚动列表中选中的项。 "
 String[] getSelectedItems() 
         " 获取此滚动列表中选中的项。" 
 Object[] getSelectedObjects() 
        "  获取对象数组中此滚动列表的选中项。 "
 int getVisibleIndex() 
         " 获取上次由 makeVisible 方法使其可视的项的索引。 "
 boolean isIndexSelected(int index) 
         " 确定是否已选中此滚动列表中的指定项。" 
 boolean isMultipleMode() 
          "确定此列表是否允许进行多项选择。"  
 void makeVisible(int index) 
         " 使指定索引处的项可视。" 
protected  String paramString() 
          "返回表示此滚动列表状态的参数字符串。"  
protected  void processActionEvent(ActionEvent e) 
         " 处理发生在此列表上的动作事件，方法是将这些事件指派给所有已注册的 ActionListener 对象。" 
protected  void processEvent(AWTEvent e) 
         " 此滚动列表的进程事件。" 
protected  void processItemEvent(ItemEvent e) 
          "处理发生在此列表上的项事件，方法是将这些事件指派给所有已注册的 ItemListener 对象。" 
 void remove(int position) 
          "从此滚动列表中移除指定位置处的项。" 
 void remove(String item) 
          "从列表中移除项的第一次出现。" 
 void removeActionListener(ActionListener l) 
          "移除指定的动作侦听器，以便不再从此列表接收动作事件。" 
 void removeAll() 
         " 从此列表中移除所有项。 "
 void removeItemListener(ItemListener l) 
         " 移除指定的项侦听器，以便不再从此列表接收项事件。 "
 void removeNotify() 
          "移除此列表的同位体。" 
 void replaceItem(String newValue, int index) 
         " 使用新字符串替换滚动列表中指定索引处的项。 "
 void select(int index) 
         " 选择滚动列表中指定索引处的项。" 
 void setMultipleMode(boolean b) 
         " 设置确定此列表是否允许进行多项选择的标志。" 
```

### 泛型

- 不指定泛型的容器，可以存放任何类型的元素
- 指定了泛型的容器，只能存放指定类型的元素以及其子类

```java
package property;

public class Item {
	String name;
	int price;
	
	public Item(){
		
	}
	
	//提供一个初始化name的构造方法
	public Item(String name){
		this.name = name;
	}
	
	public void effect(){
		System.out.println("物品使用后，可以有效果");
	}
	
}


```

```java

package collection;
  
import java.util.ArrayList;
import java.util.List;
 
import property.Item;
import charactor.APHero;
import charactor.Hero;
  
public class TestCollection {
 
    public static void main(String[] args) {
         
        //对于不使用泛型的容器，可以往里面放英雄，也可以往里面放物品
        List heros = new ArrayList();
         
        heros.add(new Hero("盖伦"));
         
        //本来用于存放英雄的容器，现在也可以存放物品了
        heros.add(new Item("冰杖"));
         
        //对象转型会出现问题
        Hero h1=  (Hero) heros.get(0);
        //尤其是在容器里放的对象太多的时候，就记不清楚哪个位置放的是哪种类型的对象了
        Hero h2=  (Hero) heros.get(1);
         
        //引入泛型Generic
        //声明容器的时候，就指定了这种容器，只能放Hero，放其他的就会出错
        List<Hero> genericheros = new ArrayList<Hero>();
        genericheros.add(new Hero("盖伦"));
        //如果不是Hero类型，根本就放不进去
        //genericheros.add(new Item("冰杖"));
         
        //除此之外，还能存放Hero的子类
        genericheros.add(new APHero());
        
        //并且在取出数据的时候，不需要再进行转型了，因为里面肯定是放的Hero或者其子类
        Hero h = genericheros.get(0);
        
    }
      
}

```

### 遍历

#### for

- 通过前面的学习，知道了可以用size()和get()分别得到大小，和获取指定位置的元素，结合for循环就可以遍历出ArrayList的内容

```java
package collection;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import charactor.Hero;

public class TestCollection {

	public static void main(String[] args) {
		List<Hero> heros = new ArrayList<Hero>();

		// 放5个Hero进入容器
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero name " + i));
		}

		// 第一种遍历 for循环
		System.out.println("--------for 循环-------");
		for (int i = 0; i < heros.size(); i++) {
			Hero h = heros.get(i);
			System.out.println(h);
		}

	}

}

```

![](http://stepimagewm.how2j.cn/2469.png)

#### 迭代器

- 使用迭代器Iterator遍历集合中的元素

```java
package collection;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import charactor.Hero;
 
public class TestCollection {

    public static void main(String[] args) {
    	List<Hero> heros = new ArrayList<Hero>();
    	
    	//放5个Hero进入容器
    	for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero name " +i));
		}
    	
    	//第二种遍历，使用迭代器
    	System.out.println("--------使用while的iterator-------");
    	Iterator<Hero> it= heros.iterator();
    	//从最开始的位置判断"下一个"位置是否有数据
    	//如果有就通过next取出来，并且把指针向下移动
    	//直到"下一个"位置没有数据
    	while(it.hasNext()){
    		Hero h = it.next();
    		System.out.println(h);
    	}
    	//迭代器的for写法
    	System.out.println("--------使用for的iterator-------");
    	for (Iterator<Hero> iterator = heros.iterator(); iterator.hasNext();) {
			Hero hero = (Hero) iterator.next();
			System.out.println(hero);
		}
    	
    }
     
}

```

![](http://stepimagewm.how2j.cn/806.png)

- **迭代器的注意点**：用for循环遍历集合，对集合中满足条件的元素进行remove操作报错：ConcurrentModificationException，所以，在遍历集合进行增、删操作时，要使用迭代器的方式

```java
package list;
 
import java.util.*;
 
public class Demo {
 
    public static void main(String[] args) {
        List<Object> obj = new ArrayList<Object>();
        obj.add("a");
        obj.add("b");
        obj.add("c");
        System.out.println("移除前：" + obj.toString());
        Iterator<Object> it = obj.iterator();
        for(int i=0; i<obj.size(); i++){
            System.out.println(i);
            Object name = it.next();
            if("a".equals(name) || "b".equals(name)){
                it.remove();
                i--;
            }
        }
        System.out.println("移除后： " + obj.toString());
         
    }
 
}
```

```java
package set;
 
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
 
public class Demo {
 
    public static void main(String[] args) {
        Set<Object> obj = new HashSet<Object>();
        obj.add("a");
        obj.add("b");
        obj.add("c");
        System.out.println("移除前：" + obj.toString());
        Iterator<Object> it = obj.iterator();
        for(int i=0; i<obj.size(); i++){
            System.out.println(i);
            Object name = it.next();
            if("a".equals(name) || "b".equals(name)){
                it.remove();
                i--;
            }
        }
        System.out.println("移除后： " + obj.toString());
         
    }
 
}
```



#### for-each

- 使用增强型for循环可以非常方便的遍历ArrayList中的元素，这是很多开发人员的首选。
- 不过增强型for循环也有不足：
  无法用来进行ArrayList的初始化
  无法得知当前是第几个元素了，当需要只打印单数元素的时候，就做不到了。 必须再自定下标变量。

```java
package collection;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import charactor.Hero;

public class TestCollection {

	public static void main(String[] args) {
		List<Hero> heros = new ArrayList<Hero>();

		// 放5个Hero进入容器
		for (int i = 0; i < 5; i++) {
			heros.add(new Hero("hero name " + i));
		}

		// 第三种，增强型for循环
		System.out.println("--------增强型for循环-------");
		for (Hero h : heros) {
			System.out.println(h);
		}

	}

}

```

![](http://stepimagewm.how2j.cn/2470.png)

## LinkedList

- 序列分先进先出FIFO,先进后出FILO 
- FIFO在Java中又叫Queue 队列 
- FILO在Java中又叫Stack 栈

### 双向链表

- 除了实现了List接口外，LinkedList还实现了双向链表结构Deque，可以很方便的在头尾插入删除数据
- 什么是链表结构: 与数组结构相比较，数组结构，就好像是电影院，每个位置都有标示，每个位置之间的间隔都是一样的。 而链表就相当于佛珠，每个珠子，只连接前一个和后一个，不用关心除此之外的其他佛珠在哪里。

```java
package collection;

import java.util.LinkedList;

import charactor.Hero;

public class TestCollection {

    public static void main(String[] args) {
    	
    	//LinkedList是一个双向链表结构的list
    	LinkedList<Hero> ll =new LinkedList<Hero>();
    	
    	//所以可以很方便的在头部和尾部插入数据
    	//在最后插入新的英雄
    	ll.addLast(new Hero("hero1"));
    	ll.addLast(new Hero("hero2"));
    	ll.addLast(new Hero("hero3"));
    	System.out.println(ll);
    	
    	//在最前面插入新的英雄
    	ll.addFirst(new Hero("heroX"));
    	System.out.println(ll);
    	
    	//查看最前面的英雄
    	System.out.println(ll.getFirst());
    	//查看最后面的英雄
    	System.out.println(ll.getLast());
    	
    	//查看不会导致英雄被删除
    	System.out.println(ll);
    	//取出最前面的英雄
    	System.out.println(ll.removeFirst());
    	
    	//取出最后面的英雄
    	System.out.println(ll.removeLast());
    	
    	//取出会导致英雄被删除
    	System.out.println(ll);
    	
    }
     
}

```

![](http://stepimagewm.how2j.cn/809.png)

### 队列

- LinkedList 除了实现了List和Deque外，还实现了Queue接口(队列)。
- Queue是先进先出队列 FIFO，常用方法：offer 在最后添加元素，poll 取出第一个元素，peek 查看第一个元素

```java
package collection;
 
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
 
import charactor.Hero;
 
public class TestCollection {
 
    public static void main(String[] args) {
        //和ArrayList一样，LinkedList也实现了List接口
        List ll =new LinkedList<Hero>();
         
        //所不同的是LinkedList还实现了Deque，进而又实现了Queue这个接口
        //Queue代表FIFO 先进先出的队列
        Queue<Hero> q= new LinkedList<Hero>();
         
        //加在队列的最后面
        System.out.print("初始化队列：\t");
        q.offer(new Hero("Hero1"));
        q.offer(new Hero("Hero2"));
        q.offer(new Hero("Hero3"));
        q.offer(new Hero("Hero4"));
         
        System.out.println(q);
        System.out.print("把第一个元素取poll()出来:\t");
        //取出第一个Hero，FIFO 先进先出
        Hero h = q.poll();
        System.out.println(h);
        System.out.print("取出第一个元素之后的队列:\t");
        System.out.println(q);
         
        //把第一个拿出来看一看，但是不取出来
        h=q.peek();
        System.out.print("查看peek()第一个元素:\t");
        System.out.println(h);
        System.out.print("查看并不会导致第一个元素被取出来:\t");
        System.out.println(q);
         
    }
      
}

```

![](http://stepimagewm.how2j.cn/810.png)

## 二叉树

- 二叉树由各种节点组成
- 二叉树特点：
  每个节点都可以有左子节点，右子节点
  每一个节点都有一个值

```java
package collection;

public class Node {
	// 左子节点
	public Node leftNode;
	// 右子节点
	public Node rightNode;
	// 值
	public Object value;
}

```

![](http://stepimagewm.how2j.cn/1008.png)

### 插入

- 假设通过二叉树对如下10个随机数进行排序
- 67,7,30,73,10,0,78,81,10,74
- 排序的第一个步骤是把数据插入到该二叉树中
- 插入基本逻辑是，小、相同的放左边，大的放右边

```java
package collection;
 
public class Node {
    // 左子节点
    public Node leftNode;
    // 右子节点
    public Node rightNode;
 
    // 值
    public Object value;
 
    // 插入 数据
    public void add(Object v) {
        // 如果当前节点没有值，就把数据放在当前节点上
        if (null == value)
            value = v;
 
        // 如果当前节点有值，就进行判断，新增的值与当前值的大小关系
        else {
            // 新增的值，比当前值小或者相同
        	
            if ((Integer) v -((Integer)value) <= 0) {
                if (null == leftNode)
                    leftNode = new Node();
                leftNode.add(v);
            }
            // 新增的值，比当前值大
            else {
                if (null == rightNode)
                    rightNode = new Node();
                rightNode.add(v);
            }
 
        }
 
    }
 
    public static void main(String[] args) {
 
        int randoms[] = new int[] { 67, 7, 30, 73, 10, 0, 78, 81, 10, 74 };
 
        Node roots = new Node();
        for (int number : randoms) {
            roots.add(number);
        }
 
    }
}

```

![](http://stepimagewm.how2j.cn/1009.png)

### 遍历

- 二叉树的遍历分左序，中序，右序
- 左序即： 中间的数遍历后放在左边
- 中序即： 中间的数遍历后放在中间
- 右序即： 中间的数遍历后放在右边
- 我们希望遍历后的结果是从小到大的，所以应该采用中序遍历

```java
package collection;

import java.util.ArrayList;
import java.util.List;

public class Node {
    // 左子节点
    public Node leftNode;
    // 右子节点
    public Node rightNode;
 
    // 值
    public Object value;
 
    // 插入 数据
    public void add(Object v) {
        // 如果当前节点没有值，就把数据放在当前节点上
        if (null == value)
            value = v;
 
        // 如果当前节点有值，就进行判断，新增的值与当前值的大小关系
        else {
            // 新增的值，比当前值小或者相同
        	
            if ((Integer) v -((Integer)value) <= 0) {
                if (null == leftNode)
                    leftNode = new Node();
                leftNode.add(v);
            }
            // 新增的值，比当前值大
            else {
                if (null == rightNode)
                    rightNode = new Node();
                rightNode.add(v);
            }
 
        }
 
    }
 
 // 中序遍历所有的节点
    public List<Object> values() {
        List<Object> values = new ArrayList<>();
 
        // 左节点的遍历结果
        if (null != leftNode)
            values.addAll(leftNode.values());
 
        // 当前节点
        values.add(value);
 
        // 右节点的遍历结果
        if (null != rightNode)
 
            values.addAll(rightNode.values());
 
        return values;
    }
 
    public static void main(String[] args) {
 
        int randoms[] = new int[] { 67, 7, 30, 73, 10, 0, 78, 81, 10, 74 };
 
        Node roots = new Node();
        for (int number : randoms) {
            roots.add(number);
        }
 
        System.out.println(roots.values());
 
    }
}

```

![](http://stepimagewm.how2j.cn/1010.png)

## HashMap

- HashMap储存数据的方式是—— 键值对
- 对于HashMap而言，key是唯一的，不可以重复的。
- 所以，以相同的key 把不同的value插入到 Map中会导致旧元素被覆盖，只留下最后插入的元素。 
- 不过，同一个对象可以作为值插入到map中，只要对应的key不一样

[面试题](https://baiweijieku.github.io/2019/03/10/java%E5%9F%BA%E7%A1%80%E5%A4%8D%E4%B9%A0%E5%85%AB-%E9%9B%86%E5%90%88%E5%B8%B8%E8%A7%81%E9%9D%A2%E8%AF%95%E9%A2%98/)

## HashSet

- Set中的元素，不能重复
- Set中的元素，没有顺序。严格的说，是没有按照元素的插入顺序排列
- HashSet的具体顺序，既不是按照插入顺序，也不是按照hashcode的顺序。
- 换句话说，同样是插入0-9到HashSet中， 在JVM的不同版本中，看到的顺序都是不一样的。
- Set不提供get()来获取指定位置的元素 ,所以遍历需要用到迭代器，或者增强型for循环

```java
package collection;
 
import java.util.HashSet;
import java.util.Iterator;
 
public class TestCollection {
    public static void main(String[] args) {
    	HashSet<Integer> numbers = new HashSet<Integer>();
    	
    	for (int i = 0; i < 20; i++) {
			numbers.add(i);
		}
    	
    	//Set不提供get方法来获取指定位置的元素
    	//numbers.get(0)
    	
    	//遍历Set可以采用迭代器iterator
    	for (Iterator<Integer> iterator = numbers.iterator(); iterator.hasNext();) {
			Integer i = (Integer) iterator.next();
			System.out.println(i);
		}
    	
    	//或者采用增强型for循环
    	for (Integer i : numbers) {
			System.out.println(i);
		}
    	
    }
}

```

- HashSet自身并没有独立的实现，而是在里面封装了一个Map
- HashSet是作为Map的key而存在的
- 而value是一个命名为PRESENT的static的Object对象，因为是一个类属性，所以只会有一个。
- `private static final Object PRESENT = new Object();`

```java
package collection;

import java.util.AbstractSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
    //HashSet里封装了一个HashMap
	private  HashMap<E,Object> map;

    private static final Object PRESENT = new Object();

    //HashSet的构造方法初始化这个HashMap
    public HashSet() {
    	map = new HashMap<E,Object>();
    }

    //向HashSet中增加元素，其实就是把该元素作为key，增加到Map中
    //value是PRESENT，静态，final的对象，所有的HashSet都使用这么同一个对象
    public boolean add(E e) {
    	return map.put(e, PRESENT)==null;
    }

    //HashSet的size就是map的size
    public int size() {
    	return map.size();
    }

    //清空Set就是清空Map
    public void clear() {
    	map.clear();
    }
    
    //迭代Set,就是把Map的键拿出来迭代
    public Iterator<E> iterator() {
    	return map.keySet().iterator();
    }

}

```

## Collection

- Collection是 Set List Queue和 Deque的接口
- Collection和Map之间没有关系，Collection是放一个一个对象的，Map 是放键值对的
- Deque 继承 Queue,间接得继承了 Collection

![](http://stepimagewm.how2j.cn/830.png)

## Collections

### 反转

- reverse 使List中的数据发生翻转

```java
package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
  
public class TestCollection {
    public static void main(String[] args) {
        //初始化集合numbers
        List<Integer> numbers = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("集合中的数据:");
        System.out.println(numbers);
        
        Collections.reverse(numbers);
        
        System.out.println("翻转后集合中的数据:");
        System.out.println(numbers);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2498.png)

### 混淆

- shuffle 混淆List中数据的顺序

```java
package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
  
public class TestCollection {
    public static void main(String[] args) {
        //初始化集合numbers
        List<Integer> numbers = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("集合中的数据:");
        System.out.println(numbers);
        
        Collections.shuffle(numbers);
        
        System.out.println("混淆后集合中的数据:");
        System.out.println(numbers);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2501.png)

### 排序

- sort 对List中的数据进行排序
- 不论是Collections.sort方法或者是Arrays.sort方法，底层实现都是TimSort实现的，这是jdk1.7新增的，以前是归并排序。TimSort算法就是找到已经排好序数据的子序列，然后对剩余部分排序，然后合并起来

```java
package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
  
public class TestCollection {
    public static void main(String[] args) {
        //初始化集合numbers
        List<Integer> numbers = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("集合中的数据:");
        System.out.println(numbers);

        Collections.shuffle(numbers);
        System.out.println("混淆后集合中的数据:");
        System.out.println(numbers);

        Collections.sort(numbers);
        System.out.println("排序后集合中的数据:");
        System.out.println(numbers);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2499.png)

### 交换

- swap 交换两个数据的位置

```java
package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
  
public class TestCollection {
    public static void main(String[] args) {
        //初始化集合numbers
        List<Integer> numbers = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("集合中的数据:");
        System.out.println(numbers);

        Collections.swap(numbers,0,5);
        System.out.println("交换0和5下标的数据后，集合中的数据:");
        System.out.println(numbers);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2500.png)

### 滚动

- rotate 把List中的数据，向右滚动指定单位的长度

```java
package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
  
public class TestCollection {
    public static void main(String[] args) {
        //初始化集合numbers
        List<Integer> numbers = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            numbers.add(i);
        }
        
        System.out.println("集合中的数据:");
        System.out.println(numbers);

        Collections.rotate(numbers,2);
        System.out.println("把集合向右滚动2个单位，标的数据后，集合中的数据:");
        System.out.println(numbers);
        
    }
}

```

![](http://stepimagewm.how2j.cn/2497.png)

### 查找替换

```java
//对List进行二分查找，返回索引，注意List必须是有序的
int binarySearch(List list, Object key)
    
//根据元素的自然顺序，返回最大的元素。 类比int min(Collection coll)
int max(Collection coll)
    
//根据定制排序，返回最大元素，排序规则由Comparatator类控制。类比int min(Collection coll, Comparator c)
int max(Collection coll, Comparator c)
    
//用指定的元素代替指定list中的所有元素。
void fill(List list, Object obj)
    
//统计元素出现次数
int frequency(Collection c, Object o)
    
//统计target在list中第一次出现的索引，找不到则返回-1，类比int lastIndexOfSubList(List source, list target).
int indexOfSubList(List list, List target)
    
//用新元素替换旧元素
boolean replaceAll(List list, Object oldVal, Object newVal)
```

```java
ArrayList<Integer> arrayList = new ArrayList<Integer>();
arrayList.add(-1);
arrayList.add(3);
arrayList.add(3);
arrayList.add(-5);
arrayList.add(7);
arrayList.add(4);
arrayList.add(-9);
arrayList.add(-7);

ArrayList<Integer> arrayList2 = new ArrayList<Integer>();
arrayList2.add(-3);
arrayList2.add(-5);
arrayList2.add(7);

System.out.println("原始数组:");
System.out.println(arrayList);

System.out.println("Collections.max(arrayList):");
System.out.println(Collections.max(arrayList));

System.out.println("Collections.min(arrayList):");
System.out.println(Collections.min(arrayList));

System.out.println("Collections.replaceAll(arrayList, 3, -3):");
Collections.replaceAll(arrayList, 3, -3);
System.out.println(arrayList);

System.out.println("Collections.frequency(arrayList, -3):");
System.out.println(Collections.frequency(arrayList, -3));

System.out.println("Collections.indexOfSubList(arrayList, arrayList2):");
System.out.println(Collections.indexOfSubList(arrayList, arrayList2));

System.out.println("Collections.binarySearch(arrayList, 7):");
// 对List进行二分查找，返回索引，List必须是有序的
Collections.sort(arrayList);
System.out.println(Collections.binarySearch(arrayList, 7));
```

### 只读

```java
//返回一个空的、不可变的集合对象，此处的集合既可以是List，也可以是Set，还可以是Map。
emptyXxx()
   
//返回一个只包含指定对象（只有一个或一个元素）的不可变的集合对象，此处的集合可以是：List，Set，Map。
singletonXxx()
    
//返回指定集合对象的不可变视图，此处的集合可以是：List，Set，Map。
unmodifiableXxx()
    
//上面三类方法的参数是原有的集合对象，返回值是该集合的”只读“版本。
```

```java
 ArrayList<Integer> arrayList = new ArrayList<Integer>();
        arrayList.add(-1);
        arrayList.add(3);
        arrayList.add(3);
        arrayList.add(-5);
        arrayList.add(7);
        arrayList.add(4);
        arrayList.add(-9);
        arrayList.add(-7);
        HashSet<Integer> integers1 = new HashSet<>();
        integers1.add(1);
        integers1.add(3);
        integers1.add(2);
        Map scores = new HashMap();
        scores.put("语文" , 80);
        scores.put("Java" , 82);

        //Collections.emptyXXX();创建一个空的、不可改变的XXX对象
        List<Object> list = Collections.emptyList();
        System.out.println(list);//[]
        Set<Object> objects = Collections.emptySet();
        System.out.println(objects);//[]
        Map<Object, Object> objectObjectMap = Collections.emptyMap();
        System.out.println(objectObjectMap);//{}

        //Collections.singletonXXX();
        List<ArrayList<Integer>> arrayLists = Collections.singletonList(arrayList);
        System.out.println(arrayLists);//[[-1, 3, 3, -5, 7, 4, -9, -7]]
        //创建一个只有一个元素，且不可改变的Set对象
        Set<ArrayList<Integer>> singleton = Collections.singleton(arrayList);
        System.out.println(singleton);//[[-1, 3, 3, -5, 7, 4, -9, -7]]
        Map<String, String> nihao = Collections.singletonMap("1", "nihao");
        System.out.println(nihao);//{1=nihao}

        //unmodifiableXXX();创建普通XXX对象对应的不可变版本
        List<Integer> integers = Collections.unmodifiableList(arrayList);
        System.out.println(integers);//[-1, 3, 3, -5, 7, 4, -9, -7]
        Set<Integer> integers2 = Collections.unmodifiableSet(integers1);
        System.out.println(integers2);//[1, 2, 3]
        Map<Object, Object> objectObjectMap2 = Collections.unmodifiableMap(scores);
        System.out.println(objectObjectMap2);//{Java=82, 语文=80}

        //添加出现异常：java.lang.UnsupportedOperationException
//        list.add(1);
//        arrayLists.add(arrayList);
//        integers.add(1);
```



### 线程安全

- synchronizedList 把非线程安全的List转换为线程安全的List。

```java
//返回指定 collection 支持的同步（线程安全的）collection。
synchronizedCollection(Collection<T>  c) 
synchronizedList(List<T> list)//返回指定列表支持的同步（线程安全的）List。
synchronizedMap(Map<K,V> m) //返回由指定映射支持的同步（线程安全的）Map。
synchronizedSet(Set<T> s) //返回指定 set 支持的同步（线程安全的）set。
```



```java
package collection;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TestCollection {
	public static void main(String[] args) {
		List<Integer> numbers = new ArrayList<>();

		System.out.println("把非线程安全的List转换为线程安全的List");
        List<Integer> synchronizedNumbers = (List<Integer>) Collections.synchronizedList(numbers);

	}
}

```

## 关系区别

### 顺序

-  ArrayList: 有顺序
- HashSet: 无顺序
- HashSet的具体顺序，既不是按照插入顺序，也不是按照hashcode的顺序。
- 不保证Set的迭代顺序; 确切的说，在不同条件下，元素的顺序都有可能不一样

### 重复

- List中的数据可以重复
- Set中的数据不能够重复
- 重复判断标准是:
  首先看hashcode是否相同
  如果hashcode不同，则认为是不同数据
  如果hashcode相同，再比较equals，如果equals相同，则是相同数据，否则是不同数据

```java
package collection;
  
import java.util.ArrayList;
import java.util.HashSet;
   
public class TestCollection {
    public static void main(String[] args) {
          
        ArrayList<Integer> numberList =new ArrayList<Integer>();
        //List中的数据可以重复
        System.out.println("----------List----------");
        System.out.println("向List 中插入 9 9");
        numberList.add(9);
        numberList.add(9);
        System.out.println("List 中出现两个9:");
        System.out.println(numberList);
        System.out.println("----------Set----------");
        HashSet<Integer> numberSet =new HashSet<Integer>();
        System.out.println("向Set 中插入9 9");
        //Set中的数据不能重复
        numberSet.add(9);
        numberSet.add(9);
        System.out.println("Set 中只会保留一个9:");
        System.out.println(numberSet);
          
    }
}

```

![](http://stepimagewm.how2j.cn/2513.png)

- ArrayList 插入，删除数据慢
- LinkedList， 插入，删除数据快
- ArrayList是顺序结构，所以定位很快，指哪找哪。 就像电影院位置一样，有了电影票，一下就找到位置了。
- LinkedList 是链表结构，就像手里的一串佛珠，要找出第99个佛珠，必须得一个一个的数过去，所以定位慢

![](http://stepimagewm.how2j.cn/799.png)

- HashMap和Hashtable都实现了Map接口，都是键值对保存数据的方式
- 区别1： 
  HashMap可以存放 null
  Hashtable不能存放null
- 区别2：
  HashMap不是[线程安全的类](http://how2j.cn/k/thread/thread-synchronized/355.html#step793)
  Hashtable是线程安全的类

```java
package collection;

import java.util.HashMap;
import java.util.Hashtable;

public class TestCollection {
	public static void main(String[] args) {
		
		//HashMap和Hashtable都实现了Map接口，都是键值对保存数据的方式
		
		HashMap<String,String> hashMap = new HashMap<String,String>();
		
		//HashMap可以用null作key,作value
		hashMap.put(null, "123");
		hashMap.put("123", null);
		
		Hashtable<String,String> hashtable = new Hashtable<String,String>();
		//Hashtable不能用null作key，不能用null作value
		hashtable.put(null, "123");
		hashtable.put("123", null);

	}
}

```

- HashSet： 无序
- LinkedHashSet： 按照插入顺序
- TreeSet： 从小到大排序

```java
package collection;
 
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.TreeSet;
 
public class TestCollection {
    public static void main(String[] args) {
        HashSet<Integer> numberSet1 =new HashSet<Integer>();
        //HashSet中的数据不是按照插入顺序存放
        numberSet1.add(88);
        numberSet1.add(8);
        numberSet1.add(888);
         
        System.out.println(numberSet1);
         
        LinkedHashSet<Integer> numberSet2 =new LinkedHashSet<Integer>();
        //LinkedHashSet中的数据是按照插入顺序存放
        numberSet2.add(88);
        numberSet2.add(8);
        numberSet2.add(888);
         
        System.out.println(numberSet2);
        TreeSet<Integer> numberSet3 =new TreeSet<Integer>();
        //TreeSet 中的数据是进行了排序的
        numberSet3.add(88);
        numberSet3.add(8);
        numberSet3.add(888);
         
        System.out.println(numberSet3);
         
    }
}

```

## hashCode

- 所有的对象，都有一个对应的hashcode（散列值）
  比如字符串“gareen”对应的是1001 (实际上不是，这里是方便理解，假设的值)
  比如字符串“temoo”对应的是1004
  比如字符串“db”对应的是1008
  比如字符串“annie”对应的也是1008
- 准备一个数组，其长度是2000，并且设定特殊的hashcode算法，使得所有字符串对应的hashcode，都会落在0-1999之间
  要存放名字是"gareen"的英雄，就把该英雄和名称组成一个键值对，存放在数组的1001这个位置上
  要存放名字是"temoo"的英雄，就把该英雄存放在数组的1004这个位置上
  要存放名字是"db"的英雄，就把该英雄存放在数组的1008这个位置上
  要存放名字是"annie"的英雄，然而 "annie"的hashcode 1008对应的位置已经有db英雄了，那么就在这里创建一个链表，接在db英雄后面存放annie
- 比如要查找gareen，首先计算"gareen"的hashcode是1001，根据1001这个下标，到数组中进行定位，（根据数组下标进行定位，是非常快速的） 发现1001这个位置就只有一个英雄，那么该英雄就是gareen.
- 比如要查找annie，首先计算"annie"的hashcode是1008，根据1008这个下标，到数组中进行定位，发现1008这个位置有两个英雄，那么就对两个英雄的名字进行逐一比较(equals)，因为此时需要比较的量就已经少很多了，很快也就可以找出目标英雄

![](http://stepimagewm.how2j.cn/819.png)

- HashSet的数据是不能重复的，相同数据不能保存在一起，到底如何判断是否是重复的呢？
- 根据[HashSet和HashMap的关系](http://how2j.cn/k/collection/collection-hashset/364.html#step825)，我们了解到因为HashSet没有自身的实现，而是里面封装了一个HashMap，所以本质上就是判断HashMap的key是否重复。
- key是否重复，是由两个步骤判断的：
- hashcode是否一样
  如果hashcode不一样，就是在不同的坑里，一定是不重复的
  如果hashcode一样，就是在同一个坑里，还需要进行equals比较
- 如果equals一样，则是重复数据
  如果equals不一样，则是不同数据。

## 比较器

- 假设Hero有三个属性 name,hp,damage
- 一个集合中放存放10个Hero,通过Collections.sort对这10个进行排序
- 那么到底是hp小的放前面？还是damage小的放前面？Collections.sort也无法确定
- 所以要指定到底按照哪种属性进行排序
- 这里就需要提供一个Comparator给定如何进行两个对象之间的大小比较

```java


package collection;
    
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
   
import charactor.Hero;
    
public class TestCollection {
    public static void main(String[] args) {
        Random r =new Random();
        List<Hero> heros = new ArrayList<Hero>();
           
        for (int i = 0; i < 10; i++) {
            //通过随机值实例化hero的hp和damage
            heros.add(new Hero("hero "+ i, r.nextInt(100), r.nextInt(100)));
        }
        System.out.println("初始化后的集合：");
        System.out.println(heros);
           
        //直接调用sort会出现编译错误，因为Hero有各种属性
        //到底按照哪种属性进行比较，Collections也不知道，不确定，所以没法排
        //Collections.sort(heros);
           
        //引入Comparator，指定比较的算法
        Comparator<Hero> c = new Comparator<Hero>() {
            @Override
            public int compare(Hero h1, Hero h2) {
                //按照hp进行排序
                if(h1.hp>=h2.hp)
                    return 1;  //正数表示h1比h2要大
                else
                    return -1;
            }
        };
        Collections.sort(heros,c);
        System.out.println("按照血量排序后的集合：");
        System.out.println(heros);
    }
}

```

![](http://stepimagewm.how2j.cn/828.png)

- 使Hero类实现Comparable接口
- 在类里面提供比较算法,Collections.sort就有足够的信息进行排序了，也无需额外提供比较器Comparator
- 如果返回-1, 就表示当前的更小，否则就是更大

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

package collection;
  
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
 
import charactor.Hero;
  
public class TestCollection {
    public static void main(String[] args) {
        Random r =new Random();
        List<Hero> heros = new ArrayList<Hero>();
         
        for (int i = 0; i < 10; i++) {
            //通过随机值实例化hero的hp和damage
            heros.add(new Hero("hero "+ i, r.nextInt(100), r.nextInt(100)));
        }
         
        System.out.println("初始化后的集合");
        System.out.println(heros);
         
        //Hero类实现了接口Comparable，即自带比较信息。
        //Collections直接进行排序，无需额外的Comparator
        Collections.sort(heros);
        System.out.println("按照伤害高低排序后的集合");
        System.out.println(heros);
         
    }
}

```

![](http://stepimagewm.how2j.cn/829.png)

本篇博客内容引用自：http://how2j.cn