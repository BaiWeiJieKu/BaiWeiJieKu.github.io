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
@WebService(targetNamespace = "http://webservice.msunsoft.com/")
public interface PatientService {

    @WebMethod
    String sendPatientMsg(@WebParam(name = "name") String name);
}
```

#### 实现类

```java
/**
 * webservice接口实现类
 * qinfen
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



### 客户端

