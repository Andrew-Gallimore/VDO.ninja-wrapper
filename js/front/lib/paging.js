console.log("Started Paging script")

// var closeOnReclick = true;
// var closeLocation = "#main .pannel-section-1";
// var closeClass = "hide";

// Checks type of input and also removes "." or "#"
function checkClass(input) {
    var temp = [];
    if(input.charAt(0) == ".") {
        temp.push({
            type: "class",
            value: input.substring(1)
        })
    }else if(input.charAt(0) == "#") {
        temp.push({
            type: "id",
            value: input.substring(1)
        })
    }
    return temp;
    // This is set up so that later I can add in multiple class functionality
}

function loadPage(button, btnList, page, pageList, buttonClass=".active", pageClass=".active", closeLocation="", closeClass=".hide") {
    var buttonClasses = checkClass(buttonClass);

    var OKswitch = true;
    if(closeLocation !== "") {
        console.log("Awesome")
        // Checking if the button clicked is already clicked, so that later we can hide the page & unselect the button
        for (let i = 0; i < buttonClasses.length; i++) {
            if(button.classList.contains(buttonClasses[i].value)) {
                OKswitch = false;
            }
        }
    }

    // Removing data on active BUTTON
    for (let i = 0; i < buttonClasses.length; i++) {
        if(buttonClasses[i].type == "class"){
            // var previousBTN = btnList.querySelector("." + buttonClasses[i].value)
            // if(previousBTN !== null) previousBTN.classList.remove(buttonClasses[i].value);
            btnList.querySelectorAll("." + buttonClasses[i].value).forEach(previousBTN => {
                previousBTN.classList.remove(buttonClasses[i].value);
            });
        }
        if(buttonClasses[i].type == "id"){
            // var previousBTN = btnList.querySelector("#" + buttonClasses[i].value)
            // if(previousBTN !== null) previousBTN.removeAttribute('id');
            btnList.querySelectorAll("#" + buttonClasses[i].value).forEach(previousBTN => {
                previousBTN.removeAttribute('id');
            });
        }
    }

    if(OKswitch) {
        // Changing BUTTON data
        for (let i = 0; i < buttonClasses.length; i++) {
            if(buttonClasses[i].type == "class") button.classList.add(buttonClasses[i].value);
            if(buttonClasses[i].type == "id") button.id = buttonClasses[i].value;
        }
    }

    // Heighlighting parent BUTTON if one of it's sub BUTTONs is clicked
    if(button.classList.contains("sub")) {
        // console.log("highlight parent")
        if(button.getAttribute("data-parent") !== null) {
            var buttonParent = button.closest(".menu").querySelector(".parent.rooms");
            
            // Changing BUTTON parent data
            for (let i = 0; i < buttonClasses.length; i++) {
                if(buttonClasses[i].type == "class") buttonParent.classList.add(buttonClasses[i].value);
                if(buttonClasses[i].type == "id") buttonParent.id = buttonClasses[i].value;
            }
        }
    }

    // Heighlighting first child BUTTON if the BUTTON clicked is a parent
    if(button.classList.contains("parent")) {
        // console.log("highlight child")
        if(button.getAttribute("data-children") !== null) {
            var buttonChild = button.closest(".menu").querySelector(".sub-items.rooms .item:nth-child(2)");
            // console.log(buttonChild)

            // // Changing BUTTON parent data
            // for (let i = 0; i < buttonClasses.length; i++) {
            //     if(buttonClasses[i].type == "class") buttonChild.classList.add(buttonClasses[i].value);
            //     if(buttonClasses[i].type == "id") buttonChild.id = buttonClasses[i].value;
            // }

            // Clicking the child button, this actually then fires the code to highlight the parent (this)
            if(buttonChild) buttonChild.click()
        }
    }else {
        if(OKswitch) {
            var pageClasses = checkClass(pageClass);
            
            // Check if the main part is hidden (if it was active and got clicked & hidden)
            if(closeLocation !== "") {
                // This needs to be set up for ids as well
                var closeClasses = checkClass(closeClass);
                for (let i = 0; i < closeClasses.length; i++) {
                    document.querySelector(closeLocation).classList.remove(closeClasses[i].value);
                }
            }
            
            // Removing data on active PAGE
            var pageListElements = document.querySelectorAll(pageList);
            for (let i = 0; i < pageClasses.length; i++) {
                for(element of pageListElements) {
                    if(pageClasses[i].type == "class"){
                        // Loop through all .page elements, and only grab the one that is a direct child of pageList'element'
                        var previousPage = element.querySelectorAll(".page." + pageClasses[i].value)
                        for (let j = 0; j < previousPage.length; j++) {
                            if(previousPage[j].parentElement == element) previousPage[j].classList.remove(pageClasses[i].value);
                        }
                        // console.log(element.querySelectorAll(".page." + pageClasses[i].value))
                    }
                    // Haven't updated ID side of it since it's creation, don't use it enough
                    if(pageClasses[i].type == "id"){
                        var previousPage = element.querySelector(".page#" + pageClasses[i].value)
                        if(previousPage) previousPage.removeAttribute('id');
                    }
                }
            }
        
            // Changing PAGE data for the new page
            document.querySelectorAll(page).forEach(pageElement => {
                if(pageElement) {
                    for (let i = 0; i < pageClasses.length; i++) {
                        if(pageClasses[i].type == "class") pageElement.classList.add(pageClasses[i].value);
                        if(pageClasses[i].type == "id") pageElement.id = pageClasses[i].value;
                    }
                }else {
                    console.error("[Paging] The page element '" + page + "' doesn't exist")
                }
            })
            // var pageElement = document.querySelector(page);
            // if(pageElement) {
            //     for (let i = 0; i < pageClasses.length; i++) {
            //         if(pageClasses[i].type == "class") pageElement.classList.add(pageClasses[i].value);
            //         if(pageClasses[i].type == "id") pageElement.id = pageClasses[i].value;
            //     }
            // }else {
            //     console.error("[Paging] The page element '" + page + "' doesn't exist")
            // }
        }else {
            // Hiding the main part (not nessesarally the direct parent) of the pages
            if(closeLocation) {
                // This needs to be set up for ids as well
                var closeClasses = checkClass(closeClass);
                for (let i = 0; i < closeClasses.length; i++) {
                    document.querySelector(closeLocation).classList.add(closeClasses[i].value);
                }
                // document.querySelector(closeLocation).classList.add(closeClass);
            }
        }
    }

}

window.addEventListener("DOMContentLoaded", (e) => {
    document.querySelectorAll("[data-original-active]").forEach(element => {
        element.click();
    })
})

function showHideElement(button, element, buttonClass=".active", elementClass=".active") {
    var buttonClasses = checkClass(buttonClass);

    // Changing button data
    // console.log(buttonClasses)
    for (let i = 0; i < buttonClasses.length; i++) {
        if(buttonClasses[i].type === "class") button.classList.toggle(buttonClasses[i].value);
        if(buttonClasses[i].type === "id") {
            console.log(buttonClasses)
            if(button.getAttribute('id') !== null) {
                button.id = buttonClasses[i].value;
            }else {
                button.removeAttribute('id');
            }
        }
    }


    var elementClasses = checkClass(elementClass);

    // Changing page data
    var elementElement = document.querySelector(element);
    for (let i = 0; i < elementClasses.length; i++) {
        if(elementClasses[i].type == "class") elementElement.classList.toggle(elementClasses[i].value);
        if(elementClasses[i].type == "id") {
            console.log("ok")
            elementElement.id = elementClasses[i].value;
        };
    }

    // Really should check the state of the button, and match that, but that is for later!


    
}