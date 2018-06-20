
'use strict';
console.log('popup loaded');
const enableButton = document.getElementById('enableButton');
let enabled = true;
function setEnableButtonText(enabled){
  if(enabled){
    enableButton.textContent = "Enable";
  }else{
    enableButton.textContent = "Disable";
  }
}
setEnableButtonText(enabled);
enableButton.onclick = function(element) {
  enabled = !enabled;
  setEnableButtonText(enabled);
};
const convert = document.getElementById('convert');
convert.onclick = function(){
    console.log('convert');
}