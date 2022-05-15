rectsList = [];
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

function createRect(model) {
    const newRect = Object.assign({}, model);
    newRect.id = Math.random().toString(36).slice(2);
    const rect = document.createElementNS(xmlns, "rect");
    setRectAttributes(rect, newRect);
    svg.appendChild(rect);
    createLinksForRect(newRect);
    rectsList.push(newRect);
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
    updateLinks(model);
}