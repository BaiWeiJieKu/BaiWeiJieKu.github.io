---
layout: post
title: "java基础复习九Java多线程"
categories: java基础
tags: java基础 多线程
author: 百味皆苦
music-id: 4341314
---

* content
{:toc}
## 线程启动

- 多线程即在同一时间，可以做多件事情。
- 创建多线程有3种方式，分别是[继承线程类](http://how2j.cn/k/thread/thread-start/353.html#step778),[实现Runnable接口](http://how2j.cn/k/thread/thread-start/353.html#step779),[匿名类](http://how2j.cn/k/thread/thread-start/353.html#step780)

### 线程概念

- 首先要理解进程(Processor)和线程(Thread)的区别 
- 进程：启动一个LOL.exe就叫一个进程。 接着又启动一个DOTA.exe，这叫两个进程。 
- 线程：线程是在进程内部同时做的事情，比如在LOL里，有很多事情要同时做，比如"盖伦” 击杀“提莫”，同时“赏金猎人”又在击杀“盲僧”，这就是由多线程来实现的。 

### 创建线程

- 使用多线程，就可以做到盖伦在攻击提莫的同时，赏金猎人也在攻击盲僧 
- 设计一个类KillThread 继承Thread，并且重写run方法
- 启动线程办法： 实例化一个KillThread对象，并且调用其start方法 
- 就可以观察到 赏金猎人攻击盲僧的同时，盖伦也在攻击提莫

```java
package multiplethread;

import charactor.Hero;

public class KillThread extends Thread{
	
	private Hero h1;
	private Hero h2;

	public KillThread(Hero h1, Hero h2){
		this.h1 = h1;
		this.h2 = h2;
	}

	public void run(){
		while(!h2.isDead()){
			h1.attackHero(h2);
		}
	}
}


```

```java


package multiplethread;

import charactor.Hero;

public class TestThread {

	public static void main(String[] args) {
		
		Hero gareen = new Hero();
		gareen.name = "盖伦";
		gareen.hp = 616;
		gareen.damage = 50;

		Hero teemo = new Hero();
		teemo.name = "提莫";
		teemo.hp = 300;
		teemo.damage = 30;
		
		Hero bh = new Hero();
		bh.name = "赏金猎人";
		bh.hp = 500;
		bh.damage = 65;
		
		Hero leesin = new Hero();
		leesin.name = "盲僧";
		leesin.hp = 455;
		leesin.damage = 80;
		
		KillThread killThread1 = new KillThread(gareen,teemo);
		killThread1.start();
		KillThread killThread2 = new KillThread(bh,leesin);
		killThread2.start();
		
	}
	
}

```

![](http://stepimagewm.how2j.cn/778.png)

#### Runnable接口

- 创建类Battle，实现Runnable接口,启动的时候，首先创建一个Battle对象，然后再根据该battle对象创建一个线程对象，并启动
- battle1 对象实现了Runnable接口，所以有run方法，但是直接调用run方法，并不会启动一个新的线程。
- 必须，借助一个线程对象的start()方法，才会启动一个新的线程。
- 所以，在创建Thread对象的时候，把battle1作为构造方法的参数传递进去，这个线程启动的时候，就会去执行battle1.run()方法了。

```java
package multiplethread;

import charactor.Hero;

public class Battle implements Runnable{
	
	private Hero h1;
	private Hero h2;

	public Battle(Hero h1, Hero h2){
		this.h1 = h1;
		this.h2 = h2;
	}

	public void run(){
		while(!h2.isDead()){
			h1.attackHero(h2);
		}
	}
}


```

```java

package multiplethread;

import charactor.Hero;

public class TestThread {

	public static void main(String[] args) {
		
		Hero gareen = new Hero();
		gareen.name = "盖伦";
		gareen.hp = 616;
		gareen.damage = 50;

		Hero teemo = new Hero();
		teemo.name = "提莫";
		teemo.hp = 300;
		teemo.damage = 30;
		
		Hero bh = new Hero();
		bh.name = "赏金猎人";
		bh.hp = 500;
		bh.damage = 65;
		
		Hero leesin = new Hero();
		leesin.name = "盲僧";
		leesin.hp = 455;
		leesin.damage = 80;
		
		Battle battle1 = new Battle(gareen,teemo);
		
		new Thread(battle1).start();

		Battle battle2 = new Battle(bh,leesin);
		new Thread(battle2).start();

	}
	
}

```

#### 匿名类

- 使用[匿名类](http://how2j.cn/k/interface-inheritance/interface-inheritance-inner-class/322.html#step687)，继承Thread,重写run方法，直接在run方法中写业务代码
- 匿名类的一个好处是可以很方便的访问外部的局部变量。
- 前提是外部的局部变量需要被声明为final。(JDK7以后就不需要了)

```java
package multiplethread;
 
import charactor.Hero;
 
public class TestThread {
 
    public static void main(String[] args) {
         
        Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 616;
        gareen.damage = 50;
 
        Hero teemo = new Hero();
        teemo.name = "提莫";
        teemo.hp = 300;
        teemo.damage = 30;
         
        Hero bh = new Hero();
        bh.name = "赏金猎人";
        bh.hp = 500;
        bh.damage = 65;
         
        Hero leesin = new Hero();
        leesin.name = "盲僧";
        leesin.hp = 455;
        leesin.damage = 80;
         
        //匿名类
        Thread t1= new Thread(){
            public void run(){
                //匿名类中用到外部的局部变量teemo，必须把teemo声明为final
            	//但是在JDK7以后，就不是必须加final的了
                while(!teemo.isDead()){
                    gareen.attackHero(teemo);
                }               
            }
        };
        
        t1.start();
         
        Thread t2= new Thread(){
            public void run(){
                while(!leesin.isDead()){
                    bh.attackHero(leesin);
                }               
            }
        };
        t2.start();
        
    }
     
}

```

#### 三种方式

- 继承Thread类
- 实现Runnable接口
- 匿名类的方式
- 注： 启动线程是start()方法，run()并不能启动一个新的线程

## 线程方法

### 线程暂停

- Thread.sleep(1000); 表示当前线程暂停1000毫秒 ，其他线程不受影响 
- Thread.sleep(1000); 会抛出InterruptedException 中断异常，因为当前线程sleep的时候，有可能被停止，这时就会抛出 InterruptedException
- 线程休眠：指的是让线程暂缓执行一下，等到了预计时间之后再恢复执行。线程休眠会交出CPU，让CPU去执行其他的任务。
- sleep方法不会释放锁，也就是说如果当前线程持有对某个对象的锁，即使调用sleep方法，其他线程也无法访问这个对象

```java
package multiplethread;

public class TestThread {

	public static void main(String[] args) {
		
		Thread t1= new Thread(){
			public void run(){
				int seconds =0;
				while(true){
					try {
						Thread.sleep(1000);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					System.out.printf("已经玩了LOL %d 秒%n", seconds++);
				}				
			}
		};
		t1.start();
		
	}
	
}

```

### 加入线程

- 所有进程，至少会有一个线程即主线程，即main方法开始执行，就会有一个看不见的主线程存在。
- 如果在主线程中调用join方法时就会让主线程休眠，让调用该方法的线程run方法先执行完毕之后在开始执行主线程

```java
package multiplethread;
 
import charactor.Hero;
 
public class TestThread {
 
    public static void main(String[] args) {
         
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 616;
        gareen.damage = 50;
 
        final Hero teemo = new Hero();
        teemo.name = "提莫";
        teemo.hp = 300;
        teemo.damage = 30;
         
        final Hero bh = new Hero();
        bh.name = "赏金猎人";
        bh.hp = 500;
        bh.damage = 65;
         
        final Hero leesin = new Hero();
        leesin.name = "盲僧";
        leesin.hp = 455;
        leesin.damage = 80;
         
        Thread t1= new Thread(){
            public void run(){
                while(!teemo.isDead()){
                    gareen.attackHero(teemo);
                }               
            }
        };
         
        t1.start();

        //代码执行到这里，一直是main线程在运行
        try {
        	//t1线程加入到main线程中来，只有t1线程运行结束，才会继续往下走
			t1.join();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        Thread t2= new Thread(){
            public void run(){
                while(!leesin.isDead()){
                    bh.attackHero(leesin);
                }               
            }
        };
        //会观察到盖伦把提莫杀掉后，才运行t2线程
        t2.start();
         
    }
     
}

```

### 优先级

- 当线程处于竞争关系的时候，优先级高的线程会有更大的几率获得CPU资源 

```java
package charactor;
 
import java.io.Serializable;
  
public class Hero{
    public String name; 
    public float hp;
     
    public int damage;
     
    public void attackHero(Hero h) {
    	//把暂停时间去掉，多条线程各自会尽力去占有CPU资源
    	//线程的优先级效果才可以看得出来
//        try {
//            
//            Thread.sleep(0);
//        } catch (InterruptedException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
        h.hp-=damage;
        System.out.format("%s 正在攻击 %s, %s的血变成了 %.0f%n",name,h.name,h.name,h.hp);
         
        if(h.isDead())
            System.out.println(h.name +"死了！");
    }
 
    public boolean isDead() {
        return 0>=hp?true:false;
    }
 
}


```

```java

package multiplethread;
 
import charactor.Hero;
 
public class TestThread {
 
    public static void main(String[] args) {
         
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 6160;
        gareen.damage = 1;
 
        final Hero teemo = new Hero();
        teemo.name = "提莫";
        teemo.hp = 3000;
        teemo.damage = 1;
         
        final Hero bh = new Hero();
        bh.name = "赏金猎人";
        bh.hp = 5000;
        bh.damage = 1;
         
        final Hero leesin = new Hero();
        leesin.name = "盲僧";
        leesin.hp = 4505;
        leesin.damage = 1;
         
        Thread t1= new Thread(){
            public void run(){

                while(!teemo.isDead()){
                    gareen.attackHero(teemo);
                }               
            }
        };
         
        Thread t2= new Thread(){
            public void run(){
                while(!leesin.isDead()){
                    bh.attackHero(leesin);
                }               
            }
        };
        
        t1.setPriority(Thread.MAX_PRIORITY);//优先级为10
        t2.setPriority(Thread.MIN_PRIORITY);//优先级为1
        t1.start();
        t2.start();
         
    }
     
}

```

![](http://stepimagewm.how2j.cn/783.png)

### 临时暂停

- 暂停当前正在执行的线程对象，并执行其他线程。
- 意思就是调用yield方法会让当前线程交出CPU权限，让CPU去执行其他的线程。它跟sleep方法类似，同样不会释放锁。
- 但是yield不能控制具体的交出CPU的时间，另外，yield方法只能让拥有相同优先级的线程有获取CPU执行时间的机会。
- 调用yield方法并不会让线程进入阻塞状态，而是让线程重回就绪状态，它只需要等待重新获取CPU执行时间

```java
package multiplethread;
 
import charactor.Hero;
 
public class TestThread {
 
    public static void main(String[] args) {
         
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 61600;
        gareen.damage = 1;
 
        final Hero teemo = new Hero();
        teemo.name = "提莫";
        teemo.hp = 30000;
        teemo.damage = 1;
         
        final Hero bh = new Hero();
        bh.name = "赏金猎人";
        bh.hp = 50000;
        bh.damage = 1;
         
        final Hero leesin = new Hero();
        leesin.name = "盲僧";
        leesin.hp = 45050;
        leesin.damage = 1;
         
        Thread t1= new Thread(){
            public void run(){

                while(!teemo.isDead()){
                    gareen.attackHero(teemo);
                }               
            }
        };
         
        Thread t2= new Thread(){
            public void run(){
                while(!leesin.isDead()){
                	//临时暂停，使得t1可以占用CPU资源
                	Thread.yield();
                	
                    bh.attackHero(leesin);
                }               
            }
        };
        
        t1.setPriority(5);
        t2.setPriority(5);
        t1.start();
        t2.start();
         
    }
     
}

```

### 守护线程

- 守护线程的概念是： 当一个进程里，所有的线程都是守护线程的时候，结束当前进程。
- 就好像一个公司有销售部，生产部这些和业务挂钩的部门。除此之外，还有后勤，行政等这些支持部门。
- 如果一家公司销售部，生产部都解散了，那么只剩下后勤和行政，那么这家公司也可以解散了。
- 守护线程就相当于那些支持部门，如果一个进程只剩下守护线程，那么进程就会自动结束。
- 守护线程通常会被用来做日志，性能统计等工作。
- 守护线程的唯一用途是为其他线程提供服务

```java
package multiplethread;
 
public class TestThread {
 
    public static void main(String[] args) {
         
        Thread t1= new Thread(){
            public void run(){
                int seconds =0;
                
                while(true){
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    System.out.printf("已经玩了LOL %d 秒%n", seconds++);
                    
                }               
            }
        };
        t1.setDaemon(true);//将线程转为守护线程
        t1.start();
         
    }
     
}

```

## 线程同步

- 多线程的同步问题指的是多个线程同时修改一个数据的时候，可能导致的问题 
- 多线程的问题，又叫Concurrency 问题

### 同步案例

- 假设盖伦有10000滴血，并且在基地里，同时又被对方多个英雄攻击
- 就是有多个线程在减少盖伦的hp，同时又有多个线程在恢复盖伦的hp
- 假设线程的数量是一样的，并且每次改变的值都是1，那么所有线程结束后，盖伦应该还是10000滴血。

```java

package multiplethread;
   
import charactor.Hero;
   
public class TestThread {
   
    public static void main(String[] args) {
           
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 10000;
          
        System.out.printf("盖伦的初始血量是 %.0f%n", gareen.hp);
          
        //多线程同步问题指的是多个线程同时修改一个数据的时候，导致的问题
          
        //假设盖伦有10000滴血，并且在基地里，同时又被对方多个英雄攻击
          
        //用JAVA代码来表示，就是有多个线程在减少盖伦的hp
        //同时又有多个线程在恢复盖伦的hp
          
        //n个线程增加盖伦的hp
          
        int n = 10000;
  
        Thread[] addThreads = new Thread[n];
        Thread[] reduceThreads = new Thread[n];
          
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                    gareen.recover();//回血方法，每次回1
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            addThreads[i] = t;
              
        }
          
        //n个线程减少盖伦的hp
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                    gareen.hurt();//掉血方法，每次减1
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            reduceThreads[i] = t;
        }
          
        //等待所有增加线程结束
        for (Thread t : addThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        //等待所有减少线程结束
        for (Thread t : reduceThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
          
        //代码执行到这里，所有增加和减少线程都结束了
          
        //增加和减少线程的数量是一样的，每次都增加，减少1.
        //那么所有线程都结束后，盖伦的hp应该还是初始值
          
        //但是事实上观察到的是：
                  
        System.out.printf("%d个增加线程和%d个减少线程结束后%n盖伦的血量变成了 %.0f%n", n,n,gareen.hp);
          
    }
       
}

```

![](http://stepimagewm.how2j.cn/786.png)

### 问题原因

- 假设增加线程先进入，得到的hp是10000 
- 进行增加运算 
- 正在做增加运算的时候，还没有来得及修改hp的值，减少线程来了 
- 减少线程得到的hp的值也是10000 
- 减少线程进行减少运算 
- 增加线程运算结束，得到值10001，并把这个值赋予hp 
- 减少线程也运算结束，得到值9999，并把这个值赋予hp 
- hp，最后的值就是9999 ，这个时候的值9999是一个错误的值，在业务上又叫做脏数据

![](http://stepimagewm.how2j.cn/787.png)

### 解决思路

- 总体解决思路是： 在增加线程访问hp期间，其他线程不可以访问hp 
- 增加线程获取到hp的值，并进行运算 
- 在运算期间，减少线程试图来获取hp的值，但是不被允许
- 增加线程运算结束，并成功修改hp的值为10001 
- 减少线程，在增加线程做完后，才能访问hp的值，即10001
- 减少线程运算，并得到新的值10000

![](http://stepimagewm.how2j.cn/788.png)

### synchronized 

```java
Object someObject =new Object();
synchronized (someObject){
  //此处的代码只有占有了someObject后才可以执行
}
/*
synchronized表示当前线程，独占 对象 someObject
当前线程独占 了对象someObject，如果有其他线程试图占有对象someObject，就会等待，直到当前线程释放对someObject的占用。
someObject 又叫同步对象，所有的对象，都可以作为同步对象
为了达到同步的效果，必须使用同一个同步对象
释放同步对象的方式： synchronized 块自然结束，或者有异常抛出
*/
```

![](http://stepimagewm.how2j.cn/789.png)

```java
package multiplethread;
 
import java.text.SimpleDateFormat;
import java.util.Date;
  
public class TestThread {
	
	public static String now(){
		return new SimpleDateFormat("HH:mm:ss").format(new Date());
	}
	
    public static void main(String[] args) {
        final Object someObject = new Object();
         
        Thread t1 = new Thread(){
            public void run(){
                try {
                    System.out.println( now()+" t1 线程已经运行");
                    System.out.println( now()+this.getName()+ " 试图占有对象：someObject");
                    synchronized (someObject) {
                         
                        System.out.println( now()+this.getName()+ " 占有对象：someObject");
                        Thread.sleep(5000);
                        System.out.println( now()+this.getName()+ " 释放对象：someObject");
                    }
                    System.out.println(now()+" t1 线程结束");
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        };
        t1.setName(" t1");
        t1.start();
        Thread t2 = new Thread(){
 
            public void run(){
                try {
                    System.out.println( now()+" t2 线程已经运行");
                    System.out.println( now()+this.getName()+ " 试图占有对象：someObject");
                    synchronized (someObject) {
                        System.out.println( now()+this.getName()+ " 占有对象：someObject");
                        Thread.sleep(5000);
                        System.out.println( now()+this.getName()+ " 释放对象：someObject");
                    }
                    System.out.println(now()+" t2 线程结束");
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        };
        t2.setName(" t2");
        t2.start();
    }
      
}

```

- 所有需要修改hp的地方，有要建立在占有someObject的基础上。
- 而对象 someObject在同一时间，只能被一个线程占有。 间接地，导致同一时间，hp只能被一个线程修改。

```java
package multiplethread;
  
import java.awt.GradientPaint;

import charactor.Hero;
  
public class TestThread {
  
    public static void main(String[] args) {

    	final Object someObject = new Object();
    	
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 10000;
         
        int n = 10000;
 
        Thread[] addThreads = new Thread[n];
        Thread[] reduceThreads = new Thread[n];
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	
                	//任何线程要修改hp的值，必须先占用someObject
                	synchronized (someObject) {
                		gareen.recover();
					}
                    
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            addThreads[i] = t;
             
        }
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	//任何线程要修改hp的值，必须先占用someObject
                	synchronized (someObject) {
                		gareen.hurt();
                	}
                	
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            reduceThreads[i] = t;
        }
         
        for (Thread t : addThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        for (Thread t : reduceThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
         
        System.out.printf("%d个增加线程和%d个减少线程结束后%n盖伦的血量是 %.0f%n", n,n,gareen.hp);
         
    }
      
}

```

![](http://stepimagewm.how2j.cn/790.png)

- 既然任意对象都可以用来作为同步对象，而所有的线程访问的都是同一个hero对象，索性就使用gareen来作为同步对象 

```java

package charactor;
 
public class Hero{
    public String name; 
    public float hp;
    
    public int damage;
    
    //回血
    public void recover(){
    	hp=hp+1;
    }
    
    //掉血
    public void hurt(){
    	//使用this作为同步对象
    	synchronized (this) {
    		hp=hp-1;	
		}
    }
    
    public void attackHero(Hero h) {
        h.hp-=damage;
        System.out.format("%s 正在攻击 %s, %s的血变成了 %.0f%n",name,h.name,h.name,h.hp);
        if(h.isDead())
            System.out.println(h.name +"死了！");
    }
 
    public boolean isDead() {
        return 0>=hp?true:false;
    }
 
}

```

```java
package multiplethread;
  
import java.awt.GradientPaint;

import charactor.Hero;
  
public class TestThread {
  
    public static void main(String[] args) {

        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 10000;
         
        int n = 10000;
 
        Thread[] addThreads = new Thread[n];
        Thread[] reduceThreads = new Thread[n];
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	
                	//使用gareen作为synchronized
                	synchronized (gareen) {
                		gareen.recover();
					}
                    
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            addThreads[i] = t;
             
        }
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	//使用gareen作为synchronized
                	//在方法hurt中有synchronized(this)
                	gareen.hurt();
                    
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            reduceThreads[i] = t;
        }
         
        for (Thread t : addThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        for (Thread t : reduceThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
         
        System.out.printf("%d个增加线程和%d个减少线程结束后%n盖伦的血量是 %.0f%n", n,n,gareen.hp);
         
    }
      
}


```

- 在recover前，直接加上synchronized ，其所对应的同步对象，就是this
- 和hurt方法达到的效果是一样
  外部线程访问gareen的方法，就不需要额外使用synchronized 了

```java
package charactor;
 
public class Hero{
    public String name; 
    public float hp;
    
    public int damage;
    
    //回血
    //直接在方法前加上修饰符synchronized
    //其所对应的同步对象，就是this
    //和hurt方法达到的效果一样
    public synchronized void recover(){
    	hp=hp+1;
    }
    
    //掉血
    public void hurt(){
    	//使用this作为同步对象
    	synchronized (this) {
    		hp=hp-1;	
		}
    }
    
    public void attackHero(Hero h) {
        h.hp-=damage;
        System.out.format("%s 正在攻击 %s, %s的血变成了 %.0f%n",name,h.name,h.name,h.hp);
        if(h.isDead())
            System.out.println(h.name +"死了！");
    }
 
    public boolean isDead() {
        return 0>=hp?true:false;
    }
 
}

```

```java

package multiplethread;
  
import java.awt.GradientPaint;

import charactor.Hero;
  
public class TestThread {
  
    public static void main(String[] args) {

        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 10000;
         
        int n = 10000;
 
        Thread[] addThreads = new Thread[n];
        Thread[] reduceThreads = new Thread[n];
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	
                	//recover自带synchronized
               		gareen.recover();
                    
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            addThreads[i] = t;
             
        }
         
        for (int i = 0; i < n; i++) {
            Thread t = new Thread(){
                public void run(){
                	//hurt自带synchronized
                	gareen.hurt();
                    
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            };
            t.start();
            reduceThreads[i] = t;
        }
         
        for (Thread t : addThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        for (Thread t : reduceThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
         
        System.out.printf("%d个增加线程和%d个减少线程结束后%n盖伦的血量是 %.0f%n", n,n,gareen.hp);
         
    }
      
}

```

- 如果一个类，其方法都是有synchronized修饰的，那么该类就叫做线程安全的类
- 同一时间，只有一个线程能够进入 这种类的一个实例 的去修改数据，进而保证了这个实例中的数据的安全(不会同时被多线程修改而变成脏数据)
- StringBuffer的方法都是有synchronized修饰的，StringBuffer就叫做线程安全的类,而StringBuilder就不是线程安全的类

## 线程安全

- HashMap和Hashtable都实现了Map接口，都是键值对保存数据的方式
- 区别1： 
  HashMap可以存放 null
  Hashtable不能存放null
- 别2：
  HashMap不是[线程安全的类](http://how2j.cn/k/thread/thread-synchronized/355.html#step793)
  Hashtable是线程安全的类

![](http://stepimagewm.how2j.cn/2595.png)

- StringBuffer 是线程安全的,StringBuilder 是非线程安全的
- 所以当进行大量字符串拼接操作的时候，如果是单线程就用StringBuilder会更快些，如果是多线程，就需要用StringBuffer 保证数据的安全性
- 非线程安全的为什么会比线程安全的 快？ 因为不需要同步嘛，省略了些时间

![](http://stepimagewm.how2j.cn/2596.png)

- Vector是线程安全的类，而ArrayList是非线程安全的。
- ArrayList是非线程安全的，换句话说，多个线程可以同时进入一个ArrayList对象的add方法
- 借助Collections.synchronizedList，可以把ArrayList转换为线程安全的List。
- 与此类似的，还有HashSet,LinkedList,HashMap等等非线程安全的类，都通过[工具类Collections](http://how2j.cn/k/collection/collection-collections/369.html)转换为线程安全的

```java
package multiplethread;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TestThread {
   
    public static void main(String[] args) {
    	List<Integer> list1 = new ArrayList<>();
    	List<Integer> list2 = Collections.synchronizedList(list1);
    }
       
}

```

## 死锁

- 当业务比较复杂，多线程应用里有可能会发生死锁
- 线程1 首先占有对象1，接着试图占有对象2
- 线程2 首先占有对象2，接着试图占有对象1
- 线程1 等待线程2释放对象2
- 与此同时，线程2等待线程1释放对象1
- 就会。。。一直等待下去，直到天荒地老，海枯石烂，山无棱 ，天地合。。。

![](http://stepimagewm.how2j.cn/794.png)

```java
public class DeadlockTest {
	//定义2个资源
    private static final Integer a = 0;
    private static final Integer b = 1;

    public static void main(String[] args) {
        //启动2个线程,分别调用getA()和getB()
        new Thread(DeadlockTest::getA).start();
        new Thread(DeadlockTest::getB).start();
    }
	static void getA() {
		//用synchronized 对a对象加锁
        synchronized (a) {
            System.out.println(Thread.currentThread().getName() + "获取到A锁");
            try {
                //等待500ms,再去获取B资源锁,让另一个线程有时间去独占b
                Thread.sleep(500);
                getB();
                System.out.println(Thread.currentThread().getName() + "获取到B锁");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    static void getB() {
        synchronized (b) {
            System.out.println(Thread.currentThread().getName() + "获取到B锁");
             try {
                //等待500ms,再去获取A资源锁,让另一个线程有时间去独占a
                Thread.sleep(500);
            	getA();
            	System.out.println(Thread.currentThread().getName() + "获取到A锁");
             } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
/*
Thread-0获取到A锁
Thread-1获取到B锁

Thread-0在拿到a对象的监视器锁（后文简称“A锁”）之后，又要去拿b对象的监视器锁（简称“B锁”），而此时B锁在Thread-1手中，于是Thread-0只能阻塞，等待B锁被Thread-1释放。对Thread-1而言，亦是如此，死锁产生。

互斥条件:在上面代码中就是通过synchronized加锁，该锁是独占的、排它的。一个线程获取到之后，不允许第二个线程同时获取。

请求和保持条件：Thread-0拿到A锁的同时，又要请求B锁，但B锁被 Thread-1占有，所以要阻塞自己，等待B资源。

不剥夺条件：Thread-0不能抢占Thread-1已拥有的资源，只能等待其主动释放。

环路等待条件：hread-0等待Thread-1占用的资源B，Thread-1等待Thread-0占用的资源A，形成环路等待条件。
*/
```

## 交互

- 线程之间有交互通知的需求，考虑如下情况：
- 有两个线程，处理同一个英雄。 一个加血，一个减血。减血的线程，发现血量=1，就停止减血，直到加血的线程为英雄加了血，才可以继续减血
- 在Hero类中：hurt()减血方法：当hp=1的时候，执行this.wait().
- this.wait()表示 让占有this的线程等待，并临时释放占有
- 进入hurt方法的线程必然是减血线程，this.wait()会让减血线程临时释放对this的占有。 这样加血线程，就有机会进入recover()加血方法了。
- recover() 加血方法：增加了血量，执行this.notify();
- this.notify() 表示通知那些等待在this的线程，可以苏醒过来了。 等待在this的线程，恰恰就是减血线程。 一旦recover()结束， 加血线程释放了this，减血线程，就可以重新占有this，并执行后面的减血工作。

```java
package charactor;

public class Hero {
	public String name;
	public float hp;

	public int damage;

	public synchronized void recover() {
		hp = hp + 1;
		System.out.printf("%s 回血1点,增加血后，%s的血量是%.0f%n", name, name, hp);
		// 通知那些等待在this对象上的线程，可以醒过来了，如第20行，等待着的减血线程，苏醒过来
		this.notify();
	}

	public synchronized void hurt() {
		if (hp == 1) {
			try {
				// 让占有this的减血线程，暂时释放对this的占有，并等待
				this.wait();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		hp = hp - 1;
		System.out.printf("%s 减血1点,减少血后，%s的血量是%.0f%n", name, name, hp);
	}

	public void attackHero(Hero h) {
		h.hp -= damage;
		System.out.format("%s 正在攻击 %s, %s的血变成了 %.0f%n", name, h.name, h.name, h.hp);
		if (h.isDead())
			System.out.println(h.name + "死了！");
	}

	public boolean isDead() {
		return 0 >= hp ? true : false;
	}

}


```

```java

package multiplethread;
     
import java.awt.GradientPaint;
   
import charactor.Hero;
     
public class TestThread {
     
    public static void main(String[] args) {
   
        final Hero gareen = new Hero();
        gareen.name = "盖伦";
        gareen.hp = 616;
            
        Thread t1 = new Thread(){
            public void run(){
                while(true){
                      
                    //无需循环判断
//                    while(gareen.hp==1){
//                        continue;
//                    }
                      
                    gareen.hurt();
                    
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
  
            }
        };
        t1.start();
  
        Thread t2 = new Thread(){
            public void run(){
                while(true){
                    gareen.recover();
  
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
  
            }
        };
        t2.start();
            
    }
         
}

```

![](http://stepimagewm.how2j.cn/796.png)

- 这里需要强调的是，wait方法和notify方法，并不是Thread线程上的方法，它们是Object上的方法。
- 因为所有的Object都可以被用来作为同步对象，所以准确的讲，wait和notify是同步对象上的方法。
- wait()的意思是： 让占用了这个同步对象的线程，临时释放当前的占用，并且等待。 所以调用wait是有前提条件的，一定是在synchronized块里，否则就会出错。
- notify() 的意思是，通知一个等待在这个同步对象上的线程，你可以苏醒过来了，有机会重新占用当前对象了。
- notifyAll() 的意思是，通知所有的等待在这个同步对象上的线程，你们可以苏醒过来了，有机会重新占用当前对象了。



## 线程池

- 每一个线程的启动和结束都是比较消耗时间和占用资源的。
- 如果在系统中用到了很多的线程，大量的启动和结束动作会导致系统的性能变卡，响应变慢。 
- 为了解决这个问题，引入线程池这种设计思想。 
- 线程池的模式很像[生产者消费者模式](http://how2j.cn/k/thread/thread-wait-notify/358.html#step2591)，消费的对象是一个一个的能够运行的任务

### 设计思路

- 准备一个任务容器
- 一次性启动10个 消费者线程
-  刚开始任务容器是空的，所以线程都wait在上面。
- 直到一个外部线程往这个任务容器中扔了一个“任务”，就会有一个消费者线程被[唤醒notify](http://how2j.cn/k/thread/thread-wait-notify/358.html#step796)
-  这个消费者线程取出“任务”，并且执行这个任务，执行完毕后，继续等待下一次任务的到来。
- 如果短时间内，有较多的任务加入，那么就会有多个线程被唤醒，去执行这些任务。
- 在整个过程中，都不需要创建新的线程，而是循环使用这些已经存在的线程

![](http://stepimagewm.how2j.cn/2600.png)

### 自定义

- 缓慢的给这个线程池添加任务，会看到有多条线程来执行这些任务。
- 线程7执行完毕任务后，又回到池子里，下一次任务来的时候，线程7又来执行新的任务。

```java
package multiplethread;
 
import java.util.LinkedList;
 
public class ThreadPool {
 
    // 线程池大小
    int threadPoolSize;
 
    // 任务容器
    LinkedList<Runnable> tasks = new LinkedList<Runnable>();
 
    // 试图消费任务的线程
 
    public ThreadPool() {
        threadPoolSize = 10;
 
        // 启动10个任务消费者线程
        synchronized (tasks) {
            for (int i = 0; i < threadPoolSize; i++) {
                new TaskConsumeThread("任务消费者线程 " + i).start();
            }
        }
    }
 
    public void add(Runnable r) {
        synchronized (tasks) {
            tasks.add(r);
            // 唤醒等待的任务消费者线程
            tasks.notifyAll();
        }
    }
 
    class TaskConsumeThread extends Thread {
        public TaskConsumeThread(String name) {
            super(name);
        }
 
        Runnable task;
 
        public void run() {
            System.out.println("启动： " + this.getName());
            while (true) {
                synchronized (tasks) {
                    while (tasks.isEmpty()) {
                        try {
                            tasks.wait();
                        } catch (InterruptedException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }
                    }
                    task = tasks.removeLast();
                    // 允许添加任务的线程可以继续添加任务
                    tasks.notifyAll();
 
                }
                System.out.println(this.getName() + " 获取到任务，并执行");
                task.run();
            }
        }
    }
 
}
```

```java

package multiplethread;

public class TestThread {
      
	public static void main(String[] args) {
        ThreadPool pool = new ThreadPool();
 
        for (int i = 0; i < 5; i++) {
        	Runnable task = new Runnable() {
                @Override
                public void run() {
                    //System.out.println("执行任务");
                	//任务可能是打印一句话
                	//可能是访问文件
                	//可能是做排序
                }
            };
        	
            pool.add(task);
        	
            try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
 
    }
          
}

```

![](http://stepimagewm.how2j.cn/1006.png)

### 测试

- 创造一个情景，每个任务执行的时间都是1秒
- 刚开始是间隔1秒钟向线程池中添加任务
- 然后间隔时间越来越短，执行任务的线程还没有来得及结束，新的任务又来了。
- 就会观察到线程池里的其他线程被唤醒来执行这些任务

```java
package multiplethread;
 
public class TestThread {
    public static void main(String[] args) {
        ThreadPool pool= new ThreadPool();
        int sleep=1000;
        while(true){
            pool.add(new Runnable(){
                @Override
                public void run() {
                    //System.out.println("执行任务");
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            });
            try {
                Thread.sleep(sleep);
                sleep = sleep>100?sleep-100:sleep;
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
             
        }
         
    }
}

```

![](http://stepimagewm.how2j.cn/2601.png)

### java线程池

- 线程池类ThreadPoolExecutor在包java.util.concurrent下
- `ThreadPoolExecutor threadPool= new ThreadPoolExecutor(10, 15, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());`
- 第一个参数10 表示这个线程池初始化了10个线程在里面工作
- 第二个参数15 表示如果10个线程不够用了，就会自动增加到最多15个线程
- 第三个参数60 结合第四个参数TimeUnit.SECONDS，表示经过60秒，多出来的线程还没有接到活儿，就会回收，最后保持池子里就10个
- 第四个参数TimeUnit.SECONDS 如上
- 第五个参数 new LinkedBlockingQueue() 用来放任务的集合
- execute方法用于添加新的任务

```java
package multiplethread;
  
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
  
public class TestThread {
  
    public static void main(String[] args) throws InterruptedException {
          
        ThreadPoolExecutor threadPool= new ThreadPoolExecutor(10, 15, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());
          
        threadPool.execute(new Runnable(){
  
            @Override
            public void run() {
                // TODO Auto-generated method stub
                System.out.println("任务1");
            }
              
        });
  
    }
  
}

```

## Lock

- 与synchronized类似的，lock也能够达到同步的效果
- Lock是一个接口，为了使用一个Lock对象，需要用到
- `Lock lock = new ReentrantLock();`
- 与 synchronized (someObject) 类似的，lock()方法，表示当前线程占用lock对象，一旦占用，其他线程就不能占用了。
- 与 synchronized 不同的是，一旦synchronized 块结束，就会自动释放对someObject的占用。 lock却必须调用unlock方法进行手动释放，为了保证释放的执行，往往会把unlock() 放在finally中进行。

```java
package multiplethread;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TestThread {

	public static String now() {
		return new SimpleDateFormat("HH:mm:ss").format(new Date());
	}

	public static void log(String msg) {
		System.out.printf("%s %s %s %n", now() , Thread.currentThread().getName() , msg);
	}

	public static void main(String[] args) {
		Lock lock = new ReentrantLock();

		Thread t1 = new Thread() {
			public void run() {
				try {
					log("线程启动");
					log("试图占有对象：lock");

					lock.lock();

					log("占有对象：lock");
					log("进行5秒的业务操作");
					Thread.sleep(5000);

				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					log("释放对象：lock");
					lock.unlock();
				}
				log("线程结束");
			}
		};
		t1.setName("t1");
		t1.start();
		try {
			//先让t1飞2秒
			Thread.sleep(2000);
		} catch (InterruptedException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Thread t2 = new Thread() {

			public void run() {
				try {
					log("线程启动");
					log("试图占有对象：lock");

					lock.lock();

					log("占有对象：lock");
					log("进行5秒的业务操作");
					Thread.sleep(5000);

				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					log("释放对象：lock");
					lock.unlock();
				}
				log("线程结束");
			}
		};
		t2.setName("t2");
		t2.start();
	}

}

```

![](http://stepimagewm.how2j.cn/2611.png)

- synchronized 是不占用到手不罢休的，会一直试图占用下去。
- 与 synchronized 的钻牛角尖不一样，Lock接口还提供了一个trylock方法。
- trylock会在指定时间范围内试图占用，占成功了，就啪啪啪。 如果时间到了，还占用不成功，扭头就走~
- 注意： 因为使用trylock有可能成功，有可能失败，所以后面unlock释放锁的时候，需要判断是否占用成功了，如果没占用成功也unlock,就会抛出异常

```java
package multiplethread;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TestThread {

	public static String now() {
		return new SimpleDateFormat("HH:mm:ss").format(new Date());
	}

	public static void log(String msg) {
		System.out.printf("%s %s %s %n", now() , Thread.currentThread().getName() , msg);
	}

	public static void main(String[] args) {
		Lock lock = new ReentrantLock();

		Thread t1 = new Thread() {
			public void run() {
				boolean locked = false;
				try {
					log("线程启动");
					log("试图占有对象：lock");

					locked = lock.tryLock(1,TimeUnit.SECONDS);
					if(locked){
						log("占有对象：lock");
						log("进行5秒的业务操作");
						Thread.sleep(5000);
					}
					else{
						log("经过1秒钟的努力，还没有占有对象，放弃占有");
					}

				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					
					if(locked){
						log("释放对象：lock");
						lock.unlock();
					}
				}
				log("线程结束");
			}
		};
		t1.setName("t1");
		t1.start();
		try {
			//先让t1飞2秒
			Thread.sleep(2000);
		} catch (InterruptedException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Thread t2 = new Thread() {

			public void run() {
				boolean locked = false;
				try {
					log("线程启动");
					log("试图占有对象：lock");

					locked = lock.tryLock(1,TimeUnit.SECONDS);
					if(locked){
						log("占有对象：lock");
						log("进行5秒的业务操作");
						Thread.sleep(5000);
					}
					else{
						log("经过1秒钟的努力，还没有占有对象，放弃占有");
					}

				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					
					if(locked){
						log("释放对象：lock");
						lock.unlock();
					}
				}
				log("线程结束");
			}
		};
		t2.setName("t2");
		t2.start();
	}

}

```

![](http://stepimagewm.how2j.cn/2612.png)

- 使用synchronized方式进行线程交互，用到的是同步对象的wait,notify和notifyAll方法
- Lock也提供了类似的解决办法，首先通过lock对象得到一个Condition对象，然后分别调用这个Condition对象的：await, signal,signalAll 方法
- 注意： 不是Condition对象的wait,nofity,notifyAll方法,是await,signal,signalAll

```java
package multiplethread;
 
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
 
public class TestThread {
 
    public static String now() {
        return new SimpleDateFormat("HH:mm:ss").format(new Date());
    }
 
    public static void log(String msg) {
        System.out.printf("%s %s %s %n", now() , Thread.currentThread().getName() , msg);
    }
 
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();
        Condition condition = lock.newCondition();
        
        Thread t1 = new Thread() {
            public void run() {
                try {
                    log("线程启动");
                    log("试图占有对象：lock");
 
                    lock.lock();
 
                    log("占有对象：lock");
                    log("进行5秒的业务操作");
                    Thread.sleep(5000);
                    log("临时释放对象 lock， 并等待");
                    condition.await();
                    log("重新占有对象 lock，并进行5秒的业务操作");
                    Thread.sleep(5000);
 
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    log("释放对象：lock");
                    lock.unlock();
                }
                log("线程结束");
            }
        };
        t1.setName("t1");
        t1.start();
        try {
            //先让t1飞2秒
            Thread.sleep(2000);
        } catch (InterruptedException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        Thread t2 = new Thread() {
 
            public void run() {
                try {
                    log("线程启动");
                    log("试图占有对象：lock");
 
                    lock.lock();
 
                    log("占有对象：lock");
                    log("进行5秒的业务操作");
                    Thread.sleep(5000);
                    log("唤醒等待中的线程");
                    condition.signal();
 
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    log("释放对象：lock");
                    lock.unlock();
                }
                log("线程结束");
            }
        };
        t2.setName("t2");
        t2.start();
    }
 
}

```

![](http://stepimagewm.how2j.cn/2617.png)

-  Lock是一个接口，而synchronized是Java中的关键字，synchronized是内置的语言实现，Lock是代码层面的实现。
- Lock可以选择性的获取锁，如果一段时间获取不到，可以放弃。synchronized不行，会一根筋一直获取下去。 借助Lock的这个特性，就能够规避死锁，synchronized必须通过谨慎和良好的设计，才能减少死锁的发生。
- synchronized在发生异常和同步块结束的时候，会自动释放锁。而Lock必须手动释放， 所以如果忘记了释放锁，一样会造成死锁。

## 原子访问

- 所谓的原子性操作即不可中断的操作，比如赋值操作
- 原子性操作本身是线程安全的 
- 但是 i++ 这个行为，事实上是有3个原子性操作组成的。
  步骤 1. 取 i 的值
  步骤 2. i + 1
  步骤 3. 把新的值赋予i
- 这三个步骤，每一步都是一个原子操作，但是合在一起，就不是原子操作。就不是线程安全的。 
- 换句话说，一个线程在步骤1 取i 的值结束后，还没有来得及进行步骤2，另一个线程也可以取 i的值了。
- i++ ，i--， i = i+1 这些都是非原子性操作。

### AtomicInteger

- JDK6 以后，新增加了一个包java.util.concurrent.atomic，里面有各种原子类，比如AtomicInteger。
- 而AtomicInteger提供了各种自增，自减等方法，这些方法都是原子性的。
- 换句话说，自增方法 incrementAndGet 是线程安全的，同一个时间，只有一个线程可以调用这个方法。代码比较复制代码

```java
package multiplethread;
  
import java.util.concurrent.atomic.AtomicInteger;
  
public class TestThread {
  
    public static void main(String[] args) throws InterruptedException {
    	AtomicInteger atomicI =new AtomicInteger();
    	int i = atomicI.decrementAndGet();
    	int j = atomicI.incrementAndGet();
    	int k = atomicI.addAndGet(3);
    	
    }
  
}

```

- 分别使用基本变量的非原子性的++运算符和 原子性的AtomicInteger对象的 incrementAndGet 来进行多线程测试。

```java
package multiplethread;

import java.util.concurrent.atomic.AtomicInteger;

public class TestThread {
   
	private static int value = 0;
	private static AtomicInteger atomicValue =new AtomicInteger();
    public static void main(String[] args) {
    	int number = 100000;
    	Thread[] ts1 = new Thread[number];
    	for (int i = 0; i < number; i++) {
    		Thread t =new Thread(){
    			public void run(){
    				value++;
    			}
    		};
    		t.start();
    		ts1[i] = t;
		}
    	
    	//等待这些线程全部结束
    	for (Thread t : ts1) {
			try {
				t.join();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
    	
        System.out.printf("%d个线程进行value++后，value的值变成:%d%n", number,value);
      	Thread[] ts2 = new Thread[number];
    	for (int i = 0; i < number; i++) {
    		Thread t =new Thread(){
    			public void run(){
    				atomicValue.incrementAndGet();
    			}
    		};
    		t.start();
    		ts2[i] = t;
		}
    	
    	//等待这些线程全部结束
    	for (Thread t : ts2) {
			try {
				t.join();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
        System.out.printf("%d个线程进行atomicValue.incrementAndGet();后，atomicValue的值变成:%d%n", number,atomicValue.intValue());
    }
       
}

```

![](http://stepimagewm.how2j.cn/2626.png)

本文引用自：http://how2j.cn