// 获取搜索框、搜索按钮、清空搜索、结果输出对应的元素
var searchBtn = document.querySelector('.search-start');
var searchClear = document.querySelector('.search-clear');
var searchInput = document.querySelector('.search-input');
var searchResults = document.querySelector('.search-results');

// 申明保存文章的标题、链接、内容、标签/分类的数组变量
var searchValue = '',
    arrItems = [],
    arrContents = [],
    arrLinks = [],
    arrTitles = [],
    arrCategories = [],
    arrResults = [],
    indexItem = [];
var tmpDiv = document.createElement('div');
tmpDiv.className = 'result-item';

// ajax 的兼容写法
var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        xml = xhr.responseXML;
        arrItems = xml.getElementsByTagName('item');

        // 遍历并保存所有文章对应的标题、链接、内容、标签/分类到对应的数组中
        for (i = 0; i < arrItems.length; i++) {
            arrContents[i] = arrItems[i].getElementsByTagName('description')[0].childNodes[0].nodeValue;
            arrLinks[i] = arrItems[i].getElementsByTagName('link')[0].childNodes[0].nodeValue.replace(/\s+/g, '');
            arrTitles[i] = arrItems[i].getElementsByTagName('title')[0].childNodes[0].nodeValue;

            // 收集 <category> 中的标签与分类，合并为字符串，便于检索
            var cateNodeList = arrItems[i].getElementsByTagName('category');
            var cateTextArr = [];
            for (var j = 0; j < cateNodeList.length; j++) {
                if (cateNodeList[j].childNodes[0]) {
                    cateTextArr.push(cateNodeList[j].childNodes[0].nodeValue);
                }
            }
            arrCategories[i] = cateTextArr.join(' ');
        }
    }
}

// 开始获取根目录下 feed.xml 文件内的数据
xhr.open('get', '/feed.xml', true);
xhr.send();

searchBtn.onclick = searchConfirm;

// 清空按钮点击函数
searchClear.onclick = function(){
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchClear.style.display = 'none';
}

// 输入框内容变化后就开始匹配，可以不用点按钮
searchInput.onkeydown = function () {
    setTimeout(searchConfirm, 0);
}
searchInput.onfocus = function () {
    searchResults.style.display = 'block';
}

function searchConfirm() {
    if (searchInput.value == '') {
        searchResults.style.display = 'none';
        searchClear.style.display = 'none';
    } else if (searchInput.value.search(/^\s+$/) >= 0) {
    
        // 检测输入值全是空白的情况
        searchInit();
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '请输入有效内容...';
        searchResults.appendChild(itemDiv);
    } else {
    
        // 合法输入值的情况
        searchInit();
        searchValue = searchInput.value;
        searchMatching(searchValue);
    }
}

// 每次搜索完成后的初始化
function searchInit() {
    arrResults = [];
    indexItem = [];
    searchResults.innerHTML = '';
    searchResults.style.display = 'block';
    searchClear.style.display = 'block';
}

function searchMatching(input) {

    // 在标题、摘要和标签/分类中综合匹配查询值
    for (i = 0; i < arrTitles.length; i++) {
        var composite = (arrTitles[i] + ' ' + arrContents[i] + ' ' + arrCategories[i]).toLowerCase();
        var keyword = input.toLowerCase();
        var hitIndex = composite.indexOf(keyword);
        if (hitIndex !== -1) {
            indexItem.push(i);

            // 优先在标题中截取高亮片段
            var displayText = arrTitles[i];
            var titleIndex = arrTitles[i].toLowerCase().indexOf(keyword);
            if (titleIndex !== -1) {
                displayText =
                    arrTitles[i].slice(0, titleIndex) +
                    '<mark>' +
                    arrTitles[i].slice(titleIndex, titleIndex + input.length) +
                    '</mark>' +
                    arrTitles[i].slice(titleIndex + input.length);
            } else {
                // 若标题未命中，则在摘要或标签中截取一小段上下文
                var contextSource = (arrContents[i] + ' ' + arrCategories[i]);
                var contextIndex = contextSource.toLowerCase().indexOf(keyword);
                var start = Math.max(0, contextIndex - 20);
                var end = Math.min(contextSource.length, contextIndex + input.length + 20);
                var snippet = contextSource.slice(start, end);
                snippet = snippet.replace(new RegExp(input, 'ig'), function (match) {
                    return '<mark>' + match + '</mark>';
                });
                displayText = snippet;
            }

            arrResults.push(displayText);
        }
    }

    // 输出总共匹配到的数目
    var totalDiv = tmpDiv.cloneNode(true);
    totalDiv.innerHTML = '总匹配：<b>' + indexItem.length + '</b> 项';
    searchResults.appendChild(totalDiv);

    // 未匹配到内容的情况
    if (indexItem.length == 0) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '未匹配到内容...';
        searchResults.appendChild(itemDiv);
    }

    // 将所有匹配内容进行组合
    for (i = 0; i < arrResults.length; i++) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerHTML = '<b>《' + arrTitles[indexItem[i]] +
            '》</b><hr />' + arrResults[i];
        itemDiv.setAttribute('onclick', 'changeHref(arrLinks[indexItem[' + i + ']])');
        searchResults.appendChild(itemDiv);
    }
}

function changeHref(href) {

    // 在当前页面点开链接的情况
    location.href = href;

    // 在新标签页面打开链接的代码，与上面二者只能取一个，自行决定
    // window.open(href);
}