---
layout: post
title: "（MK）socket网络编程进阶与实战"
categories: 网络编程
tags: socket 网络编程
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 网络编程

- 什么是网络：
  - 在计算机领域中，网络是信息传输、接收、共享的虚拟平台。
  - 通过它把各个点、面、体的信息联系到一起，从而实现这些资源的共享
- 什么是网络编程：
  - 网络编程从大的方面说就是对信息的发送到接收
  - 通过操作相应的Api调度计算机硬件资源，并利用传输管道（网线）进行数据交换的过程。
  - 更为具体的涉及：网络模型，套接字，数据包
- 七层网络模型-OSI


![image.png](https://i.loli.net/2020/05/29/SqIye8WgiGsfHCv.png)

- 基础层：物理层（physical），数据链路层（datalink），网络层（network）
- 传输层（transport）：TCP-UDP协议层、socket
- 高级层：会话层（session），表示层（presentation），应用层（application）
- 什么是socket：简单来说就是IP地址与端口的结合协议（RFC 793），一种地址与端口的结合描述协议
- socket作用与组成
  - 在网络传输中用于唯一标示两个端点之间的链接
  - 端点包括ip和port
  - 四个要素：客户端地址，客户端端口，服务器地址，服务器端口
- socket之TCP：
  - TCP是面向连接的通信协议
  - 通过三次握手建立连接，通讯完成时要拆除连接
  - 由于TCP是面向连接的，所以只能用于端到端的通讯
- socket之UDP
  - UDP是面向无连接的通讯协议
  - UDP数据包括目的端口号和源端口号信息
  - 由于通讯不需要连接，所以可以实现广播发送，并不局限于端到端

#### 通讯demo

- 客户端

```java
public class Client{
	public static void main(String[] args) throws IOException{
		Socket socket = new Socket();
		//超时时间
		socket.setSoTimeout(3000);
		//连接本地，端口2000，超时时间3000ms
		socket.connect(new InetSocketAddress(InetSocketAddress.getLocalHost(),2000),3000);

		System.out.printf("已发起服务器连接，并进入后续流程~");
		System.out.printf("客户端信息："+socket.getLocalAddress()+"P:"+socket.getLocalPort());
		System.out.printf("服务器信息："+socket.getInetAddress()+"P:"+socket.getPort());

		try{
			todo(socket);
		}catch(Exception e){
			System.out.printf("异常关闭");
		}

		socket.close();
		System.out.printf("客户端已退出");
	}

	private static void todo(Socket client) throws IOException{
		//构建键盘输入流
		InputStream in = System.in;
		BufferedReader input = new BufferedReader(new InputStreamReader(in));

		//得到socket输出流，并转换为打印流
		OutputStream outputStream = client.getOutputStream();
		PrintStream socketPrintStream = new PrintStream(outputStream);

		//得到socket输入流，并转换为BufferedReader
		InputStream inputStream = client.getInputStream();
		BufferedReader socketBufferedReader = new BufferedReader(new InputStreamReader(inputStream));

		boolean flag = true;
		do{
			//键盘读取一行
			String str = input.readLine();
			//发送到服务器
			socketPrintStream.println(str);

			//从服务器读取一行
			String echo = socketBufferedReader.readLine();
			if ("bye".equalsIgnoreCase(echo)) {
				flag = false;
			}else{
				System.out.println(echo);
			}
		}while(flag);

		//资源释放
		socketPrintStream.close();
		socketBufferedReader.close();		
	}
}
```

- 服务端

```java
public class Server{
	public static void main(String[] args) throws IOexception{
		ServerSocket server = new ServerSocket(2000);

		System.out.printf("服务器准备就绪~");
		System.out.printf("服务器信息:"+server.getInetAddress()+" P:"+server.getLocalPort());

		//等待客户端连接
		for (; ; ) {
			//得到客户端
			Socket client = server.accept();
			//客户端构建异步线程
			ClientHandler clientHandler = new ClientHandler(client);
			//启动线程
			clientHandler.start();
		}
		
		
	}

	//客户端消息处理
	private static class ClientHandler extends Thread{
		private Socket socket;
		private boolean flag = true;

		ClientHandler(Socket socket){
			this.socket = socket;
		}

		@Override
        public void run() {
            super.run();
            System.out.println("新客户端连接：" + socket.getInetAddress() +
                    " P:" + socket.getPort());

            try {
                // 得到打印流，用于数据输出；服务器回送数据使用
                PrintStream socketOutput = new PrintStream(socket.getOutputStream());
                // 得到输入流，用于接收数据
                BufferedReader socketInput = new BufferedReader(new InputStreamReader(
                        socket.getInputStream()));

                do {
                    // 客户端拿到一条数据
                    String str = socketInput.readLine();
                    if ("bye".equalsIgnoreCase(str)) {
                        flag = false;
                        // 回送
                        socketOutput.println("bye");
                    } else {
                        // 打印到屏幕。并回送数据长度
                        System.out.println(str);
                        socketOutput.println("回送：" + str.length());
                    }

                } while (flag);

                socketInput.close();
                socketOutput.close();

            } catch (Exception e) {
                System.out.println("连接异常断开");
            } finally {
                // 连接关闭
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            System.out.println("客户端已退出：" + socket.getInetAddress() +
                    " P:" + socket.getPort());

        }
	}
}
```



- 报文段：
  - 报文段是指TCP/IP协议网络传输过程中，起着路由导航作用
  - 用以查询各个网络路由网段，IP地址，交换协议等IP数据包
  - 报文段充当整个TCP/IP协议数据包的导航路由功能。
  - 报文在传输过程中会不断地封装成分组，包，帧来传输
  - 封装方式就是添加一些控制信息组成的首部，即报文头
- 传输协议：
  - 一种规定，约束
  - 约定大于配置，在网络传输中依然适用；网络的传输流程是健壮的，稳定的，得益于基础的协议构成
  - 简单来说：A -> B 的传输数据，B能识别，反之B -> A 的传输数据A也能识别，这就是协议
- Mac地址：
  - media access control 或者medium access control
  - 意为媒体访问控制，或者称为物理地址，硬件地址
  - 用来定义网络设备的位置
  - 形如：44-45-53-54-00-00



#### UDP

- 什么是udp：
  - 一种用户数据报协议，又称用户数据报文协议
  - 是一个简单的面向数据报的传输层协议，正式规范为RFC768
  - 用户数据协议，非连接协议
- 为什么udp不可靠
  - 它一旦把应用程序发给网络层的数据发送出去，就不保留数据备份
  - udp在IP数据报的头部仅仅加入了复用和数据校验（字段）
  - 发送端产生数据，接收端从网络中抓取数据
  - 结构简单，无校验，速度快，容易丢包，可广播
- udp包最大长度：65507byte字节
- API-DatagramSocket
  - 用于接收和发送udp的类
  - 负责发送某一个udp包，或者接收udp包
  - 不同于tcp，udp并没有合并到socket API中
- API-DatagramPacket
  - 用于处理报文
  - 将byte数组，目标地址，目标端口等数据包封装为报文或将报文拆卸为byte数组
  - 是udp的发送实体，也是接收实体
- 单播，多播，广播

![image.png](https://i.loli.net/2020/05/30/6c8nZbyVztvSJ3Y.png)



#### 局域网搜索案例

- 提供者

```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.UUID;

/**
 * UDP 提供者，用于提供服务
 */
public class UDPProvider {

    public static void main(String[] args) throws IOException {
        // 生成一份唯一标示
        String sn = UUID.randomUUID().toString();
        Provider provider = new Provider(sn);
        provider.start();

        // 读取任意键盘信息后可以退出
        //noinspection ResultOfMethodCallIgnored
        System.in.read();
        provider.exit();
    }

    private static class Provider extends Thread {
        private final String sn;
        private boolean done = false;
        private DatagramSocket ds = null;

        public Provider(String sn) {
            super();
            this.sn = sn;
        }

        @Override
        public void run() {
            super.run();

            System.out.println("UDPProvider Started.");

            try {
                // 监听20000 端口
                ds = new DatagramSocket(20000);

                while (!done) {

                    // 构建接收实体
                    final byte[] buf = new byte[512];
                    DatagramPacket receivePack = new DatagramPacket(buf, buf.length);

                    // 接收
                    ds.receive(receivePack);

                    // 打印接收到的信息与发送者的信息
                    // 发送者的IP地址
                    String ip = receivePack.getAddress().getHostAddress();
                    int port = receivePack.getPort();
                    int dataLen = receivePack.getLength();
                    String data = new String(receivePack.getData(), 0, dataLen);
                    System.out.println("UDPProvider receive form ip:" + ip
                            + "\tport:" + port + "\tdata:" + data);

                    // 解析端口号
                    int responsePort = MessageCreator.parsePort(data);
                    if (responsePort != -1) {
                        // 构建一份回送数据
                        String responseData = MessageCreator.buildWithSn(sn);
                        byte[] responseDataBytes = responseData.getBytes();
                        // 直接根据发送者构建一份回送信息
                        DatagramPacket responsePacket = new DatagramPacket(responseDataBytes,
                                responseDataBytes.length,
                                receivePack.getAddress(),
                                responsePort);

                        ds.send(responsePacket);
                    }

                }

            } catch (Exception ignored) {
            } finally {
                close();
            }

            // 完成
            System.out.println("UDPProvider Finished.");
        }


        private void close() {
            if (ds != null) {
                ds.close();
                ds = null;
            }
        }


        /**
         * 提供结束
         */
        void exit() {
            done = true;
            close();
        }

    }

}

```

- 搜索者

```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * UDP 搜索者，用于搜索服务支持方
 */
public class UDPSearcher {
    private static final int LISTEN_PORT = 30000;


    public static void main(String[] args) throws IOException, InterruptedException {
        System.out.println("UDPSearcher Started.");

        Listener listener = listen();
        sendBroadcast();

        // 读取任意键盘信息后可以退出
        //noinspection ResultOfMethodCallIgnored
        System.in.read();

        List<Device> devices = listener.getDevicesAndClose();

        for (Device device : devices) {
            System.out.println("Device:" + device.toString());
        }

        // 完成
        System.out.println("UDPSearcher Finished.");
    }
	//监听方法
    private static Listener listen() throws InterruptedException {
        System.out.println("UDPSearcher start listen.");
        CountDownLatch countDownLatch = new CountDownLatch(1);
        Listener listener = new Listener(LISTEN_PORT, countDownLatch);
        listener.start();

        countDownLatch.await();
        return listener;
    }
	//发送广播
    private static void sendBroadcast() throws IOException {
        System.out.println("UDPSearcher sendBroadcast started.");

        // 作为搜索方，让系统自动分配端口
        DatagramSocket ds = new DatagramSocket();


        // 构建一份请求数据
        String requestData = MessageCreator.buildWithPort(LISTEN_PORT);
        byte[] requestDataBytes = requestData.getBytes();
        // 直接构建packet
        DatagramPacket requestPacket = new DatagramPacket(requestDataBytes,
                requestDataBytes.length);
        // 20000端口, 广播地址
        requestPacket.setAddress(InetAddress.getByName("255.255.255.255"));
        requestPacket.setPort(20000);

        // 发送
        ds.send(requestPacket);
        ds.close();

        // 完成
        System.out.println("UDPSearcher sendBroadcast finished.");
    }
	//设备信息
    private static class Device {
        final int port;
        final String ip;
        final String sn;

        private Device(int port, String ip, String sn) {
            this.port = port;
            this.ip = ip;
            this.sn = sn;
        }

        @Override
        public String toString() {
            return "Device{" +
                    "port=" + port +
                    ", ip='" + ip + '\'' +
                    ", sn='" + sn + '\'' +
                    '}';
        }
    }
	//监听类
    private static class Listener extends Thread {
        private final int listenPort;
        private final CountDownLatch countDownLatch;
        private final List<Device> devices = new ArrayList<>();
        private boolean done = false;
        private DatagramSocket ds = null;


        public Listener(int listenPort, CountDownLatch countDownLatch) {
            super();
            this.listenPort = listenPort;
            this.countDownLatch = countDownLatch;
        }

        @Override
        public void run() {
            super.run();

            // 通知已启动
            countDownLatch.countDown();
            try {
                // 监听回送端口
                ds = new DatagramSocket(listenPort);


                while (!done) {
                    // 构建接收实体
                    final byte[] buf = new byte[512];
                    DatagramPacket receivePack = new DatagramPacket(buf, buf.length);

                    // 接收
                    ds.receive(receivePack);

                    // 打印接收到的信息与发送者的信息
                    // 发送者的IP地址
                    String ip = receivePack.getAddress().getHostAddress();
                    int port = receivePack.getPort();
                    int dataLen = receivePack.getLength();
                    String data = new String(receivePack.getData(), 0, dataLen);
                    System.out.println("UDPSearcher receive form ip:" + ip
                            + "\tport:" + port + "\tdata:" + data);

                    String sn = MessageCreator.parseSn(data);
                    if (sn != null) {
                        Device device = new Device(port, ip, sn);
                        devices.add(device);
                    }
                }
            } catch (Exception ignored) {

            } finally {
                close();
            }
            System.out.println("UDPSearcher listener finished.");

        }

        private void close() {
            if (ds != null) {
                ds.close();
                ds = null;
            }
        }

        List<Device> getDevicesAndClose() {
            done = true;
            close();
            return devices;
        }
    }
}

```

- 消息创建者

```java
public class MessageCreator {
    private static final String SN_HEADER = "收到暗号，我是（SN）:";
    private static final String PORT_HEADER = "这是暗号，请回电端口（Port）:";

    public static String buildWithPort(int port) {
        return PORT_HEADER + port;
    }

    public static int parsePort(String data) {
        if (data.startsWith(PORT_HEADER)) {
            return Integer.parseInt(data.substring(PORT_HEADER.length()));
        }

        return -1;
    }

    public static String buildWithSn(String sn) {
        return SN_HEADER + sn;
    }

    public static String parseSn(String data) {
        if (data.startsWith(SN_HEADER)) {
            return data.substring(SN_HEADER.length());
        }
        return null;
    }

}
```

