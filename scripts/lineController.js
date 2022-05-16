linesList = [];

const defaultLine = {
    id: null,
    start: null,
    end: null,
    parentId: null,
    stroke: '#000',
    startCoords: null,
    endCoords: null,
    strokeWidth: 0.02,
    type: 'line'
}

function createLineFromLink(link, parentId = undefined) {
    const line = Object.assign({}, defaultLine);
    line.id = Math.random().toString(36).slice(2);
    line.parentId = parentId ? parentId : line.id;
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

function createLine(parent, link1 = undefined, link2 = undefined, startCoords = undefined, endCoords = undefined) {
    const line = Object.assign({}, defaultLine);
    line.id = Math.random().toString(36).slice(2);
    line.parentId = parent.parentId;
    line.start = link1 && link1.id;
    line.end = link2 && link2.id;
    line.startCoords = startCoords;
    line.endCoords = endCoords;
    line.stroke = link1.fill;
    linesList.push(line);
    const element = document.createElementNS(xmlns, "line");
    setLineAttributes(element, line);
    svg.appendChild(element);
    return line;
}

function setLineAttributes(element, line) {
    element.setAttribute('id', line.id);
    setLineCoordinates(element, line);
    element.setAttribute('class', 'line');
    element.setAttribute('stroke', line.stroke);
    element.setAttribute('stroke-width', line.strokeWidth);
}

function setLineCoordinates(element, line) {
    console.log(line.id, line.start);
    let x1, x2, y1, y2;
    if (line.start) {
        const start = linksList.find(link => link.id === line.start);
        console.log(start);
        x1 = start.x;
        y1 = start.y;
    } else if (line.startCoords) {
        x1 = line.startCoords.x;
        y1 = line.startCoords.y;
    }
    if (line.end) {
        const end = linksList.find(link => link.id === line.end);
        x2 = end.x;
        y2 = end.y;
    } else if (line.endCoords) {
        x2 = line.endCoords.x;
        y2 = line.endCoords.y;
    }
    // console.log(x1, x2, y1, y2);
    if (x1 !== x2 && y1 !== y2) {
        const childLinks = linksList.filter(el => line.parentId === el.parentId && el.float);
        const start = linksList.find(link => link.id === linesList.find(el => el.id === line.parentId).start);
        x1 = start.x;
        y1 = start.y;
        if (childLinks.length !== 2) {
            const link1 = createLinkForLine(x1 + (x2 - x1) / 2, y1, line);
            const link2 = createLinkForLine(x1 + (x2 - x1) / 2, y2, line);
            // const end = linksList.find(link => link.id === line.end);
            line.end = link1.id;
            updateLine(start);
            createLine(line, link1, link2);
            // selectedElement.start = link2.id;
            selectedElement = createLine(line, link2, undefined, undefined, {x: x2, y: y2});
        } else {
            link1 = childLinks[0];
            link2 = childLinks[1];
            console.log(link1.y);
            link1.x = x1 + (x2 - x1) / 2;
            link1.y = y1;
            link2.x = x1 + (x2 - x1) / 2;
            link2.y = y2;
            setLinkCoordinates(document.getElementById(link1.id), link1);
            setLinkCoordinates(document.getElementById(link2.id), link2);

            updateLine(start);
            updateLine(link1);
            
            // selectedElement.start = link2.id;
            selectedElement.endCoords = {x: x2, y: y2};
            console.log(linksList);
            updateLine(link2);
        }
    } else {
        element.setAttribute('x1', x1);
        element.setAttribute('y1', y1);
        element.setAttribute('x2', x2);
        element.setAttribute('y2', y2);
    }
}

function updateLine(link) {
    const line = linesList.find(el => el.start === link.id);
    setLineCoordinates(document.getElementById(line.id), line);
}

function destroyLine(lineId) {
    while (true) {
        const index = linesList.findIndex(el => el.parentId === lineId);
        if (index !== -1) {
            document.getElementById(lineId).remove();
            linesList.splice(index, 1);
        } else {
            return;
        }
    }
}