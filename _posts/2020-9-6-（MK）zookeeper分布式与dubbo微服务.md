---
layout: post
title: "(MK)zookeeper分布式与dubbo微服务"
categories: zookeeper
tags: zookeeper MK
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}
### java api

#### 会话连接与恢复

- 连接
- [连接](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKConnect.java)

```java
/**
 * @Title: ZKConnectDemo.java
 * @Package com.imooc.zk.demo
 * @Description: zookeeper 连接demo演示
 */
public class ZKConnect implements Watcher {
         
    final static Logger log = LoggerFactory.getLogger(ZKConnect.class);
 
    public static final String zkServerPath = "192.168.1.110:2181";
// public static final String zkServerPath = "192.168.1.111:2181,192.168.1.111:2182,192.168.1.111:2183";
    public static final Integer timeout = 5000;
    
    public static void main(String[] args) throws Exception {
         /**
          * 客户端和zk服务端链接是一个异步的过程
          * 当连接成功后后，客户端会收的一个watch通知
          * 
          * 参数：
          * connectString：连接服务器的ip字符串，
          *      比如: "192.168.1.1:2181,192.168.1.2:2181,192.168.1.3:2181"
          *      可以是一个ip，也可以是多个ip，一个ip代表单机，多个ip代表集群
          *      也可以在ip后加路径
          * sessionTimeout：超时时间，心跳收不到了，那就超时
          * watcher：通知事件，如果有对应的事件触发，则会收到一个通知；如果不需要，那就设置为null
          * canBeReadOnly：可读，当这个物理机节点断开后，还是可以读到数据的，只是不能写，
          *                          此时数据被读取到的可能是旧数据，此处建议设置为false，不推荐使用
          * sessionId：会话的id
          * sessionPasswd：会话密码 当会话丢失后，可以依据 sessionId 和 sessionPasswd 重新获取会话
          */
         ZooKeeper zk = new ZooKeeper(zkServerPath, timeout, new ZKConnect());
         
         log.warn("客户端开始连接zookeeper服务器...");
         log.warn("连接状态：{}", zk.getState());
         
         new Thread().sleep(2000);
         
         log.warn("连接状态：{}", zk.getState());
    }
 
    @Override
    public void process(WatchedEvent event) {
         log.warn("接受到watch通知：{}", event);
    }
}

```

- [重连](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKConnectSessionWatcher.java)

```java
/**
 * 
 * @Title: ZKConnectDemo.java
 * @Description: zookeeper 恢复之前的会话连接demo演示
 */
public class ZKConnectSessionWatcher implements Watcher {
    
    final static Logger log = LoggerFactory.getLogger(ZKConnectSessionWatcher.class);
 
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    
    public static void main(String[] args) throws Exception {
         
         ZooKeeper zk = new ZooKeeper(zkServerPath, timeout, new ZKConnectSessionWatcher());
         
         long sessionId = zk.getSessionId();
         String ssid = "0x" + Long.toHexString(sessionId);
         System.out.println(ssid);
         byte[] sessionPassword = zk.getSessionPasswd();
         
         log.warn("客户端开始连接zookeeper服务器...");
         log.warn("连接状态：{}", zk.getState());
         new Thread().sleep(1000);
         log.warn("连接状态：{}", zk.getState());
         
         new Thread().sleep(200);
         
         // 开始会话重连
         log.warn("开始会话重连...");
         
         ZooKeeper zkSession = new ZooKeeper(zkServerPath, 
                                                timeout, 
                                                new ZKConnectSessionWatcher(), 
                                                sessionId, 
                                                sessionPassword);
         log.warn("重新连接状态zkSession：{}", zkSession.getState());
         new Thread().sleep(1000);
         log.warn("重新连接状态zkSession：{}", zkSession.getState());
    }
    
    @Override
    public void process(WatchedEvent event) {
         log.warn("接受到watch通知：{}", event);
    }
}

```



#### 节点增删改查

- [创建节点](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKNodeOperator.java)

```java
/**
 * 
 * @Title: ZKConnectDemo.java
 * @Description: zookeeper 操作demo演示
 */
public class ZKNodeOperator implements Watcher {
 
    private ZooKeeper zookeeper = null;
    
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    
    public ZKNodeOperator() {}
    
    public ZKNodeOperator(String connectString) {
         try {
             zookeeper = new ZooKeeper(connectString, timeout, new ZKNodeOperator());
         } catch (IOException e) {
             e.printStackTrace();
             if (zookeeper != null) {
                 try {
                      zookeeper.close();
                 } catch (InterruptedException e1) {
                      e1.printStackTrace();
                 }
             }
         }
    }
    
    /**
     * 
     * @Title: ZKOperatorDemo.java
     * @Description: 创建zk节点
     */
    public void createZKNode(String path, byte[] data, List<ACL> acls) {
         
         String result = "";
         try {
             /**
              * 同步或者异步创建节点，都不支持子节点的递归创建，异步有一个callback函数
              * 参数：
              * path：创建的路径
              * data：存储的数据的byte[]
              * acl：控制权限策略
              *           Ids.OPEN_ACL_UNSAFE --> world:anyone:cdrwa
              *           CREATOR_ALL_ACL --> auth:user:password:cdrwa
              * createMode：节点类型, 是一个枚举
              *           PERSISTENT：持久节点
              *           PERSISTENT_SEQUENTIAL：持久顺序节点
              *           EPHEMERAL：临时节点
              *           EPHEMERAL_SEQUENTIAL：临时顺序节点
              */
             result = zookeeper.create(path, data, acls, CreateMode.PERSISTENT);
             
//          String ctx = "{'create':'success'}";
//          zookeeper.create(path, data, acls, CreateMode.PERSISTENT, new CreateCallBack(), ctx);
             
             System.out.println("创建节点：\t" + result + "\t成功...");
             new Thread().sleep(2000);
         } catch (Exception e) {
             e.printStackTrace();
         }
    }
    
    public static void main(String[] args) throws Exception {
         ZKNodeOperator zkServer = new ZKNodeOperator(zkServerPath);
         
         // 创建zk节点
//      zkServer.createZKNode("/testnode", "testnode".getBytes(), Ids.OPEN_ACL_UNSAFE);
         
         /**修改节点数据
          * 参数：
          * path：节点路径
          * data：数据
          * version：数据状态
          */
//      Stat status  = zkServer.getZookeeper().setData("/testnode", "xyz".getBytes(), 2);
//      System.out.println(status.getVersion());
         
         /**删除节点数据
          * 参数：
          * path：节点路径
          * version：数据状态
          */
         zkServer.createZKNode("/test-delete-node", "123".getBytes(), Ids.OPEN_ACL_UNSAFE);
//      zkServer.getZookeeper().delete("/test-delete-node", 2);
         
         String ctx = "{'delete':'success'}";
         zkServer.getZookeeper().delete("/test-delete-node", 0, new DeleteCallBack(), ctx);
         Thread.sleep(2000);
    }
 
    public ZooKeeper getZookeeper() {
         return zookeeper;
    }
    public void setZookeeper(ZooKeeper zookeeper) {
         this.zookeeper = zookeeper;
    }
 
    @Override
    public void process(WatchedEvent event) {
    }
}

```

- [countDownLatch](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/countdown/CheckStartUp.java)

```java
public class CheckStartUp {
 
    private static List<DangerCenter> stationList;
    private static CountDownLatch countDown;
    
    public CheckStartUp() {
    }
    
    public static boolean checkAllStations() throws Exception {
 
         // 初始化3个调度站
         countDown = new CountDownLatch(3);
         
         // 把所有站点添加进list
         stationList = new ArrayList<>();
         stationList.add(new StationBeijingIMooc(countDown));
         stationList.add(new StationJiangsuSanling(countDown));
         stationList.add(new StationShandongChangchuan(countDown));
         
         // 使用线程池
         Executor executor = Executors.newFixedThreadPool(stationList.size());
         
         for (DangerCenter center : stationList) {
             executor.execute(center);
         }
         
         // 等待线程执行完毕
         countDown.await();
         
         for (DangerCenter center : stationList) {
             if (!center.isOk()) {
                 return false;
             }
         }
         
         return true;
    }
    
    public static void main(String[] args) throws Exception {
         boolean result = CheckStartUp.checkAllStations();
         System.out.println("监控中心针对所有危化品调度站点的检查结果为：" + result);
    }
 
}

```

- [获取节点数据](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKGetNodeData.java)

```java
/**
 * 
 * @Description: zookeeper 获取节点数据的demo演示
 */
public class ZKGetNodeData implements Watcher {
 
    private ZooKeeper zookeeper = null;
    
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    private static Stat stat = new Stat();
    
    public ZKGetNodeData() {}
    
    public ZKGetNodeData(String connectString) {
         try {
             zookeeper = new ZooKeeper(connectString, timeout, new ZKGetNodeData());
         } catch (IOException e) {
             e.printStackTrace();
             if (zookeeper != null) {
                 try {
                      zookeeper.close();
                 } catch (InterruptedException e1) {
                      e1.printStackTrace();
                 }
             }
         }
    }
    
    private static CountDownLatch countDown = new CountDownLatch(1);
    
    public static void main(String[] args) throws Exception {
    
         ZKGetNodeData zkServer = new ZKGetNodeData(zkServerPath);
         
         /**
          * 参数：
          * path：节点路径
          * watch：true或者false，注册一个watch事件
          * stat：状态
          */
         byte[] resByte = zkServer.getZookeeper().getData("/imooc", true, stat);
         String result = new String(resByte);
         System.out.println("当前值:" + result);
         countDown.await();
    }
    
    @Override
    public void process(WatchedEvent event) {
         try {
             if(event.getType() == EventType.NodeDataChanged){
                 ZKGetNodeData zkServer = new ZKGetNodeData(zkServerPath);
                 byte[] resByte = zkServer.getZookeeper().getData("/imooc", false, stat);
                 String result = new String(resByte);
                 System.out.println("更改后的值:" + result);
                 System.out.println("版本号变化dversion：" + stat.getVersion());
                 countDown.countDown();
             } else if(event.getType() == EventType.NodeCreated) {
                 
             } else if(event.getType() == EventType.NodeChildrenChanged) {
                 
             } else if(event.getType() == EventType.NodeDeleted) {
                 
             } 
         } catch (KeeperException e) { 
             e.printStackTrace();
         } catch (InterruptedException e) {
             e.printStackTrace();
         }
    }
 
    public ZooKeeper getZookeeper() {
         return zookeeper;
    }
    public void setZookeeper(ZooKeeper zookeeper) {
         this.zookeeper = zookeeper;
    }
}

```

- [获取子节点列表](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKGetChildrenList.java)

```java
/**
 * @Description: zookeeper 获取子节点数据的demo演示
 */
public class ZKGetChildrenList implements Watcher {
 
    private ZooKeeper zookeeper = null;
    
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    
    public ZKGetChildrenList() {}
    
    public ZKGetChildrenList(String connectString) {
         try {
             zookeeper = new ZooKeeper(connectString, timeout, new ZKGetChildrenList());
         } catch (IOException e) {
             e.printStackTrace();
             if (zookeeper != null) {
                 try {
                      zookeeper.close();
                 } catch (InterruptedException e1) {
                      e1.printStackTrace();
                 }
             }
         }
    }
    
    private static CountDownLatch countDown = new CountDownLatch(1);
    
    public static void main(String[] args) throws Exception {
    
         ZKGetChildrenList zkServer = new ZKGetChildrenList(zkServerPath);
         
         /**
          * 参数：
          * path：父节点路径
          * watch：true或者false，注册一个watch事件
          */
//      List<String> strChildList = zkServer.getZookeeper().getChildren("/imooc", true);
//      for (String s : strChildList) {
//          System.out.println(s);
//      }
         
         // 异步调用
         String ctx = "{'callback':'ChildrenCallback'}";
//      zkServer.getZookeeper().getChildren("/imooc", true, new ChildrenCallBack(), ctx);
         zkServer.getZookeeper().getChildren("/imooc", true, new Children2CallBack(), ctx);
         
         countDown.await();
    }
    
    @Override
    public void process(WatchedEvent event) {
         try {
             if(event.getType()==EventType.NodeChildrenChanged){
                 System.out.println("NodeChildrenChanged");
                 ZKGetChildrenList zkServer = new ZKGetChildrenList(zkServerPath);
                 List<String> strChildList = zkServer.getZookeeper().getChildren(event.getPath(), false);
                 for (String s : strChildList) {
                      System.out.println(s);
                 }
                 countDown.countDown();
             } else if(event.getType() == EventType.NodeCreated) {
                 System.out.println("NodeCreated");
             } else if(event.getType() == EventType.NodeDataChanged) {
                 System.out.println("NodeDataChanged");
             } else if(event.getType() == EventType.NodeDeleted) {
                 System.out.println("NodeDeleted");
             } 
         } catch (KeeperException e) {
             e.printStackTrace();
         } catch (InterruptedException e) {
             e.printStackTrace();
         }
    }
 
    public ZooKeeper getZookeeper() {
         return zookeeper;
    }
    public void setZookeeper(ZooKeeper zookeeper) {
         this.zookeeper = zookeeper;
    }
    
}

```

- [判断节点存在](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKNodeExist.java)

```java
/**
 * @Description: zookeeper 判断阶段是否存在demo
 */
public class ZKNodeExist implements Watcher {
 
    private ZooKeeper zookeeper = null;
    
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    
    public ZKNodeExist() {}
    
    public ZKNodeExist(String connectString) {
         try {
             zookeeper = new ZooKeeper(connectString, timeout, new ZKNodeExist());
         } catch (IOException e) {
             e.printStackTrace();
             if (zookeeper != null) {
                 try {
                      zookeeper.close();
                 } catch (InterruptedException e1) {
                      e1.printStackTrace();
                 }
             }
         }
    }
    
    private static CountDownLatch countDown = new CountDownLatch(1);
    
    public static void main(String[] args) throws Exception {
    
         ZKNodeExist zkServer = new ZKNodeExist(zkServerPath);
         
         /**
          * 参数：
          * path：节点路径
          * watch：watch
          */
         Stat stat = zkServer.getZookeeper().exists("/imooc-fake", true);
         if (stat != null) {
             System.out.println("查询的节点版本为dataVersion：" + stat.getVersion());
         } else {
             System.out.println("该节点不存在...");
         }
         
         countDown.await();
    }
    
    @Override
    public void process(WatchedEvent event) {
         if (event.getType() == EventType.NodeCreated) {
             System.out.println("节点创建");
             countDown.countDown();
         } else if (event.getType() == EventType.NodeDataChanged) {
             System.out.println("节点数据改变");
             countDown.countDown();
         } else if (event.getType() == EventType.NodeDeleted) {
             System.out.println("节点删除");
             countDown.countDown();
         }
    }
    
    public ZooKeeper getZookeeper() {
         return zookeeper;
    }
    public void setZookeeper(ZooKeeper zookeeper) {
         this.zookeeper = zookeeper;
    }
}

```

- [watch与acl](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/blob/master/imooc_code/imooc-zookeeper-starter/src/com/imooc/zk/demo/ZKNodeAcl.java)

```java
/**
 * 
 * @Description: zookeeper 操作节点acl演示
 */
public class ZKNodeAcl implements Watcher {
 
    private ZooKeeper zookeeper = null;
    
    public static final String zkServerPath = "192.168.1.110:2181";
    public static final Integer timeout = 5000;
    
    public ZKNodeAcl() {}
    
    public ZKNodeAcl(String connectString) {
         try {
             zookeeper = new ZooKeeper(connectString, timeout, new ZKNodeAcl());
         } catch (IOException e) {
             e.printStackTrace();
             if (zookeeper != null) {
                 try {
                      zookeeper.close();
                 } catch (InterruptedException e1) {
                      e1.printStackTrace();
                 }
             }
         }
    }
    
    public void createZKNode(String path, byte[] data, List<ACL> acls) {
         
         String result = "";
         try {
             /**
              * 同步或者异步创建节点，都不支持子节点的递归创建，异步有一个callback函数
              * 参数：
              * path：创建的路径
              * data：存储的数据的byte[]
              * acl：控制权限策略
              *           Ids.OPEN_ACL_UNSAFE --> world:anyone:cdrwa
              *           CREATOR_ALL_ACL --> auth:user:password:cdrwa
              * createMode：节点类型, 是一个枚举
              *           PERSISTENT：持久节点
              *           PERSISTENT_SEQUENTIAL：持久顺序节点
              *           EPHEMERAL：临时节点
              *           EPHEMERAL_SEQUENTIAL：临时顺序节点
              */
             result = zookeeper.create(path, data, acls, CreateMode.PERSISTENT);
             System.out.println("创建节点：\t" + result + "\t成功...");
         } catch (KeeperException e) {
             e.printStackTrace();
         } catch (InterruptedException e) {
             e.printStackTrace();
         } 
    }
    
    public static void main(String[] args) throws Exception {
    
         ZKNodeAcl zkServer = new ZKNodeAcl(zkServerPath);
         
         /**
          * ======================  创建node start  ======================  
          */
         // acl 任何人都可以访问
//      zkServer.createZKNode("/aclimooc", "test".getBytes(), Ids.OPEN_ACL_UNSAFE);
         
         // 自定义用户认证访问
//      List<ACL> acls = new ArrayList<ACL>();
//      Id imooc1 = new Id("digest", AclUtils.getDigestUserPwd("imooc1:123456"));
//      Id imooc2 = new Id("digest", AclUtils.getDigestUserPwd("imooc2:123456"));
//      acls.add(new ACL(Perms.ALL, imooc1));
//      acls.add(new ACL(Perms.READ, imooc2));
//      acls.add(new ACL(Perms.DELETE | Perms.CREATE, imooc2));
//      zkServer.createZKNode("/aclimooc/testdigest", "testdigest".getBytes(), acls);
         
         // 注册过的用户必须通过addAuthInfo才能操作节点，参考命令行 addauth
//      zkServer.getZookeeper().addAuthInfo("digest", "imooc1:123456".getBytes());
//      zkServer.createZKNode("/aclimooc/testdigest/childtest", "childtest".getBytes(), Ids.CREATOR_ALL_ACL);
//      Stat stat = new Stat();
//      byte[] data = zkServer.getZookeeper().getData("/aclimooc/testdigest", false, stat);
//      System.out.println(new String(data));
//      zkServer.getZookeeper().setData("/aclimooc/testdigest", "now".getBytes(), 1);
         
         // ip方式的acl
//      List<ACL> aclsIP = new ArrayList<ACL>();
//      Id ipId1 = new Id("ip", "192.168.1.6");
//      aclsIP.add(new ACL(Perms.ALL, ipId1));
//      zkServer.createZKNode("/aclimooc/iptest6", "iptest".getBytes(), aclsIP);
 
         // 验证ip是否有权限
         zkServer.getZookeeper().setData("/aclimooc/iptest6", "now".getBytes(), 1);
         Stat stat = new Stat();
         byte[] data = zkServer.getZookeeper().getData("/aclimooc/iptest6", false, stat);
         System.out.println(new String(data));
         System.out.println(stat.getVersion());
    }
 
    public ZooKeeper getZookeeper() {
         return zookeeper;
    }
    public void setZookeeper(ZooKeeper zookeeper) {
         this.zookeeper = zookeeper;
    }
 
    @Override
    public void process(WatchedEvent event) {
         
    }
}

```



### curator客户端

- [源码](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-zk-curator-maven)
- CuratorOperator 

```java
public class CuratorOperator {
 
    public CuratorFramework client = null;
    public static final String zkServerPath = "192.168.1.110:2181";
 
    /**
     * 实例化zk客户端
     */
    public CuratorOperator() {
         /**
          * 同步创建zk示例，原生api是异步的
          * 
          * curator链接zookeeper的策略:ExponentialBackoffRetry
          * baseSleepTimeMs：初始sleep的时间
          * maxRetries：最大重试次数
          * maxSleepMs：最大重试时间
          */
//      RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 5);
         
         /**
          * curator链接zookeeper的策略:RetryNTimes
          * n：重试的次数
          * sleepMsBetweenRetries：每次重试间隔的时间
          */
         RetryPolicy retryPolicy = new RetryNTimes(3, 5000);
         
         /**
          * curator链接zookeeper的策略:RetryOneTime
          * sleepMsBetweenRetry:每次重试间隔的时间
          */
//      RetryPolicy retryPolicy2 = new RetryOneTime(3000);
         
         /**
          * 永远重试，不推荐使用
          */
//      RetryPolicy retryPolicy3 = new RetryForever(retryIntervalMs)
         
         /**
          * curator链接zookeeper的策略:RetryUntilElapsed
          * maxElapsedTimeMs:最大重试时间
          * sleepMsBetweenRetries:每次重试间隔
          * 重试时间超过maxElapsedTimeMs后，就不再重试
          */
//      RetryPolicy retryPolicy4 = new RetryUntilElapsed(2000, 3000);
         
         client = CuratorFrameworkFactory.builder()
                 .connectString(zkServerPath)
                 .sessionTimeoutMs(10000).retryPolicy(retryPolicy)
                 .namespace("workspace").build();
         client.start();
    }
    
    /**
     * 
     * @Description: 关闭zk客户端连接
     */
    public void closeZKClient() {
         if (client != null) {
             this.client.close();
         }
    }
    
    public static void main(String[] args) throws Exception {
         // 实例化
         CuratorOperator cto = new CuratorOperator();
         boolean isZkCuratorStarted = cto.client.isStarted();
         System.out.println("当前客户的状态：" + (isZkCuratorStarted ? "连接中" : "已关闭"));
         
         // 创建节点
         String nodePath = "/super/imooc";
//      byte[] data = "superme".getBytes();
//      cto.client.create().creatingParentsIfNeeded()
//          .withMode(CreateMode.PERSISTENT)
//          .withACL(Ids.OPEN_ACL_UNSAFE)
//          .forPath(nodePath, data);
         
         // 更新节点数据
//      byte[] newData = "batman".getBytes();
//      cto.client.setData().withVersion(0).forPath(nodePath, newData);
         
         // 删除节点
//      cto.client.delete()
//                .guaranteed()                     // 如果删除失败，那么在后端还是继续会删除，直到成功
//                .deletingChildrenIfNeeded()    // 如果有子节点，就删除
//                .withVersion(0)
//                .forPath(nodePath);
         
         
         
         // 读取节点数据
//      Stat stat = new Stat();
//      byte[] data = cto.client.getData().storingStatIn(stat).forPath(nodePath);
//      System.out.println("节点" + nodePath + "的数据为: " + new String(data));
//      System.out.println("该节点的版本号为: " + stat.getVersion());
         
         
         // 查询子节点
//      List<String> childNodes = cto.client.getChildren()
//                                             .forPath(nodePath);
//      System.out.println("开始打印子节点：");
//      for (String s : childNodes) {
//          System.out.println(s);
//      }
         
                 
         // 判断节点是否存在,如果不存在则为空
//      Stat statExist = cto.client.checkExists().forPath(nodePath + "/abc");
//      System.out.println(statExist);
         
         
         // watcher 事件  当使用usingWatcher的时候，监听只会触发一次，监听完毕后就销毁
//      cto.client.getData().usingWatcher(new MyCuratorWatcher()).forPath(nodePath);
//      cto.client.getData().usingWatcher(new MyWatcher()).forPath(nodePath);
         
         // 为节点添加watcher
         // NodeCache: 监听数据节点的变更，会触发事件
//      final NodeCache nodeCache = new NodeCache(cto.client, nodePath);
//      // buildInitial : 初始化的时候获取node的值并且缓存
//      nodeCache.start(true);
//      if (nodeCache.getCurrentData() != null) {
//          System.out.println("节点初始化数据为：" + new String(nodeCache.getCurrentData().getData()));
//      } else {
//          System.out.println("节点初始化数据为空...");
//      }
//      nodeCache.getListenable().addListener(new NodeCacheListener() {
//          public void nodeChanged() throws Exception {
//              if (nodeCache.getCurrentData() == null) {
//                   System.out.println("空");
//                   return;
//              }
//              String data = new String(nodeCache.getCurrentData().getData());
//              System.out.println("节点路径：" + nodeCache.getCurrentData().getPath() + "数据：" + data);
//          }
//      });
         
         
         // 为子节点添加watcher
         // PathChildrenCache: 监听数据节点的增删改，会触发事件
         String childNodePathCache =  nodePath;
         // cacheData: 设置缓存节点的数据状态
         final PathChildrenCache childrenCache = new PathChildrenCache(cto.client, childNodePathCache, true);
         /**
          * StartMode: 初始化方式
          * POST_INITIALIZED_EVENT：异步初始化，初始化之后会触发事件
          * NORMAL：异步初始化
          * BUILD_INITIAL_CACHE：同步初始化
          */
         childrenCache.start(StartMode.POST_INITIALIZED_EVENT);
         
         List<ChildData> childDataList = childrenCache.getCurrentData();
         System.out.println("当前数据节点的子节点数据列表：");
         for (ChildData cd : childDataList) {
             String childData = new String(cd.getData());
             System.out.println(childData);
         }
         
         childrenCache.getListenable().addListener(new PathChildrenCacheListener() {
             public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
                 if(event.getType().equals(PathChildrenCacheEvent.Type.INITIALIZED)){
                      System.out.println("子节点初始化ok...");
                 }
                 
                 else if(event.getType().equals(PathChildrenCacheEvent.Type.CHILD_ADDED)){
                      String path = event.getData().getPath();
                      if (path.equals(ADD_PATH)) {
                          System.out.println("添加子节点:" + event.getData().getPath());
                          System.out.println("子节点数据:" + new String(event.getData().getData()));
                      } else if (path.equals("/super/imooc/e")) {
                          System.out.println("添加不正确...");
                      }
                      
                 }else if(event.getType().equals(PathChildrenCacheEvent.Type.CHILD_REMOVED)){
                      System.out.println("删除子节点:" + event.getData().getPath());
                 }else if(event.getType().equals(PathChildrenCacheEvent.Type.CHILD_UPDATED)){
                      System.out.println("修改子节点路径:" + event.getData().getPath());
                      System.out.println("修改子节点数据:" + new String(event.getData().getData()));
                 }
             }
         });
         
         Thread.sleep(100000);
         
         cto.closeZKClient();
         boolean isZkCuratorStarted2 = cto.client.isStarted();
         System.out.println("当前客户的状态：" + (isZkCuratorStarted2 ? "连接中" : "已关闭"));
    }
    
    public final static String ADD_PATH = "/super/imooc/d";
    
}

```

- CuratorAcl 

```java
public class CuratorAcl {
 
    public CuratorFramework client = null;
    public static final String zkServerPath = "192.168.1.110:2181";
 
    public CuratorAcl() {
         RetryPolicy retryPolicy = new RetryNTimes(3, 5000);
         client = CuratorFrameworkFactory.builder().authorization("digest", "imooc1:123456".getBytes())
                 .connectString(zkServerPath)
                 .sessionTimeoutMs(10000).retryPolicy(retryPolicy)
                 .namespace("workspace").build();
         client.start();
    }
    
    public void closeZKClient() {
         if (client != null) {
             this.client.close();
         }
    }
    
    public static void main(String[] args) throws Exception {
         // 实例化
         CuratorAcl cto = new CuratorAcl();
         boolean isZkCuratorStarted = cto.client.isStarted();
         System.out.println("当前客户的状态：" + (isZkCuratorStarted ? "连接中" : "已关闭"));
         
         String nodePath = "/acl/father/child/sub";
         
         List<ACL> acls = new ArrayList<ACL>();
         Id imooc1 = new Id("digest", AclUtils.getDigestUserPwd("imooc1:123456"));
         Id imooc2 = new Id("digest", AclUtils.getDigestUserPwd("imooc2:123456"));
         acls.add(new ACL(Perms.ALL, imooc1));
         acls.add(new ACL(Perms.READ, imooc2));
         acls.add(new ACL(Perms.DELETE | Perms.CREATE, imooc2));
         
         // 创建节点
//      byte[] data = "spiderman".getBytes();
//      cto.client.create().creatingParentsIfNeeded()
//              .withMode(CreateMode.PERSISTENT)
//              .withACL(acls, true)
//              .forPath(nodePath, data);
         
 
         cto.client.setACL().withACL(acls).forPath("/curatorNode");
         
         // 更新节点数据
//      byte[] newData = "batman".getBytes();
//      cto.client.setData().withVersion(0).forPath(nodePath, newData);
         
         // 删除节点
//      cto.client.delete().guaranteed().deletingChildrenIfNeeded().withVersion(0).forPath(nodePath);
         
         // 读取节点数据
//      Stat stat = new Stat();
//      byte[] data = cto.client.getData().storingStatIn(stat).forPath(nodePath);
//      System.out.println("节点" + nodePath + "的数据为: " + new String(data));
//      System.out.println("该节点的版本号为: " + stat.getVersion());
         
         
         cto.closeZKClient();
         boolean isZkCuratorStarted2 = cto.client.isStarted();
         System.out.println("当前客户的状态：" + (isZkCuratorStarted2 ? "连接中" : "已关闭"));
    }
    
}

```



### dubbo

- 架构演进

![image.png](https://i.loli.net/2020/09/06/Lj5WeU2gNZA7QKy.png)



- 系统调用方式
  - WebService-wsdl
  - HttpClient
  - rpc（dubbo）/ restful（springcloud ）
- dubbo可以最大程度解耦,降低系统耦合性

![image.png](https://i.loli.net/2020/09/06/U6n5KNXmfjgOveJ.png)



- dubbo基于生产者消费者模式。zookeeper作为注册中心，admin为监控中心，协议支持



#### 从单体到分层

![image.png](https://i.loli.net/2020/09/06/CXFmwHQYtr7cIeB.png)



- [源码](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-single-mvc)



#### 服务拆分

- 重构商品服务，抽取抽象工程
- [代码](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo/imooc-dubbo-item-api)



- 重构商品服务，暴露商品服务[代码](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo/imooc-dubbo-item-service)
- dubbo三种启动方式
  - tomcat启动
  - main线程启动
  - jar包启动
- 重构订单服务
  - [api](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo/imooc-dubbo-order-api)
  - [orderService](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo/imooc-dubbo-order-service)
- 消费方对商品和订单进行引用
  - [web](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo/imooc-dubbo-web)



### zookeeper分布式锁

![image.png](https://i.loli.net/2020/09/06/VhExPqsuGBT8JUS.png)



- 数据不一致性

![image.png](https://i.loli.net/2020/09/06/gPUpLOt71yCkc4e.png)



- ​

#### curator整合spring

- [代码](https://github.com/BaiWeiJieKu/MK-zookeeper-dubbo/tree/master/imooc_code/imooc-dubbo-lock)
- xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.2.xsd
         http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.2.xsd
         http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.2.xsd
         http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.2.xsd
         http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-4.2.xsd">
 
    <description>zk与spring容器整合，启动项目加载时建立与zk的连接</description>
    <bean id="retryPolicy" class="org.apache.curator.retry.RetryNTimes">
         <!--重试次数-->
         <constructor-arg index="0" value="10"/>
         <!--每次间隔-->
         <constructor-arg index="1" value="5000"/>
    </bean>
 
    <!--zookeeper客户端-->
    <bean id="client" class="org.apache.curator.framework.CuratorFrameworkFactory"
    factory-method="newClient" init-method="start">
         <!--zk服务地址，集群用","分隔-->
         <constructor-arg index="0" value="127.0.0.1:2181"/>
         <!--session timeout 会话超时时间-->
         <constructor-arg index="1" value="10000"/>
         <!--connectionTimeoutMs 创建连接超时时间-->
         <constructor-arg index="2" value="5000"/>
         <!--重试策略-->
         <constructor-arg index="3" ref="retryPolicy"/>
    </bean>
 
    <!--注入zk客户端-->
    <bean id="zkCurator" class="com.imooc.curator.utils.ZKCurator" init-method="init">
         <constructor-arg index="0" ref="client"/>
    </bean>
</beans>

```

- ZKCurator 

```java
package com.imooc.curator.utils;
 
import org.apache.curator.framework.CuratorFramework;
 
/**
 * Created by helei on 2019/1/5.
 */
public class ZKCurator {
 
    private CuratorFramework client = null; //zk客户端
 
    public ZKCurator(CuratorFramework client){
        this.client = client;
    }
 
    /**
     * 初始化操作
     */
    public void init(){
        client = client.usingNamespace("zk-curator-connector");
    }
 
    /**
     * 判断zk是否连接
     * @return
     */
    public boolean isZKAlive(){
        return client.isStarted();
    }
}

```

- controller

```java
@Autowired
private ZKCurator zkCurator;

//判断zk是否连接
@RequestMapping("isZKAlive")
@ResponseBody
public IMoocJSONResult isZKAlive(){
  boolean isAlive = zkCurator.isZKAlive();
  String result = isAlive?"连接":"断开";
  return IMoocJSONResult.ok(result);
}
```



#### 分布式锁

- xml

```xml
    <!--注入分布式锁工具类-->
    <bean id="distributedLock" class="com.imooc.curator.utils.DistributedLock" init-method="init">
         <constructor-arg index="0" ref="client"/>
    </bean>
```

- DistributedLock 

```java
package com.imooc.curator.utils;
 
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.recipes.cache.PathChildrenCache;
import org.apache.curator.framework.recipes.cache.PathChildrenCacheEvent;
import org.apache.curator.framework.recipes.cache.PathChildrenCacheListener;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.ZooDefs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
import java.util.concurrent.CountDownLatch;
 
/**
 * Created by helei on 2019/1/5.
 */
public class DistributedLock {
 
    private CuratorFramework client = null; //zk客户端
 
    final static Logger log = LoggerFactory.getLogger(DistributedLock.class);
 
    // 用于挂起当前请求，并且等待上一个分布式锁释放
    private static CountDownLatch zkLocklatch = new CountDownLatch(1);
 
    // 分布式锁的总结点名
    private static final String ZK_LOCK_PROJECT = "imooc-locks";
    // 分布式锁节点
    private static final String DISTRIBUTED_LOCK = "distributed_lock";
 
    //构造方法
    public DistributedLock(CuratorFramework client) {
        this.client = client;
    }
 
    public void init() {
        //使用命名空间
        client = client.usingNamespace("ZKLocks-Namespace");
 
        /**
         * 创建zk锁的总节点
         *      ZKLocks-Namespace
         *          - imooc-locks
         *              - distributed_lock
         */
        try {
            if (client.checkExists().forPath("/" + ZK_LOCK_PROJECT) == null) {
                client.create()
                        .creatingParentsIfNeeded()
                        .withMode(CreateMode.PERSISTENT)
                        .withACL(ZooDefs.Ids.OPEN_ACL_UNSAFE)
                        .forPath("/" + ZK_LOCK_PROJECT);
            }
            // 针对zk的分布式锁节点，创建相应的 watch 事件监听
            addwatcherToLocker("/" + ZK_LOCK_PROJECT);
        } catch (Exception e) {
            log.error("客户端连接zookeeper服务器错误... 请重试...");
        }
    }
 
    /**
     *  创建watcher监听
     * @param path
     * @throws Exception
     */
    public void addwatcherToLocker(String path) throws Exception{
        final PathChildrenCache cache = new PathChildrenCache(client,path,true);
        cache.start(PathChildrenCache.StartMode.POST_INITIALIZED_EVENT);
        cache.getListenable().addListener(new PathChildrenCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
                if(event.getType().equals(PathChildrenCacheEvent.Type.CHILD_REMOVED)){
                    String path = event.getData().getPath();
                    log.info("上一个会话已释放锁或该会话已断开，节点路径为：" + path);
                    if(path.contains(DISTRIBUTED_LOCK)){
                        log.info("释放计数器，让当前请求来获得分布式锁...");
                        zkLocklatch.countDown();
                    }
                }
            }
        });
    }
 
    /**
     * 获取锁
     */
    public void getLock(){
        //使用死循环，当且仅当上一个锁释放并且当前请求获得锁成功后才会跳出
        while (true){
            try {
                client.create()
                        .creatingParentsIfNeeded()
                        .withMode(CreateMode.EPHEMERAL)
                        .withACL(ZooDefs.Ids.OPEN_ACL_UNSAFE)
                        .forPath("/" + ZK_LOCK_PROJECT + "/" + DISTRIBUTED_LOCK);
                log.info("获得分布式锁成功...");
                return;
            }catch (Exception e){
                log.info("获得 分布式锁失败...");
                try {
                    // 如果没有获得到锁，需要重新设置同步资源值
                    if(zkLocklatch.getCount() <= 0){
                        zkLocklatch = new CountDownLatch(1);
                    }
                    // 阻塞线程
                    zkLocklatch.await();
                }catch (Exception e1){
                    e1.printStackTrace();
                }
            }
        }
    }
 
    /**
     * 释放分布式锁
     * @return
     */
    public boolean releaseLock(){
            try {
                if(client.checkExists().forPath("/" + ZK_LOCK_PROJECT + "/" + DISTRIBUTED_LOCK) != null){
                    client.delete().forPath("/" + ZK_LOCK_PROJECT + "/" + DISTRIBUTED_LOCK);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
            log.info("分布式锁释放完毕");
            return true;
    }
}

```

- displayBuy

```java
    @Override
    public boolean displayBuy(String itemId) {
 
         // 执行订单流程之前使当前业务获得分布式锁
         distributedLock.getLock();
         
         int buyCounts = 6;
         
         // 1. 判断库存
         int stockCounts = itemService.getItemCounts(itemId);
         if (stockCounts < buyCounts) {
             log.info("库存剩余{}件，用户需求量{}件，库存不足，订单创建失败...", 
                      stockCounts, buyCounts);
             //释放锁
             distributedLock.releaseLock();
             return false;
         }
         
         // 2. 创建订单
         boolean isOrderCreated = ordersService.createOrder(itemId);
 
         //模拟处理业务需要3秒
         try {
             Thread.sleep(3000);
         } catch (InterruptedException e) {
             e.printStackTrace();
         }
 
         // 3. 创建订单成功后，扣除库存
         if (isOrderCreated) {
             log.info("订单创建成功...");
             itemService.displayReduceCounts(itemId, buyCounts);
         } else {
             log.info("订单创建失败...");
             //释放锁
             distributedLock.releaseLock();
             return false;
         }
         //释放锁
         distributedLock.releaseLock();
         return true;
    }

```

