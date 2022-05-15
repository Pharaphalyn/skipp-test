linesList = [];

const defaultLine = {
    id: null,
    start: null,
    end: null,
    stroke: '#000',
    startCoords: null,
    endCoords: null,
    strokeWidth: 0.02,
    type: 'line'
}

function createLineFromLink(link) {
    const line = Object.assign({}, defaultLine);
    line.id = Math.random().toString(36).slice(2);
    line.start = link.id;
    line.endCoords = {x: link.x, y: link.y};
    line.stroke = link.fill;
    linesList.push(line);
    selectedElement = line;
    link.active = true;
    const element = document.createElementNS(xmlns, "line");
    setLineAttributes(element, line);
    svg.appendChild(element);
}

function setLineAttributes(element, line) {
    element.setAttribute('id', line.id);
    setLineCoordinates(element, line);
    element.setAttribute('class', 'line');
    element.setAttribute('stroke', line.stroke);
    element.setAttribute('stroke-width', line.strokeWidth);
}

function setLineCoordinates(element, line) {
    if (line.start) {
        const start = linksList.find(link => link.id === line.start);
        element.setAttribute('x1', start.x);
        element.setAttribute('y1', start.y);
    } else if (line.startCoords) {
        element.setAttribute('x2', line.startCoords.x);
        element.setAttribute('y2', line.startCoords.y);
    }
    if (line.end) {
        const end = linksList.find(link => link.id === line.end);
        element.setAttribute('x2', end.x);
        element.setAttribute('y2', end.y);
    } else if (line.endCoords) {
        element.setAttribute('x2', line.endCoords.x);
        element.setAttribute('y2', line.endCoords.y);
    }
}

function updateLine(link) {
    const line = linesList.find(el => el.start === link.id || el.end === link.id);
    setLineCoordinates(document.getElementById(line.id), line);
}