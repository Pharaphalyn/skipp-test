linesList = [];

//Should've used polylines

const defaultLine = {
    id: null,
    start: null,
    end: null,
    parentId: null,
    side: true,
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
    if (link1 && !link1.side) {
        line.side = false;
    }
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
    setLineCoordinates(line, element);
    element.setAttribute('class', 'line');
    element.setAttribute('stroke', line.stroke);
    element.setAttribute('stroke-width', line.strokeWidth);
}

function setLineCoordinates(line, element = undefined) {
    let x1, x2, y1, y2;
    if (line.start) {
        const start = linksList.find(link => link.id === line.start);
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
        let newX1, newX2, newY1, newY2;
        if (!start.side) {
            newX1 = x1 + (x2 - x1) / 2;
            newX2 = x1 + (x2 - x1) / 2;
            newY1 = y1;
            newY2 = y2;
        } else {
            newX1 = x1;
            newX2 = x2;
            newY1 = y1 + (y2 - y1) / 2;
            newY2 = y1 + (y2 - y1) / 2;
        }
        if (childLinks.length !== 2) {
            const link1 = createLinkForLine(newX1, newY1, line);
            let link2;
            if (childLinks.length === 1) {
                link2 = childLinks[0];
            } else {
                link2 = createLinkForLine(newX2, newY2, line);
            }
            // const end = linksList.find(link => link.id === line.end);
            line.end = link1.id;
            updateLine(start);
            createLine(line, link1, link2);
            // selectedElement.start = link2.id;
            selectedElement = createLine(line, link2, undefined, undefined, {x: x2, y: y2});
        } else {
            link1 = childLinks[0];
            link2 = childLinks[1];
            link1.x = newX1;
            link1.y = newY1;
            link2.x = newX2;
            link2.y = newY2;
            setLinkCoordinates(document.getElementById(link1.id), link1);
            setLinkCoordinates(document.getElementById(link2.id), link2);

            updateLine(start);
            updateLine(link1);
            
            selectedElement.endCoords = {x: x2, y: y2};
            updateLine(link2);
        }
    } else {
        element = element ? element : document.getElementById(line.id);
        element.setAttribute('x1', x1);
        element.setAttribute('y1', y1);
        element.setAttribute('x2', x2);
        element.setAttribute('y2', y2);
    }
}

function updateLine(link, any = false, end = false) {
    const line = linesList.find(el => (end ? el.end : el.start) === link.id || (any && el.end === link.id));
    setLineCoordinates(line);
}

function destroyLine(line) {
    while (true) {
        const id = line.parentId;
        const index = linesList.findIndex(el => el.parentId === id);

        if (index !== -1) {
            while (true) {
                const linkIndex = linksList.findIndex(el => el.type !== 'rect-link' &&
                                    (el.id === linesList[index].start || el.id === linesList[index].end));
                if (linkIndex === -1) {
                    break;
                }
                destroyLink(linksList[linkIndex]);
            }
            while (true) {
                const linkIndex = linksList.findIndex(el => el.active &&
                            (el.id === linesList[index].start || el.id === linesList[index].end));
                if (linkIndex === -1) {
                    break;
                }
                linksList[linkIndex].active = false;
            }
            document.getElementById(linesList[index].id).remove();
            linesList.splice(index, 1);
        } else {
            return;
        }
    }
}