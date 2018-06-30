'use strict';

let videoUrl; 
let posterUrl; 
let videoDomain; 
let isShow = false;
const support_video_domains = ["rapidvideo.com", "www.fembed.com", "openload.co"];
const domain2addr = {};
domain2addr["rapidvideo.com"] = "rapidvideo_converter";
domain2addr["www.fembed.com"] = "fembed_converter";
domain2addr["openload.co"] = "openload_converter";

const containerPages = {};
containerPages["rapidvideo.com"] = "https://www.rapidvideo.com/e";
containerPages["www.fembed.com"] = "https://www.fembed.com/v";
containerPages["openload.co"] = "https://openload.co/embed";
const title = "[Content]";
// register 
chrome.runtime.sendMessage({from: "content", to:"background", request: "register"}, function(response) {
    console.log('[Content] register', response);
});
setInterval(()=>{
    chrome.runtime.sendMessage({from: "content", to:"background", request: "heartbeat"}, function(response) {
        console.log('[Content] heartbeat', response);
    });
},6000);



function updateVideoPlayerFrameSize(width, height){
    $('#extensionVideoPlayerFrame').width(width);
    $('#extensionVideoPlayerFrame').height(height);
}
function addNotAvailable(){
    $('#extensionPlayer').append(`<button id="extensionPlayerBtn" disabled class="btn btn-primary">${videoDomain} Not Supported</button>`);
}

function addTrigger(){
    
    $('#extensionPlayer').append(`<button id="extensionPlayerBtn" disabled class="btn btn-primary">Play ${videoDomain}</button>`);
    $('#extensionPlayer').append(`<div id="extensionPlayerDiv"></div>`)
    //$('#extensionPlayerBtn').click(function(event){
        
        $('#extensionPlayerDiv').empty();
        let url = containerPages[videoDomain]; // provide default value
        
        if(url){
            // create iframe
            $('<iframe>', {
                id: 'extensionVideoPlayerFrame',
                allowfullscreen: true,
                src: url,
                frameborder: 0,
                width:0,
                height:0,
            }).appendTo('#extensionPlayerDiv'); 
        }
    $('#extensionPlayerBtn').click(function(event){
        if(isShow){
            let dest = domain2addr[videoDomain];
            if(dest){
                chrome.runtime.sendMessage({from: "content", to:dest, request: "hide"}, function(response) {
                    if(response.status === "success"){
                        updateVideoPlayerFrameSize("0px", "0px");
                    }
                });
            }
        }else{
            let dest = domain2addr[videoDomain];
            if(dest){
                chrome.runtime.sendMessage({from: "content", to:dest, request: "show"}, function(response) {
                    if(response.status === "success"){
                        updateVideoPlayerFrameSize("640px","300px");
                    }
                });
            }
        }
        isShow = !isShow;
    });
}
function removeWatchBtn(){
    $('#watchBtn').remove();
}
function run(){
    if(document.getElementById('extensionPlayerBtn')){
        return;
    }
    console.log(`Extension Content Script`);
    videoUrl = $('#e-videoUrl').html();
    posterUrl = $('#e-posterUrl').html();
    videoDomain = $('#e-videoDomain').html();
    if(support_video_domains.indexOf(videoDomain) !== -1){
        
        addTrigger();
        //removeWatchBtn();
    }else{
        addNotAvailable();
    }
}

// directly enter /content/xx, or refresh
$(document).ready(()=>{
    $('body').append('<div id="extension-mounting-point"></div>');
    $('#extension-mounting-point').click(()=>{
        run();
    });
    /*if(location.href.indexOf('/content/') !== -1){
       run(); 
    }*/
});



// listen ***_converter.js ready
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request){
        switch(request.request){
            case "converter ready":{
                console.log(`${title} ${request.from} is ready`);
                sendResponse({videoUrl: videoUrl, posterUrl: posterUrl});
                
            };break;

            case "converter done":{
                $('#extensionPlayerBtn').attr('disabled', false);
            };break;

            case "converter error":{
                $('#extensionPlayerBtn').text('Not Available!');
                $('#extensionPlayerBtn').attr('disabled', true);
                sendResponse({status: "success"});
            };break;

            case "run":{
                // message from background when tab.updated
                //run();
                /*$('body').append('<div id="extension-mounting-point"></div>');
                $('#extension-mounting-point').click(()=>{
                    run();
                });*/
                sendResponse({status:"success"});
            };break;
            default: break;
        }
    }
    sendResponse({});
});

/***
 * content script automatically create buttons and create video frame,
 * ***_converter.js send "converter ready" or "converter error" after load the container page, content script ack {videoUrl and posterUrl};
 * ***_converter.js start converting, then send "converter done" or "converter error". 
 * After that content script can send "show" at any time, ***_converter.js should show
 */