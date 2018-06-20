// don't involve extension UI and html page UI
// only used as a service
'use strict';

let enabled = false;

let frameId = new Map();


function sendMessageToFrame(destination, message, callback){
  let videoConverterFrameId = frameId.get(destination);
  if(videoConverterFrameId || videoConverterFrameId == 0){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, { frameId:videoConverterFrameId}, function(response) {
        callback(response);
      });
    });
  }else{
    callback({status: "fail", reason: "destination not found"});
  }
}
// background events
// 1. installed/update to a new version
// 2. content script (or other extension) sends a message
// 3. register on an event
chrome.runtime.onInstalled.addListener(function() {
  // invoked when this extension is installed
  console.log('installed');
  enabled = false;
  // rules 
  const rule = {
    conditions:[
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl:{hostEquals: 'rapidvideo.com'}
      })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction() ]
  };
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // undefinded means removing all rules
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if(changeInfo.url && changeInfo.url.indexOf('/content/')){
    sendMessageToFrame("content", {request: "content page"}, function(response){
      console.log(response);
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  // console.log(request, sender);
  if(request){
    switch(request.request){
      case "register":{
        frameId.set(request.name, sender.frameId);
        console.log(frameId);
        sendResponse({status:"success"});
        // 
        if(request.name === "videoConverter"){
          sendMessageToFrame('content', {request: "videoConverter is ready"}, function(response){
            console.log(response)
          });
        }
      };break;

      case "updatingVideoFrame": {
        sendMessageToFrame("videoConverter", request, function(response){
          sendResponse(response);
        });    
      };break;
      default: break;
    }
  }
  sendResponse({enable: enabled});
});

chrome.runtime.onConnect.addListener(function (port){
  if(port.name == 'popup'){
    port.onMessage.addListener(function (msg){
      enabled = msg.enabled;
      port.postMessage({result:'success'});
    });
  }
});