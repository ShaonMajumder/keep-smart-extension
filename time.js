
export function getUTCTime(){
    var gmt_zero_time = new Date();
    // gmt_zero_time.toUTCString();
    var d2 = new Date( gmt_zero_time.getUTCFullYear(), gmt_zero_time.getUTCMonth(), gmt_zero_time.getUTCDate(), gmt_zero_time.getUTCHours(), gmt_zero_time.getUTCMinutes(), gmt_zero_time.getUTCSeconds() );
    // Math.floor(d2.getTime()/ 1000) Time in seconds converted from miliseconds
    // return d2.toUTCString();
    return d2.toISOString();
}

export function timestampString(unix_timestamp){
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

export function getCurrentTimeUTC(){
    //RETURN:
    //      = number of milliseconds between current UTC time and midnight of January 1, 1970
    var tmLoc = new Date();
    //The offset is in minutes -- convert it to ms
    return tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
}

// timestampString(getCurrentTimeUTC());

export function timestampSeconds(){
    return new Date().getTime() / 1000;
}

/**
 * 
 * @returns Time Zone in String
 */
 export function getTimeZone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 
 * @param {TimeZone String} myTimezoneName 
 * @returns TimeZone Offset
 */
export function getTimezoneToOffset(myTimezoneName){
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

export function getTimezoneOffset(){
    return getTimezoneToOffset(getTimeZone());
}


export function getGMTString(){
    return new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
}

/**
 * 
 * @returns MYSQL DATE TIME FORMAT with GMT value passed
 */
export function localGMTTime(){
    const locale_ = '';
    var date = new Date();
    var options = { hour12: false };
    return date.toLocaleString('sv-SE', options) + ' ' + getGMTString();
}