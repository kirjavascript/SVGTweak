import * as d3 from './d3';

let color = (function() {
    let color = d3.scaleCategory10();
    let index = 0;
    return () => color(index++);
})()

export let attrs = {
    rect: 'x y width height fill',
    circle: 'cx cy r fill',
    line: 'x1 x2 y1 y2 stroke stroke-width',
    post: 'transform',
    pre: 'name id class'
}

// expand arrays

Object.keys(attrs).forEach(d => {attrs[d] = attrs[d].split(" ")})

export function presetLookup(d) {
    let presets = {
        x:0,
        y:0, 
        width: 100,
        height: 100,
        cx: 50,
        cy: 50,
        r: 50,
        x1: 0,
        x2: 100,
        y1: 100,
        y2: 0,
        'stroke-width': 2,
        transform:'translate(0 0)'
    }

    if (d == 'fill' || d == 'stroke') {
        return color()
    }
    else {
        return presets[d];
    }
}

export function attrDefaults(shape) {

    if(attrs[shape]) {
        return attrs[shape].map(d => ({
            name: d,
            value: presetLookup(d)
        }))
    }

    else {
        return [];
    }

}

export function attrList(shape) {

    return [...attrs.pre, ...attrs[shape], ...attrs.post];

}