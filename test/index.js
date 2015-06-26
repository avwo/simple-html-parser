var HTMLParser = require('../index');
var html = '<span class="test1 test2"></span><div id="test"><div><input test="a" /></div>'
var document = HTMLParser(html);

//通过id获取元素，如果id对应的元素不存在，则返回 `null`
console.log(document.getElementById('test')); 

//通过标签获取元素列表，如果对应的元素不存在，则返回 `[]`
console.log(document.getElementsByTagName('div')); 

//通过className获取元素列表，如果对应的元素不存在，则返回 `[]`。
//其中tagName可选，className不支持复合标签
//如何处理复合标签： 获取对应的elem，再elem = new HTMLParser(elem.innerHTML);
console.log(document.getElementsByClassName('test2')); 