var responseJson;

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
            console.log('AJAX Request not ready.');
        }
    };  
    httpRequest.send();
}

function platformFunction(caller){
    if (caller == "platform"){
        var divPlatform = document.getElementById("platform");
        var divOS = document.getElementById("os");
        var divMobiles = document.getElementById("mobiles");
        var divBrowser = document.getElementById("browser");
        var selectMobile = document.getElementById("list-mobiles");
        var selectBrowser = document.getElementById("list-browser");
        if (currentPlatform() == "mobile"){
            // selectMobile.style.display = "block";
            // selectBrowser.style.display = "none";
            
            divMobiles.style.display = "block";
            divBrowser.style.display = "none";
        }else{
            // selectMobile.style.display = "none";
            // selectBrowser.style.display = "block";
            
            divMobiles.style.display = "none";
            divBrowser.style.display = "block";
        }
        sampleGenerator("OS");
    }else if (caller == "OS"){
        if (currentPlatform() == "mobile"){
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
    var divPlatformOptions = document.getElementById("platformOptions");
    var selectOS = document.getElementById("list-os");
    var selectDevice = document.getElementById("list-mobiles");
    var selectBrowser = document.getElementById("list-browser");
    if (section == "platform"){
        for (var element in responseJson){
            var sampleDiv = "platform-"+element;
            console.log(sampleDiv);
            var platformDiv = document.createElement("div");
            platformDiv.id = sampleDiv;
            platformDiv.style.width="50%";
            platformDiv.style.display = "inline";
            platformDiv.style.float = "left";
            divPlatformOptions.appendChild(platformDiv);

            var radioButton = document.createElement("input");
            radioButton.setAttribute("type","radio");
            radioButton.setAttribute("value",element);
            radioButton.setAttribute("name","platform-options");
            radioButton.setAttribute("id",element);
            
            var label = document.createElement("label");
            label.setAttribute("for",element);
            label.innerHTML = element;
            
            platformDiv.appendChild(radioButton);
            platformDiv.appendChild(label);
            
        }
        var radioButtonPlatform = document.getElementById("platformOptions").getElementsByTagName("input");
        console.log(radioButtonPlatform);
        console.log(radioButtonPlatform.length);
        for (var a in radioButtonPlatform){
             if (a==0){
                radioButtonPlatform[a].checked = true;
            }
            radioButtonPlatform[a].onclick = function(){
                platformFunction("platform");
            }
        }
        sampleGenerator("OS");
    }else if (section == "OS"){
        cleanPreviousSelection("OS");
        context = responseJson[currentPlatform()];
        for (var element in context ){
            tempObject = context[element];
            optionOS = document.createElement("option");
            optionOS.text = tempObject.os_display_name;
            optionOS.id = tempObject.os;
            optionOS.value = tempObject.os_version;
            selectOS.add(optionOS);
        }
        if (currentPlatform() == "desktop"){
            sampleGenerator("browsers");
        }else if (currentPlatform() == "mobile"){
            sampleGenerator("mobiles");
        }
    }else if (section == "browsers"){
        cleanPreviousSelection("browsers");
        context = responseJson[currentPlatform()];
        for (var element in context){
            if (context[element].os_display_name == currentOS_version()){
                context_browsers = context[element].browsers; 
                for (var element2 in context_browsers){
                    context_browser_display_name = context_browsers[element2].display_name;
                    optionBrowser = document.createElement("option");
                    optionBrowser.text = context_browser_display_name;
                    optionBrowser.id = context_browsers[element2].browser;
                    optionBrowser.value = context_browsers[element2].browser_version;
                    selectBrowser.add(optionBrowser);
                }
            }
        }
    }else if(section == "mobiles"){
        cleanPreviousSelection("mobiles");
        
        context = responseJson[currentPlatform()];
        for (var element in context){
            if (context[element].os_display_name == currentOS_version()){
                context_devices = context[element].devices; 
                for (element2 in context_devices){
                    context_mobile_device = context_devices[element2];
                    context_mobile_device_name = context_mobile_device.display_name;
                    optionDevice = document.createElement("option");
                    optionDevice.text = context_mobile_device_name;
                    optionDevice.value = context_mobile_device_name;
                    selectDevice.add(optionDevice);
                }
            }
        }
    }
}
function cleanPreviousSelection(segment){
    if (segment == "OS"){
        toClean = document.getElementById("list-os");
        toClean.innerHTML="";
    }else if (segment == "browsers"){
        toClean = document.getElementById("list-browser");
        toClean.innerHTML = "";
    }else if (segment == "mobiles"){
        toClean = document.getElementById("list-mobiles");
        toClean.innerHTML = "";
    }
}
function currentDevice(){
    var deviceSelectionOption_value = selectMobile.options[selectMobile.selectedIndex].value;
    return deviceSelectionOption_value;
}
function currentBrowser_forURL(property){
    var selectBrowser = document.getElementById("list-browser");
    if (property == "id"){
        var browserSelectedOption_id = selectBrowser.options[selectBrowser.selectedIndex].id;
        return browserSelectedOption_id;
    }else if(property == "value"){
        var browserSelectedOption_value = selectBrowser.options[selectBrowser.selectedIndex].value;
        return browserSelectedOption_value;
    }
}
function currentOS_forURL(property){
    var selectOS = document.getElementById("list-os");
    if (property == "id"){
        var osSelectedOption_id = selectOS.options[selectOS.selectedIndex].id;
        return osSelectedOption_id;
    }else if(property == "value"){
        var osSelectedOption_value = selectOS.options[selectOS.selectedIndex].value;
        return osSelectedOption_value;
    }
}
function currentOS_version(){
    var selectOS = document.getElementById("list-os");
    var osSelectedOption = selectOS.options[selectOS.selectedIndex].text;
    return osSelectedOption
}
function currentPlatform(){    
    var radioButtonPlatform = document.getElementById("platformOptions").getElementsByTagName("input");
    for (var a in radioButtonPlatform){
        if (radioButtonPlatform[a].checked){
            return radioButtonPlatform[a].value;
        }
    }
}

function browserstack(){
    var staticURL = "https://live.browserstack.com/dashboard#";
    // Variables common across platforms:
    var os = currentOS_forURL("id");
    var start=true;
    var userURL = document.getElementById("input-url").value;
    
    var finalURL = "";
    
    if (currentPlatform() == "desktop"){
        var os_version = currentOS_forURL("value");
        var browser = currentBrowser_forURL("id");
        var browser_version= currentBrowser_forURL("value");
        
        finalURL=staticURL+"os="+os+"&os_version="+os_version+"&browser="+browser+"&browser_version="+browser_version+"&start="+start+"&url="+userURL;        
    }else if (currentPlatform() == "mobile"){
        var device = currentDevice();
        finalURL = staticURL+"os="+os+"&device="+device+"&start=true&url="+userURL;
    }else{
        finalURL = "something went wrong";
    }
    window.open(finalURL,"_blank");
}

function init(){
    selectOS.onchange = function() {
        platformFunction("OS");
    }
    selectMobile.onchange = function (){
        platformFunction("mobile")
    } 
    submitButton.onclick = function(){
        browserstack();
    }
    var urlErrorLabel = document.getElementById("url-warning");
    var inputURL = document.getElementById("input-url");
    var loadURLButton = document.getElementById('submit-button');
    inputURL.onchange = function(){
        var pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        if (!pattern.test(inputURL.value)) { 
            urlErrorLabel.innerText = "Enter a valid URL!"
            loadURLButton.disabled = true;
        }else{
            urlErrorLabel.innerText = "";
            loadURLButton.disabled = false;
        }
    }
}
init();
ajaxCall();
