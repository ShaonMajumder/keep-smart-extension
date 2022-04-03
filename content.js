var HOST_MAIN = "http://127.0.0.1:8001";
var HOST_URL = HOST_MAIN+"/api/v1";
var LOGIN_PAGE = HOST_MAIN+"/login";
var HOME_PAGE = HOST_MAIN+"/home";
var TOKEN_PAGE = HOST_MAIN + '/exttoken';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'receive_token_page') {
        sendResponse(document.body.outerHTML);
    }else if (msg.text === 'sent_to_login_page') {
        window.location.href = LOGIN_PAGE;
    }else if (msg.text === 'sent_to_token_page') {
        window.location.href = TOKEN_PAGE;
    }else if (msg.text === 'redirect_back') {
        window.history.back();
    }else if (msg.text === 'alert'){
        
        

        
        function docReady(fn) {
            // see if DOM is already available
            if (document.readyState === "complete" || document.readyState === "interactive") {
                // call on next available tick
                setTimeout(fn, 1);
            } else {
                document.addEventListener("DOMContentLoaded", fn);
            }
          }
        
          docReady(function() {
            // DOM is loaded and ready for manipulation here
            swal("Hello world!");
          });
        
    }
});
