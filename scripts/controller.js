let selectedElement, offset, transform, svg;
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
    new: true
};

function makeDraggable(evt) {
    svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    createDefaultRect();
}

function createDefaultRect() {
    const xmlns = "http://www.w3.org/2000/svg";
    const newRect = Object.assign({}, defaultRect);
    newRect.id = Math.random().toString(36).slice(2);
    const rect = document.createElementNS(xmlns, "rect");
    setRectAttributes(rect, newRect);
    svg.appendChild(rect);
    rectsList.push(newRect);
}

function setRectAttributes(rect, newRect) {
    rect.setAttributeNS(null, 'id', newRect.id);
    rect.setAttributeNS(null, 'x', newRect.x);
    rect.setAttributeNS(null, 'y', newRect.y);
    rect.setAttributeNS(null, 'width', newRect.width);
    rect.setAttributeNS(null, 'height', newRect.height);
    rect.setAttributeNS(null, 'stroke', newRect.stroke);
    rect.setAttributeNS(null, 'stroke-width', newRect.strokeWidth);
    rect.setAttributeNS(null, 'fill', newRect.fill);
    rect.setAttributeNS(null, 'class', 'rect draggable');

}

function startDrag(evt) {
    if (evt.target.classList.contains('rect')) {
        selectedElement = evt.target;
        const rect = rectsList.find(el => el.id === selectedElement.id);
        if (rect.new) {
            createDefaultRect();
            rect.new = false;
        }
        offset = getMousePosition(evt);
        // Get all the transforms currently on this element
        const transforms = selectedElement.transform.baseVal;
        // Ensure the first transform is a translate transform
        if (transforms.length === 0 ||
            transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            const translate = svg.createSVGTransform();
            translate.setTranslate(0, 0);
            // Add the translation to the front of the transforms list
            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }
        // Get initial translation amount
        transform = transforms.getItem(0);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;
    }
}

function drag(evt) {
    if (selectedElement) {
        evt.preventDefault();
        const coord = getMousePosition(evt);
        transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
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