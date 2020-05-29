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

