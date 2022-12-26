

/* Modals (Custom Implementation) */
console.log("Started Modal Code")

// Pre-opening dropdowns
window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-modal-open]").forEach(element => {
        openModal("#" + element.id)
    })
});

function openModal(query, options={clickOutClose: true}) {
    console.log("Opened Modal")
    // var options = {
    //     clickOutClose: true,
    //     resizeWidth: true,
    //     resizeHeight: true
    // }
    var modalWrapper = document.querySelector(".modal-wrapper");
    var modal = document.querySelector(query);
    if(modal !== null) {
        if(modal.classList.contains("display")) {
            // If it is already open
            closeModal(query);
        }else {
            // Else if it isn't already open, open it
            modal.classList.add("display")
            modalWrapper.classList.add("clickable")

            // If the menu contains sliders
            if(modal.getAttribute("data-includes-sliders") !== null) {
                modal.querySelectorAll(".input-slider .pills").forEach(sliderPills => {
                    possitionSliderPills(sliderPills)
                });
                modal.querySelectorAll(".input-slider input[type=range]").forEach(slider => {
                    positionValues(slider)
                });
            }
        }

        if(options.clickOutClose) {
            modalWrapper.addEventListener("click", e => {
                if(e.target.classList.contains("modal-wrapper")) {
                    console.log("Clicked outside")
                    closeModal(query)
                }
            })
        }else {
            modalWrapper.classList.add("darker")
        }
    } else {
        console.error('ERROR: Modal query "' + query + '" is not in the document')
    }
    document.querySelector(query).classList.add("display")

    // Fixing height of anything that is now visible (on index.js)
    autoHeight();
}

function closeModal(query) {
    if(typeof(query) == "object") {
        var node = query;
        for (let i = 0; i < 15; i++) {
            if(node.classList.contains("modal")) {
                var modal = node;
                break;
            }else {
                node = node.parentNode;
            }
        }
    }else {
        var modal = document.querySelector(query);
    }
    var modalWrapper = document.querySelector(".modal-wrapper");
    if(modal !== null) {
        modal.classList.remove("display")
        modalWrapper.classList.remove("clickable")
        modalWrapper.classList.remove("darker")
        // modalWrapper.outerHTML = modalWrapper.outerHTML;
        modalWrapper.removeEventListener('click', e => {
            if(e.target.classList.contains("modal-wrapper")) {
                console.log("Clicked outside")
                closeModal(query)
            }
        });
        console.log("Closed Modal")
    } else {
        console.error('ERROR: Modal query "' + query + '" is not in the document')
    }
}


/* Dialogs (Custom, but utilizes Popper.js) */
console.log("Started Dialog Code")
var popperInstances = [];
var resizing = [];
function openDialog(dialogID, location, options) {
    var dialog = document.querySelector(".dialog[data-dialog-id=" + dialogID + "]")
    var clickout = false;
    var callback = () => {};
    var callbackData = "";
    var popperInstanceID = Math.round(Math.random() * 1000000);

    // Need to finish custom hoverOutClose, cuurently it still requrires you to close manually with other function, also need to remove the popper instance object from popperInstances
    if(options.hoverOutClose == undefined || options.hoverOutClose == true) {
        // Adding instance ID to elements
        location.setAttribute("data-instance-id", popperInstanceID)
        dialog.setAttribute("data-instance-id", popperInstanceID)
        // Adding events to elements
        const showEvents = ['mouseenter', 'focus'];
        const hideEvents = ['mouseleave', 'blur'];
        showEvents.forEach(event => {
            location.addEventListener(event, e => {showDialog(e.target.getAttribute("data-instance-id"))});
            dialog.addEventListener(event, e => {showDialog(e.target.getAttribute("data-instance-id"))});
        })
        hideEvents.forEach(event => {
            location.addEventListener(event, e => {hideDialog(e.target.getAttribute("data-instance-id"))});
            dialog.addEventListener(event, e => {hideDialog(e.target.getAttribute("data-instance-id"))});
        })
    }
    delete options.hoverOutClose;


    if(options.clickOutClose == true) clickout = true;
    delete options.clickOutClose;

    
    if(options.fitLocationWidth) {
        dialog.style.width = location.offsetWidth + "px";
        resizing.push({
            dialog: dialog,
            location: location
        })
    }
    delete options.fitLocationWidth;
    

    if(options.callback) {
        callback = options.callback
    }
    delete options.callback;

    if(options.callbackData) {
        callbackData = options.callbackData
    }
    delete options.callbackData;



    // Creating popper instance, if there isn't one open already
    var found = false;
    for (let i = 0; i < popperInstances.length; i++) {
        if(popperInstances[i].dialog == dialog) {
            found = true;
            // might need to update the instance itself with it's options
            // popperInstances[i].clickOutClose = clickout;
            // popperInstances[i].startTime = Date.now();
            // popperInstances[i].location = location;
            // popperInstances[i].callback = callback;
            // popperInstances[i].callbackData = callbackData;
            // popperInstances[i].data.setOptions(options);
            // showDialog(popperInstances[i].ID)

            // Cleaning up the popper instance
            // Removing popperInstance through popper.js as well as in the array
            popperInstances[i].data.destroy();
            popperInstances.splice(i, 1);

            // Removing any resizing events for it
            for (let j = 0; j < resizing.length; j++) {
                if(resizing.dialog == dialog) {
                    resizing.splice(i, 1)
                }
            }

            // Need to remove the hoverOutClose events at some point, otherwise they stack up
        }
    }

    // Making popper instance
    const popperInstance = Popper.createPopper(location, dialog, options);
    popperInstances.push({
        ID: popperInstanceID,
        dialogID: dialogID,
        data: popperInstance,
        dialog: dialog,
        location: location,
        clickOutClose: clickout,
        callback: callback,
        callbackData: callbackData,
        startTime: Date.now()
    });

    showDialog(popperInstanceID);

}

function closeDialog(ID, data=undefined) {
    console.log();
    for (let i = 0; i < popperInstances.length; i++) {
        // if the ID is either the popperInstanceID or the dialogID
        if(popperInstances[i].ID === ID || popperInstances[i].dialogID === ID) {
            hideDialog(popperInstances[i].ID);
            // Appending any custom data
            if(data !== undefined) {
                popperInstances[i].callbackData.closeData = data
            }else {
                delete popperInstances[i].callbackData["closeData"]
            }
            popperInstances[i].callback(popperInstances[i].callbackData)
        }
    }
}

function showDialog(popperInstanceID) {
    popperInstanceID = parseInt(popperInstanceID);
    for (let i = 0; i < popperInstances.length; i++) {
        if(popperInstances[i].ID === popperInstanceID) {
            const popperInstance = popperInstances[i].data;
            const dialog = popperInstances[i].dialog;

            // Make the tooltip visible
            dialog.setAttribute('data-show', '');

            // Enable the event listeners
            popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: true },
            ],
            }));

            // console.log("Show Popper")
            break;
        }
    }
}
function hideDialog(popperInstanceID) {
    popperInstanceID = parseInt(popperInstanceID);
    for (let i = 0; i < popperInstances.length; i++) {
        if(popperInstances[i].ID === popperInstanceID) {
            const popperInstance = popperInstances[i].data;
            const dialog = popperInstances[i].dialog;

            // Hide the tooltip
            dialog.removeAttribute('data-show');

            // Disable the event listeners
            popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: false },
            ],
            }));

            // Removing clickOutClose
            popperInstances[i].clickOutClose = false

            // console.log("Hide Popper")
            break;
        }
    }
}

document.addEventListener("click", checkDialogs)
// document.addEventListener("touchend", checkDialogs)
function checkDialogs(e) {
    for (let i = 0; i < popperInstances.length; i++) {
        if(popperInstances[i].clickOutClose) {
            if(Date.now() - popperInstances[i].startTime > 200) {
                if(!popperInstances[i].dialog.contains(e.target) && !popperInstances[i].location.contains(e.target)) {
                    closeDialog(popperInstances[i].ID)
                    popperInstances[i].clickOutClose = false;
                }
            }
        }
    }
    // if(!document.querySelector(".password-options").contains(e.target)) {

    // }
    // console.log(e.target.parent('div'))
}

window.addEventListener("resize", () => {
    for (let i = 0; i < resizing.length; i++) {
        resizing[i].dialog.style.width = resizing[i].location.offsetWidth + "px";
    }
})