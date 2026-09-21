
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
    await getNewAudioContext();
    vidElems=document.querySelectorAll("video");
    for (i=0; i < vidElems.length; i++){
        vidElem = vidElems[i];

        setupMediaElement(vidElem);

        
    }
}

browser.runtime.onMessage.addListener((request) => {
    if (request.content=="upd"){
        updModifierNodeParams();
    }
    if (request.content=="recheckForVids"){
        init();
    }
    
    return Promise.resolve({ response: "complete" });
});



const mo = new MutationObserver((records)=>{
    //checking if a video was added, if so reinitialise
    for (const record of records) {

        if (record.type=="childList"){

            for (const child of record.addedNodes){

                if (child.nodeType != Node.ELEMENT_NODE){ continue; }

                
                if (child.nodeName == "VIDEO"){
                    init();
                    break;
                }

                if (child.querySelectorAll("video").length > 0){
                    init();
                    break;
                }
            }
        }
        
    }
})
mo.observe(document, {childList:true, subtree:true});
init();
