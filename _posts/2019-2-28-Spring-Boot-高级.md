---
layout: post
title:  "Spring Boot 高级"
categories: springBoot
tags: springBoot
author: 百味皆苦
music-id: 5188665
---

* content
{:toc}
### 缓存

#### JSR107

- Java Caching定义了5个核心接口，分别是CachingProvider, CacheManager, Cache, Entry和 Expiry。

  - **CachingProvider**定义了创建、配置、获取、管理和控制多个CacheManager。一个应用可以在运行期访问多个CachingProvider。
  - **CacheManager**定义了创建、配置、获取、管理和控制多个唯一命名的Cache，这些Cache存在于CacheManager的上下文中。一个CacheManager仅被一个CachingProvider所拥有。
  - **Cache**是一个类似Map的数据结构并临时存储以Key为索引的值。一个Cache仅被一个CacheManager所拥有。
  - **Entry**是一个存储在Cache中的key-value对。
  - **Expiry** 每一个存储在Cache中的条目有一个定义的有效期。一旦超过这个时间，条目为过期的状态。一旦过期，条目将不可访问、更新和删除。缓存有效期可以通过ExpiryPolicy设置。
  
- Spring从3.1开始定义了org.springframework.cache.Cache
  和org.springframework.cache.CacheManager接口来统一不同的缓存技术；并支持使用JCache（JSR-107）注解简化我们开发；

- Cache接口为缓存的组件规范定义，包含缓存的各种操作集合；

- Cache接口下Spring提供了各种xxxCache的实现；如RedisCache，EhCacheCache , ConcurrentMapCache等；

- 每次调用需要缓存功能的方法时，Spring会检查检查指定参数的指定的目标方法是否已经被调用过；如果有就直接从缓存中获取方法调用后的结果，如果没有就调用方法并缓存结果后返回给用户。下次调用直接从缓存中获取。

- 使用Spring缓存抽象时我们需要关注以下两点；

  1、确定方法需要被缓存以及他们的缓存策略

  2、从缓存中读取之前缓存存储的数据

| Cache          | 缓存接口，定义缓存操作。实现有：RedisCache、EhCacheCache、 ConcurrentMapCache等 |
| -------------- | ------------------------------------------------------------ |
| CacheManager   | 缓存管理器，管理各种缓存（Cache）组件                        |
| @Cacheable     | 主要针对方法配置，能够根据方法的请求参数对其结果进行缓存     |
| @CacheEvict    | 清空缓存                                                     |
| @CachePut      | 保证方法被调用，又希望结果被缓存。                           |
| @EnableCaching | 开启基于注解的缓存                                           |
| keyGenerator   | 缓存数据时key生成策略                                        |
| serialize      | 缓存数据时value序列化策略                                    |

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/springboot-cache-annotation.png)

![](https://raw.githubusercontent.com/BaiWeiJieKu/BaiWeiJieKu.github.io/master/images/springboot-cache-spel.png)

- 案例

- 启动类

```java
package com.mikey.cache;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@MapperScan(value = "com.mikey.cache.mapper")
@SpringBootApplication
@EnableCaching//开启缓存
public class Springboot01CacheApplication {

    public static void main(String[] args) {
        SpringApplication.run(Springboot01CacheApplication.class, args);
    }
}
```

- 配置文件

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/spring_cache
spring.datasource.username=root
spring.datasource.password=root
#spring.datasource.driver-class-name=com.mysql.jdbc.Driver
# 驼峰命名
mybatis.configuration.multiple-result-sets-enabled=true

# 日志级别
logging.level.com.mikey.cache.mapper=debug

```

- mapper

```java
import com.mikey.cache.bean.Employee;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

@Component
@Mapper
public interface EmployeeMapper {
    @Select("select * from employee where id=#{id}")
    public Employee getEmpById(Integer id);

    @Update("update employee set lastName=#{lastName},email=#{email},gender=#{gender},d_id=#{d_id} where id=#{id}")
    public void updateEmp(Employee employee);

    @Delete("Delete from employee where id=#{id}")
    public void deleteEmpById(Integer id);

    @Insert("insert employee(lastName,email,gender,d_id) values(#{lastName},#{email},#{gender},#{dId}")
    public void insertEmployee(Employee employee);
}
```

- service

```java
import com.mikey.cache.bean.Employee;
import com.mikey.cache.mapper.EmployeeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    @Autowired
    EmployeeMapper employeeMapper;

    /**
     * 将方法的运行结果进行缓存
     * @param id
     * @return
     */
//    @Cacheable(cacheNames = "emp",key = "#id")
    @Cacheable(cacheNames = "emp",condition = "#id>0",unless = "#result==null")
    public Employee getEmp(Integer id){
        System.out.println("查询"+id+"号员工");
        Employee employee=employeeMapper.getEmpById(id);
        return employee;
    }
}
```

- controller

```java
import com.mikey.cache.bean.Employee;
import com.mikey.cache.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @RequestMapping("/emp/{id}")
    public Employee getEmployee(@PathVariable("id") Integer id){
        return employeeService.getEmp(id);
    }


}
```

- 原理

  1、自动配置类；CacheAutoConfiguration

  2、缓存的配置类
    org.springframework.boot.autoconfigure.cache.GenericCacheConfiguration
    org.springframework.boot.autoconfigure.cache.JCacheCacheConfiguration
    org.springframework.boot.autoconfigure.cache.EhCacheCacheConfiguration
    org.springframework.boot.autoconfigure.cache.HazelcastCacheConfiguration
    org.springframework.boot.autoconfigure.cache.InfinispanCacheConfiguration
    org.springframework.boot.autoconfigure.cache.CouchbaseCacheConfiguration
    org.springframework.boot.autoconfigure.cache.RedisCacheConfiguration
    org.springframework.boot.autoconfigure.cache.CaffeineCacheConfiguration
    org.springframework.boot.autoconfigure.cache.GuavaCacheConfiguration
    org.springframework.boot.autoconfigure.cache.SimpleCacheConfiguration【默认】
    org.springframework.boot.autoconfigure.cache.NoOpCacheConfiguration

  3、哪个配置类默认生效：SimpleCacheConfiguration；

  4、给容器中注册了一个CacheManager：ConcurrentMapCacheManager

  5、可以获取和创建ConcurrentMapCache类型的缓存组件；他的作用将数据保存在ConcurrentMap中；

  

- 将方法的运行结果进行缓存；以后再要相同的数据，直接从缓存中获取，不用调用方法；
  CacheManager管理多个Cache组件的，对缓存的真正CRUD操作在Cache组件中，每一个缓存组件有自己唯一一个名字；

- 运行流程

```
运行流程：
@Cacheable：
1、方法运行之前，先去查询Cache（缓存组件），按照cacheNames指定的名字获取；
   （CacheManager先获取相应的缓存），第一次获取缓存如果没有Cache组件会自动创建。
2、去Cache中查找缓存的内容，使用一个key，默认就是方法的参数；
   key是按照某种策略生成的；默认是使用keyGenerator生成的，默认使用SimpleKeyGenerator生成key；
       SimpleKeyGenerator生成key的默认策略；
               如果没有参数；key=new SimpleKey()；
               如果有一个参数：key=参数的值
               如果有多个参数：key=new SimpleKey(params)；
3、没有查到缓存就调用目标方法；
4、将目标方法返回的结果，放进缓存中

@Cacheable标注的方法执行之前先来检查缓存中有没有这个数据，默认按照参数的值作为key去查询缓存，
如果没有就运行方法并将结果放入缓存；以后再来调用就可以直接使用缓存中的数据；

核心：
   1）、使用CacheManager【ConcurrentMapCacheManager】按照名字得到Cache【ConcurrentMapCache】组件
   2）、key使用keyGenerator生成的，默认是SimpleKeyGenerator


几个属性：
   cacheNames/value：指定缓存组件的名字;将方法的返回结果放在哪个缓存中，是数组的方式，可以指定多个缓存；

   key：缓存数据使用的key；可以用它来指定。默认是使用方法参数的值  1-方法的返回值
           编写SpEL； #i d;参数id的值   #a0  #p0  #root.args[0]
           getEmp[2]

   keyGenerator：key的生成器；可以自己指定key的生成器的组件id
           key/keyGenerator：二选一使用;


   cacheManager：指定缓存管理器；或者cacheResolver指定获取解析器

   condition：指定符合条件的情况下才缓存；
           ,condition = "#id>0"
       condition = "#a0>1"：第一个参数的值》1的时候才进行缓存

   unless:否定缓存；当unless指定的条件为true，方法的返回值就不会被缓存；可以获取到结果进行判断
           unless = "#result == null"
           unless = "#a0==2":如果第一个参数的值是2，结果不缓存；
   sync：是否使用异步模式
```

- 自定义key生成器

```java
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;
import java.util.Arrays;

@Configuration
public class MyCacheConfig {
    @Bean("myKeyGenerator")
    public KeyGenerator keyGenerator(){
        return new KeyGenerator(){
            @Override
            public Object generate(Object target, Method method, Object... params) {
                return method.getName()+"["+ Arrays.asList(params).toString()+"]";
            }
        };
    }
}

```

- **注意：使用异步不支持unless**
- @CachePut

```java
/**
     * @CachePut：既调用方法，又更新缓存数据；同步更新缓存
     * 修改了数据库的某个数据，同时更新缓存；
     * 运行时机：
     *  1、先调用目标方法
     *  2、将目标方法的结果缓存起来
     *
     * 测试步骤：
     *  1、查询1号员工；查到的结果会放在缓存中；
     *          key：1  value：lastName：张三
     *  2、以后查询还是之前的结果
     *  3、更新1号员工；【lastName:zhangsan；gender:0】
     *          将方法的返回值也放进缓存了；
     *          key：传入的employee对象  值：返回的employee对象；
     *  4、查询1号员工？
     *      应该是更新后的员工；
     *          key = "#employee.id":使用传入的参数的员工id；
     *          key = "#result.id"：使用返回后的id
     *             @Cacheable的key是不能用#result
     *      为什么是没更新前的？【1号员工没有在缓存中更新】
     *
     */
    @CachePut(/*value = "emp",*/key = "#result.id")
    public Employee updateEmp(Employee employee){
        System.out.println("updateEmp:"+employee);
        employeeMapper.updateEmp(employee);
        return employee;
    }
```

- @CacheEvict:缓存清除

  key：指定要清除的数据

  **allEntries = true：**指定清除这个缓存中所有的数据

  beforeInvocation = false：缓存的清除是否在方法之前执行

   默认代表缓存清除操作是在方法执行之后执行;如果出现异常缓存就不会清除

  **beforeInvocation = true：**

  代表清除缓存操作是在方法运行之前执行，无论方法是否出现异常，缓存都清除

```java
@CacheEvict(value="emp",beforeInvocation = true/*key = "#id",*/)
    public void deleteEmp(Integer id){
        System.out.println("deleteEmp:"+id);
        //employeeMapper.deleteEmpById(id);
        int i = 10/0;
    }
```

- @Caching 定义复杂的缓存规则

```java
// @Caching 定义复杂的缓存规则
    @Caching(
         cacheable = {
             @Cacheable(/*value="emp",*/key = "#lastName")
         },
         put = {
             @CachePut(/*value="emp",*/key = "#result.id"),
             @CachePut(/*value="emp",*/key = "#result.email")
         }
    )
    public Employee getEmpByLastName(String lastName){
        return employeeMapper.getEmpByLastName(lastName);
    }
```

- @CacheConfig:

```java
@CacheConfig(cacheNames="emp"/*,cacheManager = "employeeCacheManager"*/) //抽取缓存的公共配置
@Service
public class EmployeeService {
```



#### Redis

- 1:引入spring-boot-starter-data-redis
- 2:application.yml配置redis连接地址

```properties
spring.redis.host=localhost
spring.redis.password=
```



- 3:使用RestTemplate操作redis
  - redisTemplate.opsForValue();//操作字符串
  - redisTemplate.opsForHash();//操作hash
  - redisTemplate.opsForList();//操作list
  - redisTemplate.opsForSet();//操作set
  - redisTemplate.opsForZSet();//操作有序set
- 4:以json形式存储对象

```java
import com.mikey.cache.bean.Employee;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

@Configuration
public class MyRedisConfig {
    @Bean
    public RedisTemplate<Object, Employee> empredisTemplate(
            RedisConnectionFactory redisConnectionFactory) throws Exception{
        RedisTemplate<Object,Employee> template=new RedisTemplate<Object, Employee>();
        template.setConnectionFactory(redisConnectionFactory);
        Jackson2JsonRedisSerializer<Employee> ser=new Jackson2JsonRedisSerializer<Employee>(Employee.class);
        template.setDefaultSerializer(ser);
        return template;
    }
    
    //配置redis的json格式
    @Bean
    public RedisCacheManager empoyeeCacheManager(RedisTemplate<Object,Employee> employeeRedisTemplate){
        RedisCacheManager redisCacheManager=new RedisCacheManager(employeeRedisTemplate);
        redisCacheManager.setUsePrefix(true);
        return redisCacheManager;
    }
}

```

```java
import com.mikey.cache.bean.Employee;
import com.mikey.cache.mapper.EmployeeMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class Springboot01CacheApplicationTests {

    @Autowired
    EmployeeMapper employeeMapper;
    @Autowired
    StringRedisTemplate stringRedisTemplate;//操作字符串
    @Autowired
    RedisTemplate redisTemplate;//k-v都是对象

    @Test
    public void testRedis(){
//        stringRedisTemplate.opsForValue().append("msg","hello");
//        String msg = stringRedisTemplate.opsForValue().get("msg");
//        System.out.println("Message="+msg);
        stringRedisTemplate.opsForList().leftPush("mylist","1");
        stringRedisTemplate.opsForList().leftPush("mylist","2");
    }

    @Test
    public void testObjectRedis(){
        Employee employee=employeeMapper.getEmpById(1);
        redisTemplate.opsForValue().set("emp-01",employee);
    }

}

```

- 直接使用缓存管理器

```java

@RestController
public class DeptController {

    @Autowired
    @Qualifier("deptCacheManager")
    private RedisCacheManager deptCacheManager;
    
    @Autowired
    private DeptService deptService;

    @GetMapping("/depts/{id}")
    public Department getDeptByIds(@PathVariable("id") Integer id){
        System.out.println("查询部门");
        Department department=deptService.getDeptById(1);
        
        Cache dept = deptCacheManager.getCache("dept");
        dept.put("dept:1",department);
        return department;
    }

}
```



### 消息队列

#### JMS

- 大多应用中，可通过消息服务中间件来提升系统异步通信、扩展解耦能力

- 消息服务中两个重要概念：消息代理（message broker）和目的地（destination）

- 当消息发送者发送消息以后，将由消息代理接管，消息代理保证消息传递到指定目的地。

- 消息队列主要有两种形式的目的地

  队列（queue）：点对点消息通信（point-to-point）

  主题（topic）：发布（publish）/订阅（subscribe）消息通信

-  点对点式：消息发送者发送消息，消息代理将其放入一个队列中，消息接收者从队列中获取消息内容，消息读取后被移出队列，消息只有唯一的发送者和接受者，但并不是说只能有一个接收者

- 发布订阅式：发送者（发布者）发送消息到主题，多个接收者（订阅者）监听（订阅）这个主题，那么就会在消息到达时同时收到消息

- JMS（Java Message Service）JAVA消息服务：基于JVM消息代理的规范。ActiveMQ、HornetMQ是JMS实现

- AMQP：高级查询队列协议：高级消息队列协议，也是一个消息代理的规范，兼容JMS。RabbitMQ是AMQP的实现

|              | JMS                                                          | AMQP                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 定义         | Java api                                                     | 网络线级协议                                                 |
| 跨语言       | 否                                                           | 是                                                           |
| 跨平台       | 否                                                           | 是                                                           |
| Model        | 提供两种消息模型：<br/>（1）	、Peer-2-Peer<br/>（2）	、Pub/sub | 提供了五种消息模型：<br/>（1）	、direct exchange<br/>（2）	、fanout exchange<br/>（3）	、topic change<br/>（4）	、headers exchange<br/>（5）	、system exchange<br/>本质来讲，后四种和JMS的pub/sub模型没有太大差别，仅是在路由机制上做了更详细的划分； |
| 支持消息类型 | 多种消息类型：<br/>TextMessage<br/>MapMessage<br/>BytesMessage StreamMessage ObjectMessage<br/>Message （只有消息头和属性） | byte[]<br/>当实际应用时，有复杂的消息，可以将消息序列化后发送。 |
| 综合评价     | JMS 定义了JAVA API层面的标准；在java体系中，多个client均可以通过JMS进行交互，不需要应用修改代码，但是其对跨平台的支持较差； | AMQP定义了wire-level层的协议标准；天然具有跨平台、跨语言特性。 |

- Spring支持：

  spring-jms提供了对JMS的支持
  spring-rabbit提供了对AMQP的支持
  需要ConnectionFactory的实现来连接消息代理
  提供JmsTemplate、RabbitTemplate来发送消息
  @JmsListener（JMS）、@RabbitListener（AMQP）注解在方法上监听消息代理发布的消息
  @EnableJms、@EnableRabbit开启支持

- Spring Boot自动配置

  JmsAutoConfiguration
  RabbitAutoConfiguration

#### RabbitMQ

- RabbitMQ是一个由erlang开发的AMQP(Advanved Message Queue Protocol)的开源实现。
- **Message**：消息，消息是不具名的，它由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。
- **Publisher**：消息的生产者，也是一个向交换器发布消息的客户端应用程序。
- **Exchange**：交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。Exchange有4种类型：direct(默认)，fanout, topic, 和headers，不同类型的Exchange转发消息的策略有所区别
- **Queue**：消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。
- **Binding**：绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。Exchange 和Queue的绑定可以是多对多的关系。
- **Connection**：网络连接，比如一个TCP连接。
- **Channel**：信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内的虚拟连接，AMQP 命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。
- **Consumer**：消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。
- **Broker**：表示消息队列服务器实体



#### 整合RabbitMQ

- 引入 spring-boot-starter-amqp
- application.yml配置
- 测试RabbitMQ：账号密码默认为guest
- AmqpAdmin：管理组件
- RabbitTemplate：消息发送处理组件