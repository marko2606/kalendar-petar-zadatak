let events = [];
setId = 0;

function layOutDay(event) {

    function storeNewEvent(event) {
        event.collides = [];
        events.push(event);
        event.id = setId;
        setId++;
    }

    function checkColliding(event) {
        event.collides = [];

        function areColliding(event, _event) {
            let {start, end} = event;
            let startSearched = _event.start;
            let endSearched = _event.end;

            function selectLongerEvent(event, _event) {

                if ((end - start) < (endSearched - startSearched)) {
                    start = _event.start;
                    end = _event.end;
                    startSearched = event.start;
                    endSearched = event.end;
                }
            }

            function giveResults() {

                for (start; start <= end; start++) {
                    if (start === startSearched || end === endSearched) {
                        return true;
                    }
                }
                return false;
            }

            selectLongerEvent(event, _event);

            return giveResults();
        }

        let numMatched = 0;
        events.forEach(_event => {

            function checkChildrenMatching(event, _event) {
                let _eventCopy = Object.assign({}, _event);
                _eventCopy.collides = [];
                let otherCollidingEvents = event.collides;
                for (let i = 0; i <= otherCollidingEvents.length; i++) {
                    if (otherCollidingEvents[i]) {
                        if (areColliding(otherCollidingEvents[i], _eventCopy)) {
                            if (checkChildrenMatching(otherCollidingEvents[i], _eventCopy)) {
                                return true;
                            }
                            otherCollidingEvents[i].collides.push(Object.assign({}, _eventCopy));
                            numMatched++;
                            return true;
                        }
                    }
                }
                numMatched++;
                event.collides.push(Object.assign({}, _eventCopy));
                return true;
            }

            if (_event === event) {
                return;
            }
            if (areColliding(event, _event)) {
                checkChildrenMatching(event, _event);
                event.numMatched = numMatched;
            }
        });
        return event;
    }

    function reset(events) {
        events = events.map(event => {
            event.collides = [];
            return event;
        })
    }

    function setWidth(event) {
        let rows = 1;
        let fullWidth = 620;
        if (event.collides.length === 0) {
            event.width = fullWidth;
            event.rows = rows;
            return event;
        }
        else {
            function relevantRowsNumber(event) {
                let childrenNum = event.collides.length || 0;

                function higherChildByLengthId(event) {
                    return event.collides.reduce((higher, value, index) => {
                        higher = higher > value.collides.length ? higher : index;

                        return higher;
                    }, -1)
                }
                let higherId = higherChildByLengthId(event);
                let eventInside = event.collides[higherId];

                if (childrenNum !== 0) {
                    rows++;
                    relevantRowsNumber(eventInside);
                }
                return event;
            }

            relevantRowsNumber(event);
            event.width = fullWidth * (1 / rows);
            event.rows = rows;

            return event;
        }
    }

    function exactWidth(event) {
        if(event.collides[0] && event.rows < event.collides[0].rows) {
            if(event.width >= events[event.collides[0].id].width) {
                event.width = (620 - (events[event.collides[0].id].width * event.numMatched));
            }
        }
        return event;
    }

    function setLeftPosition(event) {
        let positionLeft = 0;

        if(events[event.id-1] && events[event.id-1].width !== 620) {
            positionLeft = events[event.collides[0].id].width * event.numMatched;
        }
        event.positionLeft = positionLeft;
        return event;
    }

    function setHeight(event) {
        let {start, end} = event;
        event.height = end - start;
        return event;
    }

    function displayTable(event) {

        let container = document.getElementById('container');
        let eventDiv = document.createElement('div');
        eventDiv.setAttribute("style",
            `height:${event.height}px;
                 width:${event.width}px;
                 background-color: lightgreen;
                `
        );
        eventDiv.setAttribute('id', 'event' + event.id);
        container.appendChild(eventDiv);
    }

    function deleteEvents() {
        let container = document.getElementById('container');
        for (let i = 0; events.length >= i; i++) {
            if (document.getElementById('event' + i)) {
                let child = document.getElementById('event' + i);
                container.removeChild(child);
            }
        }
    }

    storeNewEvent(event);
    reset(events);
    events = events.map(checkColliding);
    events = events.map(setWidth);
    events = events.map(setHeight);
    events = events.map(exactWidth);
    //events = events.map(setLeftPosition)
    deleteEvents();
    events.forEach(displayTable);
    console.log(events);
}

layOutDay({start: 0, end: 100});
layOutDay({start: 110, end: 620});
layOutDay({start: 110, end: 210});
layOutDay({start: 300, end: 620});
layOutDay({start: 300, end: 400});
layOutDay({start: 500, end: 620});
layOutDay({start: 500, end: 620});
layOutDay({start: 500, end: 620});
layOutDay({start: 500, end: 620});








