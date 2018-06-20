'use strict';
console.log("videoconverter_converter boot");


let posterurl = '';
let video_player;


let resolutions = [];
let mp4urls = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request){
        switch(request.request){
            case "show":{
                video_player.play();
                sendResponse({status: "success"});
            };break;

            case "hide":{
                video_player.pause();
                sendResponse({status: "success"});
            };break;

            default: break;
        }
    }else{
        sendResponse({status:"failed"});
    }
});


$('html').empty();
$('<head>').appendTo('html');
$('<body>').appendTo('html');
// register 
chrome.runtime.sendMessage({from: addr, to: "background", request: "register"}, function(response) {
    console.log(`${title} ${response['status']}: register done`);
});
$(document).ready(()=>{
    chrome.runtime.sendMessage({from: addr, to: "content", request: "converter ready"}, function(response) {
        console.log(`${title} Converting ${response['videoUrl']}`);
        posterurl = response['posterUrl'];
        frameUrl2DynamicMp4Urls(response['videoUrl'], function(err, resols,  mp4Urls){
            
            if(err || resols.length === 0){
                chrome.runtime.sendMessage({from: addr, to: "content", request: "converter error"}, function(response){
                    console.log(`${title} Converting failed`)
                });
            }else{
                console.log(`${title} Get videos`, mp4Urls);
                resols.sort((a,b)=>{return a - b});
                mp4urls = mp4Urls;
                resolutions = resols;
                
                resolutions.forEach(function (resolution){
                    $('#resol').append(`<button class="select_resol" type="button">${resolution}</button>`)
                });
                $('#videoblock').append(`
                    <video id="videojs-player" poster="${posterurl}" class="video-js" controls preload="auto" width="100%" data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2, 4, 8] }'>
                        <source id="video-core" src='${mp4urls[resolutions[0]]}' type='video/mp4'>
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                        </p>
                    </video>
                `)
                
                let current_resol = resolutions[0];
                video_player = videojs('videojs-player');
                $('.select_resol').click(function(evt){
                    if(evt.target.innerHTML !== current_resol.toString()){
                        current_resol = evt.target.innerHTML;
                        console.log(`${title} update to different resolution ${current_resol} ${mp4urls[evt.target.innerHTML]}`);
                        video_player.src({type: 'video/mp4', src: mp4urls[evt.target.innerHTML]});
                        
                    }
                });

                chrome.runtime.sendMessage({from: addr, to: "content", request: "converter done"}, function(response) {
                    console.log(`${title} converting done`);
                });
            }
        });
        
    });
});

$('body').append(`
    <div id="resol"></div>
    <div id="videoblock"></div>
`);




