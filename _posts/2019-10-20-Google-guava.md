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



#### Strings

```java
import com.google.common.base.CharMatcher;
import com.google.common.base.Charsets;
import com.google.common.base.Strings;
import org.junit.Test;
import java.nio.charset.Charset;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;

public class StringsTest {

    @Test
    public void testStringsMethod() {
        //“ ”转null
        assertThat(Strings.emptyToNull(""), nullValue());
        
        //null转“ ”
        assertThat(Strings.nullToEmpty(null), equalTo(""));
        assertThat(Strings.nullToEmpty("hello"), equalTo("hello"));
        
        //获取公共前缀
        assertThat(Strings.commonPrefix("Hello", "Hit"), equalTo("H"));
        assertThat(Strings.commonPrefix("Hello", "Xit"), equalTo(""));
        
        //获取公共后缀
        assertThat(Strings.commonSuffix("Hello", "Echo"), equalTo("o"));
        
        //重复字符串
        assertThat(Strings.repeat("Alex", 3), equalTo("AlexAlexAlex"));
        
        //判断是否为null或“”
        assertThat(Strings.isNullOrEmpty(null), equalTo(true));
        assertThat(Strings.isNullOrEmpty(""), equalTo(true));
        
		//向字符串头部或尾部添加内容
        assertThat(Strings.padStart("Alex", 3, 'H'), equalTo("Alex"));
        assertThat(Strings.padStart("Alex", 5, 'H'), equalTo("HAlex"));
        assertThat(Strings.padEnd("Alex", 5, 'H'), equalTo("AlexH"));
    }

    @Test
    public void testCharsets() {
        //获取字符集
        Charset charset = Charset.forName("UTF-8");
        assertThat(Charsets.UTF_8, equalTo(charset));
    }

    /**
     * functor
     */
    @Test
    public void testCharMatcher() {
        //判断字符是否为数字
        assertThat(CharMatcher.javaDigit().matches('5'), equalTo(true));
        assertThat(CharMatcher.javaDigit().matches('x'), equalTo(false));
        
		//获取字符在字符串中的数量
        assertThat(CharMatcher.is('A').countIn("Alex Sharing the Google Guava to Us"), equalTo(1));
        
        //把字符串中的空格替换为指定内容
        assertThat(CharMatcher.breakingWhitespace().collapseFrom("      hello Guava     ", '*'), equalTo("*hello*Guava*"));
        
        //去除字符串中的数字和空格
        assertThat(CharMatcher.javaDigit().or(CharMatcher.whitespace()).removeFrom("hello 234 world"), equalTo("helloworld"));
        
        //只保留字符串中的数字和空格
        assertThat(CharMatcher.javaDigit().or(CharMatcher.whitespace()).retainFrom("hello 234 world"), equalTo(" 234 "));

    }

    public Integer text(){
        return 0;
    }
}

```



### IO

#### Files

```java
import com.google.common.base.Charsets;
import com.google.common.base.Joiner;
import com.google.common.collect.FluentIterable;
import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import com.google.common.io.*;
import org.junit.After;
import org.junit.Test;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class FilesTest {

    private final String SOURCE_FILE = "C:\\source.txt";
    private final String TARGET_FILE = "C:\\target.txt";

    /**
     * 拷贝文件
     */
    @Test
    public void testCopyFileWithGuava() throws IOException {
        File targetFile = new File(TARGET_FILE);
        File sourceFile = new File(SOURCE_FILE);
        Files.copy(sourceFile, targetFile);
        //判断文件是否存在
        assertThat(targetFile.exists(), equalTo(true));
        //比较源文件和复制后的文件hashcode是否相同
        HashCode sourceHashCode = Files.asByteSource(sourceFile).hash(Hashing.sha256());
        HashCode targetHashCode = Files.asByteSource(targetFile).hash(Hashing.sha256());
        assertThat(sourceHashCode.toString(), equalTo(targetHashCode.toString()));
    }

    /**
     * 使用jdk的NIO拷贝文件
     */
    @Test
    public void testCopyFileWithJDKNio2() throws IOException {
        java.nio.file.Files.copy(
                Paths.get("C:\\resources", "io", "source.txt"),
                Paths.get("C:\\resources", "io", "target.txt"),
                StandardCopyOption.REPLACE_EXISTING
        );
        File targetFile = new File(TARGET_FILE);

        assertThat(targetFile.exists(), equalTo(true));
    }

    /**
     * 移动文件
     */
    @Test
    public void testMoveFile() throws IOException {
        try {
            //TARGET_FILE若存在,将被删除,重新生成
            Files.move(new File(SOURCE_FILE), new File(TARGET_FILE));
            assertThat(new File(TARGET_FILE).exists(), equalTo(true));
            assertThat(new File(SOURCE_FILE).exists(), equalTo(false));
        } finally {
            Files.move(new File(TARGET_FILE), new File(SOURCE_FILE));
        }
    }

    /**
     * 读取文件内容
     */
    @Test
    public void testToString() throws IOException {

        final String expectedString = "today we will share the guava io knowledge.\n" +
                "but only for the basic usage. if you wanted to get the more details information\n" +
                "please read the guava document or source code.\n" +
                "\n" +
                "The guava source code is very cleanly and nice.";
		//读取文件内容(一行一行读)
        List<String> strings = Files.readLines(new File(SOURCE_FILE), Charsets.UTF_8);
		//把读取到的每一行用换行符连接起来
        String result = Joiner.on("\n").join(strings);
        assertThat(result, equalTo(expectedString));
    }
	
    /**
     * 读取文件内容(按条件读取)
     */
    @Test
    public void testToProcessString() throws IOException {
        /**
         * [43, 79, 46, 0, 47]
         */
        LineProcessor<List<Integer>> lineProcessor = new LineProcessor<List<Integer>>() {

            private final List<Integer> lengthList = new ArrayList<>();

            @Override
            public boolean processLine(String line) throws IOException {
                if (line.length() == 0) return false;
                lengthList.add(line.length());
                return true;//return false,不再读取下面内容
            }

            @Override
            public List<Integer> getResult() {
                return lengthList;
            }
        };
        List<Integer> result = Files.asCharSource(new File(SOURCE_FILE), Charsets.UTF_8).readLines(lineProcessor);

        System.out.println(result);
    }

	/**
     * 写文件
     */
    @Test
    public void testFileWrite() throws IOException {
        String testPath = "C:\\testFileWrite.txt";
        File testFile = new File(testPath);
        //如果存在先删除
        testFile.deleteOnExit();
        String content1 = "content 1";
        //写入
        Files.asCharSink(testFile, Charsets.UTF_8).write(content1);
        String actully = Files.asCharSource(testFile, Charsets.UTF_8).read();
        assertThat(actully, equalTo(content1));
    }

    /**
     * 追加内容
     */
    @Test
    public void testFileAppend() throws IOException {
        String testPath = "C:\\testFileAppend.txt";
        File testFile = new File(testPath);
        testFile.deleteOnExit();
        
        CharSink charSink = Files.asCharSink(testFile, Charsets.UTF_8, FileWriteMode.APPEND);
        charSink.write("content1");
        
        String actullay = Files.asCharSource(testFile, Charsets.UTF_8).read();
        assertThat(actullay, equalTo("content1"));

        charSink.write("content2");
        actullay = Files.asCharSource(testFile, Charsets.UTF_8).read();
        assertThat(actullay, equalTo("content1content2"));
    }

    /**
     * 递归获取文件树
     */
    @Test
    public void testRecursive() {
        List<File> list = new ArrayList<>();
        this.recursiveList(new File("C:\\Users\\wangwenjun\\IdeaProjects\\guava_programming\\src\\main"), list);
        list.forEach(System.out::println);
    }

    private void recursiveList(File root, List<File> fileList) {
        /*if (root.isHidden())
            return;
        fileList.add(root);
        if (!root.isFile()) {
            File[] files = root.listFiles();
            for (File f : files) {
                recursiveList(f, fileList);
            }
        }*/


        if (root.isHidden()) return;
        if (root.isFile())
            fileList.add(root);
        else {
            File[] files = root.listFiles();
            for (File f : files) {
                recursiveList(f, fileList);
            }
        }
    }

    /**
    *获取某路径目录
    */
    @Test
    public void testTreeFilesPreOrderTraversal() {
        File root = new File("C:\\Users\\wangwenjun\\IdeaProjects\\guava_programming\\src\\main");
//        FluentIterable<File> files = Files.fileTreeTraverser().preOrderTraversal(root);
        FluentIterable<File> files = Files.fileTreeTraverser().preOrderTraversal(root).filter(File::isFile);
        files.stream().forEach(System.out::println);
    }

    //preOrderTraversal postOrderTraversal顺序不一样
    @Test
    public void testTreeFilesPostOrderTraversal() {
        File root = new File("C:\\Users\\wangwenjun\\IdeaProjects\\guava_programming\\src\\main");
        FluentIterable<File> files = Files.fileTreeTraverser().postOrderTraversal(root);
        files.stream().forEach(System.out::println);
    }

    /**
    *获取path下子目录
    */
    @Test
    public void testTreeFilesChild() {
        File root = new File("C:\\Users\\wangwenjun\\IdeaProjects\\guava_programming\\src\\main");
        Iterable<File> children = Files.fileTreeTraverser().children(root);

        children.forEach(System.out::println);
    }

    @After
    public void tearDown() {
        File targetFile = new File(TARGET_FILE);
        if (targetFile.exists())
            targetFile.delete();
    }
}

```



### collections

#### FluentIterable

- 主要用于**过滤、转换集合中的数据**

```java
import com.google.common.base.Joiner;
import com.google.common.base.Optional;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.Lists;
import org.junit.Test;
import java.util.ArrayList;
import java.util.List;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;

public class FluentIterableExampleTest
{

    private FluentIterable<String> build()
    {
        ArrayList<String> list = Lists.newArrayList("Alex", "Wang", "Guava", "Scala");
        return FluentIterable.from(list);
    }
	
    /**
    * 迭代器过滤
    */
    @Test
    public void testFilter()
    {
        FluentIterable<String> fit = build();
        assertThat(fit.size(), equalTo(4));
		
        //过滤掉集合中为null和长度<=4的元素
        FluentIterable<String> result = fit.filter(e -> e != null && e.length() > 4);
        assertThat(result.size(), equalTo(2));
    }

    /**
    * 集合追加
    */
    @Test
    public void testAppend()
    {
        FluentIterable<String> fit = build();
        ArrayList<String> append = Lists.newArrayList("APPEND");
        assertThat(fit.size(), equalTo(4));
        //把一个集合中的元素全部添加到另一个集合中
        FluentIterable<String> appendFI = fit.append(append);
        assertThat(appendFI.size(), equalTo(5));
        assertThat(appendFI.contains("APPEND"), is(true));
    }

    /**
    * 判断集合里的元素
    */
    @Test
    public void testMatch()
    {
        FluentIterable<String> fit = build();
        //如果全部符合条件，返回true
        boolean result = fit.allMatch(e -> e != null && e.length() >= 4);
        assertThat(result, is(true));
		//如果有符合条件的任意一个元素，返回true
        result = fit.anyMatch(e -> e != null && e.length() == 5);
        assertThat(result, is(true));

        //获取第一个满足条件的元素
        Optional<String> optional = fit.firstMatch(e -> e != null && e.length() == 5);
        assertThat(optional.isPresent(), is(true));
        assertThat(optional.get(), equalTo("Guava"));
    }

    /**
    * 获取头元素和尾元素
    */
    @Test
    public void testFirst$Last()
    {
        FluentIterable<String> fit = build();
        
        //获取头元素
        Optional<String> optional = fit.first();
        assertThat(optional.isPresent(), is(true));
        assertThat(optional.get(), equalTo("Alex"));

        //获取尾元素
        optional = fit.last();
        assertThat(optional.isPresent(), is(true));
        assertThat(optional.get(), equalTo("Scala"));
    }

    /**
    * 获取集合中指定数量和元素
    */
    @Test
    public void testLimit()
    {
        FluentIterable<String> fit = build();
        
        FluentIterable<String> limit = fit.limit(3);
        System.out.println(limit);
        assertThat(limit.contains("Scala"), is(false));

        limit = fit.limit(300);
        System.out.println(limit);
        assertThat(limit.contains("Scala"), is(true));

    }

    /**
     * 集合拷贝
     */
    @Test
    public void testCopyIn()
    {
        FluentIterable<String> fit = build();
        
        ArrayList<String> list = Lists.newArrayList("Java");
        ArrayList<String> result = fit.copyInto(list);

        assertThat(result.size(), equalTo(5));
        assertThat(result.contains("Scala"), is(true));
    }

    /**
    * 循环集合中的元素
    */
    @Test
    public void testCycle()
    {
        FluentIterable<String> fit = build();
        
        FluentIterable<String> cycle = fit.cycle().limit(20);
        cycle.forEach(System.out::println);
    }

    /**
    * 转化集合中的元素
    */
    @Test
    public void testTransform()
    {
        FluentIterable<String> fit = build();
        //把集合中的元素转换为对应的长度，是一个List<Integer>
        fit.transform(e -> e.length()).forEach(System.out::println);
    }

    /**
    * 转化集合中的元素并合并
    */
    @Test
    public void testTransformAndConcat()
    {
        FluentIterable<String> fit = build();
        
        List<Integer> list = Lists.newArrayList(1);
        FluentIterable<Integer> result = fit.transformAndConcat(e -> list);
        result.forEach(System.out::println);//1 1 1 1
    }

    /**
     *转化集合中的元素并合并
     */
    @Test
    public void testTransformAndConcatInAction()
    {
        ArrayList<Integer> cTypes = Lists.newArrayList(1, 2);
        //使用1作为查询条件得到一个list，里面有两个对象
        //使用2作为查询条件得到一个list2，里面有三个对象
        //使用transformAndConcat可以把list1和list2合并为一个list
        FluentIterable.from(cTypes).transformAndConcat(this::search)
                .forEach(System.out::println);
    }

    /**
     *连接集合中的元素
     */
    @Test
    public void testJoin()
    {
        FluentIterable<String> fit = build();
        String result = fit.join(Joiner.on(','));
        assertThat(result, equalTo("Alex,Wang,Guava,Scala"));
    }


    private List<Customer> search(int type)
    {
        if (type == 1)
        {
            return Lists.newArrayList(new Customer(type, "Alex"), new Customer(type, "Tina"));
        } else
        {
            return Lists.newArrayList(new Customer(type, "Wang"), new Customer(type, "Wen"), new Customer(type, "Jun"));
        }
    }

    class Customer
    {
        final int type;
        final String name;

        Customer(int type, String name)
        {
            this.type = type;
            this.name = name;
        }

        @Override
        public String toString()
        {
            return "Customer{" +
                    "type=" + type +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
}
```



#### Lists

```java
import com.google.common.base.Joiner;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.Lists;
import org.junit.Test;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class ListsExampleTest
{

    /**
    *求笛卡尔积
    */
    @Test
    public void testCartesianProduct()
    {

        List<List<String>> result = Lists.cartesianProduct(
                Lists.newArrayList("1", "2"),
                Lists.newArrayList("A", "B")
        );
        System.out.println(result);//1A,1B,2A,2B
    }

    /**
    *转换集合中的元素
    */
    @Test
    public void testTransform()
    {
        ArrayList<String> sourceList = Lists.newArrayList("Scala", "Guava", "Lists");
        Lists.transform(sourceList, e -> e.toUpperCase()).forEach(System.out::println);


    }

    /**
    *创建一个指定容积的集合
    */
    @Test
    public void testNewArrayListWithCapacity()
    {
        ArrayList<String> result = Lists.newArrayListWithCapacity(10);
        result.add("x");
        result.add("y");
        result.add("z");
        System.out.println(result);


    }

    /**
    *反转集合中元素的顺序
    */
    @Test
    public void testReverse(){
        ArrayList<String> list = Lists.newArrayList("1", "2", "3");
        assertThat(Joiner.on(",").join(list),equalTo("1,2,3"));

        List<String> result = Lists.reverse(list);
        assertThat(Joiner.on(",").join(result),equalTo("3,2,1"));
    }

    /**
    *集合分区
    */
    @Test
    public void testPartition(){
        ArrayList<String> list = Lists.newArrayList("1", "2", "3","4");
        List<List<String>> result = Lists.partition(list, 30);
        System.out.println(result.get(0));
    }
}
```



#### sets

```java
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import org.junit.Test;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class SetsExampleTest
{

    /**
    * 创建set
    */
    @Test
    public void testCreate()
    {
        HashSet<Integer> set = Sets.newHashSet(1, 2, 3);
        assertThat(set.size(), equalTo(3));

        ArrayList<Integer> list = Lists.newArrayList(1, 1, 2, 3);
        assertThat(list.size(), equalTo(4));

        //把list变为set
        HashSet<Integer> set2 = Sets.newHashSet(list);
        assertThat(set2.size(), equalTo(3));


    }

    /**
    * 笛卡尔积
    */
    @Test
    public void testCartesianProduct()
    {

        Set<List<Integer>> set = Sets.cartesianProduct(Sets.newHashSet(1, 2), Sets.newHashSet(3, 4), Sets.newHashSet(5, 6));

        //[[1,4,5],[1,4,6],[1,3,5],[1,3,6],[2,4,5],[2,4,6],[2,3,5],[2,3,6]]
        System.out.println(set);


    }

    /**
    * 返回大小为set的所有子集的集合
    */
    @Test
    public void testCombinations()
    {
        HashSet<Integer> set = Sets.newHashSet(1, 2, 3);
        Set<Set<Integer>> combinations = Sets.combinations(set, 2);
        combinations.forEach(System.out::println);
        //[1,2],[1,3],[2,3]
    }

    /**
    * 返回差集
    */
    @Test
    public void testDiff()
    {
        HashSet<Integer> set1 = Sets.newHashSet(1, 2, 3);
        HashSet<Integer> set2 = Sets.newHashSet(1, 4, 6);
        Sets.SetView<Integer> diffResult1 = Sets.difference(set1, set2);
        System.out.println(diffResult1);//[2,3]
        Sets.SetView<Integer> diffResult2 = Sets.difference(set2, set1);
        System.out.println(diffResult2);//[4,6]
    }

    /**
    * 返回交集
    */
    @Test
    public void testIntersection()
    {
        HashSet<Integer> set1 = Sets.newHashSet(1, 2, 3);
        HashSet<Integer> set2 = Sets.newHashSet(1, 4, 6);
        Sets.intersection(set1, set2).forEach(System.out::println);//[1]
    }

    /**
    * 返回并集
    */
    @Test
    public void testUnionSection()
    {
        HashSet<Integer> set1 = Sets.newHashSet(1, 2, 3);
        HashSet<Integer> set2 = Sets.newHashSet(1, 4, 6);
        Sets.union(set1, set2).forEach(System.out::println);//[1,2,3,4,6]
    }
}

```



#### Maps

```java
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import org.junit.Test;
import java.util.ArrayList;
import java.util.Map;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class MapsExampleTest
{

    /**
    * 创建map
    */
    @Test
    public void testCreate()
    {
        ArrayList<String> valueList = Lists.newArrayList("1", "2", "3");
        ImmutableMap<String, String> map = Maps.uniqueIndex(valueList, v -> v + "_key");
        System.out.println(map);//{1_key=1,2_key=2,3_key=3}
        
        Map<String, String> map2 = Maps.asMap(Sets.newHashSet("1", "2", "3"), k -> k + "_value");
        System.out.println(map2);//{1=1_value,2=2_value,3=3_value}
    }

    /**
    * 转换map的value
    */
    @Test
    public void testTransform()
    {
        Map<String, String> map = Maps.asMap(Sets.newHashSet("1", "2", "3"), k -> k + "_value");
        Map<String, String> newMap = Maps.transformValues(map, v -> v + "_transform");
        //{1=1_value_transform,2=2_value_transform,3=3_value_transform}
        System.out.println(newMap);
        assertThat(newMap.containsValue("1_value_transform"), is(true));
    }

    /**
    * 过滤
    */
    @Test
    public void testFilter()
    {
        Map<String, String> map = Maps.asMap(Sets.newHashSet("1", "2", "3"), k -> k + "_value");
        Map<String, String> newMap = Maps.filterKeys(map, k -> Lists.newArrayList("1", "2").contains(k));
        //{1=1_value,2=2_value}
        assertThat(newMap.containsKey("3"), is(false));
    }
}
```



#### Multimaps

```java
import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimaps;
import org.junit.Test;
import java.util.HashMap;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;

public class MultimapsExampleTest
{

    @Test
    public void testBasic()
    {
        //允许键重复的map,value存的是一个链表
        LinkedListMultimap<String, String> multipleMap = LinkedListMultimap.create();
        HashMap<String, String> hashMap = Maps.newHashMap();
        hashMap.put("1", "1");
        hashMap.put("1", "2");
        assertThat(hashMap.size(), equalTo(1));


        multipleMap.put("1", "1");
        multipleMap.put("1", "2");
        assertThat(multipleMap.size(), equalTo(2));
        System.out.println(multipleMap.get("1"));//[1,2]
    }
}
```



#### BiMap

- 双向映射

```java
import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;
import org.junit.Test;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;

public class BiMapExampleTest
{

    @Test
    public void testCreateAndPut()
    {
        HashBiMap<String, String> biMap = HashBiMap.create();
        biMap.put("1", "2");
        biMap.put("1", "3");
        assertThat(biMap.containsKey("1"), is(true));
        assertThat(biMap.size(), equalTo(1));
		//要保证键和值都是惟一的
        try
        {
            biMap.put("2", "3");
            fail();
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    /**
    * 反转键和值
    */
    @Test
    public void testBiMapInverse()
    {
        HashBiMap<String, String> biMap = HashBiMap.create();
        biMap.put("1", "2");
        biMap.put("2", "3");
        biMap.put("3", "4");

        assertThat(biMap.containsKey("1"), is(true));
        assertThat(biMap.containsKey("2"), is(true));
        assertThat(biMap.containsKey("3"), is(true));
        assertThat(biMap.size(), equalTo(3));

        //反转后的BiMap，即key/value互相切换的映射。
        //反转的map并不是一个新的map，而是一个视图，这意味着，你在这个反转后的map中的任何增删改操作都会影响原来的map
        BiMap<String, String> inverseKey = biMap.inverse();
        assertThat(inverseKey.containsKey("2"), is(true));
        assertThat(inverseKey.containsKey("3"), is(true));
        assertThat(inverseKey.containsKey("4"), is(true));
        assertThat(inverseKey.size(), equalTo(3));
    }

    /**
    * 覆盖原有值
    */
    @Test
    public void testCreateAndForcePut()
    {
        HashBiMap<String, String> biMap = HashBiMap.create();
        biMap.put("1", "2");
        assertThat(biMap.containsKey("1"), is(true));
        biMap.forcePut("2", "2");
        //{2=2}
        assertThat(biMap.containsKey("1"), is(false));
        assertThat(biMap.containsKey("2"), is(true));
    }
}
```

