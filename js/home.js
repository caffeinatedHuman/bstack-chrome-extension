var responseJson;

var selectPlatform = document.getElementById("list-platform");
var selectOS = document.getElementById("list-os");
var selectMobile = document.getElementById("list-mobiles");
var selectBrowser = document.getElementById("list-browser");
var submitButton = document.getElementById("submit-button");

function ajaxCall(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET','https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live',true);
    
    httpRequest.onreadystatechange = function (){
        
        if(httpRequest.readyState === XMLHttpRequest.DONE){
            responseJson = JSON.parse(httpRequest.response);
            console.log(responseJson);
            
            sampleGenerator("platform");
        }else{
            // console.log('AJAX Request not ready.');
            // console.log('Current State:'+httpRequest.readyState);
        }
    };  
    httpRequest.send();
}

function platformFunction(caller){
    console.log("Platform selected is : "+currentPlatform());
    if (caller=="platform"){
        var selectMobile = document.getElementById("list-mobiles");
        var selectBrowser = document.getElementById("list-browser");
        if (currentPlatform()=="mobile"){
            selectMobile.style.display = "block";
            selectBrowser.style.display = "none";
        }else{
            selectMobile.style.display = "none";
            selectBrowser.style.display = "block";
        }
        sampleGenerator("OS");
    }else if (caller == "OS"){
        if (currentPlatform()=="mobile"){
            var selectMobile = document.getElementById("list-mobiles");
            selectMobile.style.display = "block";
            sampleGenerator("mobiles");
        }else{
            sampleGenerator("browsers");
        }
    } else if (caller == "mobile") {
        sampleGenerator("mobileBrowsers");
    }
}

function sampleGenerator(section){
    var selectPlatform = document.getElementById("list-platform");
    var selectOS = document.getElementById("list-os");
    var selectDevice = document.getElementById("list-mobiles");
    var selectBrowser = document.getElementById("list-browser");
    if (section=="platform"){
        for (var element in responseJson){
            // console.log(element);
            optionPlatform = document.createElement("option");
            optionPlatform.text = element;
            optionPlatform.value = element;
            selectPlatform.add(optionPlatform);
        }
        sampleGenerator("OS");
    }else if (section=="OS"){
        cleanPreviousSelection("OS");
        console.log("OS DROP DOWN TO BE GENERATED FOR "+currentPlatform());
        context = responseJson[currentPlatform()];
        // console.log(context);
        for (var element in context ){
            tempObject = context[element];
            // console.log(tempObject.os_display_name);
            optionOS = document.createElement("option");
            optionOS.text = tempObject.os_display_name;
            optionOS.id = tempObject.os;
            optionOS.value = tempObject.os_version;
            selectOS.add(optionOS);
        }
        if (currentPlatform()=="desktop"){
            sampleGenerator("browsers");
        }else if (currentPlatform()=="mobile"){
            sampleGenerator("mobiles");
        }
    }else if (section == "browsers"){
        cleanPreviousSelection("browsers");
        console.log("BROWSER DROP DOWN TO BE GENERATED FOR "+ currentOS_version() + ":"+currentPlatform());
        context = responseJson[currentPlatform()];
        // console.log(context);
        for (var element in context){
            // console.log(element);
            // console.log(context[element]);
            if (context[element].os_display_name == currentOS_version()){
                // console.log("Proceed with logic");
                context_browsers = context[element].browsers; 
                // console.log(context_browsers);
                for (var element2 in context_browsers){
                    // console.log(element2);
                    context_browser_display_name = context_browsers[element2].display_name;
                    // console.log(context_browser_display_name);
                    optionBrowser = document.createElement("option");
                    optionBrowser.text = context_browser_display_name;
                    optionBrowser.id = context_browsers[element2].browser;
                    optionBrowser.value = context_browsers[element2].browser_version;
                    selectBrowser.add(optionBrowser);
                }
            }
            /*
            */
        }
        // context_os = responseJson[currentOS_version()];
        // console.log(context_platform);
        // console.log(context_os);
    }else if(section == "mobiles"){
        cleanPreviousSelection("mobiles");
        console.log("MOBILES DROP DOWN TO BE GENERATED FOR " + currentOS_version() + ":"+currentPlatform());
        context = responseJson[currentPlatform()];
        // console.log(context);
        for (var element in context){
            // console.log(element);
            // console.log(context[element]);
            if (context[element].os_display_name == currentOS_version()){
                // console.log("Proceed with logic");
                context_devices = context[element].devices; 
                // console.log(context_devices);
                for (element2 in context_devices){
                    context_mobile_device = context_devices[element2];
                    context_mobile_device_name = context_mobile_device.display_name;
                    // console.log(context_mobile_device_name);
                    optionDevice = document.createElement("option");
                    optionDevice.text = context_mobile_device_name;
                    optionDevice.value = context_mobile_device_name;
                    selectDevice.add(optionDevice);
                }
            }
        }
    }else if (section == "mobileBrowsers"){
        //No need to build this.
    }
}
function cleanPreviousSelection(segment){
    if (segment=="OS"){
        toClean = document.getElementById("list-os");
        toClean.innerHTML="";
    }else if (segment=="browsers"){
        toClean = document.getElementById("list-browser");
        toClean.innerHTML = "";
    }else if (segment=="mobiles"){
        toClean = document.getElementById("list-mobiles");
        toClean.innerHTML = "";
    }
}
function currentDevice(){
    var deviceSelectionOption_value = selectMobile.options[selectMobile.selectedIndex].value;
    // console.log(deviceSelectionOption_value);
    return deviceSelectionOption_value;
}
function currentBrowser_forURL(property){
    var selectBrowser = document.getElementById("list-browser");
    if (property=="id"){
        var browserSelectedOption_id = selectBrowser.options[selectBrowser.selectedIndex].id;
        return browserSelectedOption_id;
    }else if(property=="value"){
        var browserSelectedOption_value = selectBrowser.options[selectBrowser.selectedIndex].value;
        return browserSelectedOption_value;
    }
}
function currentOS_forURL(property){
    var selectOS = document.getElementById("list-os");
    if (property=="id"){
        var osSelectedOption_id = selectOS.options[selectOS.selectedIndex].id;
        return osSelectedOption_id;
    }else if(property=="value"){
        var osSelectedOption_value = selectOS.options[selectOS.selectedIndex].value;
        return osSelectedOption_value;
    }
}
function currentOS_version(){
    var selectOS = document.getElementById("list-os");
    var osSelectedOption = selectOS.options[selectOS.selectedIndex].text;
    // console.log(osSelectedOption);
    return osSelectedOption
}
function currentPlatform(){
    var selectPlatform = document.getElementById("list-platform");
    var platformSelectedOption = selectPlatform.options[selectPlatform.selectedIndex].text;
    // console.log(typeof(platformSelectedOption));
    return platformSelectedOption
}

function browserstack(){
    var staticURL = "https://live.browserstack.com/dashboard#";
    // Variables common across platforms:
    var os = currentOS_forURL("id");
    var start=true;
    var userURL = document.getElementById("input-url").value;
    
    var finalURL = "";

    if (currentPlatform()=="desktop"){
        var os_version = currentOS_forURL("value");
        var browser = currentBrowser_forURL("id");
        var browser_version= currentBrowser_forURL("value");
        
        finalURL=staticURL+"os="+os+"&os_version="+os_version+"&browser="+browser+"&browser_version="+browser_version+"&start="+start+"&url="+userURL;
        // var finalURL="https://os="+os+"&os_version="+os_version+"&browser="+browser+"&browser_version="+browser_version+"&start="+start+"&url="+userURL;
        
    }else if (currentPlatform()=="mobile"){
        var device = currentDevice();
        finalURL = staticURL+"os="+os+"&device="+device+"&start=true&url="+userURL;
    }else{
        finalURL = "something went wrong";
    }
    window.open(finalURL,"_blank");
}

function init(){
    selectPlatform.onchange = function() {
        platformFunction('platform');
    }
    selectOS.onchange = function() {
        platformFunction("OS");
    }
    selectMobile.onchange = function (){
        platformFunction("mobile")
    } 
    submitButton.onclick = function(){
        browserstack();
    }

}
init();
ajaxCall();