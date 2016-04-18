import * as d3 from './d3';
import { update } from './index';

export default Object.freeze({

    list,
    defaults,
    preset,
    customInput

})

let color = (function() {
    let color = d3.scaleCategory10();
    let index = 0;
    return () => color(index++);
})()

let shapeAttrs = {

    rect: 'x y width height fill',
    circle: 'cx cy r fill',
    line: 'x1 x2 y1 y2 stroke stroke-width',
    text: 'x y font-family font-size',
    path: 'd fill',
    ellipse: 'cx cy rx ry fill',
    polygon: 'points fill',
    polyline: 'points stroke fill',

    post: 'transform',
    pre: 'name id class'

}; 

Object
    .keys(shapeAttrs)
    .forEach(d => {shapeAttrs[d] = shapeAttrs[d].split(" ")});

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
    rx: 50,
    ry: 25,
    d: 'M50,0 L100,100 L0,100',
    points: '60,20 100,40 100,80 60,100 20,80 20,40',
    'font-family': 'sans-serif',
    'font-size': 18,
    'stroke-width': 2,
    transform:'translate(0 0)'
}

function defaults(shape) {

    if(shapeAttrs[shape]) {
        return shapeAttrs[shape].map(d => ({
            name: d,
            value: preset(d, shape)
        }))
    }

    else {
        return [];
    }

}

function list(shape) {

    return [...shapeAttrs.pre, ...shapeAttrs[shape], ...shapeAttrs.post];

}

function preset(d, shape) {

    if (shape == 'polyline' && d == 'fill') {
        return 'none';
    }
    else if (d == 'fill' || d == 'stroke') {
        return color()
    }
    else {
        return presets[d];
    }
}

function customInput(d, i, a) {

    if (d.name == 'fill' || d.name == 'stroke') {

        let self = this;

        // ew;

        d3.select('.colorPicker')
            .on('change', function() {
                self.value = d.value = this.value;
                update();
            })
            .node()
            .click()
    }
}