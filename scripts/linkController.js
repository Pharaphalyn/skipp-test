linksList = [];

const defaultLink = {
    id: null,
    x: null,
    y: null,
    fill: null,
    active: false,
    r: 0.1,
    parent: null,
    type: 'rect-link'
};

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
    circle.setAttribute('class', link.type);
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

function updateLinks(model) {
    const linkCoords = getRectLinkCoordinates(model);
    linksList.filter(el => el.parent === model.id).forEach((link, index) => {
        link.x = linkCoords[index][0];
        link.y = linkCoords[index][1];
        setLinkCoordinates(document.getElementById(link.id), link);

        if (link.active) {
            updateLine(link);
        }
    });
}