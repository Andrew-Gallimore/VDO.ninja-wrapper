// if requirePassword[this] == true; hide
// if requirePassword[this] == true; show

// if guestLimit[this] < 20; grey
var settingsObjects = {

}
// var settingsObjectss = {
//     requirePassword_1: {
//         element: "",
//         type: "boolean",
//         status: "show",
//         value: false,
//         limiters: [

//         ],
//         linkedSettings: [
//             "password_1"
//         ]
//     },
//     password_1: {
//         element: "",
//         type: "string",
//         status: "hide",
//         value: "MyPassword",
//         limiters: [
//             {
//                 action: "hide",
//                 setting: "requirePassword_1",
//                 settingValue: false,
//                 settingRequirement: "=="
//             },
//             {
//                 action: "show",
//                 setting: "requirePassword_1",
//                 settingValue: true,
//                 settingRequirement: "=="
//             },
//             {
//                 action: "grey",
//                 setting: "guestLimit_1",
//                 settingValue: 20,
//                 settingRequirement: "<" //less than
//             }
//         ],
//         linkedSettings: [

//         ]
//     },
//     guestLimit_1: {
//         type: "number",
//         status: "show",
//         value: 15,
//         limiters: [

//         ],
//         linkedSettings: [
//             "password_1"
//         ]
//     }
// }

var recurtionLimit = 10;

async function compileSettings() {
    // runs through all the [data-setting] objects, and creates their objects, this is only the first step 
    // console.log(document.querySelectorAll(":not([data-setting-skip]) > [data-setting]"));
    document.querySelectorAll("div:not([data-setting-skip]) [data-setting]").forEach(settingElement => {
        if(settingElement.closest("[data-setting-skip]") !== null) return;
        var alt = "";
        if(settingElement.closest("[data-setting-alt]") !== null) alt = "_" + settingElement.closest("[data-setting-alt]").getAttribute("data-setting-alt");

        // Basic data
        var object = {
            type: settingElement.getAttribute("data-setting-type"),
            status: "show",
            limiters: [],
            linkedSettings: []
        }

        // setting initial value
        var input = settingElement.querySelector("[data-setting-input]")
        var value;
        if(input.type === "range" || input.type === "text") {
            value = input.value
        }else if(input.type === "checkbox") {
            value = input.checked
        }else {
            console.warn("[pS] Need to continue expanding supported input types, because '" + input.type + "' is needed")
        }
        object.value = value;
        object.storedValue = value;

        // setting limiters
        if(settingElement.getAttribute("data-limiters") !== null) {
            var limiters = settingElement.getAttribute("data-limiters").split(';');
            
            for (i = 0; i < limiters.length; i++) {
                var limiter = limiters[i];
                if(limiter.length > 0) {
                    // replacing multiple spaces with one
                    limiter = limiter.trim().replace(/  +/g, ' ');
                    // if guestLimit < 20
                    // grey

                    // {
                    //     action: "grey",
                    //     setting: "guestLimit_1",
                    //     settingValue: 20,
                    //     settingRequirement: "<" //less than
                    // }
                    var commands = limiter.split(',')[0].split(' ')
                    var results = limiter.split(', ')[1].split(' ')

                    var actionValue = "";
                    if(results.length > 1) {
                        if(results[1] === "to") {
                            actionValue = results[2]
                        }
                    }

                    // converting the settingValue into its type, only need to do this for booleans, as numbers are automatically converted when it's > or <
                    var isTrue = (commands[3] === 'true');
                    var isFalse = (commands[3] === 'false');
                    if(isTrue || isFalse) {
                        var settingValue = JSON.parse(commands[3]);
                    }else {
                        var settingValue = commands[3]
                    }

                    // converting the actionValue into its type if it's a boolean
                    var isTrue = (actionValue === 'true');
                    var isFalse = (actionValue === 'false');
                    if(isTrue || isFalse) {
                        actionValue = JSON.parse(actionValue);
                    }
                    
                    // currently only if it is an if type question, don't know if there will be others
                    if(commands[0] === "if") {
                        var limit = {
                            actionValue: actionValue,
                            action: results[0],
                            setting: commands[1] + alt,
                            settingValue: settingValue,
                            settingRequirement: commands[2]
                        }
                        object.limiters.push(limit)
                    }
                }
            }
        }

        // adding the object to the settingsobjects list, with alt if needed
        settingsObjects[settingElement.getAttribute("data-setting") + alt] = object;

    })

    var test = settingsObjects;
    console.log(test)

    // run though all the settings with object limiters, and add other linked settings, now that everything is created
    for (var name in settingsObjects) {
        var object = settingsObjects[name];
        // Looping through all the objects' limiters
        for (let i = 0; i < object.limiters.length; i++) {

            var otherObject = settingsObjects[object.limiters[i].setting];
            if(otherObject !== undefined) {
                // looping though all the other objects' current linked settings, to not repeat them
                var found = false;
                for (let j = 0; j < otherObject.linkedSettings.length; j++) {
                    if(otherObject.linkedSettings[j] === name) {
                        found = true;
                    }
                }
                if(!found) {
                    // adding the object name to the other object's linked settings
                    otherObject.linkedSettings.push(name)
                }
            }
        }
    }

    // run through all the settings and correct their limiter settingValue types, as they natureally get inputed all as strings
    for (var name in settingsObjects) {
        var object = settingsObjects[name];
        // Looping through all the objects' limiters
        for (let i = 0; i < object.limiters.length; i++) {
            var type = settingsObjects[object.limiters[i].setting].type;
            
            if(type === "boolean") {
                object.limiters[i].settingValue = (object.limiters[i].settingValue === 'true')
            }else if(type === "number") {
                object.limiters[i].settingValue = parseFloat(object.limiters[i].settingValue)
            }
        }
    }
    // run through all the settings and correct their limiter actionValue types, as they natureally get inputed all as strings
    for (var name in settingsObjects) {
        var object = settingsObjects[name];
        // Looping through all the objects' limiters
        for (let i = 0; i < object.limiters.length; i++) {
            var type = object.type
            
            if(type === "boolean") {
                object.limiters[i].actionValue = (object.limiters[i].actionValue === 'true')
            }else if(type === "number") {
                object.limiters[i].actionValue = parseFloat(object.limiters[i].actionValue)
            }
        }
    }

    // run through all the setting objects with limiters, and evaluating them, this should be the last step needed...?
    for (var name in settingsObjects) {
        var object = settingsObjects[name];
        // Looping through all the objects' limiters
        for (let i = 0; i < object.linkedSettings.length; i++) {
            // var usePreviousStatus = (i > 0) ? false : true;
            evaluateSettings(object.linkedSettings[i], name, 0)
        }
    }
}

compileSettings()

function recompileSettings(element) {
    // reads the settings element and updates a settings object
}

function setSettingValue(setting, value) {
    var recurtion = 0;
    // Updates a setting object with its value
    // If the setting exists
    if(settingsObjects[setting] !== undefined) {
        var set = settingsObjects[setting];
        // If the value is the right type for the setting
        if(set.type == typeof(value)) {
            set.storedValue = value
            set.value = value
            // evaluate other linked settings to this
            for (let i = 0; i < set.linkedSettings.length; i++) {
                console.log("Evaluate: " + set.linkedSettings[i])
                evaluateSettings(set.linkedSettings[i], setting, recurtion);
            }
        }else {
            console.error("[pS] The value '" + value + "' when trying to set the setting '" + setting + "' is not the right type (should be a " + set.type + ")")
        }
    }else {
        console.error("[pS] The setting '" + setting + "' doesn't exist")
    }
    // updateSettingView() //pass in setting name
    // evaluateSettings(); //Pass in settings' "linkedSettings"
}
// setSettingValue("guestLimit_1", 15)
// setSettingValue("requirePassword_1", true)

function evaluateSettings(setting, previous, recurtion, usePreviousStatus=false) {
    recurtion += 1;

    if(recurtion > 10) {
        console.error("[pS] Recurtion exceeded the limit of " + recurtionLimit + ", that might mean there was an infinant loop inside the settings, or there was a large chain of linked-settings")
        return;
    }

    var set = settingsObjects[setting];
    var limitations = [];
    if(usePreviousStatus) {
        limitations.push(set.status)
    }

    // Running though all the limiters for this setting
    for (let i = 0; i < set.limiters.length; i++) {
        var limiter = set.limiters[i];
        // if(limiter.setting == previous) {
        //     console.log(limiter);
        //     console.log(settingsObjects[previous].type)
        //     // Checking if the limiter can take effect
        //     if(limiter.settingRequirement === "==") {
        //         if(settingsObjects[previous].value === limiter.settingValue) {
        //             // Adding the limitation to the limitations list
        //             limitations.push(limiter.action)
        //         }
        //     }else if(limiter.settingRequirement === "<") {
        //         if(settingsObjects[previous].value < limiter.settingValue) {
        //             // Adding the limitation to the limitations list
        //             limitations.push(limiter.action)
        //         }
        //     }else if(limiter.settingRequirement === ">") {
        //         if(settingsObjects[previous].value > limiter.settingValue) {
        //             // Adding the limitation to the limitations list
        //             limitations.push(limiter.action)
        //         }
        //     }else {
        //         console.error("[pS] Setting-Requirement of '" + limiter.settingRequirement + "' is not a valid")
        //     }
        // }

        // Checking if the limiter can take effect
        var setValue = false;
        if(limiter.settingRequirement === "==") {
            if(settingsObjects[limiter.setting].value === limiter.settingValue) {
                if(limiter.action === "limit") {
                    setValue = true;
                    set.value = limiter.actionValue;
                }else {
                    // Adding the limitation to the limitations list
                    limitations.push(limiter.action)
                }
            }
        }else if(limiter.settingRequirement === "<") {
            if(settingsObjects[limiter.setting].value < limiter.settingValue) {
                if(limiter.action === "limit") {
                    setValue = true;
                    set.value = limiter.actionValue;
                }else {
                    // Adding the limitation to the limitations list
                    limitations.push(limiter.action)
                }
            }
        }else if(limiter.settingRequirement === ">") {
            if(settingsObjects[limiter.setting].value > limiter.settingValue) {
                if(limiter.action === "limit") {
                    setValue = true;
                    set.value = limiter.actionValue;
                }else {
                    // Adding the limitation to the limitations list
                    limitations.push(limiter.action)
                }
            }
        }else {
            console.error("[pS] Setting-Requirement of '" + limiter.settingRequirement + "' is not a valid")
        }
    }

    if(!setValue) {
        if(set.storedValue !== set.value) {
            set.value = set.storedValue
            updateSettingValue(setting);
        }
    }else {
        updateSettingValue(setting);
    }

    var replaceTags = [["show", "1"], ["grey", "2"], ["hide", "3"]];

    // Running though the list to see which is the most important limitation
    var final = 1;
    for (let i = 0; i < limitations.length; i++) {
        var lim = limitations[i];
        // Replacing the tags with numbers
        for (var j = 0; j < replaceTags.length; j++) {
            lim = lim.replace(new RegExp(replaceTags[j][0], 'g'), replaceTags[j][1]);
        }

        if(lim >= final) {
            final = lim;
        }
    }
    // Replacing the numbers with their tag counterpart
    for (var j = 0; j < replaceTags.length; j++) {
        final = final.toString().replace(new RegExp(replaceTags[j][1], 'g'), replaceTags[j][0]);
    }

    // Setting the final limiter value for the settings' status
    set.status = final;

    updateSettingView(setting);
}

function updateSettingView(setting) {
    var location = document.querySelector("[data-setting-alt='" + setting.split("_")[1] + "'] [data-setting='" + setting.split("_")[0] + "']");
    if(location == null) {
        location = document.querySelector("[data-setting='" + setting + "']").parentElement;
    }
    // now I am just grabbing the option's parent

    if(location !== null) {
        if(settingsObjects[setting].status === "hide") {
            location.classList.remove("grey");
            location.classList.add("hide");
        }else if(settingsObjects[setting].status === "grey") {
            location.classList.remove("hide");
            location.classList.add("grey");
        }else if(settingsObjects[setting].status === "show") {
            location.classList.remove("hide");
            location.classList.remove("grey");
        }
    }
}
function updateSettingValue(setting) {
    var location = document.querySelector("[data-setting-alt='" + setting.split("_")[1] + "'] [data-setting='" + setting.split("_")[0] + "'] [data-setting-input]");
    if(location == null) {
        location = document.querySelector("[data-setting='" + setting + "'] [data-setting-input]");
    }

    var value = settingsObjects[setting].value
    if(location.type === "range" || location.type === "text") {
        location.value = value  //untested
    }else if(location.type === "checkbox") {
        if(value == false) {
            location.removeAttribute("checked")
            location.checked = false
        }else {
            location.setAttribute("checked", "")
            location.checked = true
        }
    }else {
        console.warn("[pS] Need to continue expanding supported input types, because '" + location.type + "' is needed")
    }
}

// This is what the page interacts with
function updateSetting(input) {
    // Getting what alt value to add on to the main setting name
    var alt = "";
    if(input.closest("[data-setting-alt]") !== null) alt = "_" + input.closest("[data-setting-alt]").getAttribute("data-setting-alt");

    // Getting the main setting name
    if(input.closest("[data-setting]") !== null) {
        var setting = input.closest("[data-setting]").getAttribute("data-setting") + alt;
        // if(input.type === "checkbox") {
        //     setSettingValue("requirePassword_1", true)
        // }
        // Different forms of getting the value
        var value;
        if(input.type === "range") {
            value = parseFloat(input.value);
        }else if(input.type === "text") {
            value = input.value
        }else if(input.type === "checkbox") {
            value = input.checked
        }

        // Converting to the right form
        var type = input.closest("[data-setting-type]").getAttribute("data-setting-type");
        if(type === "boolean") {
            // Don't need to do anything
        }else if(type === "number") {
            value = parseFloat(value);
        }

        setSettingValue(setting, value);
    }

}

// This is what other javscript files interact with
function ARBupdateSetting(setting, value) {
    setSettingValue(setting, value);
    updateSettingValue(setting);
}