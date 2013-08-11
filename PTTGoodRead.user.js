// ==UserScript==
// @name        PTTGoodRead
// @namespace   http://www.ptt.cc/bbs/*
// @include     http://www.ptt.cc/bbs/*
// @version     0.1.1
// @grant       none
// ==/UserScript==

// custom variable
// http://www.csscompressor.com/
var insertCSS = '#overlay{position:fixed;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:-999}#overlay.activeLightbox{z-index:999}#mainContainer{width:100%}#mainContainer.activeLightbox{position:fixed}.lightbox{text-decoration:none;border:none;background:none}.lightbox:hover{background:none}';

// declare variable
var PTTGoodRead = {},
    addLightboxNode = [],
    toArray = function (obj) {
      return Array.prototype.slice.call(obj, 0);
    },
    links,
    matchedNode,
    showLightbox;

showLightbox = function (event) {
  
}

// Convert array-like object into native array. For performance and additional method.
links = toArray( document.querySelectorAll('#mainContent a') );

// find out image links
matchedNode = links.filter(function (element) {
  var nextElement = element.nextSibling;
  while (nextElement.nodeType !== Node.ELEMENT_NODE) nextElement = nextElement.nextSibling;
  if (nextElement.className.match('richcontent')) {
    addLightboxNode.push(nextElement);
    return false;
  }
  return element.href.match(/(jpg|png|gif|bmp|imgur.*)$/i);
});

// generate <img> and <a> for image links.
matchedNode.forEach(function (element) {
  var url = element.href;
  var insertHTML = '<div class="richcontent">' +
                     '<a href="' + url + '" alt="image link" target="_blank" rel="nofollow" class="lightbox">' +
                       '<img src="' + ( url.match(/\/imgur/i) ?
                       url.replace(/imgur\.com\/(\w+)/, 'i.imgur.com/$1.jpg') : url) +
                       '" onerror="PTTGoodRead.handleErrorImg(event, this)">' +
                     '</a>' +
                   '</div>';
  element.insertAdjacentHTML('afterend', insertHTML);
});

// add <a> to div.richcontent
addLightboxNode.forEach(function (element) {
  var imgSrc = element.innerHTML.match(/src="([^"]+)"/i)[1];
  element.innerHTML = '<a href="' + imgSrc + '" alt="image link" target="_blank" rel="nofollow" class="lightbox">' +
                        '<img src="' + imgSrc + '" onerror="PTTGoodRead.handleErrorImg(event, this)">' +
                      '</a>';
});

/*
// insert a layer for lightbox
document.body.insertAdjacentHTML('afterbegin', '<div id="overlay"><div id="lightbox"></div></div>');
*/
// insert CSS rule before </body>
document.body.insertAdjacentHTML('beforeend', '<style>' + insertCSS + '</style>');
/*
Array.prototype.slice.call(document.querySelectorAll('a.lightbox'), 0).forEach(function (e) {
  e.addEventListener('click', showLightbox);
});
*/