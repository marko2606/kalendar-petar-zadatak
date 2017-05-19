let events = [];
let structure = [];
setId = 0;

function layOutDay(event) {

    function storeNewEvent(event) {
        event.collides = [];
        events.push(event);
        event.id = setId;
        if (setId === 0) {
            structure.push(event);
        }
        setId++;
    }

    function checkColliding(event) {

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

        let isPartOfCurrentStructure = structure.every(_event => {
            function checkChildrenMatching(event, _event) {
                let otherCollidingEvents = _event.collides;
                // go trough children and see if there is a match
                for (let i = 0; i <= otherCollidingEvents.length; i++) {
                    if (otherCollidingEvents[i]) { // does it have other colliding events
                        if (areColliding(otherCollidingEvents[i], event)) { // check for a match with children
                            checkChildrenMatching(event, otherCollidingEvents[i]); // circle
                            return false;
                        }
                    }
                }
                _event.collides.push(event);
                return false;
            }

            if (areColliding(event, _event) && event !== _event) {
                checkChildrenMatching(event, _event);
                return false;
            }
            return true;
        });

        if (isPartOfCurrentStructure && event.id !== 0) {
            structure.push(event);
        }

    }

    let fullWidth = 620;
    let level = 1;
    function something(structureEvent) {
        let length = structureEvent.collides.length;
        let children = structureEvent.collides;
        structureEvent.collides.forEach((parentEvent, index) => {
            switch(true) {
                case 0:
                    parentEvent.width = fullWidth;
                    return event;
                case length > 0:
                    level++;
                    // where to put this? parentEvent.width = fullWidth / level;
                    parentEvent.collides.forEach((_event, index) => {
                        if(_event.collides[0]) {
                            _event.width = function () {

                            }


                        } else {
                           _event.width = function (fullWidth, parentEvent) {
                               return fullWidth - parentEvent
                           }

                        }
                    })
            }
        })
    }


    function setHeight(event) {
        let {start, end} = event;
        event.height = end - start;
        return event;
    }

    storeNewEvent(event);
    checkColliding(event);
    structure.forEach(something);
    events = events.map(setHeight);
    console.log(structure);
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








