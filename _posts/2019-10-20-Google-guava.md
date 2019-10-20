---
layout: post
title: "Google-guava"
categories: guava
tags: guava
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### utilities

#### joiner

```java
import com.google.common.base.Joiner;
import com.google.common.io.Files;
import org.junit.Test;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import static com.google.common.collect.ImmutableMap.of;
import static java.util.stream.Collectors.joining;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsSame.sameInstance;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
public class JoinerTest {


    private final List<String> stringList = Arrays.asList(
            "Google", "Guava", "Java", "Scala", "Kafka"
    );

    private final List<String> stringListWithNullValue = Arrays.asList(
            "Google", "Guava", "Java", "Scala", null
    );

    private final Map<String, String> stringMap = of("Hello", "Guava", "Java", "Scala");


    private final String targetFileName = "G:\\Teaching\\汪文君Google Guava实战视频\\guava-joiner.txt";
    private final String targetFileNameToMap = "G:\\Teaching\\汪文君Google Guava实战视频\\guava-joiner-map.txt";

    /**
    *测试连接list中的元素
    */
    @Test
    public void testJoinOnJoin() {
        String result = Joiner.on("#").join(stringList);
        assertThat(result, equalTo("Google#Guava#Java#Scala#Kafka"));
    }
	/**
    *测试连接list中有null的元素，会抛出NPE异常
    */
    @Test(expected = NullPointerException.class)
    public void testJoinOnJoinWithNullValue() {
        String result = Joiner.on("#").join(stringListWithNullValue);
        assertThat(result, equalTo("Google#Guava#Java#Scala#Kafka"));
    }

    /**
    *测试连接list中的元素，忽略null
    */
    @Test
    public void testJoinOnJoinWithNullValueButSkip() {
        String result = Joiner.on("#").skipNulls().join(stringListWithNullValue);
        assertThat(result, equalTo("Google#Guava#Java#Scala"));
    }

	/**
    *测试连接list中的元素，如果有null，设置默认值
    */
    @Test
    public void testJoin_On_Join_WithNullValue_UseDefaultValue() {
        String result = Joiner.on("#").useForNull("DEFAULT").join(stringListWithNullValue);
        assertThat(result, equalTo("Google#Guava#Java#Scala#DEFAULT"));
    }

    /**
    *测试连接list中的元素，并添加到StringBuilder中
    */
    @Test
    public void testJoin_On_Append_To_StringBuilder() {
        final StringBuilder builder = new StringBuilder();
        StringBuilder resultBuilder = Joiner.on("#").useForNull("DEFAULT").appendTo(builder, stringListWithNullValue);
        assertThat(resultBuilder, sameInstance(builder));
        assertThat(resultBuilder.toString(), equalTo("Google#Guava#Java#Scala#DEFAULT"));
        assertThat(builder.toString(), equalTo("Google#Guava#Java#Scala#DEFAULT"));
    }

    /**
    *测试连接list中的元素，并把连接后的结果写入到文件中
    */
    @Test
    public void testJoin_On_Append_To_Writer() {

        try (FileWriter writer = new FileWriter(new File(targetFileName))) {
            Joiner.on("#").useForNull("DEFAULT").appendTo(writer, stringListWithNullValue);
            assertThat(Files.isFile().test(new File(targetFileName)), equalTo(true));
        } catch (IOException e) {
            fail("append to the writer occur fetal error.");
        }
    }

    /**
    *使用java8中的stream流连接list中的元素
    */
    @Test
    public void testJoiningByStreamSkipNullValues() {
        String result = stringListWithNullValue.stream().filter(item -> item != null && !item.isEmpty()).collect(joining("#"));
        assertThat(result, equalTo("Google#Guava#Java#Scala"));
    }

	/**
    *使用java8中的stream流连接list中的元素，并且给null元素默认值
    */
    @Test
    public void testJoiningByStreamWithDefaultValue() {
        String result = stringListWithNullValue.stream().map(this::defaultValue).collect(joining("#"));
        assertThat(result, equalTo("Google#Guava#Java#Scala#DEFAULT"));
    }

    private String defaultValue(final String item) {
        return item == null || item.isEmpty() ? "DEFAULT" : item;
    }

    /**
    *连接map中的键值对
    */
    @Test
    public void testJoinOnWithMap() {
        assertThat(Joiner.on('#').withKeyValueSeparator("=").join(stringMap), equalTo("Hello=Guava#Java=Scala"));
    }

	/**
    *连接map中的键值对，把结果写入到文件中
    */
    @Test
    public void testJoinOnWithMapToAppendable() {
        try (FileWriter writer = new FileWriter(new File(targetFileNameToMap))) {
            Joiner.on("#").withKeyValueSeparator("=").appendTo(writer, stringMap);
            assertThat(Files.isFile().test(new File(targetFileNameToMap)), equalTo(true));
        } catch (IOException e) {
            fail("append to the writer occur fetal error.");
        }
    }
}
```



#### splitter

```java
import com.google.common.base.Splitter;
import org.junit.Test;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertThat;

public class SplitterTest {

    /**
    *测试字符串分割
    */
    @Test
    public void testSplitOnSplit() {
        List<String> result = Splitter.on("|").splitToList("hello|world");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
        assertThat(result.get(0), equalTo("hello"));
        assertThat(result.get(1), equalTo("world"));
    }

    /**
    *测试字符串分割，去除空的部分
    */
    @Test
    public void testSplit_On_Split_OmitEmpty() {
        List<String> result = Splitter.on("|").splitToList("hello|world|||");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(5));

        result = Splitter.on("|").omitEmptyStrings().splitToList("hello|world|||");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
    }

    /**
    *测试字符串分割，去除多余空格和空的部分
    */
    @Test
    public void testSplit_On_Split_OmitEmpty_TrimResult() {
        result = Splitter.on("|").trimResults().omitEmptyStrings().splitToList("hello | world|||");
        assertThat(result.get(0), equalTo("hello"));
        assertThat(result.get(1), equalTo("world"));
    }

    /**
     * 按照固定长度分割
     * aaaabbbbccccdddd
     */
    @Test
    public void testSplitFixLength() {
        List<String> result = Splitter.fixedLength(4).splitToList("aaaabbbbccccdddd");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(4));
        assertThat(result.get(0), equalTo("aaaa"));
        assertThat(result.get(3), equalTo("dddd"));
    }

    /**
    *测试字符串分割，并且限制结果数量
    */
    @Test
    public void testSplitOnSplitLimit() {
        List<String> result = Splitter.on("#").limit(3).splitToList("hello#world#java#google#scala");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(3));
        assertThat(result.get(0), equalTo("hello"));
        assertThat(result.get(1), equalTo("world"));
        assertThat(result.get(2), equalTo("java#google#scala"));
    }

	/**
    *测试字符串分割，使用正则表达式
    */
    @Test
    public void testSplitOnPatternString() {
        List<String> result = Splitter.onPattern("\\|").trimResults().omitEmptyStrings().splitToList("hello | world|||");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
        assertThat(result.get(0), equalTo("hello"));
        assertThat(result.get(1), equalTo("world"));
    }

    @Test
    public void testSplitOnPattern() {
        List<String> result = Splitter.on(Pattern.compile("\\|")).trimResults().omitEmptyStrings().splitToList("hello | world|||");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
        assertThat(result.get(0), equalTo("hello"));
        assertThat(result.get(1), equalTo("world"));
    }

	/**
    *测试字符串分割，结果转为map
    */
    @Test
    public void testSplitOnSplitToMap() {
        Map<String, String> result = Splitter.on(Pattern.compile("\\|")).trimResults()
                .omitEmptyStrings().withKeyValueSeparator("=").split("hello=HELLO| world=WORLD|||");
        assertThat(result, notNullValue());
        assertThat(result.size(), equalTo(2));
        assertThat(result.get("hello"),equalTo("HELLO"));
        assertThat(result.get("world"),equalTo("WORLD"));

    }
}

```

