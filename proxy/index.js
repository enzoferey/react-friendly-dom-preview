var express = require('express');
var app = express();
const request = require('request');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function toJSON(node) {
	node = node || this;
  var obj = {
    nodeType: node.nodeType
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else
  if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  var attrs = node.attributes;
  if (attrs) {
    var length = attrs.length;
    var arr = obj.attributes = new Array(length);
    for (var i = 0; i < length; i++) {
      attr = attrs[i];
      arr[i] = [attr.nodeName, attr.nodeValue];
    }
  }
  var childNodes = node.childNodes;
  if (childNodes) {
    length = childNodes.length;
    arr = obj.childNodes = new Array(length);
    for (i = 0; i < length; i++) {
      arr[i] = toJSON(childNodes[i]);
    }
  }
  return obj;
}

app.get('/', function (req, res) {
  var url = req.query.url;
  console.log(url);
  request(url, function (error, response, html) {    
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(html);
      let links = dom.window.document.querySelectorAll('a');
      console.log("<a>", links.length);
      for(let i = 0; i < links.length; i++) {
         if (!/http/.test(links[i].href) && !/mailto/.test(links[i].href)) {
           links[i].href = `${url}/${links[i].href}`;
         }
      }
      links = dom.window.document.querySelectorAll('link');
      console.log("<link>", links.length);
      for(let i = 0; i < links.length; i++) {
         if (!/http/.test(links[i].href)) {
           links[i].href = `${url}/${links[i].href}`;
         }
      }
      links = dom.window.document.querySelectorAll('img');
      console.log("<img>", links.length);
      for(let i = 0; i < links.length; i++) {
         if (!/http/.test(links[i].src)) {
           links[i].src = `${url}/${links[i].src}`;
         }
      }
      links = dom.window.document.querySelectorAll('script');
      console.log("<script>", links.length);
      for(let i = 0; i < links.length; i++) {
         if (links[i].src && !/http/.test(links[i].src)) {
           links[i].src = `${url}/${links[i].src}`;
         }
      }
      
      /*links = dom.window.document.querySelectorAll("*");
      const size = links.length;
      const noRender = [ "HTML", "HEAD", "META", "TITLE", "LINK", "SCRIPT" ];
      let body = null;
      console.log("all", size);
      for(let i = 0; i < size; i++) {
      	console.log(links[i].tagName);
      	if(noRender.indexOf(links[i].tagName) === -1) {
      		links[i].setAttribute("data-preview-id", "habak");
        	//if(i > 0 && i < size - 1)
        		//links[i].insertAdjacentHTML("afterend", "::-next-::");
      	}

      	// Get body
      	if(links[i].tagName === "BODY") body = links[i];
      }*/
      
      res.send(dom.serialize());
    }
  });
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
