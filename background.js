const HOST_MAIN = "http://127.0.0.1:8000";
const API_ENDPOINT = "/api/v1";
const HOST_URL = HOST_MAIN+API_ENDPOINT;
const VISIT_LOG_URL = HOST_MAIN+API_ENDPOINT+'/visited';

const LOGIN_PAGE = HOST_MAIN+"/login";
const HOME_PAGE = HOST_MAIN+"/home";
const TOKEN_PAGE = HOST_MAIN + '/exttoken';



/**
 * Get cookie for given cookie name
 * @param {cookie name} cname 
 * @returns 
 */
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
}

/**
 * Set cookie for a host 
 * @param {Cookie Name} cname 
 * @param {Cookie Value} cvalue 
 * @param {expires day} exdays 
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getUTCTime(){
    var gmt_zero_time = new Date();
    // gmt_zero_time.toUTCString();
    var d2 = new Date( gmt_zero_time.getUTCFullYear(), gmt_zero_time.getUTCMonth(), gmt_zero_time.getUTCDate(), gmt_zero_time.getUTCHours(), gmt_zero_time.getUTCMinutes(), gmt_zero_time.getUTCSeconds() );
    // Math.floor(d2.getTime()/ 1000) Time in seconds converted from miliseconds
    // return d2.toUTCString();
    return d2.toISOString();
}

function timestampString(unix_timestamp){
    // let unix_timestamp = 1549312452
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}

function getCurrentTimeUTC(){
    //RETURN:
    //      = number of milliseconds between current UTC time and midnight of January 1, 1970
    var tmLoc = new Date();
    //The offset is in minutes -- convert it to ms
    return tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
}

// timestampString(getCurrentTimeUTC());

/**
 * Parsing JSON response from web body
 * @param {html source code of active page} domContent 
 */
function saveTokenFromResponse(domContent) {
    var part = domContent.substring(
        domContent.lastIndexOf("jsonstart") + "jsonstart".length, 
        domContent.lastIndexOf("jsonstop")
    );
    part = part.replace(/\\/g, '');
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
    var loginAjax = $.ajax({
        url: HOST_MAIN+'/weblogin',
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
        if ( jqXhr.status == 403 && activeTab.url != LOGIN_PAGE){
            window.open(LOGIN_PAGE);
            // here edit
        }else{
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
        url: HOST_MAIN+'/api/v1/login',
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
    chrome.storage.local.get(['login_page_id'], function(result) {    
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
        chrome.storage.local.remove("login_page_id");
    });
}

function timestampSeconds(){
    return new Date().getTime() / 1000;
}

/**
 * 
 * @returns Time Zone in String
 */
 function getTimeZone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 
 * @param {TimeZone String} myTimezoneName 
 * @returns TimeZone Offset
 */
function getTimezoneToOffset(myTimezoneName){
    // Generating the formatted text
    var options = {timeZone: myTimezoneName, timeZoneName: "short"};
    var dateText = Intl.DateTimeFormat([], options).format(new Date);
    
    // Scraping the numbers we want from the text
    var timezoneString = dateText.split(" ")[1].slice(3);
    // Getting the offset
    var timeZoneOffset_ = parseInt(timezoneString.split(':')[0])*60;
    // Checking for a minutes offset and adding if appropriate
    if (timezoneString.includes(":")) {
        // console.log(timeZoneOffset_);
        var timeZoneOffset_ = timeZoneOffset_ + parseInt(timezoneString.split(':')[1]);
    }
    return timeZoneOffset_;
}

function getTimezoneOffset(){
    return getTimezoneToOffset(getTimeZone());
}


function getGMTString(){
    return new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
}

/**
 * 
 * @returns MYSQL DATE TIME FORMAT with GMT value passed
 */
function localGMTTime(){
    const locale_ = '';
    var date = new Date();
    var options = { hour12: false };
    return date.toLocaleString('sv-SE', options) + ' ' + getGMTString();
}

/**
 * Function To send web browsing log of user
 * @param {*} activeTab 
 */
function send_visit_log(activeTab,time_,tab_open_time = null,spent_time = null){
    const event = new Date('05 October 2011 14:48 UTC');

    chrome.storage.local.get(['access_token'], function(result) {
        var data = {
            title : activeTab.title,
            url : activeTab.url,
            visit_time : time_,
            tab_id : activeTab.id,
            tab_open_gmt_time : tab_open_time,
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
        alert('on installation after weblogin');
        // .then(response => {
        //     alert('on installation after weblogin');
        //     // if (response.status == 200) {
        //     //   return response.json();
        //     // } else {
        //     //   throw new Error(response.status);
        //     // }
        // });
            
        
        
        // var time_ = localGMTTime();

        // chrome.storage.local.set({ 'active_tab' : activeTab.id });
        // chrome.storage.local.set({
        //     [activeTab.id] : { 
        //         'start_timestamp' : timestampSeconds(),
        //         'start_gmt_time' : time_
        //     }
        // });
        // send_visit_log(activeTab,time_);
    });
    
});

// First Auth Problem

/**
 * On Created
 */
/*
chrome.tabs.onCreated.addListener(function(tab){
    alert('tab created '+tab.id);
    chrome.storage.local.set({ 'active_tab' : tab.id });
    chrome.storage.local.set({
        [tab.id] : { 
            'start_timestamp'   : timestampSeconds(),
            'start_gmt_time'    : localGMTTime()
        }
    });
}); 
*/



/**
 * On Page Load
 */
/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            var time_ = localGMTTime();
            chrome.storage.local.get(null, function(result){
                var allKeys = Object.keys(result);
                if(allKeys.includes(tabId.toString())){
                    var tab_info = result[tabId];
                    spent_time = timestampSeconds() - tab_info.start_timestamp;
                    var tab_open_time = tab_info.start_gmt_time;
                    send_visit_log(activeTab,time_,tab_open_time,spent_time);
                    chrome.storage.local.remove(tabId.toString());
                    chrome.storage.local.set({
                        [tabId] : { 
                            'start_timestamp' : timestampSeconds(),
                            'start_gmt_time' : time_
                        }
                    });
                }else{
                    send_visit_log(activeTab,time_);
                    chrome.storage.local.set({
                        [tabId] : { 
                            'start_timestamp' : timestampSeconds(),
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


chrome.tabs.onActiveChanged.addListener( function(tabId, info) {
    var currentTabId        = tabId;         // For comparison
    var windowId = info.windowId;
    var time_ = localGMTTime();
    alert('activated'+currentTabId);
    
    //currentTabId exists before or new

    chrome.storage.local.get(null, function(result){
        var allKeys = Object.keys(result);
        if(allKeys.includes('active_tab')){
            var previousTabId = result.active_tab;
            chrome.storage.local.set({ 'active_tab' : currentTabId });

            if(currentTabId != previousTabId){
                var previousTabId = result.active_tab;
                var previous_tab_info = result[previousTabId];
                alert(previousTabId);
                // if(previous_tab_info.start_timestamp != null){
                //     var spent_time = timestampSeconds() - previous_tab_info.start_timestamp;
                //     var previous_tab_open_time = tab_info.start_gmt_time;
                //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                //         console.log(tabs);

                //         tabs.forEach(element=>{
                //             console.log(element.id);
                //             if(element.id == previousTabId){
                //                 alert('orange');
                //             }
                //         })

                //         // var activeTab = tabs[0];
                //         // send_visit_log(activeTab,time_,previous_tab_open_time,spent_time);
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
            
            
            
            // send_visit_log(activeTab,time_,tab_open_time,spent_time);
            // chrome.storage.local.remove(tabId.toString());
            // chrome.storage.local.set({
            //     [tabId] : { 
            //         'start_timestamp' : timestampSeconds(),
            //         'start_gmt_time' : tab_open_time
            //     }
            // });
        }

        // if(allKeys.includes(tabId.toString())){
        //     var tab_info = result[previousTabId];
        //     var spent_time = timestampSeconds() - tab_info.start_timestamp;
        //     var tab_open_time = tab_info.start_gmt_time;
        //     send_visit_log(activeTab,time_,tab_open_time,spent_time);
        //     chrome.storage.local.remove(tabId.toString());
        //     chrome.storage.local.set({
        //         [tabId] : { 
        //             'start_timestamp' : timestampSeconds(),
        //             'start_gmt_time' : time_
        //         }
        //     });
        // }else{
        //     send_visit_log(activeTab,time_);
        //     chrome.storage.local.set({
        //         [tabId] : { 
        //             'start_timestamp' : timestampSeconds(),
        //             'start_gmt_time' : time_
        //         }
        //     });
        // }
    });
});

*/