'use strict';
console.log("openload_converter boot");
const title="[Openload]";

/**
 * 
 * @param {frameUrl} e.g. https://www.fembed.com/v/y40oxnqyv83
 * @param {*} callback (err, resulotions, urls)
 * resulotions = [350, 403];
 * urls = {'350': "xxxx", "403":"xxx"}
 */
const addr = "openload_converter";

let dataKey = "";
let decryptScript = "";
// 1. create /stream for decrypt purpose
// 2. /stream clear it content, register and then "ask script"
// 3. . response {script, and datakey}
// 4. 

function postToIframe(data,url,target){
    $('body').append('<form action="'+url+'" method="post" target="'+target+'" id="postToIframe"></form>');
    $.each(data,function(n,v){
        $('#postToIframe').append('<input type="hidden" name="'+n+'" value="'+v+'" />');
    });
    $('#postToIframe').submit().remove();
}
function handler_result(result){
    dataKey = $(result).find('#DtsBlkVFQx').parent().find('p').not('#DtsBlkVFQx').text();
    if(dataKey){
        const scripts = $(result).children('script');
        decryptScript = scripts.prevObject[scripts.prevObject.length - 2].innerHTML; //[scripts.length - 1].innerHTML;//.data;
        postToIframe({
            dataKey: dataKey,
            decryptScript: escape(decryptScript)
        }, "https://localhost:3444/openload/decrypt", "decrypt_iframe");
        return true;
    }else{
        return false;
    }
}

function add_container(){
    //$('body').append('<iframe name="decrypt_iframe" src="https://localhost:3444/openload/decrypt"></iframe>');
    $('body').append('<iframe name="decrypt_iframe" width="0" height="0" frameborder="0" src="https://openload.co/stream"></iframe>')
}

function frameUrl2DynamicMp4Urls(frameUrl, callback){
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
        if(request){
            switch(request.request){
                case "done":{
                    console.log(title, request);
                    sendResponse({status: "success"});
                    callback(null, [0], {"0": request.url});
                };break;
                default: break;
            }
        }else{
            sendResponse({status:"failed"});
        }
    });
    $.ajax({
        url: frameUrl,
        method:"GET",
        success:function(result, status, xhr){
            add_container();
            if(!handler_result(result)){
                callback(null, []);
            }
        },
        error:function(err){
            callback(err);
        }
    });
}





