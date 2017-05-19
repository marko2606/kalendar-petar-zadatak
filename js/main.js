let timeFrame = [];
let numOfEvents = 0;
let events = [];
let storedEvents = [];

function populateTimeFrameBlank() {
    for(let i = 0; i <= 720; i++) {
        timeFrame.push({status: 'free', howManyEvents: 0, order:[]})
    }
}

populateTimeFrameBlank();

function layOutDay(newEvents) {
    storedEvents = [];
    timeFrame = [];
    populateTimeFrameBlank();

    newEvents.forEach(event => {
        events.push(event)
    });

    function resetTable() {
        let container = document.getElementById('container');
        for(let i = 0; events.length >= i; i++) {
            if(document.getElementById('event' + i)) {
                let child = document.getElementById('event' + i);
                container.removeChild(child);
            }
        }
        numOfEvents = 0;
    }

    // populate timeFrame with new events
    function addEventsTimeFrame(events) {
        events.forEach((event, index) => {
            let {start, end} = event;
            let {status, howManyEvents} = timeFrame;
            for(start; start<=end; start++) {
                timeFrame[start].status = 'scheduled';
                timeFrame[start].howManyEvents = timeFrame[start].howManyEvents + 1;
                timeFrame[start].order.push('event' + index);
            }
        });
    }

    // store new events
    function addEventsStoredEvents(events) {
        let maxWidth = 100; // referring to percentage
        let eventsThisTimeFrame = 1;

        function numEventsThisTimeFrame(event) {
            let {start, end} = event;
            for(start; start<=end; start++) {
                 if(timeFrame[start].status === 'scheduled') {
                     eventsThisTimeFrame = eventsThisTimeFrame > timeFrame[start].howManyEvents ? eventsThisTimeFrame : timeFrame[start].howManyEvents;
                 }
            }
        }
        function setOrder(event, index) {
            let eventId = 'event'+index;
            let mostEvents = 0;
            let longestOrderTF = 0;
            let {start, end} = event;
            for(start; start<=end; start++) {
                if(timeFrame[start].order.length > mostEvents) {
                    mostEvents = timeFrame[start].order.length;
                    longestOrderTF = start;
                }
            }
            let result =  timeFrame[longestOrderTF].order.findIndex(item => {
                return (eventId === item)
            });
            if (result === 0) {
                return 0;
            }
            return result;
        }
        events.forEach((event, index) => {
            numEventsThisTimeFrame(event);
            setOrder(event, index);
            storedEvents.push({
                id: 'event' + index,
                event,
                numEventsThisTimeFrame: eventsThisTimeFrame,
                H: event.end - event.start,
                W: maxWidth / eventsThisTimeFrame,
                position: {
                    top: event.start,
                    left: (maxWidth / eventsThisTimeFrame) * setOrder(event, index) // FIX THIS!
                }
            });
            eventsThisTimeFrame = 1;
            numOfEvents++;
        });

       // console.log('stored events' , storedEvents)
    }

    function renderTable() {
        function createEvents(event) {
            let container = document.getElementById('container');
            let eventDiv = document.createElement('div');
            eventDiv.setAttribute("style",
                `height:${event.H}px;
                 width:${event.W}%;
                 position:absolute;
                 background-color: lightgreen;
                 left:${event.position.left}%;
                 top:${event.position.top}px;
                `
            );
            eventDiv.setAttribute('id', event.id);
            container.appendChild(eventDiv);
        }
        storedEvents.forEach(event => {
            createEvents(event);
        })
    }

    resetTable();

    addEventsTimeFrame(events);

    addEventsStoredEvents(events);

    renderTable()
}
layOutDay([{start: 30, end: 150}]);

layOutDay([{start: 540, end: 600}]);
layOutDay([{start: 560, end: 620}]);

 layOutDay([{start: 610, end: 670}]);




// layOutDay([{start: 0, end: 10}, {start: 5, end: 20}, {start: 30, end: 150}, {start: 540, end: 600}, {start: 610, end: 670}]);
//layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 610, end: 670}]);

