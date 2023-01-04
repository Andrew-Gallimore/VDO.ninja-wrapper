/*
*  Copyright (c) 2022 Andrew Gallimore. All Rights Reserved.
*
*/

/*
This is a layer which has some of my new structure of commands, that builds off the old structure in VDO.ninja
This is needed so I can run functions without worrying about their connections to the bridge & Iframe API
*/


function getDirectorID() {
	// Eventually will need to get it from URL params

	// Temporaraly
	return "kXfEikzQQ68tySm";
}

function generateRTid() {
	var date = new Date;
	return id = (date.getTime() * 100) + Math.floor(Math.random() * 100);
}

// Only after dom has loaded, otherwise it causes issues aparently
var loadingIframes = [];
var promiseResolve = [];
function loadIframe(ID){
	var iframe = document.createElement("iframe");
	iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;";
	iframe.classList.add("vdon");
	iframe.classList.add("_" + ID);

	// var iframesrc="https://vdo.ninja/alpha/?sendframes?director=" + ID;
	// var iframesrc="https://vdoninja.netlify.app/?sendframes&salt=vdo.ninja&director=" + ID;
	var iframesrc="https://vdo.ninja/alpha/?sendframes?director=" + ID;
    console.log(iframesrc.toString())
	iframe.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
	iframe.src = iframesrc;

	document.body.appendChild(iframe);

	// loadingIframe.then(value => { console.log("Yay: " + value) })

	var Pid = ID;
	var position = loadingIframes.length;

	loadingIframes[position] = {
		"Pid": Pid
	};
	return loadingIframes[position].Promise = new Promise((resolve, reject) => {
		// Creating backup timeout for 15 seconds
		setTimeout(() => {
			resolve("Timed Out")
			// TODO: Add the removing of other saved ID's like in "loadingIFrames", for example, look at the loadingLabels
		}, 15000);

		// Setting up remote function to resolve this promise (meaning that the Iframe has loaded)
		var Rid = generateRTid();
		promiseResolve[promiseResolve.length] = {
			"Rid": Rid,
			"resolve": resolve
		};

		// Setting up event system to know when Iframe has loaded
		var Eid = generateRTid();
		customEventCallbacks.push({
			"Eid": Eid,
			"data": {
				"Rid": Rid,
				"Pid": Pid
			},
			function: (e, Eid, data) => {
			// function: (e, Eid, Rid, Pid) => {
				// Checking if it is the first room that sent the event & if the event is the right one
				if(e.source === document.querySelector("._" + data.Pid).contentWindow && e.data.action === "joined-room-complete") {
					// resolving the loadingIframe Promise & removing its resolve-function from list
					// promiseResolve[Rid]("Created Room")
					for (let i = 0; i < promiseResolve.length; i++) {
						if(promiseResolve[i].Rid === data.Rid) {
							promiseResolve[i].resolve("Created Room")
							promiseResolve.splice(i, 1)
						}
						
					}
					
					// removing the promise itself
					for (let i = 0; i < loadingIframes.length; i++) {
						if(loadingIframes[i].Pid === data.Pid) {
							loadingIframes.splice(i, 1)
						}
						
					}
					
					// For removing this function callback from the list
					for (let i = 0; i < customEventCallbacks.length; i++) {
						if(customEventCallbacks[i].Eid === Eid) {
							customEventCallbacks.splice(i,1);
							// console.log("EventCallback: " + i)
						}
					}

				}
			}
		});
		// console.log(customEventCallbacks)
		
	});
	  
}
async function awaitLoadIframe(ID){
	let result = await loadIframe(ID);
	return result
}

var roomIDList = [];
var roomIDsProvisioned = false;
var myrng;
function provisionRoomIDs(seed) {
	myrng = new Math.seedrandom(seed);
	roomIDsProvisioned = true;
}
function getRoomID(index) {
	let roomCount = roomIDList.length;
	if(roomCount > index) {
		// console.log("Grabed: " + roomIDList[index])
		return Math.floor(roomIDList[index] * 1000000000);
	}else {
		for (let i = 0; i < (index - roomCount + 1); i++) {
			// console.log("Generated: " + (roomCount + i))
			var roomID = myrng();
			roomIDList.push(roomID)
		}
		return Math.floor(roomIDList[index] * 1000000000);
	}
}

var roomPreset = {
	name: "",
	soloDirector: false,
	injestRoom: false,
	transferOnlyInjest: false,
	directorOKs: false,
	requirePassword: false,
	password: "Tester12"
}
async function loadRoom(index, data=roomPreset) {
	// Find the room id based on index
	roomID = getRoomID(index);
    console.log("Opening Room: " + roomID)

	// Making object for the room
	var found = false;
	for (let i = 0; i < roomDataList.length; i++) {
		if(roomDataList[i].ID === roomID) {
			found = true;
		}
	}
	if(!found) {
		roomDataList.push({
			directorOwned: "unknown",
			soloDirector: data.soloDirector,
			ID: roomID,
			index: index
		})
	}

	// Adding the data from the room preset to the room object
	for (let i = 0; i < roomDataList.length; i++) {
		if(roomDataList[i].ID === roomID) {
			// Adding the room name
			if(data.name === "") {
				roomDataList[i].name = "Room " + (Number(index) + 1);
				if(index + 1 === 13) {
					roomDataList[i].name = "Friday 13th"
				}
			}

			// Adding whether its solo-director or not
			roomDataList[i].soloDirector = data.soloDirector;
			// Adding whether its an injest room or not
			roomDataList[i].injestRoom = data.injestRoom;
			// Adding whether people can just join of need to be transferd
			roomDataList[i].transferOnlyInjest = data.transferOnlyInjest;
			// Whether director has to OK people joining room
			roomDataList[i].directorOKs = data.directorOKs;
			// Whether a password is required
			roomDataList[i].requirePassword = data.requirePassword;
			// Password value
			roomDataList[i].password = data.password;

			// shouldn't need to get the people who would be already in this room, as we are only creating the room now
			roomDataList[i].guests = [];
		}
	}
	
	roomDataLisseners(roomID);

    var status = await awaitLoadIframe(roomID);
	
	// After loading the room
	console.log("Opened Room: " + roomID + " (" + status + ")")



	var iframe = document.querySelector("._" + roomID)
	// session = iframe.contentWindow['session'];
	// session = iframe.contentWindow;
	console.log(iframe)
	iframe.contentWindow.postMessage({"autoSync": "mystuff", "value": "asdfadf"}, '*');

	return status;
}

async function updateRoomData(roomID, type, value) {
	console.log(type)
	// Putting it in the room data object
	for (let i = 0; i < roomDataList.length; i++) {
		if(roomDataList[i].ID === roomID) {
			var key = type;
			if(key === "reserved") {
				roomDataList[i].reserved = value;
			}
		}
	}

	// Sending it to the room, so other directors can view it
	var iframe = document.querySelector("iframe._" + roomID);
	await setRoomData(iframe, type, value);
}

// For loading rooms, this is more extensive & takes more time
async function checkRoomData(roomID) {
	var iframe = document.querySelector("._" + roomID)
	// var data = await getRoomData(iframe)
	for (let i = 0; i < roomDataList.length; i++) {
		if(roomDataList[i].ID === roomID) {
			var data = roomDataList[i];
		}
	}

	console.log(data);
	return {
		data: data
	};
}
// Just gets the current data known, it won't wait for VDO.ninja iframe to respond with updated things
function readCurrentRoomData(roomID) {
	for (let i = 0; i < roomDataList.length; i++) {
		if(roomDataList[i].ID === Number(roomID)) {
			var data = roomDataList[i];
		}
	}
	return {
		data: data
	};
}

function roomDataLisseners(roomID) {
	var Eid = generateRTid();
	customEventCallbacks.push({
		"Eid": Eid,
		"data": {
			"roomID": roomID
		},
		function: (e, Eid, data) => {
			// This first one handles any data/audio packets sent, the others are specific Iframe Message actions
			if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "director") {
				// Someone Joined, need to create an element for them
				if(e.data.value) {
					console.log("we are the director!")
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].directorOwned = false;
						}
					}
				}else if(!e.data.value) {
					console.log("another director owned")
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].directorOwned = true;
						}
					}
				}
			}
		}

	});
}


var peopleObjects = [
	// {
	// 	room: "538628350test",
	// 	streamID: "Lgs6v2x",
	// 	UUID: "a711486a65d944a3b078daff20070711",

	// 	type: "guest",

	// 	label: "Guest",

	// 	stream: "[Some Element]",
	// 	element: "[Some Element]"
	// }
]
var personUItemplate = {
	showingMainUI: false,
	showingButton: false,
	hasVideo: false,
	buttonLoading: false,
	buttonHasDetails: false,

	guestChanging: false,
	gotGuestData: false,
	guestConnected: false,
	guestVideoCreated: false,
	guestLeft: false

}

var statsSyncTime = 0;
async function guestLisseners(roomID) {
	console.log("Set Guest Lisseners for " + roomID)

	var Eid = generateRTid();
	customEventCallbacks.push({
		"Eid": Eid,
		"data": {
			"roomID": roomID
		},
		function: (e, Eid, data) => {
			// This first one handles any data/audio packets sent, the others are specific Iframe Message actions
			if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.frame) {
				if(!media.tracks[e.data.trackID]) {
					console.log(e)
					// Creating a new track if it hasn't been made yet
					media.tracks[e.data.trackID] = {};
					media.tracks[e.data.trackID].streamID = e.data.streamID;
					media.tracks[e.data.trackID].generator = new MediaStreamTrackGenerator({kind:e.data.kind});
					media.tracks[e.data.trackID].stream = new MediaStream([media.tracks[e.data.trackID].generator]);
					media.tracks[e.data.trackID].frameWriter = media.tracks[e.data.trackID].generator.writable.getWriter();
					
					// Adding the data to the new track
					media.tracks[e.data.trackID].frameWriter.write(e.data.frame);
					
					if(!media.streams[e.data.streamID]) {
						// If the stream isn't made yet, make it
						media.streams[e.data.streamID] = document.createElement("video");
						media.streams[e.data.streamID].id = "video_"+e.data.streamID;
						media.streams[e.data.streamID].muted = true;
						// TODO: Need to unmute it when the user intacts with the page
						media.streams[e.data.streamID].autoplay = true;
						// media.streams[e.data.streamID].controls = true;
						media.streams[e.data.streamID].srcObject = media.tracks[e.data.trackID].stream;
		
						// Making the new video element in the page
						console.log("Made Video Element")
						for (let i = 0; i < peopleObjects.length; i++) {
							if(peopleObjects[i].streamID === e.data.streamID) {
								// Adding the new video element to peopleObject
								peopleObjects[i].stream = media.streams[e.data.streamID];

								guestVideoCreated(peopleObjects[i]);

								// // And if the person is already defined, initiate creating their front end element
								// if(peopleObjects[i].type) {
								// 	console.log("Creating Now")
								// 	if(peopleObjects[i].element) {
								// 		createPersonVideo(peopleObjects[i].element, media.streams[e.data.streamID]);
								// 	}else {
								// 		// This function grabs the labels of the person, before running the callback, which is to create the person element
								// 		loadLabel(e.data.streamID, createPersonElement, e.data.streamID);
								// 		// createPersonElement(e.data.streamID);
								// 	}
								// }
							}
						}
						// console.log(peopleObjects)
					}else {
						// If there is already a stream for this, remove any tracks for it, and add the new one(s)?
						if(e.data.kind == "video") {
							media.streams[e.data.streamID].srcObject.getVideoTracks().forEach(trk=>{
								media.streams[e.data.streamID].srcObject.removeTrack(trk);
							});
						}else if(e.data.kind == "audio") {
							media.streams[e.data.streamID].srcObject.getAudioTracks().forEach(trk=>{
								media.streams[e.data.streamID].srcObject.removeTrack(trk);
							});
						} 
						media.tracks[e.data.trackID].stream.getTracks().forEach(trk=>{
							media.streams[e.data.streamID].srcObject.addTrack(trk);
						});
					}
				}else {
					// Adding the data to an existing track
					media.tracks[e.data.trackID].frameWriter.write(e.data.frame);
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "director-connected") {
				// Director Joined, need to create an element for them
				console.log("director Joined")

				var found = false;
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						found = true;

						// Just updating data if in-case it is needed
						peopleObjects[i].room = roomID;
						peopleObjects[i].UUID = e.data.UUID;
						peopleObjects[i].type = "director";

						break;
					}
				}
				if(!found) {
					// Making the person's object
					peopleObjects.push({
						room: roomID,
						streamID: e.data.streamID,
						UUID: e.data.UUID,
						UI: personUItemplate,
				
						type: "director",
					});
					// // Adding the person to their rooms' object
					// for (let i = 0; i < roomDataList.length; i++) {
					// 	if(roomDataList[i].ID === roomID) {
					// 		roomDataList[i].guests.push(e.data.streamID)
					// 		break;
					// 	}
					// }
				}
				// TODO: Need to add functionality of what to do when a director connects
				
				// This function grabs the labels of the person, before running the callback, which is to create the person element
				// loadLabel(e.data.streamID, createPersonElement, e.data.streamID);
				// console.log(peopleObjects)
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "guest-connected") {
				// Someone Joined, need to create an element for them
				console.log("someone (guest) Joined")
				var found = false;
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						found = true;

						// Just updating data if in-case it is needed
						peopleObjects[i].room = roomID;
						peopleObjects[i].UUID = e.data.UUID;
						peopleObjects[i].type = "guest";

						// Check if there is a video needing to be created (if video came through before they joined)
						// if(peopleObjects[i].stream) {
						// 	createPersonElement(e.data.streamID);
						// }

						break;
					}
				}
				if(!found) {
					// Making the person's object
					peopleObjects.push({
						room: roomID,
						streamID: e.data.streamID,
						UUID: e.data.UUID,
						UI: personUItemplate,
				
						type: "guest"
					});

					// Adding the person to their rooms' object
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].guests.push(e.data.streamID)
							break;
						}
					}
				}

				// This grabs the labels of the person, before running the callback, which is to then notify that the guest is connected
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						loadLabel(e.data.streamID, guestConnected, peopleObjects[i]);
					}
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "remote-screenshare-state" && e.data.value === true) {
				// We now know that a video connection is a screen share, and so need to manage that
				console.log("someone's screensharing")
				var found = false;
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						found = true;

						// Just updating data if in-case it is needed
						peopleObjects[i].room = roomID;
						peopleObjects[i].UUID = e.data.UUID;
						peopleObjects[i].type = "screenshare";

						// Check if there is a video needing to be created (if video came through before they joined)
						// if(peopleObjects[i].stream) {
						// 	createPersonElement(e.data.streamID);
						// }

						break;
					}
				}
				if(!found) {
					// Making the person's object
					peopleObjects.push({
						room: roomID,
						streamID: e.data.streamID,
						UUID: e.data.UUID,
						UI: personUItemplate,
				
						type: "screenshare",
				
						// label: "Guest",
					});
					// Adding the person to their rooms' object
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].guests.push(e.data.streamID)
							break;
						}
					}
				}
				// TODO: Handle when someone screen shares, to know what to do on the front end

				// This function grabs the labels of the person, before running the callback, which is to create the person element
				// loadLabel(e.data.streamID, createPersonElement, e.data.streamID);
				// createPersonElement(e.data.streamID);

				console.log(peopleObjects)
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "view-connection") {
				// Someone (director or just someone, we don't know) Joined, need to create an object for them
				console.log("view connection changing")
				// console.log(e)
				var found = false;
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						found = true;

						// Just updating data if in-case it is needed
						peopleObjects[i].room = roomID;
						peopleObjects[i].UUID = e.data.UUID;

						break;
					}
				}
				if(!found) {
					// Making the person's object
					peopleObjects.push({
						room: roomID,
						streamID: e.data.streamID,
						UUID: e.data.UUID,
						UI: personUItemplate,
					});
					// Adding the person to their rooms' object
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].guests.push(e.data.streamID)
							break;
						}
					}
				}

				// This notifies that the guest is changing in some way
				// The changing is either finished when a guest Joins or Leaves.
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						guestChanging(peopleObjects[i])
					}
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "video-element-created") {
				// I don't know if this event is needed anymore, as video elements are created when video/audio data starts coming in, not here

				var found = false;
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						found = true;

						// Just updating data if in-case it is needed
						peopleObjects[i].room = roomID;
						peopleObjects[i].UUID = e.data.UUID;

						break;
					}
				}
				if(!found) {
					// Making the person's object
					peopleObjects.push({
						room: roomID,
						streamID: e.data.streamID,
						UUID: e.data.UUID,
						UI: personUItemplate,
					});
					// Adding the person to their rooms' object
					for (let i = 0; i < roomDataList.length; i++) {
						if(roomDataList[i].ID === roomID) {
							roomDataList[i].guests.push(e.data.streamID)
							break;
						}
					}
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "end-view-connection") {
				// Someone (director or just someone, we don't know) Left, need to manage their object
				console.log("someone Left")
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.value) {
						// Possibly marking or removing the person's object of the person who just left
						break;
					}
				}

				// This notifies that the guest has left
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.value) {
						guestLeft(peopleObjects[i])
					}
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "view-connection-info") {
				// Someone (director or just someone, we don't know) Left, need to manage their object
				console.log("got person data")
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						peopleObjects[i].statuses = {};

						parsePersonInfo(e.data.streamID, e.data.value)
						break;
					}
				}

				// This grabs the labels of the person, before running the callback, which is to then notify that there is now data for the guest
				for (let i = 0; i < peopleObjects.length; i++) {
					if(peopleObjects[i].streamID === e.data.streamID) {
						loadLabel(e.data.streamID, gotGuestData, peopleObjects[i]);
					}
				}
			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.action === "view-stats-updated") {
				// This is where I call for new stats, which I then recive and parse their info later, to see if any UI needs to change
				var iframe = document.querySelector("._" + data.roomID);
				var date = new Date;
				// It can only grab the new stats at minimum every 2.8 seconds (one will generally go every 3 seconds), so where there is 10 people it isn't going crazy with requests
				if(date.getTime() - statsSyncTime > 2800) {
					// console.log("Sync")
					statsSyncTime = date.getTime();
					getStats(iframe);
				}

			}else if(e.source === document.querySelector("._" + data.roomID).contentWindow && e.data.stats !== undefined) {
				// This is for when re-recieve the stats of people after I call for it in other systems
				if(e.data.stats.inbound_stats) {
					for (const key in e.data.stats.inbound_stats) {
						parsePersonInfo(key, e.data.stats.inbound_stats[key].info)
					}
				}
			}

		}

	});

	// Should return all Eid's for when the room is removed, and you want to remove the customEventCallbacks then
}

function parsePersonInfo(streamID, data) {
	// console.log(streamID)
	for (let i = 0; i < peopleObjects.length; i++) {
		if(peopleObjects[i].streamID === streamID) {
			peopleObjects[i].rawInfo = data;
			peopleObjects[i].statuses = {};

			// Director Mic Muted
			if(data.recording_audio_gain === 0) {
				peopleObjects[i].statuses.directorMicMuted = true;
			}else if(data.recording_audio_gain > 0){
				peopleObjects[i].statuses.directorMicMuted = false;
			}else if(data.recording_audio_gain === false){
				// if it's false, I think that means they aren't sending microphone audio
				peopleObjects[i].statuses.sendingMic = false;
			}
			// Sending Mic
			if(data.playback_audio_pipeline === false) {
				peopleObjects[i].statuses.sendingMic = false;
			}else if(data.playback_audio_pipeline === true){
				peopleObjects[i].statuses.sendingMic = true;
			}
			
			// User Mic Muted
			if(data.muted !== null) {
				peopleObjects[i].statuses.userMicMuted = data.muted;
			}
			// Vision Muted
			if(data.directorDisplayMuted === null || data.directorDisplayMuted === false) {
				peopleObjects[i].statuses.visionMuted = false;
			}else if(data.directorDisplayMuted === true){
				peopleObjects[i].statuses.visionMuted = true;
			}
			// Speaker Muted
			if(data.directorSpeakerMuted === null || data.directorSpeakerMuted === null) {
				peopleObjects[i].statuses.speakerMuted = false;
			}else if(data.directorSpeakerMuted === true){
				peopleObjects[i].statuses.speakerMuted = true;
			}

			// Director Video Muted
			if(data.directorVideoMuted === null || data.directorVideoMuted === false) {
				peopleObjects[i].statuses.directorVideoMuted = false;
			}else if(data.directorVideoMuted === true){
				peopleObjects[i].statuses.directorVideoMuted = true;
			}
			// User Video Muted
			if(data.video_muted_init === null || data.video_muted_init === false) {
				peopleObjects[i].statuses.userVideoMuted = false;
			}else if(data.directorVideoMuted === true){
				peopleObjects[i].statuses.userVideoMuted = true;
			}

			// Plugged in
			if(data.plugged_in == true) {
				peopleObjects[i].statuses.pluggedIn = true;
			}else if(data.plugged_in == false) {
				peopleObjects[i].statuses.pluggedIn = false;
			}
			// battery
			if(data.power_level !== null) {
				peopleObjects[i].statuses.batteryLevel = data.power_level;
			}

			// Label
			if(data.label) {
				peopleObjects[i].label = data.label;
			}

			// Volume
			if(data.recording_audio_gain) {
				peopleObjects[i].statuses.volume = data.recording_audio_gain;
			}else {
				peopleObjects[i].statuses.volume = 0;
			}

			var test = peopleObjects[i];
			// console.log(test)
			
			// console.log(JSON.stringify(peopleObjects[i], null, 1));
			break;
		}
	}
}

function readPersonData(streamID) {
	for (let i = 0; i < peopleObjects.length; i++) {
		if(peopleObjects[i].streamID === streamID) {
			return {data: peopleObjects[i]};
		}
		
	}
}

// function createPersonElement(streamID) {
// 	var peoplesLocation = document.querySelector(".peopleLocation");
// 	var guestTemplateQuery = ".personTemplate";
// 	// var guestPasteLocation = peoplesLocation.querySelector(".peoples");

// 	var labelQuery = ".label";
// 	var IDQuery = ".id";

// 	console.log(streamID);
// 	console.log(peopleObjects);
// 	for (let i = 0; i < peopleObjects.length; i++) {
// 		if(peopleObjects[i].streamID === streamID) {
// 			var personObject = peopleObjects[i];

// 			if(!personObject.element) {
// 				// if(personObject.type === "guest") {
// 				// 	var temp = peoplesLocation.querySelector(guestTemplateQuery + " .guest").cloneNode(true);

// 				// 	// Setting ID where its needed
// 				// 	temp.setAttribute("data-streamID", personObject.streamID)
// 				// 	temp.querySelector(IDQuery).innerHTML = personObject.streamID;

// 				// 	// Setting the person's label if they have one
// 				// 	if(personObject.label) {
// 				// 		temp.querySelector(labelQuery).innerHTML = personObject.label;
// 				// 	}else {
// 				// 		temp.querySelector(labelQuery).innerHTML = "Guest";
// 				// 		peopleObjects[i].label = "Guest";
// 				// 	}

// 				// 	// Adding someone's video if they have one
// 				// 	if(personObject.stream) {
// 				// 		createPersonVideo(temp, media.streams[streamID])
// 				// 	}
// 				// }else if(personObject.type === "director") {
// 				// 	var temp = peoplesLocation.querySelector(guestTemplateQuery + " .director").cloneNode(true);

// 				// 	// Setting ID where its needed
// 				// 	temp.setAttribute("data-streamID", personObject.streamID)
// 				// 	temp.querySelector(IDQuery).innerHTML = personObject.streamID;

// 				// 	// Setting the person's label if they have one
// 				// 	if(personObject.label) {
// 				// 		temp.querySelector(labelQuery).innerHTML = personObject.label;
// 				// 	}else {
// 				// 		temp.querySelector(labelQuery).innerHTML = "Director";
// 				// 		peopleObjects[i].label = "Director";
// 				// 	}

// 				// 	// Adding someone's video if they have one
// 				// 	if(personObject.stream) {
// 				// 		createPersonVideo(temp, media.streams[streamID])
// 				// 	}
// 				// }else if(personObject.type === "screenshare") {
// 				// 	var temp = peoplesLocation.querySelector(guestTemplateQuery + " .screenshare").cloneNode(true);

// 				// 	// Setting ID where its needed
// 				// 	temp.setAttribute("data-streamID", personObject.streamID)
// 				// 	temp.querySelector(IDQuery).innerHTML = personObject.streamID;

// 				// 	// Setting the person's label if they have one
// 				// 	if(personObject.label) {
// 				// 		temp.querySelector(labelQuery).innerHTML = personObject.label;
// 				// 	}else {
// 				// 		temp.querySelector(labelQuery).innerHTML = "Screenshare";
// 				// 		peopleObjects[i].label = "Screenshare";
// 				// 	}

// 				// 	// Adding someone's video if they have one
// 				// 	if(personObject.stream) {
// 				// 		createPersonVideo(temp, media.streams[streamID])
// 				// 	}
// 				// }

// 				// // Putting the created element into the person's object
// 				// if(temp) {
// 				// 	guestPasteLocation.appendChild(temp);
// 				// 	peopleObjects[i].element = temp;
// 				// }

// 				console.log(personObject)
// 			}
// 		}
// 	}
// }

// These are end-points for while a person is joining or leaving, these will call functions in the front end
// This tells the front end that a person is loading in some fassion, be it joining or leaving
function guestChanging(personObject) {
	console.log("guestChanging!")
	MguestChanging(personObject)
}

// This tells the front end that we have the data for someone who is currently connecting
function gotGuestData(personObject) {
	console.log("gotGuestData!")
	MgotGuestData(personObject)
}

// This tells the front end that a person has officially connected, and so create their elements
function guestConnected(personObject) {
	console.log("guestConnected :)")
	MguestConnected(personObject)
}
// This tells the front end that a video is availible, allowing it to dynamically load the video independently from the person's elements
function guestVideoCreated(personObject) {
	console.log("guestVideoCreated!")
	MguestVideoCreated(personObject)
}

// This tells the front end that a person has officially left, and so remove their elements
function guestLeft(personObject) {
	console.log("guestLeft :(")
	MguestLeft(personObject)
}

var loadingLabels = [];
function loadLabel(streamID, callback, values) {
	console.log("Loading Label")
	var iframe;
	for (let i = 0; i < peopleObjects.length; i++) {
		if(peopleObjects[i].streamID === streamID) {
			iframe = document.querySelector("._" + peopleObjects[i].room);
			break;
		}
	}
	if(iframe) {
		// iframe.contentWindow.postMessage({"getStreamIDs":true}, '*');
		// console.log("What what")

		// If there isn't already a lissener for getting the labels (for the particular streamID), then create one
		var found = false;
		// for (let i = 0; i < loadingLabels.length; i++) {
		// 	if(loadingLabels[i].Pid === streamID) {
		// 		found = true;
		// 		break;
		// 	}
		// }
		if(!found) {
			var Pid = streamID;
			var position = loadingLabels.length;
			var Lid = generateRTid();
			loadingLabels[position] = {
				"Pid": Pid,
				"Lid": Lid
			};

			return loadingLabels[position].Promise = new Promise((resolve, reject) => {
				// Creating backup timeout for 10 seconds
				setTimeout(() => {
					// Getting the data from the customEventCallbacks so that I can remove their other saved things
					for (let i = 0; i < customEventCallbacks.length; i++) {
						if(customEventCallbacks[i].Eid === Eid) {
							console.warn("Loading Labels has timed out after 10 seconds");
							resolve("Timed Out");

							var data = customEventCallbacks[i].data;
							
							// resolving the loadingIframe Promise & removing its resolve-function from list
							for (let i = 0; i < promiseResolve.length; i++) {
								if(promiseResolve[i].Rid === data.Rid) {
									promiseResolve[i].resolve("Timed Out")
									promiseResolve.splice(i, 1);
								}
							}
		
							// removing the promise itself
							for (let i = 0; i < loadingLabels.length; i++) {
								if(loadingLabels[i].Lid === data.Lid) {
									loadingLabels.splice(i, 1)
								}
								
							}
							
						}
					}
					// For removing this function callback from the list
					for (let i = 0; i < customEventCallbacks.length; i++) {
						if(customEventCallbacks[i].Eid === Eid) {
							customEventCallbacks.splice(i,1);
							// console.log("EventCallback: " + i)
						}
					}
				}, 3000);

				// Setting up remote function to resolve this promise (meaning that the Iframe has loaded)
				var Rid = generateRTid();
				promiseResolve[promiseResolve.length] = {
					"Rid": Rid,
					"resolve": resolve
				};

				// Setting up event system to know when Iframe has loaded
				var Eid = generateRTid();
				customEventCallbacks.push({
					"Eid": Eid,
					"data": {
						"Rid": Rid,
						"Pid": Pid,
						"Lid": Lid,
						"streamID": streamID,
						"callback": callback,
						"values": values,
						"iframe": iframe
					},
					function: (e, Eid, data) => {
						// Checking if it is the first room that sent the event & if the event is the right one
						if(e.source === data.iframe.contentWindow && e.data.streamIDs) {
							console.log("Collected Labels!!")
							// Adding the label to the element
							for (let i = 0; i < peopleObjects.length; i++) {
								if(peopleObjects[i].streamID === data.streamID) {
									// Adding a label if there was a label for the person
									if(e.data.streamIDs[data.streamID]) {
										peopleObjects[i].label = e.data.streamIDs[data.streamID];
									}
									break;
								}
							}

							// Calling the callback
							data.callback(data.values);

							// resolving the loadingIframe Promise & removing its resolve-function from list
							for (let i = 0; i < promiseResolve.length; i++) {
								if(promiseResolve[i].Rid === data.Rid) {
									promiseResolve[i].resolve("Collected Label")
									promiseResolve.splice(i, 1);
								}
							}

							// removing the promise itself
							for (let i = 0; i < loadingLabels.length; i++) {
								if(loadingLabels[i].Lid === data.Lid) {
									loadingLabels.splice(i, 1)
								}
								
							}
							
							// For removing this function callback from the list
							for (let i = 0; i < customEventCallbacks.length; i++) {
								if(customEventCallbacks[i].Eid === Eid) {
									customEventCallbacks.splice(i,1);
									// console.log("EventCallback: " + i)
								}
							}
						}
					}
				});

				// Actually calling the getStreamIDs to the iframe
				iframe.contentWindow.postMessage({"getStreamIDs":true}, '*');
				
			});
		}

	}

}

function userButtons(button) {
	console.log(button)
	var buttonAction = button.getAttribute("data-action");
	var value;
	if(button.type === "range") {
		value = button.value;
	}
	console.log(value)

	// Find the parent of the button that has the streamID
	if(button.closest("[data-streamid]") !== null) {
		var streamID = button.closest("[data-streamid]").getAttribute("data-streamid");
		for (let i = 0; i < peopleObjects.length; i++) {
			// Finding the person's object based on streamID
			if(peopleObjects[i].streamID === streamID) {
				console.log(peopleObjects[i])

				//finding Iframe, based on roomID
				var iframe = document.querySelector("._" + peopleObjects[i].room);

				if(buttonAction === "muteUserMic") {
					muteUserMic(iframe, streamID);
					// Need to update UI
					userIndicator(buttonAction , streamID, "changing");
					
					// Making a callback for when the option is actually changed, to update the UI again
					var Eid = generateRTid();
					customEventCallbacks.push({
						"Eid": Eid,
						"data": {
							"buttonAction": buttonAction,
							"streamID": streamID
						},
						function: (e, Eid, data) => {
							// This is so we know that this is the right callback, and so that the data object has what we want in it
							if(e.data.action === "director-mute-state" && e.data.streamID === data.streamID) {
								// For removing this function callback from the list
								for (let i = 0; i < customEventCallbacks.length; i++) {
									if(customEventCallbacks[i].Eid === Eid) {
										customEventCallbacks.splice(i,1);
										userIndicator(data.buttonAction, data.streamID, !e.data.value);
										break;
									}
								}
							}
						}
					});
					
					// Need to update userObject
				}else if(buttonAction === "muteUserEars") {
					muteUserEars(iframe, peopleObjects[i].streamID);
					// Need to update userObject
					// Need to update UI
				}else if(buttonAction === "muteUserVision") {
					muteUserVision(iframe, peopleObjects[i].streamID);
					// Need to update userObject
					// Need to update UI
				}else if(buttonAction === "userVolume") {
					setUserVolume(iframe, peopleObjects[i].streamID, value);
					// Need to update userObject
					// Need to update UI
				}else if(buttonAction === "userVolume") {
					toggleUserGroup(iframe, peopleObjects[i].streamID, value);
					// Need to update userObject
					// Need to update UI
				}else if(buttonAction === "hangup") {
					hangupUser(iframe, peopleObjects[i].streamID);
					// Need to update userObject
					// Need to update UI
				}
				break;
			}
			
		}
	}
}
function userIndicator(action, streamID, status) {
	status = status.toString();
	// Currently only looks at the one parent (being the parent element where their video is)
	document.querySelectorAll('[data-streamid="' + streamID + '"]').forEach(parent => {
		parent.querySelectorAll('.buttonIndicator[data-action="' + action + '"]').forEach(buttonI => {
			
			// Getting current status
			var value;
			if(buttonI.classList.contains("false")) {
				value = false;
			}else if(buttonI.classList.contains("true")) {
				value = true;
			}
			
			// Removing current status
			buttonI.classList.remove("true");
			buttonI.classList.remove("false");
			buttonI.classList.remove("changing-false");
			buttonI.classList.remove("changing-true");
			buttonI.classList.remove("starting");
			
			// Applying the class based on current status and status variable
			if(status === "changing" && value) {
				buttonI.classList.add("changing-false")
				console.log("changing-false")
			}else if(status === "changing" && !value) {
				buttonI.classList.add("changing-true")
				console.log("changing-true")
			}else if(status === "true") {
				buttonI.classList.add("true")
				console.log(status)
			}else if(status === "false") {
				buttonI.classList.add("false")
				console.log(status)
			}else if(status === "starting") {
				buttonI.classList.add("starting")
				console.log(status)
			}
		})
	})
}