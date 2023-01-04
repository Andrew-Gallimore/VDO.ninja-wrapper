/*
*  Copyright (c) 2022 Andrew Gallimore. No Rights Reserved.
*
*/

// import splitGrid = require("./lib/split-grid");

// main.js interacts with any function starting with F[...]
displayedGuests = [];
// From back end, creating a new room button wherever it needs them
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

// Rooms tab, when you click on a room option to view in on the page (handles the other functions to call)
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
// Room tab, hiding the data/options/settings for a room
function hideRoomSettings() {
    document.querySelector("#main .maga-page.rooms .other-content .side-wrapper").classList.remove("viewing")
}

// Rooms Tab, showing the room-data about the current room
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
// Rooms Tab, hiding the room-data about the current room
function hideRoomData() {
    document.querySelector("#main .maga-page.rooms .room-data").classList.add("hide")
}




var controlViewCount = 2;
var controlViewDirection = 1; // 2=up/down 1=left/right
var loadedViews = {
    one: {
        button: null,
        room: null
    },
    two: {
        button: null,
        room: null
    }
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
    if(button.parentNode == loadedViews.one.button || button.parentNode == loadedViews.two.button) {
        addActive = false;
    }

    
    if(controlViewCount > 1) {
        // this means there are multiple viewing boxes that the button clicked could go into
        
        // Removeing the current active buttons that aren't views currently being displayed
        var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
        buttonsParent.querySelectorAll(".option.active .mainbox").forEach(element => {
            if(element !== loadedViews.one.button && element !== loadedViews.two.button) {
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
                        if(loadedViews.one.button !== null) {
                            // one, they are putting this in place of another one
                            loadedViews.one.button.parentNode.classList.remove("active")
                            clearContentInControls(button, "one")
                        }
                        if(loadedViews.two.button == button) {
                            // two, they are moving this to the other slot
                            loadedViews.two.button.parentNode.classList.remove("active")
                            loadedViews.two.button = null;
                            clearContentInControls(button, "two")
                            // If there was a place to add the option of loading past options when an empty slot opens up, here it is
                        }
                        loadedViews.one.button = button
                    }else if(data.closeData === "two") {
                        if(loadedViews.two.button !== null) {
                            // one, they are putting this in place of another one
                            loadedViews.two.button.parentNode.classList.remove("active")
                            clearContentInControls(button, "two")
                        }
                        if(loadedViews.one.button == button) {
                            // two, they are moving this to the other slot
                            loadedViews.one.button.parentNode.classList.remove("active")
                            loadedViews.one.button = null;
                            clearContentInControls(button, "one")
                            // If there was a place to add the option of loading past options when an empty slot opens up, here it is
                        }
                        loadedViews.two.button = button
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
            if(loadedViews.one.button !== null) {
                // This removes the button selection which is currently being viewed in one
                loadedViews.one.button.parentNode.classList.remove("active")
                
                loadedViews.one.button = button
            }
            if(loadedViews.two.button == button) {
                // This removed the current view from two if it was in there last
                loadedViews.two.button.parentNode.classList.remove("hidden2")
                loadedViews.two.button = null;
                clearContentInControls(button, "two")
            }
            if(loadedViews.two.button !== null) {
                // This is just hiding the active from the button for the view on the right
                // loadedViews.two.button.parentNode.classList.add("hidden2")
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

// Control tab, loading in the content (ie. guests, directors, room labels, guest count, etc.) into a particular view box
function loadContentInControls(input, box="one") {
    // Find type from input
    var type = "";
    // var data = "";
    
    // Defineing type
    if(input.getAttribute("data-roomid") !== null) type = "room";

    // Need to add different types as I add them to the options in the control tab

    // Then grab the data for the people and such as well as update the Menu UI's based on type
    if(type === "room") {
        // Setting the current roomID in loadedViews
        loadedViews[box].room = input.getAttribute("data-roomID");

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
            
            var personData = MgetPersonData(data.guests[i]);
            console.log(personData)
            
            // Now grabing the template for the type of person (ex: guest, director, screenshare)
            if(personData.type === "guest") {
                createGuestUI(personData);
                // var temp = baseLocation.querySelector(".template .item.guest").cloneNode(true);

                // // Setting label
                // if(person.label) {
                //     temp.querySelector(".label h3").innerText = person.label;
                // }else {
                //     temp.querySelector(".label h3").innerText = "Guest";
                // }
                
                // // Putting in video element to temp
                // // Need to add option for iframe solo-view feeds, for not-chrome browser option to view people
                // temp.querySelector(".video").appendChild(person.stream);
                
                // // Putting in the whole video and stuff around it
                // pastLocation.appendChild(temp);
                // // Starting the video playing again, because it STOPS when you MOVE IT, AH!
                // temp.querySelector(".video video").play();

            }else {
                console.warn("[Front.js] Need to add new person type of (" + personData.type + ") to be able to be added to the page when loading a room into the viewing box");
            }
        }
        if(data.guests.length < 1) {
            console.log("No Guests in Room")
        }
    }else if(type === "scene") {

    }else if(type === "person") {

    }
}
// Control tab, removing the content from a particular view boxt
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

// TODO: I will also need to do this for removing the person from the page
// Creating a guest on the page
function createGuestUI(personData) {
    console.log(personData)
    personData.UI.showingMainUI = true;
    // Handling alot of creating the person (if the other steps haven't happened yet)


    // Getting what box the persons video is in
    var box;
    console.log(loadedViews)
    if(loadedViews.one.room === personData.room.toString()) {
        box = "one";
    }else if(loadedViews.two.room === personData.room.toString()) {
        box = "two";
    }

    console.log(box)
    if(box) {
        // Getting the locations for things
        var baseLocation = document.querySelector(".maga-page.control .video-section");
        var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
        var pastLocation = location.querySelector(".video-section-content .layout-wrapper")

        // Cloneing guest UI base (without specific data)
        var temp = baseLocation.querySelector(".template .item.guest").cloneNode(true);

        // Setting label
        if(personData.label) {
            temp.querySelector(".label h3").innerText = personData.label;
        }else {
            temp.querySelector(".label h3").innerText = "Guest";
        }
        
        // Putting in video element to temp
        // Need to add option for iframe solo-view feeds, for not-chrome browser option to view people
        if(personData.UI.hasVideo) {
            temp.querySelector(".video").appendChild(personData.stream);
        }else {
            // Create a "loading video element" (need to get the aspect ratio for the stand in video)
        }
        
        // Putting in the whole video and stuff around it
        pastLocation.appendChild(temp);
        // Starting the video playing again, because it STOPS when you MOVE IT in dom, AH!
        temp.querySelector(".video video").play();
    }
}

function loadUserVideo(personData) {
    personData.UI.hasVideo = true;
    if(personData.UI.showingMainUI) {
        // Create it
    }
}

// Control tab, changing the orientation and count of the view boxes
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
        if(loadedViews.two.button !== null) loadedViews.two.button.parentNode.classList.add("hidden2")
    }else {
        controlViewCount = 2
        if(loadedViews.two.button !== null) loadedViews.two.button.parentNode.classList.remove("hidden2")

        if(boxStyle === "config-1") {
            controlViewDirection = 2
        }else if(boxStyle === "config-2") {
            controlViewDirection = 1
        }
    }
}



// Control tab, handling what a message about a guest loading/leaving means (relative to the other messages)
function FhandleGuestStat(type, personObject) {

}
// Control tab, creating in the 'loading' ui for a guest
function createLoadingGuest() {

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