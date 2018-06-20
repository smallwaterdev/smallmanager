'use strict';
console.log("fembed_converter boot");
const title="[Fembed]";

/**
 * 
 * @param {frameUrl} e.g. https://www.fembed.com/v/y40oxnqyv83
 * @param {*} callback (err, resulotions, urls)
 * resulotions = [350, 403];
 * urls = {'350': "xxxx", "403":"xxx"}
 */
const addr = "fembed_converter";


function frameUrl2DynamicMp4Urls(frameUrl, callback){
    frameUrl = frameUrl.split('/');
    frameUrl[3] = "api/source";
    let url = "";
    let counter = 0;
    while(counter < frameUrl.length){
        if(counter < frameUrl.length - 1){
            url += frameUrl[counter] + '/';
        }else{
            url += frameUrl[counter];
        }
        counter ++;
    }
    console.log(url);
    $.ajax({
        url: url,
        method:"POST",
        success:function(result, status, xhr){
            if(result.success){
                let resolutions = [];
                let mp4urls = {};
                let value = JSON.parse(result.data);
                value.forEach(ele=>{
                    let num  = parseInt(ele['label']);
                    resolutions.push(num);
                    mp4urls[num.toString()] = ele['file'];
                });
                callback(null, resolutions, mp4urls);
            }else{
                callback(null, []);
            }
            
            
        },
        error:function(xhr, status, err){
            callback(err);
        }
    });
}
