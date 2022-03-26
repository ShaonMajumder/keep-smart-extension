var HOST_MAIN = "http://127.0.0.1:8001";
var HOST_URL = HOST_MAIN+"/api/v1";
var LOGIN_PAGE = HOST_MAIN+"/login";
var HOME_PAGE = HOST_MAIN+"/home";
var TOKEN_PAGE = HOST_MAIN + '/exttoken';

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'receive_token_page') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        sendResponse(document.body.outerHTML);
    }else if (msg.text === 'sent_to_login_page') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        window.location.href = LOGIN_PAGE;
    }else if (msg.text === 'sent_to_token_page') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        window.location.href = TOKEN_PAGE;
    }else if (msg.text === 'redirect_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        window.history.back();
    }
    
});
