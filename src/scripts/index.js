import * as d3 from './d3';
import i3 from './i3';
import edit from './editor';
import generate from './generator';
import draw, { initView } from './viewer';
import { attrList, attrDefaults, presetLookup} from './data';

// menu
// native colour picker
// d3out

// XML parser
// https://www.npmjs.com/package/xml-parser
// load from file inputbox placeholder (paste svg)
// http://bl.ocks.org/mbostock/3892928
// http://bl.ocks.org/mccannf/1629464
// drag + resize stuff

// made defaults dropdown auto input?

// use i3 for showing d3 window?
// round paths to int
// dupe
// svg .children
// move up down
// shapes / filters / etc

// init

i3();
edit();
initView();

// conf

let index = 0;
let svg = [];

// events

//d3.select('#add').on('click', addShape);
d3.select('#shape').on('change', addShape)

// ui

function addShape() {
    let shape = d3.select('#shape').node();

    svg.push({
        index: index++,
        shape: shape.value,
        attr: attrDefaults(shape.value)
    });

    shape.selectedIndex = 0;

    update();
}

function option(element, index, action) {

    if (action == 'remove') {

        svg = svg.filter(d => d.index != index)
 
    }
    else if (action == 'attr') {

        let element = svg.find(d => d.index == index);

        element.attr.push({value:""});

    }
    else if (action == 'up') {
        // swap index and DOM
    }

    update();
}

function setAttr(type, data, value, refresh) {

    // find data

    let attr = svg.find(d => data.parent.index == d.index).attr;

    let attrIndex = attr.findIndex(d => data == d);

    // set data

    (typeof value == 'object') && (value = value.value)

    if (type == 'preset') {
        attr[attrIndex].name = value;
        attr[attrIndex].value = presetLookup(value)
    }
    else {
        attr[attrIndex][type] = value;
    }

    if (refresh) {
        update();
    }
    else {
        updateData(svg);
    }
}

function removeAttr(data) {

    svg.find(d => data.parent == d)

    let attr = svg.find(d => data.parent == d).attr;

    let attrIndex = attr.findIndex(d => data == d);

    attr.splice(attrIndex, 1)

    update();

}

function update() {

    let shape = d3.select('#menu')
        .selectAll('div')
        .data(svg, d => d.index)

    // exit

    shape.exit().remove();

    // enter

    let shapeEnter = shape
        .enter()
        .append('div')
        .classed('line', 1)

    shapeEnter
        .append('div')
        .classed('element', 1)
        .html(d => d.shape)

    shapeEnter
        .selectAll('button')
        .data(d => [
            {index: d.index, action:'attr'},
            {index: d.index, action:'style'},
            {index: d.index, action:'up'},
            {index: d.index, action:'down'},
            {index: d.index, action:'remove'},
        ])
        .enter()
        .append('button')
        .classed('option', 1)
        .html(d => d.action)
        .on('click', function(d) {option(this, d.index, d.action)})



    // merge

    let shapeMerge = shapeEnter.merge(shape);

    {
        // attr

        let attrEnter = shapeMerge
            .selectAll('.attr')
            .data(d => d.attr.map(j => {j.parent = d; return j}))
            .enter()
            .append('div')
            .classed('line', 1)

        attrEnter.append('input')
            .attr('class', 'attr')
            .attr('placeholder', 'attr')
            .attr('value', d => d.name)
            .on('keydown', function(d) { setAttr("name", d, this, false)})
            .on('keyup', function(d) { setAttr("name", d, this, false)})
            .on('change', function(d) { setAttr("name", d, this, false)})

        attrEnter.append('input')
            .attr('class', 'value')
            .attr('placeholder', 'value')
            .attr('value', d => d.value)
            .on('keydown', function(d) { setAttr("value", d, this, false)})
            .on('keyup', function(d) { setAttr("value", d, this, false)})
            .on('change', function(d) { setAttr("value", d, this, false)})

        attrEnter
            .each(function(d) {
                d3.select(this)
                    .append('select')
                    .attr('class', 'option')
                    .on('change', function(d) { setAttr("preset", d, this, true)})
                    .selectAll('option')
                    .data(attrList(d.parent.shape))
                    .enter()
                    .append('option')
                    .html(d => d)
                    .attr('value', d => d)
            })

        attrEnter
            .append('button')
            .attr('class', 'option')
            .html('remove')
            .on('click', d => removeAttr(d))

        updateData(svg);
    }
}

function updateData(data) {
    draw(data);
    generate(data);
}