function onLoad(){
    document.getElementById("autoColorOnSpan").innerHTML=chrome.i18n.getMessage("whichColor");
    document.getElementById("whichLang").innerHTML=chrome.i18n.getMessage("whichLang");
    document.getElementById("autoLangOnSpan").innerHTML=chrome.i18n.getMessage("autoLangOn");
    document.getElementById("autoLangOffSpan").innerHTML=chrome.i18n.getMessage("autoLangOff");
    document.getElementById("save").innerHTML=chrome.i18n.getMessage("save");
    chrome.storage.local.get(["autoLang","wikiLang","wikiColor"],function(a){
        document.getElementById("autoLangOnRad").checked=a.autoLang;
        document.getElementById("autoLangOffRad").checked=!a.autoLang;
        document.getElementById("wikiLangTxt").value=a.wikiLang
        document.getElementById("autoColorOnRad").value=a.wikiColor;
    });
    document.getElementById("save").addEventListener("click",function(){
        var a=document.getElementById("autoLangOnRad").checked,
        b=document.getElementById("wikiLangTxt").value,
        c=document.getElementById("autoColorOnRad").value;
        chrome.storage.local.set({autoLang:a});
        ""!=b&&chrome.storage.local.set({wikiLang:b});
        chrome.storage.local.set({wikiColor:c});
        window.close()
    })
}
    
document.addEventListener("DOMContentLoaded",onLoad);
