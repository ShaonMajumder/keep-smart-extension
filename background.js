import * as time from './time.js';
import * as cookie from './cookie.js';


const HOST_MAIN = "http://127.0.0.1:8000";
const API_ENDPOINT = "/api/v1";
const HOST_URL = HOST_MAIN+API_ENDPOINT;
const VISIT_LOG_URL = HOST_MAIN+API_ENDPOINT+'/visited';

const LOGIN_PAGE = HOST_MAIN+"/login";
const HOME_PAGE = HOST_MAIN+"/home";
const TOKEN_PAGE = HOST_MAIN + '/exttoken';

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
    chrome.storage.sync.set({"access_token": access_token}, function() {
        console.log('Value is set to ' + access_token);
    });
}

/**
 * Login via parsing web response for json data by background listner
 * How : It pops up login window
 * @param {*} activeTab 
 */
function webParserlogin(activeTab){
    if ( activeTab.url == LOGIN_PAGE){

    }else if ( activeTab.url != TOKEN_PAGE){
        window.open(TOKEN_PAGE);
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
    $.ajax({
        url: HOST_MAIN+'/weblogin',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function( responseData, textStatus, Lxhr ){
            var access_token = responseData.data.access_token;
            chrome.storage.sync.set({"access_token": access_token}, function() {});
            close_login_popup();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            if ( jqXhr.status == 403 && activeTab.url != LOGIN_PAGE){
                chrome.storage.sync.set({"back_url": activeTab.url, "back" : 1 }, function() {
                    console.log('back url ' + activeTab.url);
                });
                window.open(LOGIN_PAGE);
            }else{
                chrome.storage.sync.set({"login_page_id": activeTab.id}, function() {
                    console.log('login_page_id ' + activeTab.id);
                });
            }   
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
        url: HOST_MAIN+'/api/v1/login',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( data ),
        processData: false,
        success: function( responseData, textStatus, Lxhr ){
            var access_token = responseData.data.access_token;
            chrome.storage.sync.set({"access_token": access_token}, function() {});
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
    chrome.storage.sync.get(['back','back_url','login_page_id'], function(result) {
        if(result.back == 1 ){                     
            chrome.storage.sync.set({"back": 0, 'back_url': ""}, function(){});
            if(close_all_login){
                chrome.tabs.query({},function(tabs){     
                    console.log("\n/////////////////////\n");
                    tabs.forEach(function(tab){
                    console.log(tab.url);
                    if(tab.url == HOME_PAGE)
                        chrome.tabs.remove(tab.id, function() { });
                    });
                });
            }
            chrome.tabs.remove(result.login_page_id, function() { });
        }
    });
}







/**
 * Function To send web browsing log of user
 * @param {*} activeTab 
 */
function send_visit_log(activeTab,time_,previous_time_ = null,spent_time = null){
    const event = new Date('05 October 2011 14:48 UTC');

    chrome.storage.sync.get(['access_token'], function(result) {
        var data = {
            title : activeTab.title,
            url : activeTab.url,
            visit_time : time_,
            tab_id : activeTab.id,
            previous_gmt_time : previous_time_,
            spent_time : spent_time
        };
        $.ajax({
            url: VISIT_LOG_URL,
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
                if(jqXhr.status == 401)
                    webLogin(activeTab);
            }
        });

    });
}

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        //call a function to handle a first install
        alert('thanks for installing');
    }else if(details.reason == "update"){
        //call a function to handle an update
        alert('thanks for updating');
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];
        webLogin(activeTab);
    });
    
});

// First Auth Problem

/**
 * On Created
 */
chrome.tabs.onCreated.addListener(function(tab){
    chrome.storage.local.set({
        [tab.id] : { 
            'start_timestamp' : time.timestampSeconds(),
            'start_gmt_time' : localGMTTime()
        }
    });
}); 

/**
 * On Page Load
 */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        alert(time.timestampSeconds());
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            var time_ = localGMTTime();
            chrome.storage.local.get(null, function(result){
                var allKeys = Object.keys(result);
                if(allKeys.includes(tabId.toString())){
                    var tab_info = result[tabId];
                    spent_time = time.timestampSeconds() - tab_info.start_timestamp;
                    var previous_time_ = tab_info.start_gmt_time;
                    send_visit_log(activeTab,time_,previous_time_,spent_time);
                    chrome.storage.local.remove(tabId.toString());
                    chrome.storage.local.set({
                        [tabId] : { 
                            'start_timestamp' : time.timestampSeconds(),
                            'start_gmt_time' : time_
                        }
                    });
                }else{
                    send_visit_log(activeTab,time_);
                    chrome.storage.local.set({
                        [tabId] : { 
                            'start_timestamp' : time.timestampSeconds(),
                            'start_gmt_time' : time_
                        }
                    });
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
        alert(title)
    }
});

// chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete') {
//         alert('creatd');
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             var activeTab = tabs[0];
//             send_visit_log(activeTab);
//         });
//     }
// })

// chrome.tabs.onRemoved.addListener(function(tabid, removed) {
//     alert("tab closed")
//    })

// chrome.windows.onRemoved.addListener(function(windowid) {
//     alert("window closed")
//    })

// chrome.tabs.onActivated.addListener(
//     callback: function,
//   )