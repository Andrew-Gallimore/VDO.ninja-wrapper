function validateNumberInput(input, min="", max="") {
    // This all could be optimized
    var output = input.toString();

    output = output.replace(/\D/g,'');
    
    output = parseFloat(output)
    if(min !== "") {
        if(output < min) output = min
    }
    if(max !== "") {
        if(output > max) output = max
    }
    if(isNaN(output)) {
        output = ""
    }
    return output;
}