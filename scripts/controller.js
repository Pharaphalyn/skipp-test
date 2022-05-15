let selectedElement, offset, transform, svg;
rectsList = [];
linesList = [];
linksList = [];


const xmlns = "http://www.w3.org/2000/svg";

const defaultRect = {
    id: null,
    x: 4,
    y: 5,
    width: 3,
    height: 3,
    stroke: '#000',
    strokeWidth: '0.02', 
    fill: 'transparent',
    new: true,
    type: 'rect'
};

const defaultLink = {
    id: null,
    x: null,
    y: null,
    fill: null,
    r: 0.1,
    parent: null
};

const defaultLine = {
    id: null,
    start: null,
    end: null,
    startSide: null,
    endSide: null,
    type: 'line'
}

function makeDraggable(evt) {
    svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    createRect(defaultRect);
}

function createRect(model) {
    const newRect = Object.assign({}, model);
    newRect.id = Math.random().toString(36).slice(2);
    const rect = document.createElementNS(xmlns, "rect");
    setRectAttributes(rect, newRect);
    svg.appendChild(rect);
    createLinksForRect(newRect);
    rectsList.push(newRect);
}

function createLinksForRect(model) {
    getRectLinkCoordinates(model).forEach(coord => {
        const link = Object.assign({}, defaultLink);
        link.id = Math.random().toString(36).slice(2);
        link.parent = model.id;
        link.x = coord[0];
        link.y = coord[1];
        link.fill = model.stroke;
        const circle = document.createElementNS(xmlns, "circle");
        setLinkAttributes(circle, link);
        svg.appendChild(circle);
        linksList.push(link);
    });
}

function setLinkAttributes(circle, link) {
    circle.setAttribute('id', link.id);
    circle.setAttribute('r', link.r);
    circle.setAttribute('fill', link.fill);
    circle.setAttribute('class', 'link');
    setLinkCoordinates(circle, link);
}

function setLinkCoordinates(circle, link) {
    circle.setAttribute('cx', link.x);
    circle.setAttribute('cy', link.y);
}

function getRectLinkCoordinates(model) {
    return [[model.x + model.width / 2, model.y], [ model.x + model.width, model.y + model.height / 2],
            [model.x + model.width / 2, model.y + model.height], [model.x, model.y + model.height / 2]];
}

function setRectAttributes(rect, newRect) {
    rect.setAttributeNS(null, 'id', newRect.id);
    rect.setAttributeNS(null, 'width', newRect.width);
    rect.setAttributeNS(null, 'height', newRect.height);
    rect.setAttributeNS(null, 'stroke', newRect.stroke);
    rect.setAttributeNS(null, 'stroke-width', newRect.strokeWidth);
    rect.setAttributeNS(null, 'fill', newRect.fill);
    rect.setAttributeNS(null, 'class', 'rect draggable');
    updateCoordinates(rect, newRect);
}

function updateCoordinates(rect, model) {
    rect.setAttributeNS(null, 'x', model.x);
    rect.setAttributeNS(null, 'y', model.y);
    const linkCoords = getRectLinkCoordinates(model);
    linksList.filter(el => el.parent === model.id).forEach((link, index) => {
        link.x = linkCoords[index][0];
        link.y = linkCoords[index][1];
        setLinkCoordinates(document.getElementById(link.id), link);
    });
}

function startDrag(evt) {
    evt.preventDefault();
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
    if (selectedElement) {
        const rect = document.getElementById(selectedElement.id);
        const coord = getMousePosition(evt);
        selectedElement.x = coord.x - offset.x;
        selectedElement.y = coord.y - offset.y;
        updateCoordinates(rect, selectedElement);
    } else {
        if (evt.target.id) {
            console.log(evt.target.id);
        }
    }
}

function endDrag(evt) {
    selectedElement = null;
}

function getMousePosition(evt) {
    const CTM = svg.getScreenCTM();
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}