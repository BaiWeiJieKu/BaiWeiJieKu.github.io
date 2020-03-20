---
layout: post
title: "Java开发webService接口"
categories: springboot
tags: springboot
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 服务端

- maven

```xml
<!-- 解析WebService JAR包 CXF -->
<dependency>
  <groupId>org.apache.cxf</groupId>
  <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
  <version>3.2.4</version>
</dependency>

<dependency>
  <groupId>org.apache.cxf</groupId>
  <artifactId>cxf-rt-transports-http-jetty</artifactId>
  <version>3.2.4</version>
</dependency>
<!-- 解析WebService JAR包 CXF end-->

<!-- https://mvnrepository.com/artifact/org.jdom/jdom2 -->
<dependency>
  <groupId>org.jdom</groupId>
  <artifactId>jdom2</artifactId>
  <version>2.0.6</version>
</dependency>
<!-- https://mvnrepository.com/artifact/dom4j/dom4j -->
<dependency>
  <groupId>dom4j</groupId>
  <artifactId>dom4j</artifactId>
  <version>1.6.1</version>
</dependency>
```

#### 接口

```java
//命名空间一般为包名的倒序，最后一定要加斜杠
@WebService(targetNamespace = "http://webservice.msunsoft.com/")
public interface PatientService {

    //生命对外接口方法和参数
    @WebMethod
    String sendPatientMsg(@WebParam(name = "name") String name);
}
```

#### 实现类

```java
/**
 * webservice接口实现类
 * qinfen
 命名空间要和接口的命名空间保持一致
 endpointInterface指明实现类所实现的接口
 */
@WebService(serviceName = "PatientService",
targetNamespace = "http://webservice.msunsoft.com/",
endpointInterface = "com.msunsoft.webService.PatientService")
@Component
public class PatientServiceImpl implements PatientService {
    @Override
    public String sendPatientMsg(String name) {
        return "hello"+name;
    }
}
```

#### 配置类

```java
/**
 * cxf配置
 * qinfen
 */
@Configuration
public class CxfConfig {

    /**
     * 注入servlet  bean name不能dispatcherServlet 否则会覆盖dispatcherServlet
     * @return
     */
    @Bean(name = "cxfServlet")
    public ServletRegistrationBean cxfServlet() {
        return new ServletRegistrationBean(new CXFServlet(),"/services/*");
    }
    @Bean(name = Bus.DEFAULT_BUS_ID)
    public SpringBus springBus() {
        return new SpringBus();
    }
  	//注入对外开放接口
    @Bean
    public PatientService patientService() {
        return new PatientServiceImpl();
    }
    @Bean(name = "WebServiceDemoEndpoint")
    public Endpoint endpoint() {
        EndpointImpl endpoint = new EndpointImpl(springBus(), patientService());
        endpoint.publish("/patient");
        return endpoint;
    }

}
```

- 生成的接口地址为：`http://localhost:82/services/patient?wsdl`

- 因为springboot整合了shiro，这个webservice路径没有添加到可以过滤的路径上面去。

  `filterChainDefinitionMap.put("/services/**", "anon");`



### 客户端

- 例1：

```java
public class Client {

    public static void main(String args[]) throws Exception{
        
        JaxWsDynamicClientFactory dcf =JaxWsDynamicClientFactory.newInstance();
        org.apache.cxf.endpoint.Client client =dcf.createClient("http://localhost:82/services/patient?wsdl");
        //sendPatientMsg 为接口中定义的方法名称  张三为传递的参数   返回一个Object数组
        Object[] objects=client.invoke("sendPatientMsg","张三");
        //输出调用结果
        System.out.println("*****"+objects[0].toString());
    }
    
}
```

- 例2：

```java
public static void main(String[] args){
        try {
            String param = "张三";
            String webUrl = "http://localhost:82/services/patient?wsdl";
            String methodName = "sendPatientMsg";
            String xmlDoc = WebServiceClient.callWebSV(webUrl, methodName, param);
            System.out.println(xmlDoc);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```



### xml解析工具

- maven

```xml
<!-- https://mvnrepository.com/artifact/org.jdom/jdom2 -->
<dependency>
  <groupId>org.jdom</groupId>
  <artifactId>jdom2</artifactId>
  <version>2.0.6</version>
</dependency>
<!-- https://mvnrepository.com/artifact/dom4j/dom4j -->
<dependency>
  <groupId>dom4j</groupId>
  <artifactId>dom4j</artifactId>
  <version>1.6.1</version>
</dependency>
```

- 工具类

```java
package com.msunsoft.common.jdom;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

/**
 *
 * xml转换类.
 *
 * @author jiacl 2015/09/22.
 *
 */
public class XmlUtil {

    /** 返回值(MAP)  */
    private Map<String,String> xmlMap = null;

    /** 返回值(LIST)  */
    private List<Map<String,String>> listXmlMap = null;

    /** 中间变量  */
    private Map<String,String> tempMap = null;

    /**
     * xml字符串转化map
     *
     * @param protocolXML xml字符串
     *
     */
    public void parse(String protocolXML) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory
                    .newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(
                    protocolXML)));

            Element root = doc.getDocumentElement();
            xmlMap = new HashMap<String, String>();
            parseElement(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * xml字符串转化List
     *
     * @param protocolXML xml字符串
     *
     */
    public void parseList(String protocolXML) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory
                    .newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(
                    protocolXML)));

            Element root = doc.getDocumentElement();
            listXmlMap = new ArrayList<Map<String,String>>();
            tempMap = new HashMap<String, String>();
            parseElementList(root);
            if (!tempMap.isEmpty()) {
                listXmlMap.add(tempMap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * xml字符串转化map递归方法
     *
     * @param element xml元素
     *
     */
    private void parseElement(Element element) {

        String tagName = element.getNodeName();
        NodeList children = element.getChildNodes();

        // element元素的所有属性所构成的NamedNodeMap对象，需要对其进行判断
        NamedNodeMap map = element.getAttributes();

        // 如果该元素存在属性
        if (null != map) {
            for (int i = 0; i < map.getLength(); i++) {
                // 获得该元素的每一个属性
                Attr attr = (Attr) map.item(i);
                String attrName = attr.getName();
                String attrValue = attr.getValue();
            }
        }

        for (int i = 0; i < children.getLength(); i++) {

            Node node = children.item(i);
            // 获得结点的类型
            short nodeType = node.getNodeType();
            if (nodeType == Node.ELEMENT_NODE) {
                // 是元素，继续递归
                parseElement((Element) node);
            } else if (nodeType == Node.TEXT_NODE) {
                // 递归出口
                xmlMap.put(tagName, node.getNodeValue());
            }
        }
    }

    /**
     * xml字符串转化List递归方法
     *
     * @param element xml元素
     *
     */
    private void parseElementList(Element element) {

        String tagName = element.getNodeName();
        NodeList children = element.getChildNodes();

        // element元素的所有属性所构成的NamedNodeMap对象，需要对其进行判断
        NamedNodeMap map = element.getAttributes();

        // 如果该元素存在属性
        if (null != map) {
            for (int i = 0; i < map.getLength(); i++) {
                // 获得该元素的每一个属性
                Attr attr = (Attr) map.item(i);
                String attrName = attr.getName();
                String attrValue = attr.getValue();
            }
        }

        if (children.getLength() == 0) {
            if (tempMap.containsKey(tagName)) {
                listXmlMap.add(tempMap);
                tempMap = new HashMap<String, String>();
            }
            // 递归出口
            tempMap.put(tagName, "");
        }

        for (int i = 0; i < children.getLength(); i++) {

            Node node = children.item(i);
            // 获得结点的类型
            short nodeType = node.getNodeType();
            if (nodeType == Node.ELEMENT_NODE) {
                // 是元素，继续递归
                parseElementList((Element) node);
            } else if (nodeType == Node.TEXT_NODE) {
                if (tempMap.containsKey(tagName)) {
                    listXmlMap.add(tempMap);
                    tempMap = new HashMap<String, String>();
                }
                // 递归出口
                tempMap.put(tagName, node.getNodeValue());
            }
        }
    }

    /**
     * @return the xmlMap
     */
    public Map<String, String> getXmlMap() {
        return xmlMap;
    }

    /**
     * @return the listXmlMap
     */
    public List<Map<String, String>> getListXmlMap() {
        return listXmlMap;
    }

    public static String getXmlStrUseName(Map<String, Object> map, int init) {
        StringBuffer str = new StringBuffer("");
        if(init == 0) {
            str.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        }
        if(map != null) {
            for(String key : map.keySet()) {
                if(map.get(key) instanceof Map) {
                    str.append("<").append(key).append(">");
                    str.append(getXmlStrUseName((Map)map.get(key), 1));
                    str.append("</").append(key).append(">");
                }else {
                    str.append("<").append(key).append(">");
                    str.append(map.get(key));
                    str.append("</").append(key).append(">");
                }
            }
        }
        return str.toString();
    }

}
```

- 案例

```java
public void replaceOrInsertSysDept() throws Exception {
        String param = "参数";
        String webUrl = "http://IP/HISWebService/Dict/DeptSetting.svc?wsdl";
        String methodName = "GetDept";
        String xmlDoc = WebServiceClient.callWebSV(webUrl, methodName, param);
        System.out.println(xmlDoc);

        XmlUtil xmlUtil = new XmlUtil();
        xmlUtil.parseList(xmlDoc);
        List<Map<String, String>> listXmlMap = xmlUtil.getListXmlMap();
        System.out.println(listXmlMap);
        listXmlMap.forEach(m -> {
            //根据科室id查sys_dept,如果存在，执行更新，如果不存在执行添加。使用MySQL的replace into
            System.out.println(m.toString());
            sysDeptMapper.replaceOrInsert(m);
        });
    }
```

