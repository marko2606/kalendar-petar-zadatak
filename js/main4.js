let timeFrame = [];
let events = [];
setId = 0;

function populateTimeFrameBlank() {
    for(let i = 0; i <= 720; i++) {
        timeFrame.push({status: 'free', howManyEvents: 0, order:[]})
    }
}
populateTimeFrameBlank();

function layOutDay(event) {

    function storeEvents(event) {
        event.id = setId;
        setId++;
        events.push(event);
    }

    function resetTable() {
        let container = document.getElementById('container');
        for(let i = 0; events.length >= i; i++) {
            if(document.getElementById(i)) {
                let child = document.getElementById(i);
                container.removeChild(child);
            }
        }
    }

    function addEventsTimeFrame(event) {
            let {start, end} = event;
            for(start; start<=end; start++) {
                timeFrame[start].status = 'scheduled';
                timeFrame[start].howManyEvents = timeFrame[start].howManyEvents + 1;
                timeFrame[start].order.push(event);
            }
    }

    function setCollides(event) {
        let collidesWith = [1]; //temporary
        let {start, end} = event;
        let numCollides = 0;
        let relevantCollides = [];

        function setCollidesWith() {
            if(timeFrame[start].order[0]) {
                timeFrame[start].order.forEach( orderItem => {
                    let isDouble = undefined;
                    isDouble = collidesWith.some(collideItem => {
                        return orderItem === collideItem;
                    });

                    if (!isDouble && orderItem !== event) {
                        collidesWith.push(orderItem);
                    }
                })
            }
        }

        function setRelativeCollides() {
            if(numCollides < timeFrame[start].order.length) {
                numCollides = timeFrame[start].order.length;
                relevantCollides = timeFrame[start].order;
            }
        }

        for(start; start<=end; start++) {
            setCollidesWith();
            setRelativeCollides();
        }

        event.numCollides = numCollides;
        collidesWith.shift(); // temporary
        event.collidesWith = collidesWith;
        event.relevantCollides = relevantCollides;
    }

    function setHeight(event) {
        let {start, end} = event;
        event.height = end - start;
        return event;
    }

    function setGeneralWidth(event) {
        let fullWidth = 620;
        event.width = fullWidth / event.numCollides;
    }

    function setExactWidth(event) {
        let fullWidth = 620;
        let eventWidth = event.width;
        let childrenWidth = event.relevantCollides.reduce((total, value) => {
            if (event === value) {
                return total;
            }
            total += value.width;
            return total;
        }, 0);

        if(eventWidth + childrenWidth !== fullWidth) {
            eventWidth = fullWidth - childrenWidth;
            event.width = eventWidth;
        }
    }

    function setPosition(event) {
        let leftPosition = 0;
        let i = 0;
        while( event.relevantCollides[i].id < event.id ) {
            leftPosition += event.relevantCollides[i].width;
            i++;
        }
        event.leftPosition = leftPosition;
    }

    function displayTable(event) {
        let container = document.getElementById('container');
        let eventDiv = document.createElement('div');
        let eventChild = document.createElement('p');
        eventChild.innerHTML = `EVENT ${event.id}`;
        if(event.height > event.width) {
            eventChild.setAttribute('style','transform: rotate(-90deg)')
        }
        eventDiv.setAttribute("style",
            `height:${event.height}px;
                 width:${event.width}px;
                 position: absolute;
                 left: ${event.leftPosition}px;
                 top: ${event.start}px;
                 background-color: lightgreen;
                `
        );
        eventDiv.setAttribute('id', event.id);
        eventDiv.setAttribute('class', 'event');
        container.appendChild(eventDiv);
        eventDiv.appendChild(eventChild);
    }

    storeEvents(event);
    resetTable();
    addEventsTimeFrame(event);
    events.forEach(setCollides);
    events.forEach(setHeight);
    events.forEach(setGeneralWidth);
    events.forEach(setExactWidth);
    events.forEach(setPosition);
    events.forEach(displayTable);
    console.log('events ', events)
}

// layOutDay({start: 0, end: 100});
// layOutDay({start: 110, end: 720});
// layOutDay({start: 110, end: 210});
// layOutDay({start: 300, end: 720});
// layOutDay({start: 300, end: 400});
// layOutDay({start: 500, end: 720});
// layOutDay({start: 500, end: 720});
// layOutDay({start: 500, end: 720});
// layOutDay({start: 500, end: 720});





