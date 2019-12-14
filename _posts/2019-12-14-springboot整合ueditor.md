---
layout: post
title:  "Spring Boot整合富文本"
categories: springBoot
tags: springBoot
author: 百味皆苦
music-id: 5188665
---

* content
{:toc}
### 简述

- UEditor只提供JSP版本的后端入口代码。但提供了项目源码，因此可以根据业务需求修改源代码。
- 此处使用了SpringBoot框架，配备了Thymeleaf模板引擎，所以没有必要再添加jsp来兼容UEditor，可通过修改源码满足需要。

### 搭建项目

#### pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.example</groupId>
	<artifactId>ueditor-test</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>jar</packaging>

	<name>ueditor-test</name>
	<description>Demo project for Spring Boot</description>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.2.RELEASE</version>

		<relativePath/> <!-- lookup parent from repository -->
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<!--修改thymeleaf版本-->
		<thymeleaf.version>3.0.3.RELEASE</thymeleaf.version>
		<thymeleaf-layout-dialect.version>2.1.0</thymeleaf-layout-dialect.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>

		<dependency>
			<groupId>org.json</groupId>
			<artifactId>json</artifactId>
		</dependency>
		<dependency>
			<groupId>commons-fileupload</groupId>
			<artifactId>commons-fileupload</artifactId>
			<version>1.3.2</version>
		</dependency>
		<dependency>
			<groupId>commons-codec</groupId>
			<artifactId>commons-codec</artifactId>
			<version>1.9</version>
		</dependency>
		<dependency>
		    <groupId>org.springframework.boot</groupId>
		    <artifactId>spring-boot-devtools</artifactId>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>


</project>

```

#### 富文本配置

- 从官网下载源代码并解压至项目，注意config.json我拷到了resources根路径下

```json
/* 前后端通信相关的配置,注释只允许使用多行方式 */
{

    "basePath":"C:/",/* 上传文件的基本路径 */
    /* 上传图片配置项 */
    "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
    "imageFieldName": "upfile", /* 提交的图片表单名称 */
    "imageMaxSize": 2048000, /* 上传大小限制，单位B */
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
    "imageCompressEnable": true, /* 是否压缩图片,默认是true */
    "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
    "imageInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageUrlPrefix": "http://localhost:8080", /* 图片访问路径前缀 */
    "imagePathFormat": "/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
                                /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */
                                /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */
                                /* {time} 会替换成时间戳 */
                                /* {yyyy} 会替换成四位年份 */
                                /* {yy} 会替换成两位年份 */
                                /* {mm} 会替换成两位月份 */
                                /* {dd} 会替换成两位日期 */
                                /* {hh} 会替换成两位小时 */
                                /* {ii} 会替换成两位分钟 */
                                /* {ss} 会替换成两位秒 */
                                /* 非法字符 \ : * ? " < > | */
                                /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */

    /* 涂鸦图片上传配置项 */
    "scrawlActionName": "uploadscrawl", /* 执行上传涂鸦的action名称 */
    "scrawlFieldName": "upfile", /* 提交的图片表单名称 */
    "scrawlPathFormat": "/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "scrawlMaxSize": 2048000, /* 上传大小限制，单位B */
    "scrawlUrlPrefix": "", /* 图片访问路径前缀 */
    "scrawlInsertAlign": "none",

    /* 截图工具上传 */
    "snapscreenActionName": "uploadimage", /* 执行上传截图的action名称 */
    "snapscreenPathFormat": "/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "snapscreenUrlPrefix": "", /* 图片访问路径前缀 */
    "snapscreenInsertAlign": "none", /* 插入的图片浮动方式 */

    /* 抓取远程图片配置 */
    "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
    "catcherActionName": "catchimage", /* 执行抓取远程图片的action名称 */
    "catcherFieldName": "source", /* 提交的图片列表表单名称 */
    "catcherPathFormat": "/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "catcherUrlPrefix": "", /* 图片访问路径前缀 */
    "catcherMaxSize": 2048000, /* 上传大小限制，单位B */
    "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 抓取图片格式显示 */

    /* 上传视频配置 */
    "videoActionName": "uploadvideo", /* 执行上传视频的action名称 */
    "videoFieldName": "upfile", /* 提交的视频表单名称 */
    "videoPathFormat": "/ueditor/jsp/upload/video/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "videoUrlPrefix": "", /* 视频访问路径前缀 */
    "videoMaxSize": 102400000, /* 上传大小限制，单位B，默认100MB */
    "videoAllowFiles": [
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"], /* 上传视频格式显示 */

    /* 上传文件配置 */
    "fileActionName": "uploadfile", /* controller里,执行上传视频的action名称 */
    "fileFieldName": "upfile", /* 提交的文件表单名称 */
    "filePathFormat": "/ueditor/jsp/upload/file/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "fileUrlPrefix": "", /* 文件访问路径前缀 */
    "fileMaxSize": 51200000, /* 上传大小限制，单位B，默认50MB */
    "fileAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ], /* 上传文件格式显示 */

    /* 列出指定目录下的图片 */
    "imageManagerActionName": "listimage", /* 执行图片管理的action名称 */
    "imageManagerListPath": "/ueditor/jsp/upload/image/", /* 指定要列出图片的目录 */
    "imageManagerListSize": 20, /* 每次列出文件数量 */
    "imageManagerUrlPrefix": "", /* 图片访问路径前缀 */
    "imageManagerInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 列出的文件类型 */

    /* 列出指定目录下的文件 */
    "fileManagerActionName": "listfile", /* 执行文件管理的action名称 */
    "fileManagerListPath": "/ueditor/jsp/upload/file/", /* 指定要列出文件的目录 */
    "fileManagerUrlPrefix": "", /* 文件访问路径前缀 */
    "fileManagerListSize": 20, /* 每次列出文件数量 */
    "fileManagerAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ] /* 列出的文件类型 */

}
```

#### 富文本控制层

```java
package com.example;

import com.baidu.ueditor.ActionEnter;

import org.json.JSONException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

/**与富文本界面交互
 * Created by ldb on 2017/4/9.
 */
@Controller
public class UEditorController {


	/**
	 * 在页面加载完成后读取本地文件内容进行显示
	 * @param model
	 * @return
	 */
    @RequestMapping("/")
    private String showPage(Model model){
    	File f = new File("c:/userNote.txt");
        // 创建文件字符流
        // 缓存流必须建立在一个存在的流的基础上
    	StringBuilder sb = new StringBuilder();
        try (
        		FileReader fr = new FileReader(f); 
        		BufferedReader br = new BufferedReader(fr);
        	) 
        {
            while (true) {
                // 一次读一行
                String line = br.readLine();
                if (null == line)
                    break;
                sb.append(line);
            }
            model.addAttribute("context", sb.toString());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return "index";
    }

    /**
    *读取Ueditor配置类
    */
    @RequestMapping(value="/config")
    public void config(HttpServletRequest request, HttpServletResponse response) throws JSONException {
        response.setContentType("application/json");
        String rootPath = request.getSession().getServletContext().getRealPath("/");
        try {
            String exec = new ActionEnter(request, rootPath).exec();
            PrintWriter writer = response.getWriter();
            writer.write(exec);
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}

```

- 发现无法加载config.json文件。此时修改ConfigManage类的getConfigPath()方法

```java
private String getConfigPath () {
		//源码：return this.parentPath + File.separator + ConfigManager.configFileName;
		try {
			//获取classpath下的config.json路径
            //此处需要先转为URI再getPath()，否则如果你的项目路径带空格或者带中文则无法读取到文件
			return this.getClass().getClassLoader().getResource("config.json").toURI().getPath();
		} catch (URISyntaxException e) {
			return null;
		}
	}
```

- 运行项目路径http://localhost:8080/config?action=config如果能获取到内容就说明修改成功了
- 现在可以弹出选择上传文件的提示框了，但是提示未找到上传数据,发现在BinaryUploader类竟然无法获取到字节流。因为SpringMVC框架对含字节流的request进行了处理，此处传的是处理过的request，故获取不到字节流。此时采用SpringMVC框架的解析器multipartResolver

```java
package com.baidu.ueditor.upload;

import com.baidu.ueditor.PathFormat;
import com.baidu.ueditor.define.AppInfo;
import com.baidu.ueditor.define.BaseState;
import com.baidu.ueditor.define.FileType;
import com.baidu.ueditor.define.State;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class BinaryUploader {

	public static final State save(HttpServletRequest request,
			Map<String, Object> conf) {
		if (!ServletFileUpload.isMultipartContent(request)) {
			return new BaseState(false, AppInfo.NOT_MULTIPART_CONTENT);
		}
		try {
			//此时采用SpringMVC框架的解析器multipartResolver
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			MultipartFile multipartFile = multipartRequest.getFile(conf.get("fieldName").toString());
			if(multipartFile==null){
				return new BaseState(false, AppInfo.NOTFOUND_UPLOAD_DATA);
			}

			String savePath = (String) conf.get("savePath");
			//String originFileName = fileStream.getName();
			String originFileName = multipartFile.getOriginalFilename();
			String suffix = FileType.getSuffixByFilename(originFileName);

			originFileName = originFileName.substring(0,
					originFileName.length() - suffix.length());
			savePath = savePath + suffix;

			long maxSize = ((Long) conf.get("maxSize")).longValue();

			if (!validType(suffix, (String[]) conf.get("allowFiles"))) {
				return new BaseState(false, AppInfo.NOT_ALLOW_FILE_TYPE);
			}

			savePath = PathFormat.parse(savePath, originFileName);

			//String physicalPath = (String) conf.get("rootPath") + savePath;
			String basePath=(String) conf.get("basePath");
			String physicalPath = basePath + savePath;

			//InputStream is = fileStream.openStream();
			InputStream is = multipartFile.getInputStream();
			State storageState = StorageManager.saveFileByInputStream(is,
					physicalPath, maxSize);
			is.close();

			if (storageState.isSuccess()) {
				storageState.putInfo("url", PathFormat.format(savePath));
				storageState.putInfo("type", suffix);
				storageState.putInfo("original", originFileName + suffix);
			}

			return storageState;
		// } catch (FileUploadException e) {
		// 	return new BaseState(false, AppInfo.PARSE_REQUEST_ERROR);
		} catch (IOException e) {
		}
		return new BaseState(false, AppInfo.IO_ERROR);
	}

	private static boolean validType(String type, String[] allowTypes) {
		List<String> list = Arrays.asList(allowTypes);

		return list.contains(type);
	}
}

```

- 此时进行上传图片，已经能够成功上传了。
- 可是图片究竟上传到哪里了呢,路径为tomcat缓存路径，只要重启下tomcat该文件就会被删除。我们需要将其存储到磁盘中。此时修改config.json文件。

```
"basePath":"C:/",/* 上传文件的基本路径 */
```

- 此处我多添加了basePath，是想把视频、音乐等静态资源都存储到C盘。由于添加了basePath，需要修改配置ConfigManage类。

```java
//将basePath塞进conf
conf.put("basePath",this.jsonConfig.getString( "basePath" ) );
conf.put( "savePath", savePath );
conf.put( "rootPath", this.rootPath );
```

- 之后继续来到上传文件类BinaryUploader类

```java
//String physicalPath = (String) conf.get("rootPath") + savePath;
String basePath=(String) conf.get("basePath");
String physicalPath = basePath + savePath;
```

- 运行项目，点击添加图片。打开C盘的image目录，如图，成功上传到C盘对应路径
- 打开浏览器，发现页面无法加载图片。这是当然的，因为我们把图片存在C盘了，而spring并没有对C盘目录进行映射。此时我们加入路径映射。打开application.properties文件，添加如下代码

```properties
web.upload-path=E:/
spring.mvc.static-path-pattern=/**
spring.resources.static-locations=classpath:/META-INF/resources/,classpath:/resources/,classpath:/static/,classpath:/public/,file:${web.upload-path}
```

- 此时重新运行项目，点击上传图片，图片已经能够正常显示了。
- springboot为什么打成Jar包后就无法上传图片了呢。
- 发现了在Jar包里无法以ClassLoader.getResource().getPath()获得的路径读取文件，得用Class类的getResourceAsStream()来读取。
- 改成getResourceAsStream读取config.json文件吧。打开ConfigManager类，修改initEnv方法

```java
private void initEnv () throws FileNotFoundException, IOException {
		
		File file = new File( this.originalPath );
		
		if ( !file.isAbsolute() ) {
			file = new File( file.getAbsolutePath() );
		}
		
		this.parentPath = file.getParent();
		
		//String configContent = this.readFile( this.getConfigPath() );
		String configContent = this.filter(IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream("config.json")));

		try{
			JSONObject jsonConfig = new JSONObject( configContent );
			this.jsonConfig = jsonConfig;
		} catch ( Exception e ) {
			this.jsonConfig = null;
		}
		
	}
```

- ok了，再次打包，运行项目,上传照片成功

### 可修改项

#### 修改配置文件名称

- 若修改了config.json文件的名称就需要修改ConfigManager类中initEnv方法

#### 修改获取配置文件的路径映射

- 先修改ueditor.config.js中的第33行

```js
// 服务器统一请求接口路径
serverUrl: URL + "ueditorconfig"
```

- 然后修改后台映射路径

```java
/**
*读取Ueditor配置类
*/
@RequestMapping(value="/ueditorconfig")
public void config(HttpServletRequest request, HttpServletResponse response) throws JSONException {}
```

#### 存储和读取文本

- 编辑完文本后点击获取内容按钮，自动保存内容到本地磁盘

```js
function getContent() {
        /* var arr = [];
        arr.push("使用editor.getContent()方法可以获得编辑器的内容");
        arr.push("内容为：");
        arr.push(UE.getEditor('editor').getContent());
        alert(arr.join("\n")); */
        //把内容保存到本地磁盘
        $.ajax({
				url:'/saveContextToLocal',//地址
				dataType:'json',//数据类型
				type:'POST',//类型
				timeout:2000,//超时
				data:{
					text: UE.getEditor('editor').getContent()
				},
				//请求成功
				success:function(data,status){
					//alert(data);
					//alert(status);
				},
				//失败/超时
				error:function(XMLHttpRequest,textStatus,errorThrown){
					if(textStatus==='timeout'){
						alert('請求超時');
						setTimeout(function(){
							alert('重新请求');
						},2000);
					}
					//alert(errorThrown);
				}
        })
    }
```

```java
@Controller
public class SaveContextController {

	@RequestMapping(value = "/saveContextToLocal", method = RequestMethod.POST)
	@ResponseBody
	public void saveContextToLocal(String text) {
		System.out.println("接收到前台文本："+text);
		// 向文件userNote.txt中写入
        File f = new File("c:/userNote.txt");
        try (
                // 创建文件字符流
                FileWriter fw = new FileWriter(f);
                // 缓存流必须建立在一个存在的流的基础上               
                PrintWriter pw = new PrintWriter(fw);               
        ) {
            pw.println(text);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
	}

}
```

- 加载页面自动读取本地文本内容到编辑器中

```js
$(function(){
    var content =[[${context}]];
    //判断ueditor 编辑器是否创建成功
    ue.addListener("ready", function () {
    　　// editor准备好之后才可以使用
    　　ue.setContent(content);

    });
});
```

```java
/**
	 * 在页面加载完成后读取本地文件内容进行显示
	 * @param model
	 * @return
	 */
    @RequestMapping("/")
    private String showPage(Model model){
    	File f = new File("c:/userNote.txt");
    	if(f.exists()) {
    		// 创建文件字符流
            // 缓存流必须建立在一个存在的流的基础上
        	StringBuilder sb = new StringBuilder();
            try (
            		FileReader fr = new FileReader(f); 
            		BufferedReader br = new BufferedReader(fr);
            	) 
            {
                while (true) {
                    // 一次读一行
                    String line = br.readLine();
                    if (null == line)
                        break;
                    sb.append(line);
                }
                model.addAttribute("context", sb.toString());
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
    	}
        return "index";
    }
```

- 在js中读取thymeleaf标签的内容参考

```java
@GetMapping("/message")
public String getMessage(Model model){
    model.addAttribute("message","This is your message");
    return "index";
}
```

```js
<script th:inline="javascript">
    var message = [[${message}]];
    console.log(message);
</script>
```



[参考致谢](https://blog.csdn.net/qq_33745799/article/details/70031641)

[项目地址](https://github.com/BaiWeiJieKu/springboot-ueditor)

