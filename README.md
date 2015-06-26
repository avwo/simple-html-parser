# simple-html-parser
node实现的简单高效的html文档解析工具。

# Installation

	$ npm i simple-http-parser

# Example

	var HTMLParser = require('simple-http-parser');
	var html = '<span class="test1 test2"></span><div id="test"><div><input test="a" /></div>'
	var document = new HTMLParser(html);
	
	//通过id获取元素，如果id对应的元素不存在，则返回 `null`
	console.log(document.getElementById('test')); 
	
	//通过标签获取元素列表，如果对应的元素不存在，则返回 `[]`
	console.log(document.getElementsByTagName('div')); 

	//通过className获取元素列表，如果对应的元素不存在，则返回 `[]`。
	//其中tagName可选，className不支持复合标签
	//如何处理复合标签： 获取对应的elem，再elem = new HTMLParser(elem.innerHTML);
	console.log(document.getElementsByClassName('test2'[, tagName])); 

	//获取的元素结构

	{
		id: [string],
		innerHTML: [string],
		outerHTML: [string],
		attributes: [object],
		className: [array],
	}

	
	HTMLParser.decode(html); //把&nbsp;等实体字符编码转成实体字符
