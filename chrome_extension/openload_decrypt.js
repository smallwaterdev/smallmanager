'use strict';
const title = "[Openload decrypt]"
const addr = "opeload_decrypt";
console.log("openload_decrypt boot 2");
// register 
chrome.runtime.sendMessage({from: addr, to:"background", request: "register"}, function(response) {
    console.log(`${title} registered`);
    chrome.runtime.sendMessage({from: addr, to: "openload_converter", request: "done", url:$('#nowrunning').html() }, function(response) {
        console.log(`${title} done ${$('#nowrunning').html()}`);
    });
});
/*$('html').empty();
$('<head>').appendTo('html');
$('<body>').appendTo('html');*/
