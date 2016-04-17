export let attrs = {
    rect: ['x','y','width','height','fill','rx','ry'],
    circle: ['cx','cy','r','fill'],
    all: ['transform']
};

export let attrDefaults = {
    rect: [['x', 0],['y', 0],['width', 100],['height', 100],['fill', '#F00']],
    circle: [['cx', 50],['cy', 50],['r', 50],['fill', '#00F']]
}