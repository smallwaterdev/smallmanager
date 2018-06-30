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
let address_record = {};
/**
 * {
 *  "windowId":
 *    {
 *       "tabId":
 *          {
 *            "frameId":
 *          } 
 *    }
 * }
 */
function update_address_record(sender, name){
  let tab = sender.tab;
  let window_addr = address_record[tab.windowId];
  if(window_addr !== undefined){
    if(window_addr[tab.index] !== undefined){
      window_addr[tab.index][name] = sender.frameId;
    }else{
      window_addr[tab.index] = {};
      window_addr[tab.index][name] = sender.frameId;
    }
  }else{
    address_record[tab.windowId] = {};
    address_record[tab.windowId][tab.index] = {};
    address_record[tab.windowId][tab.index][name] = sender.frameId;
  }
}
function get_address_frame(windowId, index, name){
  let window_ = address_record[windowId];
  if(window_ !== undefined){
    let tab_ = window_[index];
    if(tab_ !== undefined){
      let frameId = tab_[name];
      if(frameId !== undefined){
        return frameId;
      }
    }
  }
  return null;
}
// let valid_destination = ["background", "content", "rapidvideo_converter"];

function sendMessageToFrame(sender, to, message, callback){
  /*let query_condition = {
    windowId: sender.tab.windowId,
    index: sender.tab.index,
  };*/
  let frameId = get_address_frame(sender.tab.windowId, sender.tab.index, to);
  if(frameId !== null){
    //chrome.tabs.query(query_condition, function(tabs) {
      chrome.tabs.sendMessage(sender.tab.id, message, { frameId:frameId}, callback);
    //});
  }else{
    callback({status: "fail", reason: `destination ${to} not found`});
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
 
  if(request){
    switch(request.request){
      case "register":{
        update_address_record(sender, request.from);
        console.log(`${title} Register ${request.from} is registered with window id ${sender.tab.windowId} tab index ${sender.tab.index} frame id ${sender.frameId}`);
        sendResponse({status:"success"});
      };break;
      case "heartbeat":{
        update_address_record(sender, request.from);
        console.log(`${title} Heartbeat ${request.from} is registered with window id ${sender.tab.windowId} tab index ${sender.tab.index} frame id ${sender.frameId}`);
        sendResponse({status:"success"});
      }
      default: {
        sendMessageToFrame(sender, request.to, request, sendResponse);
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
/*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if(changeInfo.url && changeInfo.url.indexOf('/content/') !== -1){
    let data = changeInfo.url.split('/');
    if(data[data.length - 1] !== ""){
      chrome.tabs.query({active: true}, function(tabs) {
        tabs.forEach(tab=>{
          chrome.tabs.sendMessage(tab.id,  {from: 'background', to:'content', request: 'run'}, function(response){
            console.log(`${title} Send converting request to content ${tab.id}`);
          });
        });
      });
    }
  }
});*/