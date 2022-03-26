const HOST_MAIN = "http://127.0.0.1:8000";
const API_ENDPOINT = "/api/v1";
const HOST_URL = HOST_MAIN+API_ENDPOINT;
const VISIT_LOG_URL = HOST_MAIN+API_ENDPOINT+'/visited';

const LOGIN_PAGE = HOST_MAIN+"/login";
const HOME_PAGE = HOST_MAIN+"/home";
const TOKEN_PAGE = HOST_MAIN + '/exttoken';

var MENU_ITEM_PARENT_ID = "Wikipedia Lookup";
function openUrl(a) {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, function (b) {
        b = b[0];
        chrome.tabs.create({
            url: a,
            index: b.index + 1,
            openerTabId: b.id
        })
    })
}

function formatUrl(b) {
    return url = "https://wikipedia.org/wiki?search=" + encodeURIComponent(b)
}

chrome.contextMenus.onClicked.addListener(function (tab) {
    if (tab.menuItemId == 'keep_smart_village_foq_dance_bangladeshi' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'village,foq dance,bangladeshi',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
         });
    }else if (tab.menuItemId == 'keep_smart_village_foq_dance_mixed' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'village,foq dance,mixed',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
         });
    }else if (tab.menuItemId == 'keep_smart_village_dance_covers' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'village,dance covers,mixed',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
         });
    }else if (tab.menuItemId == 'keep_smart_village_tag_bangladeshi' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'village,tag,bangladeshi',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
         });
    }else if (tab.menuItemId == 'keep_smart_village_tag_mixed' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'village,tag,mixed',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
         });
    }else if (tab.menuItemId == 'keep_smart_knowledge_ict' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'knowledge,ict',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
        });
    }else if (tab.menuItemId == 'keep_smart_work_solution_laravel' ) { // a.selectionText
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = tabs[0];
            var activeTabId = activeTab.id; // or do whatever you need
            
            sendData({
                title : activeTab.title,
                action : 'keep',
                tags : 'work,solution,laravel',
                url : activeTab.url
            });

            console.log('sent');

            chrome.tabs.getSelected(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
            });
            /*
            chrome.tabs.executeScript({
                code: 'document.body.style.backgroundColor="green"'
            });
            */
        });
    }
});

function sendData(data){
    //openUrl(formatUrl(tab.selectionText));
    var URL = HOST_URL + '/visited';
    $.get(URL, data, function(responseData) {
        // do something with the response of your script
        console.log(responseData);
    });
}

chrome.runtime.onInstalled.addListener(function (a) {
    chrome.storage.sync.set({"back": 0, 'back_url': ""}, function(){});
    chrome.contextMenus.create({
        title: 'Keep Smart',
        contexts: ["all"],
        id: MENU_ITEM_PARENT_ID
    });
    
    chrome.contextMenus.create({
        title: 'Slam',
        parentId: MENU_ITEM_PARENT_ID,
        contexts: ["all"],
        id: 'keep_smart_village'
    });

    chrome.contextMenus.create({
        title: 'Work',
        parentId: MENU_ITEM_PARENT_ID,
        contexts: ["all"],
        id: 'keep_smart_work'
    });

    chrome.contextMenus.create({
        title: 'Solution',
        parentId: 'keep_smart_work',
        contexts: ["all"],
        id: 'keep_smart_work_solution'
    });

    chrome.contextMenus.create({
        title: 'Laravel',
        parentId: 'keep_smart_work_solution',
        contexts: ["all"],
        id: 'keep_smart_work_solution_laravel'
    });

    chrome.contextMenus.create({
        title: 'foq Dance',
        parentId: 'keep_smart_village',
        contexts: ["all"],
        id: 'keep_smart_village_foq_dance'
    });

    chrome.contextMenus.create({
        title: 'Dance Covers',
        parentId: 'keep_smart_village',
        contexts: ["all"],
        id: 'keep_smart_village_dance_covers'
    });

    chrome.contextMenus.create({
        title: 'bangladeshi foq Dance',
        parentId: 'keep_smart_village_foq_dance',
        contexts: ["all"],
        id: 'keep_smart_village_foq_dance_bangladeshi'
    });

    chrome.contextMenus.create({
        title: 'Mixed',
        parentId: 'keep_smart_village_foq_dance',
        contexts: ["all"],
        id: 'keep_smart_village_foq_dance_mixed'
    });

    chrome.contextMenus.create({
        title: 'tag',
        parentId: 'keep_smart_village',
        contexts: ["all"],
        id: 'keep_smart_village_tag'
    });
    chrome.contextMenus.create({
        title: 'bangladeshi tag',
        parentId: 'keep_smart_village_tag',
        contexts: ["all"],
        id: 'keep_smart_village_tag_bangladeshi'
    });

    chrome.contextMenus.create({
        title: 'Mixed tag',
        parentId: 'keep_smart_village_tag',
        contexts: ["all"],
        id: 'keep_smart_village_tag_mixed'
    });

    chrome.contextMenus.create({
        title: 'Knowledge',
        parentId: MENU_ITEM_PARENT_ID,
        contexts: ["all"],
        id: 'keep_smart_knowledge'
    });

    chrome.contextMenus.create({
        title: 'ICT',
        parentId: 'keep_smart_knowledge',
        contexts: ["all"],
        id: 'keep_smart_knowledge_ict'
    });
});

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
        console.log(timeZoneOffset_);
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
function send_visit_log(activeTab){
    const event = new Date('05 October 2011 14:48 UTC');

    chrome.storage.sync.get(['access_token'], function(result) {
        var data = {
            title : activeTab.title,
            url : activeTab.url,
            visit_time : localGMTTime()
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

/**
 * On Page Load
 */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            send_visit_log(activeTab);
        });
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