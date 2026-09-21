//where the default values are set
browser.storage.local.get("preGain").then(function(item){
    if (item.preGain==null){
        browser.storage.local.set({
            "preGain":3*1
        });
        browser.storage.local.set({
            "hardUpperLimit":Math.pow(0.5,4)
        });
    }
});