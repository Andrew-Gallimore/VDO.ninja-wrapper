/*
*  Copyright (c) 2022 Andrew Gallimore. No Rights Reserved.
*
*/

/*
This is the main loop and system of the director view, only communicating with the frontend and backend (front.js & back.js)
This is needed so I can control the director view at a high level.
*/

// Temporary
var roomDataCashe = {
	directorOwned: "unknown",
    roomLabels: {

    },
	roomSettings: {

	},
	roomCount: 0
};

var media = {};
media.tracks = {};
media.streams = {};

// Event system for lissening to Iframe API messages, and calling any custom functions who are lissening to the messages
var customEventCallbacks = [];

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
eventer(messageEvent, function (e) {
	if(e.data.kind !== "video" && e.data.kind !== "audio") {
		if(e.data.action !== "view-stats-updated" && e.data.stats === undefined) {
			if(e.data.streamIDs === undefined) {
				// console.log("Window event")
				// // console.log(e)
				// console.log(e.data)
			}
		}
	}else {
		// console.log("AudioVideo")
	}
	for (let i = 0; i < customEventCallbacks.length; i++) {
		customEventCallbacks[i].function(e, customEventCallbacks[i].Eid, customEventCallbacks[i].data);
	}
});


// Main variables
var roomDataList = [];

// Main function: makes rooms, starts lisseners, etc.
async function startMain() {

	// get director ID and set up the room ID system (in sub-layer)
	var directorSeed = getDirectorID();
	provisionRoomIDs(directorSeed);

	roomStatus = await loadRoom(0);
	console.log("Awesome")
	
	var room1ID = getRoomID(0);
	var roomsData = await checkRoomData(room1ID); //Should also check local data and store it there, encase director needs to reload

	
	// if a director already owns the room (and this director view isn't a co-director)
	if(roomsData.data.directorOwned == true) {
		// Alert the user that this room is taken, and possibly set up another directors id and such for them?
		console.log("[Room is already taken by other director]");

		// Alerting user of this, with options of what to do
		
	}else if(roomsData.data.directorOwned == false) {
		console.log("Claiming the room")
		// reserve the room
		await updateRoomData(room1ID, "reserved", true)

		// loadContentInControls("room", room1ID);

		// update lisseners to lissen for guest joining events, and leaving, and video, etc.
		guestLisseners(room1ID);

		// Making a new room on the front end
		FnewRoomItem(roomsData.data)
	}else {
		// // if there are no other rooms & this one hasn't been setup yet (this is someone creating this)
		// if(roomsData.data.roomCount < 1 && roomsData.data.roomLabels["_" + room1ID] == undefined) {
		// 	await updateRoomData(room1ID, "roomCount", 1)
			
		// 	// prompt creating a room
		// 	await updateRoomData(room1ID, "directorOwned", true);

		// 	// update lisseners to lissen for guest joining events, and leaving, and video, etc.
		// 	guestLisseners(room1ID);
		// }
	}

	await loadRoom(1);
	var room2ID = getRoomID(1);
	var rooms2Data = await checkRoomData(room2ID);
	guestLisseners(room2ID);
	FnewRoomItem(rooms2Data.data)

		// Check data inside first room for how many other rooms and their names & such
			//get room data
			//begin another function for the other rooms
		// begin opening the next rooms
		// Check for data inside first room for passwords & presets, etc.

	// console.log("Almost Finished")
	// roomStatus = await loadRoom(1);
	console.log("Finished")

	return;
}

startMain();




function MgetRoomData(roomID) {
	var responce = readCurrentRoomData(roomID).data;
	return responce;
}
function MgetPersonData(streamID) {
	var responce = readPersonData(streamID).data;
	return responce;
}


// These events tell the guest tracker to update a person's joining/leaving status (and the front end for it) accordingly
// These events can be broken out later in the API as well

// This means that someone is changing in some way, likely joining or leaving
function MguestChanging(personObject) {
	trackGuest(personObject, "guestChanging");
}

// This means that we have the data for someone who is currently connecting
function MgotGuestData(personObject) {
	trackGuest(personObject, "gotGuestData");
}

// This means a person has officially connected, and so create their elements
function MguestConnected(personObject) {
	trackGuest(personObject, "guestConnected");
}
// This means a video is availible, allowing it to dynamically load the video independently from the person's elements
function MguestVideoCreated(personObject) {
	trackGuest(personObject, "guestVideoCreated");
}

// This means a person has officially left, and so remove their elements
function MguestLeft(personObject) {
	trackGuest(personObject, "guestLeft");
}

var trackedGuests = [];
function trackGuest(personObject, event="loadOnPage") {
	// console.log(personObject)
	var found = false;
	for (let i = 0; i < trackedGuests.length; i++) {
		if(trackedGuests[i].streamID === personObject.streamID) {
			// They are currently tracked already, sweeet!
			found = true;
			break;
		}
	}
	if(!found) {
		// They are not yet tracked, and so we need to track them and create any 'connecting' UI needed
		trackedGuests.push({
			streamID: personObject.streamID,
			room: personObject.room,
			events: {
				guestChanging: true,
				gotData: false,
				guestConnected: false,
				videoCreated: false,
				guestLeft: false
			}
		})

		// Call connecting UI
		createLoadingGuest(personObject);
	}

	// Running through what the UI will need to do for the event for the person
	for (let i = 0; i < trackedGuests.length; i++) {
		if(trackedGuests[i].streamID === personObject.streamID) {
			// Checking if they are even supposed to be in any UI currently
			var needsUI = false;
			if(loadedViews.one.room === trackedGuests[i].room) {
				needsUI = true;
			}else if(loadedViews.two.room === trackedGuests[i].room) {
				needsUI = true;
			}

			// Seeing what needs to happen to UI (if needed) based on event
			if(event === "guestChanging") {
				// This can be a person joining or leaving (I don't know of any other cases)
				
				// Currently, just change them to loading animation
				trackedGuests[i].events.guestChanging = true;
			}else if(event === "guestConnected") {
				if(trackedGuests[i].events.gotData) {
					// Create the person!
					creatFullGuest(personObject);
					trackedGuests[i].events.guestChanging = false;
				}
				trackedGuests[i].events.guestConnected = true;
			}else if(event === "gotGuestData") {
				if(trackedGuests[i].events.guestConnected) {
					// Create the person!
					creatFullGuest(personObject);
					trackedGuests[i].events.guestChanging = false;
				}
				trackedGuests[i].events.gotData = true;
			}else if(event === "guestVideoCreated") {
				// Checking if the event has already been called
				loadUserVideo(personObject);
				trackedGuests[i].events.videoCreated = true;
			}else if(event === "guestLeft") {
				// Remove the person's UI (or equivalent)

				trackedGuests[i].events.guestChanging = false;
				trackedGuests[i].events.guestLeft = true;
			}else if(event === "loadOnPage") {
				// This is the Front end Calling for the person to be loaded on page
				if(trackedGuests[i].events.guestChanging) {
					// Create person UI for a connecting person
					createLoadingGuest(personObject);
				}else if(trackedGuests[i].events.gotData && trackedGuests[i].events.guestConnected) {
					// Create person in full
					creatFullGuest(personObject);
				}
			}

			break;
		}
	}
}




// TODO, when loading an IFrame times out, it needs to regognize that and specify that there is an issue (and possibly remove the lissener)
// TODO, figure out how to get if someone is sending video or not for the statuses of people's objects, might need to ask steve
// TODO, need to add protection against the same streamID, because it breaks it
// TODO, add Multi-Video-Location displaying of a person's video feed, because currently there is only one element allowed