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



### or或查询

多个条件中只要一个满足即可

```java
public void orQuery() {
    // 等同于 db.getCollection('demo').find({"user": "一灰灰blog", $or: [{ "age": 18}, { "sign": {$exists: true}}]})
    Query query = new Query(Criteria.where("user").is("一灰灰blog")
            .orOperator(Criteria.where("age").is(18), Criteria.where("sign").exists(true)));
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | orQuery: " + result);

    // 单独的or查询
    // 等同于Query: { "$or" : [{ "age" : 18 }, { "sign" : { "$exists" : true } }] }, Fields: { }, Sort: { }
    query = new Query(new Criteria().orOperator(Criteria.where("age").is(18), Criteria.where("sign").exists(true)));
    result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | orQuery: " + result);
}
```



### in查询

包含条件

```java
public void inQuery() {
    // 相当于:
    Query query = new Query(Criteria.where("age").in(Arrays.asList(18, 20, 30)));
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | inQuery: " + result);
}
```



### 数值比较

主要使用的是：gte，gt，lte，lt

```java
public void compareBigQuery() {
    // age > 18
    Query query = new Query(Criteria.where("age").gt(18));
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | compareBigQuery: " + result);

    // age >= 18
    query = new Query(Criteria.where("age").gte(18));
    result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | compareBigQuery: " + result);
}
```



### 正则查询

不常用

```java
public void regexQuery() {
    Query query = new Query(Criteria.where("user").regex("^一灰灰blog"));
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | regexQuery: " + result);
}
```



### 数量查询

统计常用

```java
public void countQuery() {
    Query query = new Query(Criteria.where("user").is("一灰灰blog"));
    long cnt = mongoTemplate.count(query, COLLECTION_NAME);
    System.out.println("query: " + query + " | cnt " + cnt);
}
```



### 分组查询

对应MySQL中的group查询，更多的是利用聚合查询

```java
public void groupQuery() {
    // 根据用户名进行分组统计，每个用户名对应的数量
    // aggregate([ { "$group" : { "_id" : "user" , "userCount" : { "$sum" : 1}}}] )
    Aggregation aggregation = Aggregation.newAggregation(Aggregation.group("user").count().as("userCount"));
    AggregationResults<Map> ans = mongoTemplate.aggregate(aggregation, COLLECTION_NAME, Map.class);
    System.out.println("query: " + aggregation + " | groupQuery " + ans.getMappedResults());
}
```



### 排序

比较常用的sort，对于没有这个字段的document也被查出来了

```java
public void sortQuery() {
    // sort查询条件，需要用with来衔接
    Query query = Query.query(Criteria.where("user").is("一灰灰blog")).with(Sort.by("age"));
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | sortQuery " + result);
}
```



### 分页查询

limit和skip

```java
public void pageQuery() {
    // limit限定查询2条
    Query query = Query.query(Criteria.where("user").is("一灰灰blog")).with(Sort.by(Sort.Order.asc("age"))).limit(2);
    List<Map> result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | limitPageQuery " + result);


    // skip()方法来跳过指定数量的数据
    query = Query.query(Criteria.where("user").is("一灰灰blog")).with(Sort.by("age")).skip(2);
    result = mongoTemplate.find(query, Map.class, COLLECTION_NAME);
    System.out.println("query: " + query + " | skipPageQuery " + result);
}
```



## 新增操作

插入一条数据：mongoTemplate.insert(object, COLLECTION_NAME);

不存在才插入：mongoTemplate.upsert(Query query, Update update, String collectionName)

```java
public void upsertNoMatch() {
    // addToSet 表示将数据塞入document的一个数组成员中
    //  两条数据匹配时，upsert 将只会更新一条数据
    UpdateResult upResult = mongoTemplate.upsert(new Query(Criteria.where("name").is("一灰灰blog").and("age").is(100)),
            new Update().set("age", 120).addToSet("add", "额外增加"), COLLECTION_NAME);
    System.out.println("nomatch upsert return: " + upResult);

    List<JSONObject> re = mongoTemplate
            .find(new Query(Criteria.where("name").is("一灰灰blog").and("age").is(120)), JSONObject.class,
                    COLLECTION_NAME);
    System.out.println("after upsert return should not be null: " + re);
    System.out.println("------------------------------------------");
}
```



## 修改操作



### 常用

```
{
     "_id" : ObjectId("5c6a7ada10ffc647d301dd62"),
     "age" : 28.0,
     "name" : "blog",
     "desc" : "Java Developer",
     "add" : [
              "额外增加"
      ],
     "date" : ISODate("2019-01-28T08:00:08.373Z"),
     "doc" : {
          "key" : "小目标",
          "value" : "升职加薪，迎娶白富美"
      }
}
  
```



```java
// 1. 直接修改值的内容
    Query query = new Query(Criteria.where("_id").is("5c49b07ce6652f7e1add1ea2"));

    Update update = new Update().set("desc", "Java & Python Developer");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);


// 数字修改，实现累加or减少
Update numUp = new Update().inc("age", 20L);
mongoTemplate.updateFirst(query, numUp, COLLECTION_NAME);


// 数字比较修改，保留最大的
Update cmpUp = new Update().max("age", 88);
mongoTemplate.updateFirst(query, cmpUp, COLLECTION_NAME);


// 乘法
Update mulUp = new Update().multiply("age", 3);
mongoTemplate.updateFirst(query, mulUp, COLLECTION_NAME);


// 日期修改
Update dateUp = new Update().currentDate("date");
mongoTemplate.updateFirst(query, dateUp, COLLECTION_NAME);


//重命名，如果字段不存在，相当于没有更新
Update update = new Update().rename("desc", "skill");
mongoTemplate.updateFirst(query, update, COLLECTION_NAME);


// 删除字段，如果不存在，则不操作
Update update = new Update().unset("new-skill");
mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
```



### 数组操作

```java
private void addData2Array(Query query) {
    // 新加一个元素到数组，如果已经存在，则不会加入
    String insert = "新添加>>" + System.currentTimeMillis();
    Update update = new Update().addToSet("add", insert);
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
   

    // push 新增元素，允许出现重复的数据
    update = new Update().push("add", 10);
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
    
    
    // 批量插入数据到数组中, 注意不会将重复的数据丢入mongo数组中
    Update update = new Update().addToSet("add").each("2", "2", "3");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
    
    
    // 删除数组中元素
    Update update = new Update().pull("add", "2");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
    
    
    // 使用set，field.index 来更新数组中的值
    // 更新数组中的元素，如果元素存在，则直接更新；如果数组个数小于待更新的索引位置，则前面补null
    Update update = new Update().set("add.1", "updateField");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
    

    update = new Update().set("add.10", "nullBefore");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
    
}



```



### 文档操作

```java
// 内嵌doc新增field
    Update update = new Update().set("doc.title", "好好学习，天天向上!");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);


// 内嵌doc修改field
    Update update = new Update().set("doc.title", "新的标题：Blog!");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);


// 删除内嵌doc中的field
    Update update = new Update().unset("doc.title");
    mongoTemplate.updateFirst(query, update, COLLECTION_NAME);
```

