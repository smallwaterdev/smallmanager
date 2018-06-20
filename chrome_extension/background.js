// don't involve extension UI and html page UI
// only used as a service
'use strict';

let enabled = false;
const title = "[Background]";
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
        pageUrl:{hostEquals: 'localhost'}
      })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction() ]
  };
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // undefinded means removing all rules
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});


///////////////////////////////// message delivering service ///////////////////////////
let frameId = new Map();

let valid_destination = ["background", "content", "rapidvideo_converter"];

function sendMessageToFrame(to, message, callback){
  let videoConverterFrameId = frameId.get(to);
  if(videoConverterFrameId || videoConverterFrameId === 0){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, { frameId:videoConverterFrameId}, callback);
    });
  }else{
    callback({status: "fail", reason: `destination ${to} not found`});
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
 
  if(request){
    switch(request.request){
      case "register":{
        frameId.set(request.from, sender.frameId);
        console.log(`${title} ${request.from} is registered with frame id ${sender.frameId}`);
        sendResponse({status:"success"});
        
      };break;
      case "heartbeat":{
        frameId.set(request.from, sender.frameId);
        // console.log(`${title} ${request.from} is registered with frame id ${sender.frameId}`);
        sendResponse({status:"success"});
      }
      default: {
        // forward
        sendMessageToFrame(request.to, request, sendResponse);
        return true;
      };break;
    }
  }
});

/*chrome.runtime.onConnect.addListener(function (port){
  if(port.name == 'popup'){
    port.onMessage.addListener(function (msg){
      enabled = msg.enabled;
      port.postMessage({result:'success'});
    });
  }
});*/
/////////////////////// Monitor url change ////////////////////
/**
 * because we use angular : a single page application will not trigger the content script to run
 * so the content script has to run on any url, the below code will monitor the url change, and trigger
 * content script at correct time.
 * 
 * * The event is not triggered in the first loading.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if(changeInfo.url && changeInfo.url.indexOf('/content/') !== -1){
    let data = changeInfo.url.split('/');
    if(data[data.length - 1] !== ""){
      console.log(`${title} Content run`);
      sendMessageToFrame('content', {from: 'background', to:'content', request: 'run'}, function(response){
        console.log(response);
      });
    }
  }
});