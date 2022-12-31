/*
*  Copyright (c) 2022 Andrew Gallimore. No Rights Reserved.
*
*/

// import splitGrid = require("./lib/split-grid");

// main.js interacts with any function starting with F[...]

function Falert(data) {

}
function FnewRoomItem(data) {
    // Loading a new room item in the rooms list in the ROOMS TAB
    var mainParent = document.querySelector("#main .maga-page.rooms .room-list")
    var template = mainParent.querySelector(".template .item");
    var pastParent = mainParent.querySelector(".flex-group");

    var temp = template.cloneNode(true);
    // console.log(temp)
    temp.querySelector(".room-title").innerHTML = data.name;
    temp.setAttribute("data-roomID", data.ID)

    // Adding the description option things to the room button
    if(data.soloDirector === true) {
        var option = document.createElement('p');
        option.setAttribute("data-optionType", "soloDirector")
        option.innerHTML = "Solo-Director";

        temp.querySelector(".data").appendChild(option)
    }
    if(data.injestRoom === true) {
        var option = document.createElement('p');
        option.setAttribute("data-optionType", "injestRoom")
        option.innerHTML = "Injest";

        temp.querySelector(".data").appendChild(option)
    }

    pastParent.appendChild(temp);

    // Loading a new room item in the rooms list in the CONTROL TAB
    var mainParent = document.querySelector("#main .maga-page.control .page.controls .scroll")
    var template = mainParent.querySelector(".template .item");
    var pastParent = mainParent.querySelector(".room-list");

    var temp = template.cloneNode(true);
    // console.log(temp)
    temp.querySelector(".room-title").innerHTML = data.name;
    temp.querySelector(".mainbox").setAttribute("data-roomID", data.ID)



    // temp.classList.add("ID-" + data.ID);
    
    pastParent.appendChild(temp)
}

// Rooms tab, when you click on a room option to view in on the page
function roomButtonClickedRooms(button) {
    // Update which button is active
    var addActive = true;
    if(button.classList.contains("active")) addActive = false;
    var buttonsParent = document.querySelector("#main .maga-page.rooms .room-list .flex-group");
    buttonsParent.querySelectorAll(".option.active").forEach(element => {
        element.classList.remove("active")
    })
    if(addActive) button.classList.add("active");

    // Getting room data
    var data = MgetRoomData(button.getAttribute("data-roomID"));

    // Load data into settings
    if(addActive) {
        loadRoomSettings(data);
    }else {
        hideRoomSettings();
    }

    // Load data into room-data
    if(addActive) {
        loadRoomData(data);
    }else {
        hideRoomData();
    }
    // Load data into links & possibly generate links if needed
    // Grab meshcast based on data

    // Running functions to adjust sliders to new width
    setTimeout(() => {
        updateSliderChildren('#main .maga-page.rooms .other-content .side-wrapper');
    }, 1);
}

// Rooms tab, showing the data/options/settings for a current room
function loadRoomSettings(data) {
    var settingsParent = document.querySelector("#main .maga-page.rooms .other-content .side-wrapper .menu");

    // Room name
    settingsParent.querySelector(".room-title").innerHTML = data.name;
    // Solo-director
    ARBupdateSetting("soloDirector", data.soloDirector);
    // Room is an Injest Room
    ARBupdateSetting("injestRoom", data.injestRoom);
    // Transfer only injest
    ARBupdateSetting("transferOnlyInjest", data.transferOnlyInjest);
    // Director has to OK people joining
    ARBupdateSetting("directorOKs", data.directorOKs);
    // Whether there is a password or not
    console.log(data.requirePassword)
    ARBupdateSetting("requirePassword", data.requirePassword);
    // Password Value
    ARBupdateSetting("password", data.password);

    console.log(data);

    // Starting to view the settings, after all the contents filled in
    document.querySelector("#main .maga-page.rooms .other-content .side-wrapper").classList.add("viewing")
}
function hideRoomSettings() {
    document.querySelector("#main .maga-page.rooms .other-content .side-wrapper").classList.remove("viewing")
}

// Rooms Tab, showing the data about the current room
function loadRoomData(data) {
    var dataParent = document.querySelector("#main .maga-page.rooms .room-data .list");

    // Room name
    dataParent.querySelector(".room-title").innerHTML = data.name;
    // Solo-director
    if(data.soloDirector) {
        dataParent.querySelector(".solo-director").innerHTML = "Solo-Director";
    }else {
        dataParent.querySelector(".solo-director").innerHTML = "Other Guests";
    }
    // Injest access type/level
    if(data.injestRoom) {
        dataParent.querySelector(".injest").innerHTML = "Public Injest";
    }else if(data.transferOnlyInjest) {
        dataParent.querySelector(".injest").innerHTML = "Transfer Only";
    }else {
        dataParent.querySelector(".injest").innerHTML = "People in rooms";
    }
    // Password
    if(data.requirePassword) {
        dataParent.querySelector(".password").innerHTML = '"' + data.password + "'";
    }else {
        dataParent.querySelector(".password").innerHTML = "None";
    }

    console.log(data)

    // Actually showing the data, after it has been filled in
    document.querySelector("#main .maga-page.rooms .room-data").classList.remove("hide")
}
function hideRoomData() {
    document.querySelector("#main .maga-page.rooms .room-data").classList.add("hide")
}




var controlViewCount = 2;
var controlViewDirection = 1; // 2=up/down 1=left/right
var loadedViews = {
    one: null,
    two: null
};

// Controls tab, when you click on a room option to view in on the page
function viewButtonClickedControls(button) {
    // Check what type it is, so that it can change any controls needed (like for controling scenes)

    var mainParent = document.querySelector("#main .maga-page.control .page.controls .scroll")
    var template = mainParent.querySelector(".template .item");
    var pastParent = mainParent.querySelector(".room-list");

    // Update which button is active
    var addActive = true;
    // if(button.parentNode.classList.contains("active")) addActive = false;
    if(button.parentNode == loadedViews.one || button.parentNode == loadedViews.two) {
        addActive = false;
    }

    
    if(controlViewCount > 1) {
        // this means there are multiple viewing boxes that the button clicked could go into
        
        // Removeing the current active buttons that aren't views currently being displayed
        var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
        buttonsParent.querySelectorAll(".option.active .mainbox").forEach(element => {
            if(element !== loadedViews.one && element !== loadedViews.two) {
                element.parentNode.classList.remove("active")
            }
        })
        // Removing any stray .hover's
        buttonsParent.querySelectorAll(".option.hover").forEach(element => {
            element.classList.remove("hover")
        })

        // So if the room is alread active in a box, it will just be like you are switching it to another box, or if you are putting it into a new box
        if(addActive) {
            button.parentNode.classList.add("hover");
        }

        // Making the dialog go in the right direction with how the boxes are layed out
        var offset = 0;
        var id = "lKPqq9LFZueaQ9XdR";
        var dialog = document.querySelector("[data-dialog-id=" + id + "]");
        if(controlViewDirection === 1) {
            // LEFT/RIGHT
            dialog.classList.add("d1")
            dialog.classList.remove("d2")

            offset = -80;
        }else if(controlViewDirection === 2){
            // UP/DOWN
            dialog.classList.add("d2")
            dialog.classList.remove("d1")
            
            offset = -40;
        }

        // Spawning a dialog to tell which box of the controls viewing area that it will put the content in
        openDialog(id, button, {
            hoverOutClose: false,
            clickOutClose: true,
            placement: 'right',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, offset],
                    },
                },
            ],
            callbackData: {
                button: button
            },
            callback: (data) => {
                console.log("Closed!")
                data.button.parentNode.classList.remove("hover");

                if(data.closeData) {
                    if(data.closeData === "one") {
                        // There are two options:
                        if(loadedViews.one !== null) {
                            // one, they are putting this in place of another one
                            loadedViews.one.parentNode.classList.remove("active")
                            clearContentInControls(button, "one")
                        }
                        if(loadedViews.two == button) {
                            // two, they are moving this to the other slot
                            loadedViews.two.parentNode.classList.remove("active")
                            loadedViews.two = null;
                            clearContentInControls(button, "two")
                            // If there was a place to add the option of loading past options when an empty slot opens up, here it is
                        }
                        loadedViews.one = button
                    }else if(data.closeData === "two") {
                        if(loadedViews.two !== null) {
                            // one, they are putting this in place of another one
                            loadedViews.two.parentNode.classList.remove("active")
                            clearContentInControls(button, "two")
                        }
                        if(loadedViews.one == button) {
                            // two, they are moving this to the other slot
                            loadedViews.one.parentNode.classList.remove("active")
                            loadedViews.one = null;
                            clearContentInControls(button, "one")
                            // If there was a place to add the option of loading past options when an empty slot opens up, here it is
                        }
                        loadedViews.two = button
                    }

                    if(addActive) {
                        // Adding active to the button loading the view
                        button.parentNode.classList.add("active");
                        // Load view into the box
                        loadContentInControls(button, data.closeData);
                    }
                }
            }
        });

    }else {
        // This means that there is only one viewing box that the button can go into, so just make it active

        // Removeing the current active buttons
        // var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
        // buttonsParent.querySelectorAll(".option.active").forEach(element => {
        //     element.classList.remove("active")
        // })

        console.log(addActive)
        if(addActive) {
            // Setting up the button
            if(loadedViews.one !== null) {
                // This removes the button selection which is currently being viewed in one
                loadedViews.one.parentNode.classList.remove("active")
                
                loadedViews.one = button
            }
            if(loadedViews.two == button) {
                // This removed the current view from two if it was in there last
                loadedViews.two.parentNode.classList.remove("hidden2")
                loadedViews.two = null;
                clearContentInControls(button, "two")
            }
            if(loadedViews.two !== null) {
                // This is just hiding the active from the button for the view on the right
                // loadedViews.two.parentNode.classList.add("hidden2")
            }
            button.parentNode.classList.add("active");

            // Load into the box
            clearContentInControls(button)
            loadContentInControls(button);
        }else {
            // Remove from box
        }
    }
}


function loadContentInControls(input, box="one") {
    // Find type from input
    var type = "";
    // var data = "";
    
    // Defineing type
    if(input.getAttribute("data-roomid") !== null) type = "room";

    // Need to add different types as I add them to the options in the control tab

    // Then grab the data for the people and such as well as update the Menu UI's based on type
    if(type === "room") {
        // Getting the locations for things
        var baseLocation = document.querySelector(".maga-page.control .video-section");
        var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
        var pastLocation = location.querySelector(".video-section-content .layout-wrapper")

        // Getting room data
        var data = MgetRoomData(input.getAttribute("data-roomID"));

        // Setting the name for the room in the page
        location.querySelector(".video-menu .center-label h2").innerHTML = data.name


        // Getting guests data's
        for (let i = 0; i < data.guests.length; i++) {
            // Need to add a case for if there is 0 guests in it
            
            var person = MgetPersonData(data.guests[i]);
            console.log(person)
            
            // Now grabing the template for the type of person (ex: guest, director, screenshare)
            if(person.type === "guest") {
                var temp = baseLocation.querySelector(".template .item.guest").cloneNode(true);

                // Setting label
                if(person.label) {
                    temp.querySelector(".label h3").innerText = person.label;
                }else {
                    temp.querySelector(".label h3").innerText = "Guest";
                }
                
                // Putting in video element to temp
                // Need to add option for iframe solo-view feeds, for not-chrome browser option to view people
                temp.querySelector(".video").appendChild(person.stream);
                
                // Putting in the whole video and stuff around it
                pastLocation.appendChild(temp);
                // Starting the video playing again, because it STOPS when you MOVE IT, AH!
                temp.querySelector(".video video").play();

            }else {
                console.log("[Front.js] Need to add new person type to be able to be added to the page when loading a room into the viewing box");
            }
        }
        if(data.guests.length < 1) {
            console.log("No Guests in Room")
        }
    }else if(type === "scene") {

    }else if(type === "person") {

    }
}
function clearContentInControls(input, box="one") {
    // Find type from input
    var type = "";

    // Defineing type
    if(input.getAttribute("data-roomid") !== null) type = "room";

    // Need to clear the UI based on the type
    if(type === "room") {
        // Getting the locations for things
        var baseLocation = document.querySelector(".maga-page.control .video-section");
        var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
        var peopleLocation = location.querySelector(".video-section-content .layout-wrapper")

        // // Getting room data
        // var data = MgetRoomData(input.getAttribute("data-roomID"));

        // Clearing the name for the room to nothing
        location.querySelector(".video-menu .center-label h2").innerHTML = ""

        // Removing all the people's cameras
        peopleLocation.querySelectorAll(".item").forEach(element => {
            element.remove();
        });

    }else if(type === "scene") {

    }else if(type === "person") {

    }
}

function changeBoxesInControls(boxStyle) {
    // Changing UI
    var element = document.querySelector(".maga-page.control .video-section");
    element.classList.remove("config-0");
    element.classList.remove("config-1");
    element.classList.remove("config-2");
    element.classList.add(boxStyle);

    // Changing Variables
    if(boxStyle === "config-0") {
        controlViewCount = 1
        if(loadedViews.two !== null) loadedViews.two.parentNode.classList.add("hidden2")
    }else {
        controlViewCount = 2
        if(loadedViews.two !== null) loadedViews.two.parentNode.classList.remove("hidden2")

        if(boxStyle === "config-1") {
            controlViewDirection = 2
        }else if(boxStyle === "config-2") {
            controlViewDirection = 1
        }
    }
}

// Setting the parameters for the slit functionality of the two view boxes in the controls tab
// SplitGrid({
//     columnGutters: [{
//         track: 1,
//         element: document.querySelector('.video-section .inner-gutter-col-1'),
//     }],
// })

// SplitGrid({
//     columnGutters: [{
//         track: 1,
//         element: document.querySelector('.gutter-col-1'),
//     }, {
//         track: 3,
//         element: document.querySelector('.gutter-col-3'),
//     }],
// })

// Split(['.maga-page.content .side-wrapper.one', '.maga-page.content .video-section', '.maga-page.content .side-wrapper.two'], {
//     expandToMin: true,
// })

// Split(['#split-0', '#split-1', '#split-2'])