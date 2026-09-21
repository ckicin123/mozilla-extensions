
let audioContext=new AudioContext();
let modifierNode=null;

async function getNewAudioContext(){
    audioContext.close();
    audioContext = new AudioContext();
    await audioContext.resume();
    await audioContext.audioWorklet.addModule(browser.runtime.getURL("processor.js"));
}

function updModifierNodeParam(paramName){
    browser.storage.local.get(paramName).then(function(item){
        const param = modifierNode.parameters.get(paramName);
        param.setValueAtTime(
            item[paramName],
            audioContext.currentTime
        );
    })
}

function updModifierNodeParams(){
    if (modifierNode!=null){
        console.log("upding modifier node");
        updModifierNodeParam("preGain");
        updModifierNodeParam("hardUpperLimit");
    }
}

function setupMediaElement(elem){

    const track = audioContext.createMediaElementSource(elem);

    modifierNode = new AudioWorkletNode(audioContext, "processor");

    track.connect(modifierNode);
    modifierNode.connect(audioContext.destination);

    updModifierNodeParams();
}

async function init(){
    console.log("ran");
    await getNewAudioContext();
    vidElems=document.querySelectorAll("video");
    for (i=0; i < vidElems.length; i++){
        console.log(i);
        vidElem = vidElems[i];

        setupMediaElement(vidElem);

        
    }
}

browser.runtime.onMessage.addListener((request) => {
    console.log(request.content);
    if (request.content=="upd"){
        updModifierNodeParams();
    }
    if (request.content=="recheckForVids"){
        init();
    }
    
    return Promise.resolve({ response: "complete" });
});

init();
document.addEventListener("click",function(){
    console.log("click detected");
    init();
})
const mo = new MutationObserver(()=>{
    init();
})
mo.observe(document, {childList:true, subtree:true});