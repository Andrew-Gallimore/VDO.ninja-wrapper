var loggingStartTime = (new Date).getTime();

var peopleLog = [];
var directorLog = {
    totalTime: loggingStartTime,
    list: []
};

var log = {
    peopleLog: (id, data) => {
        // Setting the starting total time for the personlog if needed
        if(peopleLog.totalTime === undefined) {
            var time = new Date;
            peopleLog.totalTime = time.getTime();
        }
        
        // Applying the value now
        var found = false;
        for (let i = 0; i < peopleLog.length; i++) {
            if(peopleLog[i].id === id) {
                found = true;

                // Adding another log to the person
                var time = new Date;
                var label = time.getTime() - peopleLog[i].listTime;
                peopleLog[i].list.push({e: data, t: label});

                break;
            }
        }
        if(!found) { 
            // Creating the person with the first log
            var time = new Date;
            var label = 0;
            peopleLog.push({
                id: id,
                listTime: time.getTime(),
                list: [{e: data, t: label}]
            })
        }
    },
    directorLog: (data) => {
        var time = new Date;
        var label = time.getTime() - directorLog.totalTime;
        directorLog.list.push({e: data, t: label});
    }
}
log.directorLog("Started Logging Script");