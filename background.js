import * as time from './time.js';
import * as cookie from './cookie.js';
import * as config from './config.js';

var MENU_ITEM_PARENT_ID = "keep_smart_paretnt_id";

/**
 * Parsing JSON response from web body
 * @param {html source code of active page} domContent 
 */
 function saveTokenFromResponse(domContent) {    
    var part = domContent.substring(
        domContent.lastIndexOf("jsonstart") + "jsonstart".length, 
        domContent.lastIndexOf("jsonstop")
    );
    var json = JSON.parse(part);
    var access_token =  json.access_token;
    chrome.storage.local.set({"access_token": access_token}, function() {
        console.log('Value is set to ' + access_token);
    });
}

/**
 * Login via parsing web response for json data by background listner
 * How : It pops up login window
 * @param {*} activeTab 
 */
function webParserlogin(activeTab){
    if ( activeTab.url == config.LOGIN_PAGE){

    }else if ( activeTab.url != config.TOKEN_PAGE){
        window.open(config.TOKEN_PAGE);
    }else{
        chrome.tabs.sendMessage(activeTab.id, {text: 'receive_token_page'}, saveTokenFromResponse);
        chrome.tabs.remove(activeTab.id, function(){});
    }
}

/**
 * Login via parsing json response via web protocol by ajax request
 * How : It pops up login window
 * @param {*} activeTab 
 */
function webLogin(activeTab){
    console.log('Trying to Login');
    var loginAjax = $.ajax({
        url: config.WEBLOGIN_TOKEN_PAGE,
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        
    });

    loginAjax.done(function( responseData, textStatus, Lxhr ){
        var access_token = responseData.data.access_token;
        chrome.storage.local.set({"access_token": access_token});
        close_login_popup();
    })
    .catch(function( jqXhr, textStatus, errorThrown ){
        if ( jqXhr.status == 403 && activeTab.url != config.LOGIN_PAGE){
            console.log('Login required and it is not login page');
            window.open(config.LOGIN_PAGE);
            console.log('Login Page Popped up');
            
        }else{
            console.log('Login Popped up')
            chrome.storage.local.set({"login_page_id": activeTab.id});
        }   
    });
}

/**
 * Login via prompting js input
 */
function promptLogin(){
    var email = prompt("Email:","")
    var password = prompt("Pasword:","")
    data = {
        "email" : email ,
        "password" : password
    }
    $.ajax({
        url: config.HOST_MAIN+'/api/v1/login',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( data ),
        processData: false,
        success: function( responseData, textStatus, Lxhr ){
            var access_token = responseData.data.access_token;
            chrome.storage.local.set({"access_token": access_token}, function() {});
            close_login_popup();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            console.log(jqXhr.status);
        }
    });
}

/**
 * Closes popup login window
 * @param {If true closes all login window} close_all_login 
 */
function close_login_popup(close_all_login=false){
    console.log('trying to closing popup');
    chrome.storage.local.get(['login_page_id'], function(result) {    
        if(close_all_login){
            chrome.tabs.query({},function(tabs){     
                console.log("\n/////////////////////\n");
                tabs.forEach(function(tab){
                console.log(tab.url);
                if(tab.url == config.HOME_PAGE)
                    chrome.tabs.remove(tab.id, function() { });
                });
            });
        }

        if(result.login_page_id){
            chrome.tabs.remove(result.login_page_id, function() { });
            chrome.storage.local.remove("login_page_id");
        }
    });
}







/**
 * Function To send web browsing log of user
 * @param {*} activeTab 
 */
function send_visit_log(activeTab,log_time_,tab_open_time = null,spent_time = null){
    console.log('Sending Visit log ...');
    chrome.storage.local.get(['access_token'], function(result) {
        console.log(result.access_token);
        var data = {
            title : activeTab.title,
            url : activeTab.url,
            visit_time : log_time_,
            tab_id : activeTab.id,
            tab_open_gmt_time : tab_open_time,
            spent_time : spent_time
        };
        $.ajax({
            url: config.VISIT_LOG_URL,
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            headers: {
                Authorization: 'Bearer '+result.access_token
            },
            data: JSON.stringify( data ),
            processData: false,
            success: function( responseData, textStatus, xhr ){
                // console.log(xhr.status);
                // console.log( JSON.stringify( responseData )  );
            },
            error: function( jqXhr, textStatus, errorThrown ){
                if(jqXhr.status == 0){
                    alert("Server is shutdown may be !");
                }
                if(jqXhr.status == 401)
                    webLogin(activeTab);
            }
        });

    });
}



chrome.runtime.onInstalled.addListener(function(details){

    chrome.contextMenus.create({
        title: 'Keep Smart',
        contexts: ["all"],
        id: MENU_ITEM_PARENT_ID
    });

    if(details.reason == "install"){
        //call a function to handle a first install
        console.log('thanks for installing');
    }else if(details.reason == "update"){
        //call a function to handle an update
        console.log('thanks for updating');
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];
        webLogin(activeTab);
        
        console.log('on installation after weblogin');
        // .then(response => {
        //     console.log('on installation after weblogin');
        //     // if (response.status == 200) {
        //     //   return response.json();
        //     // } else {
        //     //   throw new Error(response.status);
        //     // }
        // });
            
        
        
        // var log_time_ = time.localGMTTime();

        // chrome.storage.local.set({ 'active_tab' : activeTab.id });
        // chrome.storage.local.set({
        //     [activeTab.id] : { 
        //         'start_timestamp' : timestampSeconds(),
        //         'start_gmt_time' : log_time_
        //     }
        // });
        // send_visit_log(activeTab,log_time_);
    });
    
});

// First Auth Problem

/**
 * On Created
 */
/*
chrome.tabs.onCreated.addListener(function(tab){
    console.log('tab created '+tab.id);
    chrome.storage.local.set({ 'active_tab' : tab.id });
    chrome.storage.local.set({
        [tab.id] : { 
            'start_timestamp'   : time.timestampSeconds(),
            'start_gmt_time'    : localGMTTime()
        }
    });
}); 
*/



/**
 * On Page Load
 */

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log('Page Load Completed ...')
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            var log_time_ = time.localGMTTime();

            console.log('Store tab '+activeTab.id)
            send_visit_log(activeTab,log_time_);
            chrome.storage.local.set({
                [tabId] : { 
                    'start_timestamp' : time.timestampSeconds(),
                    'start_gmt_time' : log_time_
                }
            });

            
        });
    }else if (changeInfo.status == 'loading') {
        
    }
})

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        this.pageSource = request.source;
        var title = this.pageSource.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        console.log(title)
    }
});

function basicPopup(url) {
    popupWindow = window.open(url,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

chrome.contextMenus.onClicked.addListener(function (tab) {
    if (tab.menuItemId == MENU_ITEM_PARENT_ID ) {
        basicPopup(config.KEEP_PAGE);
    }
});

/*

// chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete') {
//         console.log('creatd');
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             var activeTab = tabs[0];
//             send_visit_log(activeTab);
//         });
//     }
// })

// chrome.tabs.onRemoved.addListener(function(tabid, removed) {
//     console.log("tab closed")
//    })

// chrome.windows.onRemoved.addListener(function(windowid) {
//     console.log("window closed")
//    })

// chrome.tabs.onActivated.addListener(
//     callback: function,
//   )


chrome.tabs.onActiveChanged.addListener( function(tabId, info) {
    var currentTabId        = tabId;         // For comparison
    var windowId = info.windowId;
    var log_time_ = time.localGMTTime();
    console.log('activated'+currentTabId);
    
    //currentTabId exists before or new

    chrome.storage.local.get(null, function(result){
        var allKeys = Object.keys(result);
        if(allKeys.includes('active_tab')){
            var previousTabId = result.active_tab;
            chrome.storage.local.set({ 'active_tab' : currentTabId });

            if(currentTabId != previousTabId){
                var previousTabId = result.active_tab;
                var previous_tab_info = result[previousTabId];
                console.log(previousTabId);
                // if(previous_tab_info.start_timestamp != null){
                //     var spent_time = time.timestampSeconds() - previous_tab_info.start_timestamp;
                //     var previous_tab_open_time = tab_info.start_gmt_time;
                //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                //         console.log(tabs);

                //         tabs.forEach(element=>{
                //             console.log(element.id);
                //             if(element.id == previousTabId){
                //                 console.log('orange');
                //             }
                //         })

                //         // var activeTab = tabs[0];
                //         // send_visit_log(activeTab,log_time_,previous_tab_open_time,spent_time);
                //         // chrome.storage.local.remove(previousTabId.toString());
                //         // chrome.storage.local.set({
                //         //     [tabId] : { 
                //         //         'start_timestamp' : null,
                //         //         'start_gmt_time' : previous_tab_open_time
                //         //     }
                //         // });
                //     });
                // }
               
            }
            

            // previous tab actions
            
            
            
            // send_visit_log(activeTab,log_time_,tab_open_time,spent_time);
            // chrome.storage.local.remove(tabId.toString());
            // chrome.storage.local.set({
            //     [tabId] : { 
            //         'start_timestamp' : time.timestampSeconds(),
            //         'start_gmt_time' : tab_open_time
            //     }
            // });
        }

        // if(allKeys.includes(tabId.toString())){
        //     var tab_info = result[previousTabId];
        //     var spent_time = time.timestampSeconds() - tab_info.start_timestamp;
        //     var tab_open_time = tab_info.start_gmt_time;
        //     send_visit_log(activeTab,log_time_,tab_open_time,spent_time);
        //     chrome.storage.local.remove(tabId.toString());
        //     chrome.storage.local.set({
        //         [tabId] : { 
        //             'start_timestamp' : time.timestampSeconds(),
        //             'start_gmt_time' : log_time_
        //         }
        //     });
        // }else{
        //     send_visit_log(activeTab,log_time_);
        //     chrome.storage.local.set({
        //         [tabId] : { 
        //             'start_timestamp' : time.timestampSeconds(),
        //             'start_gmt_time' : log_time_
        //         }
        //     });
        // }
    });
});

*/