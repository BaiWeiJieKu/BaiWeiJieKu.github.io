---
layout: post
title: "LeetCode-数组"
categories: LeetCode
tags: LeetCode 数组
author: 百味皆苦
music-id: 2602106546
---

* content
{:toc}
### 两数之和

```
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例:
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```



#### 方法一

```java
//从数组两端开始遍历
//时间复杂度O（n^2）
//对于每个元素，我们试图通过遍历数组的其余部分来寻找它所对应的目标元素,耗时O(1)
//空间复杂度：O（1）

class Solution {
    public int[] twoSum(int[] nums, int target) {
        for(int head=0;head<nums.length-1;head++ )
        {
            for(int tail=nums.length-1;tail>head;tail--)
            {
                if(nums[head]+nums[tail]==target){
                    return new int[]{head,tail};
                }
            }
        }
		return new int[]{};
    }
}
```



#### 方法二

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap();
        for(int i=0;i<nums.length;i++) {
            //用目标值减数组元素，查看map中是否有这个键
            if(map.containsKey(target-nums[i]))
                return new int[]{i,map.get(target-nums[i])};
            map.put(nums[i],i);
        }
        return new int[]{};
    }
}
//第一次target=9，target-2=7，map中没有这个键，把值和索引装入map中，形成（2：0）
//第二次target-7=2，map中有2这个键，返回i和键2所对应的的值[0,1]
```

```
利用map键值对，键为数组元素，值为数组索引
键   2   7   11   15
值   0   1   2    3
```

```
一遍哈希表
事实证明，我们可以一次完成。在进行迭代并将元素插入到表中的同时，我们还会回过头来检查表中是否已经存在当前元素所对应的目标元素。如果它存在，那我们已经找到了对应解，并立即将其返回。
时间复杂度：O(n)
空间复杂度：O（n）
```



### 移除元素

```
给定一个排序数组，你需要在原地删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
```

```
给定数组 nums = [1,1,2], 

函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。 

你不需要考虑数组中超出新长度后面的元素。
```

```
给定 nums = [0,0,1,1,1,2,2,3,3,4],

函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。

你不需要考虑数组中超出新长度后面的元素。
```



#### 方法一

```java
利用双指针遍历数组

class Solution {
    public int removeDuplicates(int[] nums) {
        if(nums.length<=0) {
            return 0;
        }
        int mov=0; //赋值指针指针
        int res=1; //统计不重复元素的个数
        for(int i=0;i<nums.length;i++) { //i相当于移动指针
            if(nums[mov]==nums[i]) {
                continue; //两个指针从数组第一个元素开始比较，如果相同，跳过本次循环
            }else {
                mov++; //当两个指针指的位置元素不相等就表示是一个新元素
                nums[mov]=nums[i]; //把赋值指针向后移动一位，把新元素赋值给赋值指针位置
                res++; //元素个数加一
            }
        }
        return res;
    }
}
```

```
时间复杂度：O(n)， 假设数组的长度是 nn，那么 ii 和 jj 分别最多遍历 nn 步。
空间复杂度：O(1)。
```

```
nums = [0,0,1,1,1,2,2,3,3,4]

第一次mov=0,i=0  两个位置都是0且元素相等，
第二次mov=0,i=1  两个位置都是0且元素相等,
第三次mov=0,i=2  0!=1,所以mov++,mov=1,nums[mov]=nums[i],res=2
第四次mov=1,i=3  两个位置都是1且元素相等,
.
.
.
```



### 移除元素2

```
给定一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。
```

```
给定 nums = [3,2,2,3], val = 3,

函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。

你不需要考虑数组中超出新长度后面的元素。
```

```
给定 nums = [0,1,2,2,3,0,4,2], val = 2,

函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。

注意这五个元素可为任意顺序。

你不需要考虑数组中超出新长度后面的元素。
```

```
// nums 是以“引用”方式传递的。也就是说，不对实参作任何拷贝
int len = removeElement(nums, val);
// 在函数里修改输入数组对于调用者是可见的。
// 根据你的函数返回的长度, 它会打印出数组中该长度范围内的所有元素。
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```



#### 自实现

```java
public int removeElement(int[] nums, int val) {
    	//如果数组中没有元素或者数组中只有一个元素且元素是要删除的元素，返回0
		if(nums.length<=0 || (nums.length==1 && nums[0]==val)) {
			return 0;
		}
		int res=0;//记录复合条件的元素个数
		int preres=0;//记录排序后待删除元素之前元素的个数
		int head=0;
    	//先对给定的数组进行从小到大排序
		for(int i=0;i<nums.length-1;i++) {
			for(int j=i+1;j<nums.length;j++) {
				if(nums[i]>nums[j]) {
					int merge=nums[i];
					nums[i]=nums[j];
					nums[j]=merge;
				}
			}
		}
    	//查找要删除元素在数组中的第一个位置，赋值给head
		for(int i=0;i<nums.length;i++) {
			if(nums[i]==val) {
				head=i;
				preres=i;
				break;
			}
		}
    	//从head索引开始，把后边不需要删除的元素前移
		for(int i=head;i<nums.length;i++) {
			if(nums[i]!=val) {
				int merge=nums[head];
				nums[head]=nums[i];
				nums[i]=merge;
				res++;
				head++;
			}
		}
		return res+preres;
        
    }
```



#### 方法一

```java
public int removeElement(int[] nums, int val) {
    int i = 0;
    for (int j = 0; j < nums.length; j++) {
        if (nums[j] != val) {
            nums[i] = nums[j];
            i++;
        }
    }
    return i;
}
/*
我们可以保留两个指针 i 和 j，其中 i 是慢指针，j 是快指针。
当nums[j] 与给定的值相等时，递增j以跳过该元素。只要 nums[j]!=val，我们就复制nums[j]到nums[i] 并同时递增两个索引。重复这一过程，直到j到达数组的末尾，该数组的新长度为i。
*/
//时间复杂度：O(n)， 假设数组总共有n个元素，i和j至少遍历2n步。
//空间复杂度：O(1)
```



### 插入位置

```
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
你可以假设数组中无重复元素。
```

```
输入: [1,3,5,6], 5
输出: 2

输入: [1,3,5,6], 2
输出: 1

输入: [1,3,5,6], 7
输出: 4

输入: [1,3,5,6], 0
输出: 0
```

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        //遍历数组，如果有目标值，返回索引位置
        for(int i=0;i<nums.length;i++) {
            if(nums[i]==target)
                return i;
        }
        //如果数组中没有目标值
        for(int j=0;j<nums.length;j++) {
            //如果J位置的元素大于目标值，那就应该把目标值放在J的位置
            if(nums[j]>target) {
                return j;
            }
        }
        //否则把目标值放到最后
        return nums.length;
    }
}
```



### 最大子序和

```
给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
```

```java
class Solution {
    public int maxSubArray(int[] nums) {
    	//假设最大和为第一个数
        int max = nums[0];
        //定义一个存储累加和的容器，赋值为0
        int res = 0;
        int length = nums.length;
        //遍历数组
        for (int i = 0;i < length;i++) {
            //累加
            res += nums[i];
            //如果累加的和比第i个数还小，则把第i个数作为当前最大和
            if (nums[i] > res) {
                res = nums[i];
            }
            //用比较函数求两个数的最大值
            max = Math.max(max,res);
            /*
            和数学函数等效代替，但是数学函数更快
            if(res>max) {
            	max=res;
            }
            */
        }
        return max;
    }
}
```

```
[-2,1,-3,4,-1,2,1,-5,4]

第一次：res=0,max=-2。-2+1=-1,-1和1比较大小1大。res=1,max=1。
第二次：res=1,max=1。1-3=-2，-2和-3比较大小-2大。res=-2,max=1。
第三次：res=-2,max=1。-2+4=2，2和4比较大小4大。res=4，max=4。
第四次：res=4，max=4。4-1=3，3和-1比较大小3大。res=3，max=4。
第五次：res=3，max=4。3+2=5，5和2比较大小5大。res=5，max=5。
第六次：res=5，max=5。5+1=6，6和1比较大小6大。res=6，max=6。
第七次：res=6，max=6。6-5=1，1和-5比较大小1大。res=1，max=6。
第八次：res=1，max=6。1+4=5，5和4比较大小5大。res=5，max=6。

复杂度为：O（n）
```



### 加一

```
给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位， 数组中每个元素只存储一个数字。

你可以假设除了整数 0 之外，这个整数不会以零开头。
```

```
输入: [1,2,3]
输出: [1,2,4]
解释: 输入数组表示数字 123。

输入: [4,3,2,1]
输出: [4,3,2,2]
解释: 输入数组表示数字 4321。
```

```java
class Solution {
    public int[] plusOne(int[] digits) {
        //数组最后一位数执行加一操作
		digits[digits.length-1]=digits[digits.length-1]+1;
        //从数组最后一位，也就是个位数开始，检测是否大于等于10了
        for(int i=digits.length-1;i>=0;i--) {
            //如果是最高位的数大于等于10
        	if(i==0 && digits[i]>=10) {
                //把当前位重置为零
        		digits[i]=0;
                //新建一个比原来数组容积大一的新数组
        		int[] newdigits=new int[digits.length+1];
                //新数组的最高位为1
        		newdigits[0]=1;
                //把旧数组的元素转移到新数组，从新数组的第二个位置开始
        		for(int j=0;j<digits.length;j++) {
        			newdigits[j+1]=digits[j];
        		}
                //返回新数组
        		return newdigits;
        	}//如果不是最高位大于等于10
        	else if(digits[i]>=10 && i!=0) {
                //把当前位数字重置为零，高一位的数字执行加一操作
        		digits[i]=0;
        		digits[i-1]++;
        	}
        }
		return digits;
    }
}
```

