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
var loadedViews2 = {
    one: {
        filled: false,
        type: "",
        data: {
            
        }
    },
    two: {
        filled: false,
        type: "",
        data: {
            
        }
    }
};
var pocketView = {};

// Controls tab, when you click on a room option to view in on the page
function viewButtonClickedControls(button) {
    if(controlViewCount > 1) {
        // Removing any stray .hover's
        var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
        buttonsParent.querySelectorAll(".option.hover").forEach(element => {
            element.classList.remove("hover")
        })

        // Adding hover the the current button which will have the dialog
        button.parentNode.classList.add("hover");

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
                data.button.parentNode.classList.remove("hover");

                if(data.closeData) {
                    // Check if there is another view in the {data.closeData} viewBox
                    if(loadedViews2[data.closeData].filled) {
                        // Remove the current view inside the view box we are placing into
                        clearContentInControls(data.closeData);
                    }

                    // This would be the place to have any other limiters for loading things in a view

                    // Load view into the box
                    if(button.getAttribute("data-roomid") !== null) {
                        var type = "room";
                        var id = button.getAttribute("data-roomID");
                        loadContentInControls(type, {id: id}, data.closeData);
                    }
                    
                    // Adding active to the button loading the view through updating the buttons
                    updateViewButtonsControls();
                }
            }
        });

    }else {
        // This means that there is only one viewing box that the button can go into, so just make it active

        // Removeing the current active buttons
        var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
        buttonsParent.querySelectorAll(".option.active").forEach(element => {
            element.classList.remove("active")
        })

        var addActive = true;
        if(addActive) {
            // Check if there is another view in the {data.closeData} viewBox
            if(loadedViews2.one.filled) {
                // Remove the current view inside the view box we are placing into
                clearContentInControls("one");
            }

            // Load view into the box
            if(button.getAttribute("data-roomid") !== null) {
                var type = "room";
                var id = button.getAttribute("data-roomID");
                loadContentInControls(type, {id: id}, "one");
            }

            // // Setting up the button
            // if(loadedViews.one.button !== null) {
            //     // This removes the button selection which is currently being viewed in one
            //     loadedViews.one.button.parentNode.classList.remove("active")
                
            //     loadedViews.one.button = button
            // }
            // if(loadedViews.two.button == button) {
            //     // This removed the current view from two if it was in there last
            //     loadedViews.two.button.parentNode.classList.remove("hidden2")
            //     loadedViews.two.button = null;
            //     loadedViews.two.room = null;
            //     clearContentInControls(button, "two")
            // }
            // if(loadedViews.two.button !== null) {
            //     // This is just hiding the active from the button for the view on the right
            //     console.log("Not Null for 2")
            //     // loadedViews.two.button.parentNode.classList.add("hidden2")
            // }
            button.parentNode.classList.add("active");

            // Load into the box
            clearContentInControls(button)

            var type = "";
            var id = "";
            if(button.getAttribute("data-roomid") !== null) {
                type = "room";
                id = button.getAttribute("data-roomID");
            }

            loadContentInControls(type, {id: id});
        }else {
            // Remove from box
        }
    }
}

// Control tab, updating the styles for all the room/scene/guest buttons based on current loaded views
function updateViewButtonsControls() {
    // Removeing the current active buttons that aren't views currently being displayed
    var buttonsParent = document.querySelector("#main .maga-page.control .page.controls .scroll");
    buttonsParent.querySelectorAll(".option .mainbox").forEach(element => {
        // if(element !== loadedViews.one.button && element !== loadedViews.two.button) {
        //     element.parentNode.classList.remove("active")
        // }
        // Removing the active class
        element.parentNode.classList.remove("active");
        
        // Checking for rooms if a button is a room that is active, if so, it adds back the active class
        if(element.getAttribute("data-roomid") !== null) {
            if(loadedViews2.one.filled && loadedViews2.one.type === "room") {
                if(loadedViews2.one.data.roomID === element.getAttribute("data-roomid")) element.parentNode.classList.add("active");
            }
            if(loadedViews2.two.filled && loadedViews2.two.type === "room") {
                if(loadedViews2.two.data.roomID === element.getAttribute("data-roomid")) element.parentNode.classList.add("active");
            }
        }
    })
    // Removing any stray .hover's
    buttonsParent.querySelectorAll(".option.hover").forEach(element => {
        element.classList.remove("hover")
    })

    // Need to add the .active to the ones that need it
}

// Control tab, loading in the content (ie. guests, directors, room labels, guest count, etc.) into a particular view box
function loadContentInControls(type, data, box="one") {
    if(type === "room") {
        // Checking if there is a room in another box we can clone over, or if we will have to generate it now
        if(data.id.toString() === loadedViews2.one.data.roomID) {
            // We can clone over the content from the one box

            // Setting the loadedViews2 data for the new room inside it
            loadedViews2[box].filled = true;
            loadedViews2[box].type = "room";
            loadedViews2[box].data.roomID = data.id;

            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var grabLocation = baseLocation.querySelector(".block.one");
            var pastLocation = baseLocation.querySelector(".block.two");

            // Swapping the whole video section's, the previous should be blank, othwise it would look like we are swapping rooms
            var temp = grabLocation.querySelector(".video-section-content");
            var previous = pastLocation.querySelector(".video-section-content").cloneNode(true)
            pastLocation.querySelector(".video-section-content").replaceWith(temp);
            grabLocation.appendChild(previous);

            // Tranfering the label
            pastLocation.querySelector(".video-menu .center-label h2").innerHTML = grabLocation.querySelector(".video-menu .center-label h2").innerHTML;

            // Remove the content from the one box
            clearContentInControls("one")
        }else if(data.id.toString() === loadedViews2.two.data.roomID) {
            // We can clone over the content from the two box

            // Setting the loadedViews2 data for the new room inside it
            loadedViews2[box].filled = true;
            loadedViews2[box].type = "room";
            loadedViews2[box].data.roomID = data.id;

            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var grabLocation = baseLocation.querySelector(".block.two");
            var pastLocation = baseLocation.querySelector(".block.one");

            // Swapping the whole video section's, the previous should be blank, othwise it would look like we are swapping rooms
            var temp = grabLocation.querySelector(".video-section-content");
            var previous = pastLocation.querySelector(".video-section-content").cloneNode(true)
            pastLocation.querySelector(".video-section-content").replaceWith(temp);
            grabLocation.appendChild(previous);

            // Tranfering the label
            pastLocation.querySelector(".video-menu .center-label h2").innerHTML = grabLocation.querySelector(".video-menu .center-label h2").innerHTML;

            // Remove the content from the two box
            clearContentInControls("two")
        }else {
            // We need to generate the room fully

            // Setting the loadedViews2 data for the new room inside it
            loadedViews2[box].filled = true;
            loadedViews2[box].type = "room";
            loadedViews2[box].data.roomID = data.id;

            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
            var pastLocation = location.querySelector(".video-section-content .layout-wrapper")

            // Getting room data
            var roomData = MgetRoomData(data.id);

            // Setting the name for the room in the page
            location.querySelector(".video-menu .center-label h2").innerHTML = roomData.name


            for (let i = 0; i < roomData.guests.length; i++) {
                // Getting guests data's
                var personData = MgetPersonData(roomData.guests[i]);

                if(personData.type === "guest") {
                    // This creates the person through the tracking-guest's function logic
                    trackGuest(personData); //This function defaults to the UI wanting to add someone, so don't need to add an event option when calling it
                }else {
                    console.warn("[Front.js] Need to add new person type of (" + personData.type + ") to be able to be added to the page when loading a room into the viewing box");
                }
            }
        }

        if(roomData) {
            if(roomData.guests.length < 1) {
                console.log("No Guests in Room")
            }
        }
    }else if(type === "scene") {

    }else if(type === "person") {

    }
}
// Control tab, removing the content from a particular view box
function clearContentInControls(box="one") {
    // Find type from the data stored for the view
    var type = loadedViews2[box].type;
    
    // Clearing the UI based on the type
    if(type === "room") {
        // Getting the locations for things
        var baseLocation = document.querySelector(".maga-page.control .video-section");
        var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
        var peopleLocation = location.querySelector(".video-section-content .layout-wrapper")
        
        // Clearing the name for the room to nothing
        location.querySelector(".video-menu .center-label h2").innerHTML = ""
        
        // Removing all the people's cameras
        peopleLocation.querySelectorAll(".item").forEach(element => {
            element.remove();
        });
    }else if(type === "scene") {

    }else if(type === "person") {

    }

    // Clearing the data in the loadedViews2 for the current viewBox
    loadedViews2[box].filled = false;
    loadedViews2[box].type = "";
    loadedViews2[box].data = {};
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

        if(loadedViews2.two.filled) {
            if(loadedViews2.one.filled) {
                pocketView = {...loadedViews2.two};
                clearContentInControls("two");
                updateViewButtonsControls();
            }else {
                // In this case, there is something in two but not one, so just move two over to one
                if(loadedViews2.two.type === "room") {
                    loadContentInControls("room", {id: loadedViews2.two.data.roomID}, "one");
                    updateViewButtonsControls();
                }
            }
        }
    }else {
        controlViewCount = 2
        if(pocketView !== {}) {
            if(pocketView.type === "room") {
                loadContentInControls("room", {id: pocketView.data.roomID}, "two");
                updateViewButtonsControls();
            }
            pocketView = {};
        }

        if(boxStyle === "config-1") {
            controlViewDirection = 2
        }else if(boxStyle === "config-2") {
            controlViewDirection = 1
        }
    }
    WHRatioSet();
}


// Control tab, creating in the 'connecting' ui for a guest
function createLoadingGuest(personData) {
    console.log("Creating LOADING")
    // THIS IS NOT PROPPER MULTI-VIDEO-LOCATION LOGIC, NEED TO FIX IN FUTURE
    // Getting what box the persons video should be in, currently only check for rooms where people would be
    var type;
    var box;
    if(loadedViews2.one.filled === true && loadedViews2.one.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "one";
    }else if(loadedViews2.two.filled === true && loadedViews2.two.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "two";
    }

    // The code for actually adding the element
    if(type === "room") {
        if(box) {
            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
            var pastLocation = location.querySelector(".video-section-content .layout-wrapper")

            // Checking if there is already an element for the person
            var found = pastLocation.querySelector('[guest-element="' + personData.streamID + '"]')
            if(found == null) {
                // Cloneing guest UI base (without specific data)
                var temp = baseLocation.querySelector(".template .item.guest").cloneNode(true);
                temp.classList.add("connecting");
                temp.setAttribute("guest-element", personData.streamID);
                
                // Putting in the whole video and stuff around it
                pastLocation.appendChild(temp);
                WHRatioSet();
            }
        }
    }
}
// Control tab, transitions a person from the connecting status to fully created
function creatFullGuest(personData) {
    console.log("Creating FULL")
    // THIS IS NOT PROPPER MULTI-VIDEO-LOCATION LOGIC, NEED TO FIX IN FUTURE
    // Getting what box the persons video should be in, currently only check for rooms where people would be
    var type;
    var box;
    if(loadedViews2.one.filled === true && loadedViews2.one.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "one";
    }else if(loadedViews2.two.filled === true && loadedViews2.two.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "two";
    }

    // The code for actually adding the element
    if(type === "room") {
        if(box) {
            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
            var pastLocation = location.querySelector(".video-section-content .layout-wrapper")

            // Checking if there is already an element for the person
            var found = pastLocation.querySelector('[guest-element="' + personData.streamID + '"]')
            if(found == null) {
                // Cloneing guest UI base (without specific data)
                var temp = baseLocation.querySelector(".template .item.guest").cloneNode(true);
                temp.setAttribute("guest-element", personData.streamID);
                
                // Putting in the whole element in the page
                pastLocation.appendChild(temp);

                // Re-finding the found variable, now that we created it
                found = pastLocation.querySelector('[guest-element="' + personData.streamID + '"]')
            }

            // Adding the content to the person's element VVV

            // Putting in video element
            // Need to add option for iframe solo-view feeds, for not-chrome browser option to view people
            if(personData.stream !== undefined) {
                // Adding the video because its there
                found.querySelector(".video").appendChild(personData.stream);

                // Starting the video playing again, because it STOPS when you MOVE IT in dom, AH!
                found.querySelectorAll(".video video").forEach(element => {
                    element.play();
                })
                WHRatioSet();

            }else {
                // Adding the "getting video" element because the videos not there yet
                found.classList.add("loadingVideo");
            }

            // Setting label
            if(personData.label) {
                found.querySelector(".label h3").innerText = personData.label;
            }else {
                found.querySelector(".label h3").innerText = "Guest";
            }

            // Removing the loading styling
            found.classList.remove("connecting");
        }
    }
}
// Control tab, adding the video to the guest's UI
function loadUserVideo(personData) {
    // THIS IS NOT PROPPER MULTI-VIDEO-LOCATION LOGIC, NEED TO FIX IN FUTURE
    // Getting what box the persons video should be in, currently only check for rooms where people would be
    var type;
    var box;
    if(loadedViews2.one.filled === true && loadedViews2.one.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "one";
    }else if(loadedViews2.two.filled === true && loadedViews2.two.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "two";
    }

    // The code for actually adding the element
    if(type === "room") {
        if(box) {
            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
            var pastLocation = location.querySelector(".video-section-content .layout-wrapper")
            
            // Checking if there is already an element for the person
            var found = pastLocation.querySelector('[guest-element="' + personData.streamID + '"]')
            if(found) {
                if(!found.classList.contains("connecting")) {
                    // console.log("Creating VIDEO")
                    // Adding in the video element
                    found.querySelector(".video").appendChild(personData.stream);
                    // Starting the video playing again, because it STOPS when you MOVE IT in dom, AH!
                    found.querySelector(".video video").play();

                    // Removing the loading styling
                    found.classList.remove("connecting");
                    found.classList.remove("loadingVideo");
                }
            }
        }
    }
    // Check for them on the page (not connecting)

    // add their video to the page
    // Unlock the buttons for the video now (if they were locked with js)
}
// Control tab, remocing the person from the page
function removeGuest(personData) {
    console.log("Removing Guest")
    // THIS IS NOT PROPPER MULTI-VIDEO-LOCATION LOGIC, NEED TO FIX IN FUTURE
    // Getting what box the persons video should be in, currently only check for rooms where people would be
    var type;
    var box;
    if(loadedViews2.one.filled === true && loadedViews2.one.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "one";
    }else if(loadedViews2.two.filled === true && loadedViews2.two.data.roomID.toString() === personData.room.toString()) {
        type = "room";
        box = "two";
    }

    // The code for actually adding the element
    if(type === "room") {
        if(box) {
            // Getting the locations for things
            var baseLocation = document.querySelector(".maga-page.control .video-section");
            var location = (box === "one")? baseLocation.querySelector(".block.one") : baseLocation.querySelector(".block.two");
            var getLocation = location.querySelector(".video-section-content .layout-wrapper")

            // Checking if they are on the page in the box they should be in
            var found = getLocation.querySelector('[guest-element="' + personData.streamID + '"]')
            if(found !== null) {
                // Removing the person UI element
                found.remove();
            }
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