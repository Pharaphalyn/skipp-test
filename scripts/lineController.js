linesList = [];

const defaultLine = {
    id: null,
    start: null,
    end: null,
    stroke: '#000',
    coords: null,
    strokeWidth: 0.02,
    type: 'line'
}

function createLineFromLink(link) {
    const line = Object.assign({}, defaultLine);
    line.id = Math.random().toString(36).slice(2);
    line.start = link.id;
    line.coords = {x: link.x, y: link.y};
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
    const start = linksList.find(link => link.id === line.start);
    element.setAttribute('x1', start.x);
    element.setAttribute('y1', start.y);
    if (line.end) {
        const end = linksList.find(link => link.id === line.end);
        element.setAttribute('x2', end.x);
        element.setAttribute('y2', end.y);
    } else if (line.coords) {
        element.setAttribute('x2', line.coords.x);
        element.setAttribute('y2', line.coords.y);
    }
}