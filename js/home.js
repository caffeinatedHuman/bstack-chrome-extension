var responseJson;

var extensionUtilities = (function (){
    console.log("extensionUtilitiy ran");
    selectOS = document.getElementById("list-os");
    selectMobile = document.getElementById("list-mobiles");
    selectBrowser = document.getElementById("list-browser");
    selectDevice = document.getElementById("list-mobiles");
    submitButton = document.getElementById("submit-button");
    
    function _platformFunction(caller){
        if (caller == "platform"){
            var divMobiles = document.getElementById("mobiles");
            var divBrowser = document.getElementById("browser");
            if (_currentPlatform() == "mobile"){
                divMobiles.style.display = "block";
                divBrowser.style.display = "none";
            }else{
                divMobiles.style.display = "none";
                divBrowser.style.display = "block";
            }
            _sampleGenerator("OS");
        }else if (caller == "OS"){
            if (_currentPlatform() == "mobile"){
                selectMobile.style.display = "block";
                _sampleGenerator("mobiles");
            }else{
                _sampleGenerator("browsers");
            }
        } else if (caller == "mobile") {
            _sampleGenerator("mobileBrowsers");
        }
    }
    
    function _sampleGenerator(section){
        var divPlatformOptions = document.getElementById("platformOptions");
        if (section == "platform"){
            for (var element in responseJson){
                var sampleDiv = "platform-"+element;
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
            for (var a in radioButtonPlatform){
                if (a==0){
                    radioButtonPlatform[a].checked = true;
                }
                radioButtonPlatform[a].onclick = function(){
                    _platformFunction("platform");
                }
            }
            _sampleGenerator("OS");
        }else if (section == "OS"){
            _cleanPreviousSelection("OS");
            context = responseJson[_currentPlatform()];
            for (var element in context ){
                tempObject = context[element];
                optionOS = document.createElement("option");
                optionOS.text = tempObject.os_display_name;
                optionOS.id = tempObject.os;
                optionOS.value = tempObject.os_version;
                selectOS.add(optionOS);
            }
            if (_currentPlatform() == "desktop"){
                _sampleGenerator("browsers");
            }else if (_currentPlatform() == "mobile"){
                _sampleGenerator("mobiles");
            }
        }else if (section == "browsers"){
            _cleanPreviousSelection("browsers");
            context = responseJson[_currentPlatform()];
            for (var element in context){
                if (context[element].os_display_name == _currentOSVersion()){
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
            _cleanPreviousSelection("mobiles");
            context = responseJson[_currentPlatform()];
            for (var element in context){
                if (context[element].os_display_name == _currentOSVersion()){
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
    function _currentDevice(){
        var deviceSelectionOption_value = selectMobile.options[selectMobile.selectedIndex].value;
        return deviceSelectionOption_value;
    }
    function _currentPlatform(){
        var radioButtonPlatform = document.getElementById("platformOptions").getElementsByTagName("input");
        for (var a in radioButtonPlatform){
            if (radioButtonPlatform[a].checked){
                return radioButtonPlatform[a].value;
            }
        }
    }
    function _currentOSForURL (property){
        if (property == "id"){
            var osSelectedOption_id = selectOS.options[selectOS.selectedIndex].id;
            return osSelectedOption_id;
        }else if(property == "value"){
            var osSelectedOption_value = htmlElements.selectOS.options[selectOS.selectedIndex].value;
            return osSelectedOption_value;
        }
    }
    function _currentBrowserForURL(property){
        var selectBrowser = document.getElementById("list-browser");
        if (property == "id"){
            var browserSelectedOption_id = selectBrowser.options[selectBrowser.selectedIndex].id;
            return browserSelectedOption_id;
        }else if(property == "value"){
            var browserSelectedOption_value = selectBrowser.options[selectBrowser.selectedIndex].value;
            return browserSelectedOption_value;
        }
    }
    function _cleanPreviousSelection(segment){
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
    function _currentOSVersion(){
        var osSelectedOption = selectOS.options[selectOS.selectedIndex].text;
        return osSelectedOption
    }
    function _browserstack(){
        console.log("Browserstack called");
        var staticURL = "https://live.browserstack.com/dashboard#";
        
        // Variables common across platforms:
        var os = _currentOSForURL("id");
        var start=true;
        var userURL = document.getElementById("input-url").value;
        
        var finalURL = "";
        
        if (_currentPlatform() == "desktop"){
            var os_version = _currentOSForURL("value");
            var browser = _currentBrowserForURL("id");
            var browser_version= _currentBrowserForURL("value");
            
            finalURL=staticURL+"os="+os+"&os_version="+os_version+"&browser="+browser+"&browser_version="+browser_version+"&start="+start+"&url="+userURL;
        }else if (_currentPlatform() == "mobile"){
            var device = _currentDevice();
            finalURL = staticURL+"os="+os+"&device="+device+"&start=true&url="+userURL;
        }
        window.open(finalURL,"_blank");
    }
    
    return {
        selectOS : selectOS,
        selectMobile : selectMobile,
        selectBrowser : selectBrowser,
        selectDevice : selectDevice,
        submitButton : submitButton,
        platformFunction: _platformFunction,
        sampleGenerator: _sampleGenerator,
        browserstack: _browserstack
    }
})();

var root = (function(){
    console.log("root ran");
    console.log("init executed");
    extensionUtilities.selectOS.onchange = function(){
        extensionUtilities.platformFunction("OS");
    }
    extensionUtilities.selectMobile.onchange = function (){
        extensionUtilities.platformFunction("mobile")
    }
    extensionUtilities.submitButton.onclick = function(){
        extensionUtilities.browserstack();
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
    
    ajax();
    
    function ajax(){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET','https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live',true);
        httpRequest.onreadystatechange = function (){
            
            if(httpRequest.readyState === XMLHttpRequest.DONE){
                responseJson = JSON.parse(httpRequest.response);
                extensionUtilities.sampleGenerator("platform");
            }
        };
        httpRequest.send();
    }
})();

// root.init;
