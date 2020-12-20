---
layout: post
title: "Google-guava"
categories: 工具类
tags: guava
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}


[getting started with Google guava](https://www.processon.com/view/link/5d413527e4b020861117eb7b)

### joiner

#### null相关

```java
//默认null异常
String[] values = new String[]{"foo",null,"bar"};
Joiner.on("#").join(values);//NullPointerException

//跳过null
String[] values = new String[]{"foo",null,"bar"};
String returned = Joiner.on("#").skipNulls().join(values);
assertThat(returned,is("foo#bar"));

//替换null
String[] values = new String[]{"foo",null,"bar"};
String returned = Joiner.on("#").useForNull("missing").join(values);
assertThat(returned,is("foo#missing#bar"));
```



#### 追加

```java
//StringBuilder
String[] values = new String[]{"foo", "bar","baz"};
StringBuilder builder = new StringBuilder();
StringBuilder returned = Joiner.on("|").appendTo(builder,values);
assertThat(returned,is(builder));

//writer
File tempFile = new File("testTempFile.txt");
CharSink charSink = Files.asCharSink(tempFile, Charsets.UTF_8);
Writer writer = charSink.openStream();
String[] values = new String[]{"foo", "bar","baz"};
Joiner.on("|").appendTo(writer,values);
writer.close();
String fromFileString = Files.toString(tempFile,Charsets.UTF_8);
assertThat(fromFileString,is("foo|bar|baz"));

//map
String expectedString = "Washington D.C=Redskins#New York City=Giants#Philadelphia=Eagles#Dallas=Cowboys";
Map testMap = Maps.newLinkedHashMap();
testMap.put("Washington D.C","Redskins");
testMap.put("New York City","Giants");
testMap.put("Philadelphia","Eagles");
testMap.put("Dallas","Cowboys");
String returnedString = Joiner.on("#").withKeyValueSeparator("=").join(testMap);
assertThat(returnedString,is(expectedString));
```



### Splitter

```java
//String.split()问题：中间保留，最后丢弃

String commaSeparatedString = "Foo,,Bar,,Baz,,,";
String[] words = commaSeparatedString.split(",");
//[Foo, , Bar, , Baz]
System.out.println(Arrays.toString(words));
```

```java
//字符
String text = "foo|bar|baz";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.on('|').split(text);

//字符串
String text = "foo&bar&baz";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.on("&").split(text);

//正则
String text = "foo123bar45678baz";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.onPattern("\d+").split(text);

//空串
String text = "foo & bar& baz ";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.on("&").trimResults().split(text);

//CharMatcher
String text = "1foo&bar2&2baz3";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.on("&").trimResults(CharMatcher.JAVA_DIGIT).split(text);

//默认保留
String text = "foo|bar|||baz";
String[] expected = new String[]{"foo","bar","","","baz"};
Iterable values = Splitter.on('|').split(text);

//忽略
String text = "foo|bar|||baz";
String[] expected = new String[]{"foo","bar","baz"};
Iterable values = Splitter.on('|').omitEmptyStrings().split(text);

//map
String startSring = "Washington D.C=Redskins#New York City=Giants#Philadelphia=Eagles#Dallas=Cowboys";
Map expectedMap = Maps.newLinkedHashMap();
testMap.put("Washington D.C","Redskins");
testMap.put("New York City","Giants");
testMap.put("Philadelphia","Eagles");
testMap.put("Dallas","Cowboys");
Splitter.MapSplitter mapSplitter = Splitter.on("#").withKeyValueSeparator("=");
Map splitMap = mapSplitter.split(startSring);
```



### Strings

#### CharMatcher

```java
//替换
String stringWithLinebreaks = "This is an example\n"+
"of a String with linebreaks\n"+
"we want on one line";
String expected = "This is an example of a String with linebreaks we want on one line";
String scrubbed = CharMatcher.BREAKING_WHITESPACE.replaceFrom(stringWithLinebreaks,' ');

//压缩
String tabsAndSpaces = "String with spaces and tabs";
String expected = "String with spaces and tabs";
String scrubbed = CharMatcher.WHITESPACE.collapseFrom(tabsAndSpaces,' ');

//裁剪
String tabsAndSpaces = " String with spaces and tabs";
String expected = "String with spaces and tabs";
String scrubbed = CharMatcher.WHITESPACE.trimAndCollapseFrom(tabsAndSpaces,' ');

//保留
String lettersAndNumbers = "foo989yxbar234";
String expected = "989234";
String retained = CharMatcher.JAVA_DIGIT.retainFrom(lettersAndNumbers)
```



#### Charsets

```java
//String.getBytes需要处理异常
byte[] bytes = null;
try{
bytes = "foobarbaz".getBytes("UTF-8");
}catch (UnsupportedEncodingException e){
//This really can't happen UTF-8 must be supported
}

byte[] bytes2 = "foobarbaz".getBytes(Charsets.UTF_8);
```



#### strings

```java
//空转换
assertThat(Strings.nullToEmpty(null),is(""));
assertThat(Strings.nullToEmpty("foo"),is("foo"));
assertThat(Strings.emptyToNull(""),is(nullValue()));
assertThat(Strings.emptyToNull(" "),is(" "));

assertThat(Strings.isNullOrEmpty(""),is(true));
assertThat(Strings.isNullOrEmpty(" "),is(false));
assertThat(Strings.isNullOrEmpty(null),is(true));
assertThat(Strings.isNullOrEmpty("foo"),is(false));

//整合字符串
String expected = "001";
String returned = Strings.padStart("1",3,'0');
assertThat(returned,is(expected));

String expected = "boom!!";
String returned = Strings.padEnd("boom",6,'!');
assertThat(returned,is(expected));

//复制字符串
assertThat(Strings.repeat("abc", 3), is("abcabcabc"));

//头部相同
assertThat(Strings.commonPrefix("abc12345", "abc44544"), is("abc"));

//尾部相同
assertThat(Strings.commonSuffix("12345abc", "44544abc"), is("abc"));
```



### Lists

```java
//新建
List emptyList = Lists.newArrayList();
List numbers = Lists.newArrayList(1, 2, 3, 4);

//分区
List numbers = Lists.newArrayList(1, 2, 3, 4);
List> subLists = Lists.partition(numbers, 2);
assertThat(subLists.get(0), is(Lists.newArrayList(1, 2)));
assertThat(subLists.get(1), is(Lists.newArrayList(3, 4)));

//反转
List reversed = Lists.reverse(numbers);
```



### Sets

```java
//新建
Set emptySet = Sets.newHashSet();
Set s1 = Sets.newHashSet("Foo","Bar");

//笛卡尔积
Set s1 = Sets.newHashSet("Foo","Bar");
Set s2 = Sets.newHashSet("Jim","Bob");
Set cartesian = Sets.cartesianProduct(s1, s2);
[
["Foo","Jim"],
["Foo","Bob"],
["Bar","Jim"],
["Bar","Bob"]
]

//差集
Set s1 = Sets.newHashSet("1","2","3");
Set s2 = Sets.newHashSet("3","2","4");
Sets.SetView sv = Sets.difference(s1,s2);//[1]

//对称差集
Set s1 = Sets.newHashSet("1","2","3");
Set s2 = Sets.newHashSet("3","2","4");
Sets.SetView sv = Sets.symmetricDifference(s1,s2); //[1, 4]

//交集
Set s1 = Sets.newHashSet("1","2","3");
Set s2 = Sets.newHashSet("3","2","4");
Sets.SetView sv = Sets.intersection(s1,s2);//[2,3]

//并集
Set s1 = Sets.newHashSet("1","2","3");
Set s2 = Sets.newHashSet("3","2","4");
Sets.SetView sv = Sets.union(s1,s2);//[1,2,3,4]
```



### Maps

```java
//新建
Map emptyMap = Maps.newHashMap();

//差集
MapDifference diffMap = Maps.difference(bookMap, bookMap2);

//list---map
Map bookMap = Maps.uniqueIndex(books,new Function() {
@Override
public String apply(Book book) {
return book.getIsbn();
}
});

//set---map
Set bookSet = Sets.newHashSet(books);
Map bookToIsbn = Maps.asMap(bookSet,new Function() {
@Override
public String apply(Book book) {
return book.getIsbn();
}
});

//转换值
Map map = Maps.transformValues(bookMap,new Function() {
@Override
public String apply(Book book) {
return book.getTitle();
}
});

//转换实体
Map map = Maps.transformEntries(bookMap,new Maps.EntryTransformer(){
@Override
public String transformEntry(String key, Book value) {
StringBuilder builder = new StringBuilder();
return builder.append(key).append("|").append(value.getTitle()).toString();
}
});
```

