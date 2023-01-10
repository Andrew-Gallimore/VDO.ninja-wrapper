// Adding functionality of onenter, it isn't native, and so I need to add the check for it
document.querySelectorAll("[onenter]").forEach(element => {
    element.addEventListener('keyup', function (e) {
        // console.log(e.target.getAttribute("onenter"))
        if (e.key === 'Enter') {
            eval(e.target.getAttribute("onenter"))
        }
    });
})

// Custom slider
var sliderPills = {
    AAA: [
        854, 1280, 1920, 2560, 3840
    ],
    AAB: [
        500, 1000, 2500
    ]
}

function preloadSlider() {
    
    var sliders = document.querySelectorAll('input[data-slider-preload]');
    for (let i = 0; i < sliders.length; i++) {
        var slider = sliders[i];
        var values = slider.parentElement.parentElement.querySelector(".values")

        // Filling out start and end values
        values.querySelector(".first").innerHTML = slider.min;
        values.querySelector(".last").innerHTML = slider.max;
        values.querySelector(".moving-input").addEventListener("click", openSliderText)
        values.querySelector(".moving-input").addEventListener("blur", closeSliderText)
        values.querySelector(".moving-input").addEventListener("submit", closeSliderText)
        values.querySelector(".moving-input").addEventListener("keypress", event => {if (event.key == "Enter") closeSliderText(event)})
        
        // Need to create pills with presets
        createSliderPills(slider);

        slider.addEventListener("input", e => {
            positionValues(e.target)
        })
        positionValues(slider);
    }
}
function positionValues(slider) {
    //Adjusting the colored part of the track
    slider.style.backgroundSize = Math.round(slider.value / slider.max * 10000) / 100 + "% 100%";

    var text = slider.parentElement.parentElement.querySelector(".moving")
    var textInput = slider.parentElement.parentElement.querySelector(".moving-input")
    var sliderBackground = slider.parentElement.parentElement.querySelector(".moving-background")

    // Set value of the text
    text.innerHTML = slider.value

    // if the text is an input box, you need to handle sizing the box to the text with JS


    // Positioning text        
    var leftOffset = (text.parentElement.offsetWidth / (slider.max - slider.min) * slider.value) - (text.offsetWidth / 2);
    // var widthChange = (text.offsetWidth * -0.65) + 11.2 //Found with desmos
    var widthChange = (Math.pow(text.offsetWidth, 2) * 0.015133) - (text.offsetWidth * 1.35999) + 18.9049 //Found with graphing calc
    var transform = ((slider.value / slider.max * (text.offsetWidth + widthChange)) - ((text.offsetWidth + widthChange)/2)) * -1
    text.style.left = leftOffset + transform + "px";
    


    // Sizeing text input
    textInput.style.width = text.offsetWidth + 20 + "px";

    // Position textInput      
    var InputleftOffset = (textInput.parentElement.offsetWidth / (slider.max - slider.min) * slider.value) - (textInput.offsetWidth / 2);
    // var widthChange = (textInput.offsetWidth * -0.65) + 11.2 //Found with desmos
    var widthChange = (Math.pow(textInput.offsetWidth, 2) * 0.015133) - (textInput.offsetWidth * 1.35999) + 18.9049 //Found with graphing calc
    // var transform = ((slider.value / slider.max * (textInput.offsetWidth + widthChange)) - ((textInput.offsetWidth + widthChange)/2)) * -1
    textInput.style.left = InputleftOffset + transform + "px";



    // Sizing the background
    if(sliderBackground) {
        sliderBackground.style.width = textInput.offsetWidth + "px";
        sliderBackground.style.height = textInput.offsetHeight + 4 + "px";
    }

    // Possisioning the background for the text & textInput
    if(sliderBackground) {
        sliderBackground.style.left = (leftOffset + transform + (text.offsetWidth / 2)) + "px";
    }

    

    // Hiding first and last text's if they are covered by the moving text
    var first = slider.parentElement.parentElement.querySelector(".first");
    var last = slider.parentElement.parentElement.querySelector(".last");
    if(leftOffset + transform - 4 < first.offsetWidth + 0) {
        // first.style.opacity = 0
        first.classList.add("hide");
    }else {
        // first.style.opacity = 1
        first.classList.remove("hide");
    }
    if(leftOffset + transform + 4 + text.offsetWidth > text.parentElement.offsetWidth - last.offsetWidth - 0) {
        // last.style.opacity = 0
        last.classList.add("hide");
    }else {
        // last.style.opacity = 1
        last.classList.remove("hide");
    }
}

function openSliderText(e) {
    var input = e.target;
    var text = e.target.parentElement.querySelector(".moving");
    var background = e.target.parentElement.querySelector(".moving-background");
    
    input.value = text.innerHTML
    input.style.opacity = 1;
    text.style.opacity = 0;
    background.classList.add("active");
}
function closeSliderText(e) {
    var input = e.target;
    var text = e.target.parentElement.querySelector(".moving");
    var background = e.target.parentElement.querySelector(".moving-background");
    var slider = e.target.parentElement.parentElement.querySelector("input[type=range]")
    
    if (typeof validateNumberInput === "function") { 
        // safe to use validateNumberInput
        var number = validateNumberInput(input.value)
        if(number !== "") {
            slider.value = number
            positionValues(slider)
        }
    }else {
        console.error('[Inputs.js] Need to include validate.js for its function "validateNumberInput()"')
    }
    
    input.style.opacity = 0;
    text.style.opacity = 1;
    background.classList.remove("active");
}
window.addEventListener("DOMContentLoaded", function () {
    preloadSlider();
});

function createSliderPills(slider) {
    var id = slider.getAttribute("data-slider-id");
    if(id !== null) {
        if(sliderPills[id] !== undefined) {
            var pillsLocation = slider.parentElement.parentElement.querySelector(".pills")
            for (let i = 0; i < sliderPills[id].length; i++) {
                // Creating and appending the button
                var temp = document.createElement("button")
                temp.innerHTML = sliderPills[id][i];
                temp.classList.add("_" + sliderPills[id][i])
                temp.onclick = e => {
                    var sliderInput = e.target.parentElement.parentElement.querySelector("input[type=range]")
                    sliderInput.value = e.target.innerHTML;
                    positionValues(sliderInput)

                    // Need to add the option to also change another slider
                };
                pillsLocation.appendChild(temp);

            }
            // Positioning it
            possitionSliderPills(pillsLocation);
            window.addEventListener("resize", (e) => {
                for(slider of document.querySelectorAll("input[data-slider-preload]")) {
                    positionValues(slider);
                    var pillsLocation = slider.parentElement.parentElement.querySelector(".pills");
                    if(pillsLocation !== null) possitionSliderPills(pillsLocation);
                }
                // possitionSliderPills(pillsLocation);
                // positionValues(slider)
            })
        }
    }
}
function possitionSliderPills(pillsLocation) {
    var slider = pillsLocation.parentElement.querySelector("input[type=range]");
    var id = slider.getAttribute("data-slider-id");
    
    if(sliderPills[id] !== undefined) {
        for (let i = 0; i < sliderPills[id].length; i++) {
            var pill = pillsLocation.querySelector("._" + sliderPills[id][i]);
            if(pill !== null) {
                var pillWidth = pill.offsetWidth;
                var fullWidth = pillsLocation.offsetWidth;
            
                var leftOffset = (fullWidth / (slider.max - slider.min) * sliderPills[id][i]) - (pillWidth / 2);
                var transform = 0;
                if((leftOffset + pillWidth) > fullWidth) {
                    // moving it left to not overflow the right side
                    transform = (leftOffset + pillWidth - fullWidth) * -1;
                }else if(leftOffset < 0) {
                    // moving it right to not overflow the left side
                    transform = -1 * leftOffset;
                }

                pill.style.left = leftOffset + transform + "px"
            }
        }
    }
}

function updateSliderChildren(element) {
    console.log("Updating")
    var location = document.querySelector(element);
    var sliders = location.querySelectorAll('input[data-slider-preload]');
    console.log(location)
    for (let i = 0; i < sliders.length; i++) {
        // Possitioning the numbers above the slider (now that the page has its final width)
        positionValues(sliders[i]);

        // Possitioning the pills, if the slider has them
        var id = sliders[i].getAttribute("data-slider-id");
        if(id !== null) {
            if(sliderPills[id] !== undefined) {
                var pillsLocation = sliders[i].parentElement.parentElement.querySelector(".pills")
                possitionSliderPills(pillsLocation);
            }
        }
        
    }
}



// Adjusting aspect ratio for items, specifically video element parents
function ScaleToFit() {
    document.querySelectorAll('.scale-to-fit').forEach(element => {
        var factor = element.parentElement.clientWidth / element.clientWidth;
        element.style.transform = "scale(" + factor + ")";
    });
}
function WHRatioSet() {
    document.querySelectorAll('.wh-ratio').forEach(element => {
        var elementG = element.parentElement.parentElement.parentElement;
        var factor = parseFloat(element.dataset.whratio);
        var breakH = element.dataset.whbreakh === null;

        if(element.dataset.heightlimit != undefined) {
            if(element.parentElement.clientWidth * factor > element.dataset.heightlimit * elementG.clientHeight && breakH) {
                // Height Based
                // console.log("height based 1")
                element.style.height = (elementG.clientHeight * element.dataset.heightlimit) + "px";
                element.style.width = (elementG.clientHeight * element.dataset.heightlimit) / factor + "px";
            }else {
                // Width Based
                // console.log("width based 1")
                element.style.width = element.parentElement.clientWidth + "px";
                element.style.height = element.parentElement.clientWidth * factor + "px";
            }
        }else {
            if(element.parentElement.clientWidth * factor > element.parentElement.clientHeight && breakH) {
                // Height Based
                // console.log("height based 2")
                element.style.height = element.parentElement.clientHeight + "px";
                element.style.width = element.parentElement.clientHeight / factor + "px";
            }else {
                // Width Based
                // console.log("width based 2")
                element.style.width = element.parentElement.clientWidth + "px";
                element.style.height = element.parentElement.clientWidth * factor + "px";
            }
        }
    });
}
function WHRatioDisplay(value) {
    document.querySelectorAll('.wh-hide').forEach(element => {
        element.style.opacity = value;
        if(value == 0) {
            element.style.transition = 'opacity 0s';
        }else {
            element.style.transition = 'opacity 0.4s';
        }
    });
}

window.addEventListener("DOMContentLoaded", function () {
    WHRatioSet();
});