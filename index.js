var rdecodeEntity = /&quot;|&lt;|&gt;|&amp;|&nbsp;|&apos;|&#(\d+);|&#(\d+)/g;
var rhtmlSpace = /\u00a0/g;
var decodeEntities = {
        '&quot;':'"',
        '&apos;': '\'',
        '&lt;':'<',
        '&gt;':'>',
        '&amp;':'&',
        '&nbsp;':' '
   };

function fdecodeEntity(matched, charCode, lastCharCode) {
    if (!charCode && !lastCharCode) {
        return decodeEntities[matched] || matched;
    }
    return String.fromCharCode(charCode || lastCharCode);
}

function decodeHTML(html) {
    return html ? html.replace(rdecodeEntity, fdecodeEntity).replace(rhtmlSpace, ' ') : '';
}

function HTMLParser(html) {
	if (!(this instanceof HTMLParser)) {
		return new HTMLParser(html);
	}
	var elements = this._elements = [];
	var rawElements = [];
	var tagElements = this._tagElements = {};
	var idElements = this._idElements = {};
	
	html = html || '';
	html.replace(/(<([\w-]+)[^>]*(\/)?>)|(<\/([\w-]+)[^>]*>)/g, 
			function(all, startTag, startTagName, selfClosing, 
					endTag, endTagName, index) {
		if (startTagName) {
			(selfClosing ? elements : rawElements).push({
				tagName: startTagName.toUpperCase(),
				startIndex: index,
				selfClosing: !!selfClosing,
				tagContent: startTag
			});
			
			return;
		} 
		
		var startTagIndex = lastIndexOfTagName(rawElements, endTagName.toUpperCase());
		if (startTagIndex == -1) {
			return;
		}
		
		setElement(rawElements[startTagIndex], index, endTag.length);
		for (var i = rawElements.length - 1; i > startTagIndex; i--) {
			setElement(rawElements[i], index);
		}
		
		rawElements = rawElements.slice(0, startTagIndex);
	});
	
	var htmlLength = html.length;
	for (var i = 0, len = rawElements.length; i < len; i++) {
		setElement(rawElements[i], htmlLength);
	}
	
	function setElement(elem, endIndex, endTagLength) {
		elem.endIndex = endIndex + (endTagLength || 0);
		elem.outerHTML = html.substring(elem.startIndex, elem.endIndex);
		elem.innerHTML = html.substring(elem.startIndex + elem.tagContent.length, endIndex);
		setAttributes(elem);
		elements.push(elem);
	}
	
	function setAttributes(elem) {
		var attributes = elem.attributes = {};
		if (/<[\w-]+([^>]+)\/?>/.test(elem.tagContent)) {
			RegExp.$1.replace(/([\w-]+)=((['"])([\w\W]*?)\3|([^\s]*))/g, function() {
				attributes[arguments[1]] = decodeHTML(arguments[4] || arguments[5]);
			});
		}
	}
	
	elements.forEach(function(elem) {
		var attrs = elem.attributes;
		if (attrs.id) {
			elem.id = attrs.id;
			idElements[attrs.id] = elem;
		}
		
		if (attrs['class']) {
			elem.className = attrs['class'].split(/\s+/g);
		} 
		
		var elems = tagElements[elem.tagName];
		if (elems) {
			elems.push(elem);
		} else {
			tagElements[elem.tagName] = [elem];
		}
	});
	
}

HTMLParser.decode = decodeHTML;

var proto = HTMLParser.prototype;

proto.getElementsByTagName = function(tagName) {
	return this._tagElements[tagName && tagName.toUpperCase()] || [];
};

proto.getElementsByClassName = function(className, tagName) {
	var result = [];
	tagName = tagName && tagName.toUpperCase();
	var elems = this._tagElements[tagName];
	if (!tagName && !elems) {
		elems = this._elements;
	}
	
	if (elems && className) {
		elems.forEach(function(elem) {
			if (elem.className && elem.className.indexOf(className) != -1) {
				result.push(elem);
			}
		});
	}
	
	return result;
};


proto.getElementById = function(id) {
	
	return this._idElements[id];
};

function lastIndexOfTagName(elements, tagName) {
	for (var i = elements.length - 1; i > -1; i--) {
		if (elements[i].tagName == tagName) {
			return i;
		}
	}
	
	return -1;
}

module.exports = HTMLParser;