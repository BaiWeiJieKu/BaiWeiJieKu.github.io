---
layout: post
title: "mongoTemplate"
categories: MongoDB
tags: MongoDB 数据库
author: 百味皆苦
music-id: 3136952023
---

* content
{:toc}


## 查询操作



### 根据字段查询



﻿这里主要会使用Query + Criteria 来完成

```java
	private static final String COLLECTION_NAME = "demo";

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 指定field查询
     */
    public void specialFieldQuery() {
        Query query = new Query(Criteria.where("user").is("一灰灰blog"));
        // 查询一条满足条件的数据
        Map result = mongoTemplate.findOne(query, Map.class, COLLECTION_NAME);
        System.out.println("query: " + query + " | specialFieldQueryOne: " + result);

        // 满足所有条件的数据
        List<Map> ans = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
        System.out.println("query: " + query + " | specialFieldQueryAll: " + ans);
    }
```



### and多条件查询

如果要同时满足多个条件，需要利用and来衔接多个查询条件

```java
Query query = new Query(Criteria.where("user").is("一灰灰blog").and("age").is(18));
Map result = mongoTemplate.findOne(query, Map.class, COLLECTION_NAME);
System.out.println("query: " + query + " | andQuery: " + result);
```

