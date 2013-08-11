// ==UserScript==
// @name        PTTGoodRead
// @namespace   http://www.ptt.cc/bbs/*
// @include     http://www.ptt.cc/bbs/*
// @version     0.1 alpha
// @grant       none
// ==/UserScript==

// custom variable
var insertCSS = '#overlay{position:fixed;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:-999}#overlay.activeLightbox{z-index:999}#mainContainer{width:100%}#mainContainer.activeLightbox{position:fixed}.lightbox{text-decoration:none;border:none;background:none}.lightbox:hover{background:none}';

// declare variable
var a, matchedNode, showLightbox, PTTGoodRead = {}, addLightboxNode = [];

showLightbox = function () {
  console.log(arguments);
}

PTTGoodRead.init = function () {
  console.log(window.$);
}

a = document.querySelectorAll('#mainContent a');
// Convert array-like object into native array. For performance and additional method.
a = Array.prototype.slice.call(a, 0);

// find out image links
matchedNode = a.filter(function (e) {
  var nextElement = e.nextSibling;
  while (nextElement.nodeType !== Node.ELEMENT_NODE) nextElement = nextElement.nextSibling;
  if (nextElement.className.match('richcontent')) {
    addLightboxNode.push(nextElement);
    return false;
  }
  return e.href.match(/(jpg|png|gif|bmp|imgur.*)$/i);
});

// generate <img> and <a> for image links.
matchedNode.forEach(function (e) {
  var url = e.href;
  var insertHTML = '<div class="richcontent">' +
                     '<a href="' + url + '" alt="image link" target="_blank" rel="nofollow" class="lightbox">' +
                       '<img src="' + ( url.match(/\/imgur/i) ?
                       url.replace(/imgur\.com\/(\w+)/, 'i.imgur.com/$1.jpg') : url) +
                       '" onerror="PTTGoodRead.handleErrorImg(event, this)">' +
                     '</a>' +
                   '</div>';
  e.insertAdjacentHTML('afterend', insertHTML);
});

// add <a> to div.richcontent
addLightboxNode.forEach(function (e) {
  var imgSrc = e.innerHTML.match(/src="([^"]+)"/i)[1];
  e.innerHTML = '<a href="' + imgSrc + '" alt="image link" target="_blank" rel="nofollow" class="lightbox">' +
                  '<img src="' + imgSrc + '" onerror="PTTGoodRead.handleErrorImg(event, this)">' +
                '</a>';
});

// insert a layer for lightbox
document.body.insertAdjacentHTML('afterbegin', '<div id="overlay"><div id="lightbox"><img id="lightboxImg" src=""></div></div>');

// insert CSS rule before </body>
document.body.insertAdjacentHTML('beforeend', '<style>' + insertCSS + '</style>');

Array.prototype.slice.call(document.querySelectorAll('a.lightbox'), 0).forEach(function (e) {
  e.addEventListener('click', showLightbox);
});