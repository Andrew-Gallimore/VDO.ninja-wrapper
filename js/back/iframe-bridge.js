/*
*  Copyright (c) 2022 Andrew Gallimore. All Rights Reserved.
*
*/

/*
This is a layer bridging my code with the commands of the VDO.ninja Iframe API.
This is needed incase that the VDO.ninja Iframe API commands change or update, my code won't have to
*/

function muteDSpeakers(iframe) {
    iframe.contentWindow.postMessage({"mute":true}, '*');
}

function unmuteDSpeakers(iframe) {
    iframe.contentWindow.postMessage({"mute":false}, '*');
}
function togglemuteDSpeakers(iframe) {
    iframe.contentWindow.postMessage({"mute":"toggle"}, '*');
}

function muteUserMic(iframe, target) {
	// Mutes the user's microphone, only on the directors mute side of things this is seperate from their mute control
	iframe.contentWindow.postMessage({"target":target, "action":"mic", "value":null}, '*');
}

//TODO Needs to be confirmed if functionality is correct
function muteUserEars(iframe, target) {
	// [I think] Mutes the user's headphones/audio-out
	iframe.contentWindow.postMessage({"target":target, "action":"speaker", "value":null}, '*');
}

function muteUserVision(iframe, target) {
	// This hides the user's vision of their video (maybe others videos as well) and displays a message saying 'the director has disabled your vision'
	iframe.contentWindow.postMessage({"target":target, "action":"display", "value":null}, '*');
}


function setUserVolume(iframe, target, value) {
	// This disconnects the user from the room
	iframe.contentWindow.postMessage({"target":target, "action":"volume", "value":value}, '*');
}


function hangupUser(iframe, target) {
	// This disconnects the user from the room
	iframe.contentWindow.postMessage({"target":target, "action":"hangup", "value":null}, '*');
}


async function setRoomData(iframe, key, value) {
	// The Iframe API way of storing data

    // Temporarally
	if(key == "label") {
		roomDataCashe.roomLabels["_" + roomID] = value;
	}else if(key == "roomCount") {
		roomDataCashe.roomCount = value;
	}else if(key == "directorOwned") {
		roomDataCashe.directorOwned = value;
	}else if(key == "reserved") {
		roomDataCashe.reserved = value;
	}
	console.log(roomDataCashe)
}

async function getRoomData(iframe) {
    // Check cashe for data, if not found then ask Iframe API
    // Although cashe may be temporary
	iframe.contentWindow.postMessage({"getStats":""}, '*');
	iframe.contentWindow.postMessage({"getDetailedState":""}, '*');
    return roomDataCashe;
}

function getStats(iframe) {
	// This disconnects the user from the room
	iframe.contentWindow.postMessage({"getStats":""}, '*');
}