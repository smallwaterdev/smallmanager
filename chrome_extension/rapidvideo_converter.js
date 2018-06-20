'use strict';
console.log("rapidvideo_converter boot");
const title="[Rapidvideo]";
const addr = "rapidvideo_converter";
/**
 * 
 * @param {frameUrl} e.g. https://www.rapidvideo.com/e/FN36CJSSM5 
 * @param {*} callback (err, resulotion, url)
 */
function frameUrl2DynamicMp4Url(frameUrl, callback){
    $.ajax({
        url: frameUrl,
        method:"GET",
        success:function(result, status, xhr){
            let mp4url = $(result).find('#videojs source').attr('src');
            let resolution = parseInt($(result).find('#videojs source').attr('title'));
            if(mp4url && resolution){
                callback(null, resolution, mp4url);
            }else{
                callback(new Error(`${frameUrl} mp4 not existed`));
            }
            
        },
        error:function(xhr, status, err){
            callback(err);
        }
    });
}

function parallel(arr, handler, callback){
    let counter = 0;
    let resolutions = [];
    let final_result = {};
    arr.forEach(function(ele){
        handler(ele, function(err, resolution, mp4url){
            if(!err){
                resolutions.push(resolution);
                final_result[resolution] = mp4url;
            }
            counter++;
            if(counter === arr.length){
                console.log(resolutions);
                callback(null, resolutions, final_result);
            }
        })
    });
}


function frameUrl2DynamicMp4Urls(frameUrl, callback){
    let result_ = [];
    $.ajax({
        url: frameUrl,
        method:"GET",
        success:function(result, status, xhr){
            try{
                $(result).find('a').toArray().forEach(function(ele){
                    let url = $(ele).attr('href');
                    if(url.indexOf('https://www.rapidvideo.com/e/') !== -1 && url.indexOf('&q=') !== -1){
                        result_.push(url);
                    }
                });
                if(result_.length !== 0){
                    parallel(result_, frameUrl2DynamicMp4Url, callback);
                }else{
                    callback(null, []);
                }
            }catch(err){
                callback(err);
            }
        },
        error:function(xhr, status, err){
            callback(err);
        }
    });
}
