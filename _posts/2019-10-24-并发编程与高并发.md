---
layout: post
title: "并发编程与高并发"
categories: 并发
tags: 并发
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 概念

- **并发**：同时拥有两个或者多个线程，如果程序在单核处理器上运行，多个线程将交替的换入或换出内存，这些线程是同时“存在”的，每个线程都处于执行过程中的某个状态，如果运行在多核处理器上，此时，程序中的每个线程都将分配到一个处理器核上，因此可以同时运行
  - 多个线程操作相同的资源，保证线程安全，合理使用资源
- **高并发**：高并发（High Concurrency）是互联网分布式系统架构设计中必须考虑的因素之一，它通常是指，通过设计保证系统能够**同时并行处理**很多请求。
  - 服务能同时处理很多请求，提高程序性能

### 内存模型

#### 同步操作

- **lock（锁定）**：作用于主内存的变量，把一个变量标识为一条线程独占状态
- **unlock（解锁）**：作用于主内存的变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
- **read（读取）**：作用于主内存的变量，把一个变量的值从主内存传输到线程的工作内存中，以便以后的load动作使用。
- **load（载入）**：作用于工作内存的变量，它把read操作从主内存中得到的变量值放入工作内存的变量副本中。
- **use（使用）**：作用于工作内存的变量，把工作内存中的一个变量值传递给执行引擎。
- **assign（赋值）**：作用于工作内存的变量，它把一个从执行引擎接收到的值赋值给工作内存的变量。
- **store（存储）**：作用于工作内存的变量，把工作内存中的一个变量的值传送到主内存中，以便以后的write操作。
- **write（写入）**：作用于主内存的变量，它把store操作从工作内存中一个变量的值传送到主内存的变量中。

#### 同步规则

- 如果要把一个变量从主内存中复制到工作内存，就需要按顺序地执行read和load操作，如果把变量从工作内存中同步回主内存中，就要按顺序地执行store和write操作。但java内存模型只要求上述操作必须按顺序执行，而没有保证必须是连续执行。
- 不允许read和load、store和write操作之一单独出现
- 不允许一个线程丢弃它的最近assign的操作，即变量在工作内存中改变了之后必须同步到主内存中
- 不允许一个线程无原因地（没有发生过任何assign操作）把数据从工作内存同步回主内存中。
- 一个新的变量只能在主内存中诞生，不允许在工作内存中直接使用一个未被初始化（load或assign）的变量。即就是对一个变量实施use和store操作之前，必须先执行过了assign和load操作。
- 一个变量在同一时刻只允许一条线程对其进行lock操作，但lock操作可以被同一条线程重复执行多次，多次执行lock后，只有执行相同次数的unlock操作，变量才会被解锁。lock和unlock必须成对出现。
- 如果一个变量执行lock操作，将会清空工作内存中此变量的值，在执行引擎使用这个变量前需要重新执行load或assign操作初始化变量的值
- 如果一个变量事先没有被lock操作锁定，则不允许对它执行unlock操作；也不允许去unlock一个被其他线程锁定的变量。
- 对一个变量执行unlock操作之前，必须先把此变量同步到主内存中（执行store和write操作）。

#### 并发优势

- 速度：同时处理多个请求，响应更快；复杂的操作可以分成多个进程同时进行
- 设计：程序设计在某些情况下更简单，也可以有更多的选择。
- 资源利用：cup能够在等待io的时候做一些其他的事情

#### 并发风险

- 安全性：多个线程共享数据时可能会产生与期望不符的结果
- 活跃性：某个操作无法继续进行下去时，就会发生活跃性问题。比如死锁，饥饿等问题
- 性能：线程过多时会使得CPU频繁切换，调度时间增多，同步机制，消耗过多内存



### 线程安全性

- 当多个线程访问某个类时，不管运行时环境采用**何种调度方式**或者这些进程将如何交替执行，并且在主调度代码中**不需要任何额外的同步或协同**，这个类都能表现出**正确的行为**，那么就称这个类是线程安全的。
- 原子性：提供了互斥访问，同一时刻只能有一个线程来对它进行操作
- 可见性：一个线程对主内存的修改可以及时的被其他线程观察到
- 有序性：一个线程观察其他线程中的指令执行顺序，由于指令重排序的存在，该观察结果一般杂乱无序。
- 原子性锁
  - synchronized：依赖JVM，不可中断锁，适合竞争不激烈，可读性好
  - Lock：依赖特殊的CPU指令，代码实现，ReentrantLock。可中断锁，多样化同步，竞争激烈时能维持常态
- synchronized：
  - 修饰代码块：大括号括起来的代码，作用于**调用的对象**
  - 修饰方法：整个方法，作用于**调用的对象**
  - 修饰静态方法：整个静态方法，作用于**所有对象**
  - 修饰类：括号括起来的部分，作用于**所有对象**

#### 总结

- 原子性：Atomic包，CAS算法，synchronized，Lock
- 可见性：synchronized，volatile
- 有序性：happens-before原则

### 可见性

- 导致共享变量在线程间不可见的原因：
  - 线程交叉执行
  - 重排序结合线程交叉执行
  - 共享变量更新后的值没有在工作内存与主存间及时更新
- JMM对synchronized的规定：
  - 线程解锁前，必须把共享变量的最新值刷新到主内存
  - 线程加锁时，将清空工作内存中共享变量的值，从而使用共享变量时需要从主内存中重新读取最新的值（加锁和解锁是同一把锁）
- volatile通过加入**内存屏障**和**禁止重排序**来实现可见性
  - 对volatile变量写操作时，会在写操作后加入一条store屏障指令，将本地内存中的共享变量值刷新到主内存
  - 对volatile变量的读操作时，会在读操作前加入一条load屏障指令，从主存中读取共享变量
  - volatile不具有原子性，不适用于计数
  - 使用volatile的两个条件：
    - 对变量的写操作不依赖于当前值
    - 该变量没有包含在具有其他变量的不变表达式中
    - **volatile适合做状态标记量**

### 安全发布对象

#### 发布&逸出

- 发布对象：使一个对象能够被当前范围之外的代码所使用
- 对象逸出：一种错误的发布。当一个对象还没有构造完成时，就使它被其他线程所见

#### 安全发布

- 在静态初始化函数中初始化一个对象引用
- 将对象的引用保存到volatile类型域或者AtomicReference对象中
- 将对象的引用保存到某个正确构造对象的final类型域中
- 将对象的引用保存到一个由锁保护的域中



### 不可变对象

- 不可变对象需要满足的条件：
  - 对象创建以后状态就不能修改
  - 对象所有域都是final类型
  - 对象是正确创建的（在对象创建期间，this引用没有逸出）
- final关键字：
  - 修饰类：不能被继承
  - 修饰方法：锁定方法不被继承类修改，提高效率
  - 修饰变量：基本数据类型（初始化后不能修改），引用类型变量（初始化后不能再指向其他对象）
- Collections.unmodifiableXXX：Collection、List、Set、Map
- Guava:ImmutableXXX：Collection、List、Set、Map

### 线程封闭

- ThreadLocal线程封闭：这是一种特别好的封闭方法
- 堆栈封闭：局部变量（在方法中定义局部变量），无并发问题

### 线程不安全类

- StringBuilder（线程不安全，但作为局部变量时安全的（堆栈封闭））
- StringBuffer（线程安全，底层方法加了synchronized修饰符，但是效率低）
- SimpleDateFormat（作为全局变量是不安全的，作为局部变量时安全的（堆栈封闭））
- JodaTime（线程安全）
- ArrayList、HashSet、HashMap都是线程不安全的类
- 线程不安全的写法：if（condition（a））｛handle（a）；｝ 

### 同步容器

- vector，Stack，HashTable，Collections.synchronizedXXX（这些都是线程安全的）
- 下面是JUC（java.util.concurrent包下的同步容器）
- ArrayList ---> CopyOnWriteArrayList
- HashSet、TreeSet ---> CopyOnWriteArraySet、ConcurrentSkipListSet
- HashMap、TreeMap ---> ConcurrentHashMap、ConcurrentSkipListMap

### 安全共享对象策略

- 线程限制：一个被线程限制的对象，由线程独占，并且只能被占有它的线程修改
- 共享只读：一个共享只读的对象，在没有额外同步的情况下，可以被多个线程并发访问，但是任何线程都不能修改它
- 线程安全对象：一个线程安全的对象或者容器，在内部通过同步机制来保证线程安全，所以其他线程无需额外的同步就可以通过公共接口随意访问它
- 被守护对象：被守护对象只能通过获取特定的锁来访问

### AQS

- AQS（AbstractQueuedSynchronizer）使用Node实现FIFO队列，可以用于构建锁或者其他同步装置的基础框架
- 利用了一个int类型表示状态
- 使用方法是继承
- 子类通过继承并通过实现它的方法管理其状态｛acquire和release｝的方法操纵状态
- 可以同时实现排它锁和共享锁模式（独占、共享）

#### AQS同步组件

- CountDownLatch（倒计时器）
- Semaphore（信号量，控制并发访问的线程个数）
- CyclicBarrier（循环栅栏，允许一组线程相互等待，直到到达一个公共的屏障点）
- ReentrantLock（可重入锁）
  - 和synchronized区别是：可重入性、锁的实现、性能区别、功能区别
  - 可指定是公平锁（先等待的线程先获取锁）还是非公平锁
  - 提供了一个Condition类，可以分组唤醒需要唤醒的线程
  - 提供能够中断等待锁的线程的机制，lock.lockInterruptibly()
- Condition

#### JUC拓展

- FutureTask（创建多线程任务，并获取任务的结果。）
- ForkJoin框架（用于并行执行任务，它的思想就是讲一个大任务分割成若干小任务，最终汇总每个小任务的结果得到这个大任务的结果。）
- BlockingQueue（阻塞队列）
  - 当队列已满，线程需要入队的时候会阻塞
  - 当队列为空，线程需要出队的时候会阻塞
  - 实现类：ArrayBlockingQueue
  - 实现类：DelayQueue
  - 实现类：LinkedBlockingQueue
  - 实现类：PriorityBlockingQueue
  - 实习类：SynchronousQueue

### 线程池

- 使用new Thread的弊端：
  - 每次new Thread新建对象，性能差
  - 线程缺乏统一管理，可以无限制的新建线程，相互竞争，有可能占用过多系统资源导致死机或OOM
  - 缺乏更多功能，如更多执行、定期执行、线程中断
- 线程池的好处：
  - 重用存在的线程，减少对象创建、消亡的开销，性能佳
  - 可有效控制最大并发线程数，提高系统资源利用率，同时可以避免过多资源竞争，避免阻塞
  - 提供定时任务、定期执行、单线程、并发数控制等功能

#### ThreadPoolExecutor

- corePoolSize：核心线程数量
- maximumPoolSize：线程最大线程数
- workQueue：阻塞队列，存储等待执行的任务，**很重要**，会对线程池运行过程产生重大影响
- keepAliveTime：线程没有任务执行时最多保持多久时间终止
- unit：keepAliveTime的时间单位
- threadFactory：线程工厂，用来创建线程
- rejectHandler：当拒绝处理任务时的策略
- execute（）：提交任务，交给线程池执行
- submit（）：提交任务，能够返回执行结果 execute+Future
- shutdown（）：关闭线程池，等待任务都执行完
- shutdownNow（）：关闭线程池，不等待任务执行完
- getTaskCount（）：线程池已执行和未执行的任务总数
- getCompletedTaskCount（）：已完成的任务数量
- getPoolSize（）：线程池当前的线程数量
- getActiveCount（）：当前线程池中正在执行任务的线程数量

#### Executor框架接口

- Executors.newCachedThreadPool

```java
package com.mmall.concurrency.example.threadPool;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**测试newCachedThreadPool
 * @author Administrator
 */
@Slf4j
public class ThreadPoolExample1 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newCachedThreadPool();

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}

```



- Executors.newFixedThreadPool

```java
package com.mmall.concurrency.example.threadPool;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**测试newFixedThreadPool
 * @author Administrator
 */
@Slf4j
public class ThreadPoolExample2 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newFixedThreadPool(3);

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}

```



- Executors.newScheduledThreadPool

```java
package com.mmall.concurrency.example.threadPool;

import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**测试newScheduledThreadPool
 * @author Administrator
 */
@Slf4j
public class ThreadPoolExample4 {

    public static void main(String[] args) {

        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

//        executorService.schedule(new Runnable() {
//            @Override
//            public void run() {
//                log.warn("schedule run");
//            }
//        }, 3, TimeUnit.SECONDS);

        executorService.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                log.warn("schedule run");
            }
        }, 1, 3, TimeUnit.SECONDS);
//        executorService.shutdown();

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                log.warn("timer run");
            }
        }, new Date(), 5 * 1000);
    }
}

```



- Executors.newSingleThreadExecutor

```java
package com.mmall.concurrency.example.threadPool;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**测试newSingleThreadExecutor
 * @author Administrator
 */
@Slf4j
public class ThreadPoolExample3 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newSingleThreadExecutor();

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}

```

#### 死锁

```java
package com.mmall.concurrency.example.deadLock;

import lombok.extern.slf4j.Slf4j;

/**
 * 一个简单的死锁类
 * 当DeadLock类的对象flag==1时（td1），先锁定o1,睡眠500毫秒
 * 而td1在睡眠的时候另一个flag==0的对象（td2）线程启动，先锁定o2,睡眠500毫秒
 * td1睡眠结束后需要锁定o2才能继续执行，而此时o2已被td2锁定；
 * td2睡眠结束后需要锁定o1才能继续执行，而此时o1已被td1锁定；
 * td1、td2相互等待，都需要得到对方锁定的资源才能继续执行，从而死锁。
 */

@Slf4j
public class DeadLock implements Runnable {
    public int flag = 1;
    //静态对象是类的所有对象共享的
    private static Object o1 = new Object(), o2 = new Object();

    @Override
    public void run() {
        log.info("flag:{}", flag);
        if (flag == 1) {
            synchronized (o1) {
                try {
                    Thread.sleep(500);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                synchronized (o2) {
                    log.info("1");
                }
            }
        }
        if (flag == 0) {
            synchronized (o2) {
                try {
                    Thread.sleep(500);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                synchronized (o1) {
                    log.info("0");
                }
            }
        }
    }

    public static void main(String[] args) {
        DeadLock td1 = new DeadLock();
        DeadLock td2 = new DeadLock();
        td1.flag = 1;
        td2.flag = 0;
        //td1,td2都处于可执行状态，但JVM线程调度先执行哪个线程是不确定的。
        //td2的run()可能在td1的run()之前运行
        new Thread(td1).start();
        new Thread(td2).start();
    }
}

```



### 代码实例

#### 计数器案例

- Atomic：竞争激烈时能维持常态，比Lock性能好；只能同步一个值

- com.mmall.concurrency.example.count.CountExample1(线程不安全的程序计数类)
- com.mmall.concurrency.example.count.CountExample2(线程安全的程序计数类:AtomicInteger)
- com.mmall.concurrency.example.atomic.AtomicExample3(线程安全的程序计数器类（LongAdder）)
- com.mmall.concurrency.example.atomic.AtomicExample4(线程安全的类（AtomicReference）)
- com.mmall.concurrency.example.atomic.AtomicExample5(线程安全的类（AtomicIntegerFieldUpdater）)
- com.mmall.concurrency.example.atomic.AtomicExample6(线程安全的类（AtomicBoolean）)

#### synchronized

- com.mmall.concurrency.example.sync.SynchronizedExample1(修饰代码块和方法)
- com.mmall.concurrency.example.sync.SynchronizedExample2(修饰类或静态方法)
- com.mmall.concurrency.example.count.CountExample3(使用synchronized实现计数器)
- com.mmall.concurrency.example.count.CountExample4(使用volatile实现计数器)

#### 发布对象

- com.mmall.concurrency.example.publish.UnsafePublish(线程不安全的对象发布)
- com.mmall.concurrency.example.publish.Escape(对象逸出)
- com.mmall.concurrency.example.singleton.SingletonExample1(懒汉模式-线程不安全)
- com.mmall.concurrency.example.singleton.SingletonExample2(饿汉模式-线程安全)
- com.mmall.concurrency.example.singleton.SingletonExample3(线程安全的懒汉模式)
- com.mmall.concurrency.example.singleton.SingletonExample4(双重同步锁单例模式)
- com.mmall.concurrency.example.singleton.SingletonExample5(双重同步锁单例模式-volatile)
- com.mmall.concurrency.example.singleton.SingletonExample6(饿汉模式-静态代码块)
- com.mmall.concurrency.example.singleton.SingletonExample7(枚举模式：最安全)

#### 不可变对象

- com.mmall.concurrency.example.immutable.ImmutableExample1(测试final)
- com.mmall.concurrency.example.immutable.ImmutableExample2(测试Collections)
- com.mmall.concurrency.example.immutable.ImmutableExample3(测试Immutable)

#### 线程封闭

- com.mmall.concurrency.example.threadLocal.RequestHolder(请求持有的线程:封装ThreadLocal)
- com.mmall.concurrency.HttpFilter(请求过滤器，往ThreadLocal中添加内容)
- com.mmall.concurrency.HttpInterceptor(请求拦截器，在请求结束后清空ThreadLocal)

[具体使用工具](https://baiweijieku.github.io/2019/04/14/RBAC%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F/#%E7%94%A8%E6%88%B7%E5%92%8C%E8%AF%B7%E6%B1%82%E7%BA%BF%E7%A8%8B%E5%B7%A5%E5%85%B7%E7%B1%BB)

#### 线程不安全类

- com.mmall.concurrency.example.commonUnsafe.StringExample1(测试StringBuilder,线程不安全)
- com.mmall.concurrency.example.commonUnsafe.StringExample2(测试StringBuffer,线程安全)
- com.mmall.concurrency.example.commonUnsafe.DateFormatExample1(测试SimpleDateFormat,线程不安全)
- com.mmall.concurrency.example.commonUnsafe.DateFormatExample2(测试SimpleDateFormat作为局部变量,线程安全)
- com.mmall.concurrency.example.commonUnsafe.DateFormatExample3(测试JodaTime,线程安全)
- com.mmall.concurrency.example.commonUnsafe.ArrayListExample（ArrayList线程不安全）
- com.mmall.concurrency.example.commonUnsafe.HashSetExample（HashSet线程不安全）
- com.mmall.concurrency.example.commonUnsafe.HashMapExample（HashMap线程不安全）

#### 同步容器

- com.mmall.concurrency.example.syncContainer.VectorExample1（Vector线程安全）
- com.mmall.concurrency.example.syncContainer.VectorExample2（Vector线程不安全的情况）
- com.mmall.concurrency.example.syncContainer.VectorExample3（Vector并发修改异常）
- com.mmall.concurrency.example.syncContainer.HashTableExample（HashTable线程安全）
- com.mmall.concurrency.example.syncContainer.CollectionsExample1（使用Collections创建线程安全的list）
- com.mmall.concurrency.example.syncContainer.CollectionsExample2（使用Collections创建线程安全的Set）
- com.mmall.concurrency.example.syncContainer.CollectionsExample3（使用Collections创建线程安全的Map）
- com.mmall.concurrency.example.concurrent.CopyOnWriteArrayListExample（JUC）
- com.mmall.concurrency.example.concurrent.CopyOnWriteArraySetExample（JUC）
- com.mmall.concurrency.example.concurrent.ConcurrentSkipListSetExample（JUC）
- com.mmall.concurrency.example.concurrent.ConcurrentHashMapExample（JUC）
- com.mmall.concurrency.example.concurrent.ConcurrentSkipListMapExample（JUC）

#### AQS

- com.mmall.concurrency.example.aqs.CountDownLatchExample1（测试CountDownLatch）
- com.mmall.concurrency.example.aqs.CountDownLatchExample2（测试CountDownLatch等待超时）
- com.mmall.concurrency.example.aqs.SemaphoreExample1（测试Semaphore单许可）
- com.mmall.concurrency.example.aqs.SemaphoreExample2（测试Semaphore多许可）
- com.mmall.concurrency.example.aqs.SemaphoreExample3（测试Semaphore尝试获取许可）
- com.mmall.concurrency.example.aqs.SemaphoreExample4（测试Semaphore在超时时间内获取许可）
- com.mmall.concurrency.example.aqs.CyclicBarrierExample1（测试CyclicBarrier）
- com.mmall.concurrency.example.aqs.CyclicBarrierExample2（测试CyclicBarrier等待时间）
- com.mmall.concurrency.example.aqs.CyclicBarrierExample3（测试CyclicBarrier结合runnable）
- com.mmall.concurrency.example.lock.LockExample2（测试ReentrantLock）
- com.mmall.concurrency.example.lock.LockExample3（测试ReentrantReadWriteLock）
- com.mmall.concurrency.example.lock.LockExample4（测试StampedLock）
- com.mmall.concurrency.example.lock.LockExample5（测试StampedLock）
- com.mmall.concurrency.example.lock.LockExample6（测试Condition）
- com.mmall.concurrency.example.aqs.FutureExample（测试Future）
- com.mmall.concurrency.example.aqs.FutureTaskExample（测试FutureTask）
- com.mmall.concurrency.example.aqs.ForkJoinTaskExample（测试ForkJoin框架）