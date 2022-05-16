let timeout = false;

let selectedElement, offset;


const xmlns = "http://www.w3.org/2000/svg";

function makeDraggable(evt) {
    svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    createRect(defaultRect);
}



function startDrag(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('rect-link')) {
        const link = linksList.find(el => el.id === evt.target.id);
        const line = linesList.find(el => el.start === link.id || el.end === link.id);
        if (line) {
            return selectedElement = line;
        }
        createLineFromLink(link);
        console.log(link);
    }
    if (evt.target.classList.contains('rect')) {
        const rect = evt.target;
        selectedElement = rectsList.find(el => el.id === rect.id);
        if (selectedElement.new) {
            createRect(defaultRect);
            selectedElement.new = false;
        }
        offset = getMousePosition(evt);
        offset.x -= parseFloat(selectedElement.x);
        offset.y -= parseFloat(selectedElement.y);
    }
}

function drag(evt) {
    if (selectedElement && selectedElement.type === 'rect') {
        const rect = document.getElementById(selectedElement.id);
        const coords = getMousePosition(evt);
        selectedElement.x = coords.x - offset.x;
        selectedElement.y = coords.y - offset.y;
        updateCoordinates(rect, selectedElement);
    } else if (selectedElement && selectedElement.type === 'line') {
        const element = document.getElementById(selectedElement.id);
        const coords = getMousePosition(evt);
        selectedElement.endCoords = coords;
        setLineCoordinates(element, selectedElement);
    }
}

function endDrag(evt) { 
    if (selectedElement && selectedElement.type === 'line') {
        const element = document.getElementById(selectedElement.id);
        const coords = getMousePosition(evt);
        selectedElement.endCoords = coords;
        setLineCoordinates(element, selectedElement);
        if (evt.target.classList.contains('rect-link')) {
            const endLink = linksList.find(el => el.id === evt.target.id);
            endLink.active = true;
            selectedElement.end = endLink.id;
            setLineCoordinates(document.getElementById(selectedElement.id), selectedElement);
        } else {
            destroyLine(selectedElement);
        }
    } 
    selectedElement = null;
}

function getMousePosition(evt) {
    const CTM = svg.getScreenCTM();
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}