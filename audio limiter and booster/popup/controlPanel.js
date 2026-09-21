function createOptionTagsForDatalist(min,max,step){
    let output="";
    let value=0;
    for (i = 0; i <= ( max-min ) / step; i++){
        value = min + (step * i);
        output += '<option value='+parseFloat(value)+'></option>';
    }
    return output;
}

var preGainRange=document.getElementById("preGainRange");
var hardUpperLimitRange=document.getElementById("hardUpperLimitRange");

var preGainMarkers=document.getElementById("preGainMarkers")
var hardUpperLimitMarkers=document.getElementById("hardUpperLimitMarkers")

function sendMessageToTabs(msg){
    browser.tabs.query({}).then(function(tabs){
        let id=0;
        for (i=0; i<tabs.length; i++){
            id=tabs[i].id;
            browser.tabs.sendMessage(id,{content:msg})
            .then(
                (response) => {
                }
            )

        }
    });
    
}
/*
preGainMarkers.innerHTML=createOptionTagsForDatalist(
    preGainRange.min,
    preGainRange.max,
    1
);
hardUpperLimitMarkers.innerHTML=createOptionTagsForDatalist(
    hardUpperLimitRange.min,
    hardUpperLimitRange.max,
    0.1
);
*/

function processGainValueFromRange(value){
    return 3*value;
}
function processGainValueFromReal(value){
    return value/3;
}

function processLimitValueFromRange(value){
    return Math.pow(value,4);
}
function processLimitValueFromReal(value){
    return Math.sqrt(Math.sqrt(value));
}

preGainRange.addEventListener("input",() => {
    browser.storage.local.set({
        "preGain": processGainValueFromRange(preGainRange.value)
    });
    sendMessageToTabs("upd");
});


hardUpperLimitRange.addEventListener("input",() => {
    browser.storage.local.set({
        "hardUpperLimit": processLimitValueFromRange(hardUpperLimitRange.value)
    });
    sendMessageToTabs("upd");
});

browser.storage.local.get("preGain").then(function(item){
    preGainRange.value= processGainValueFromReal(item.preGain);
})
browser.storage.local.get("hardUpperLimit").then(function(item){
    hardUpperLimitRange.value= processLimitValueFromReal(item.hardUpperLimit);
})


var fixButton=document.getElementById("fixButton");

fixButton.addEventListener("click",(event) =>{
    sendMessageToTabs("recheckForVids");
})