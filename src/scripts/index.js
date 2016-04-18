import './i3';
import './editor';
import * as d3 from './d3';
import attr from './attr';
import draw from './viewer';
import { generateCode } from './parser';

// split this into module?

export let SVG = (function() {

    let index = 0;

    function SVG() {
        return 'hello world';
    }

    SVG.data = [];

    SVG.add = function(shape) {
        index++;
        this.data.push({
            index: index++,
            shape: shape,
            attrs: attr.defaults(shape)
        })
        return this;
    }

    SVG.reset = function() {
        index = 0;
        this.data = [];
        return this;
    }

    return SVG;

})()

// events

d3.select('#mode').on('change', update)

d3.select('#shape').on('change', function() {
    let shape = d3.select('#shape').node();

    SVG.add(shape.value);

    shape.selectedIndex = 0;

    update();
})

// data manipulation

function option(element, index, action) {

    if (action == 'remove') {

        SVG.data = SVG.data.filter(d => d.index != index)

    }
    else if (action == 'attr') {

        let element = SVG.data.find(d => d.index == index);

        element.attrs.push({value:""});

    }
    else if (action == 'down') {
        // swap index and DOM
        let elementIndex = SVG.data.findIndex(d => d.index == index);

        console.log(elementIndex)

    }

    update();
}

function setAttr(type, data, value, refresh) {

    // find data

    let objAttr = SVG.data.find(d => data.parent.index == d.index).attrs;

    let objAttrIndex = objAttr.findIndex(d => data == d);

    // set data

    (typeof value == 'object') && (value = value.value)

    if (type == 'preset') {
        objAttr[objAttrIndex].name = value;
        objAttr[objAttrIndex].value = attr.preset(value, data.parent.shape)
    }
    else {
        objAttr[objAttrIndex][type] = value;
    }

    if (refresh) {
        update();
    }
    else {
        updateData(SVG.data);
    }
}

function removeAttr(data) {

    SVG.data.find(d => data.parent == d)

    let attr = SVG.data.find(d => data.parent == d).attrs;

    let attrIndex = attr.findIndex(d => data == d);

    attr.splice(attrIndex, 1)

    update();

}

// data bind

export function update() {

    let shape = d3.select('#menu')
        .selectAll('div')
        .data(SVG.data, d => d.index)

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
        .on('click', d => window.open('http://mdn.io/SVG.data%20element%20' + d.shape))

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
            .data(d => d.attrs.map(j => {j.parent = d; return j}))
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
            .on('click', attr.customInput)

        attrEnter
            .each(function(d) {
                d3.select(this)
                    .append('select')
                    .attr('class', 'option')
                    .on('change', function(d) { setAttr("preset", d, this, true)})
                    .selectAll('option')
                    .data(attr.list(d.parent.shape))
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

        updateData(SVG.data);
    }
}

function updateData(data) {
    draw(data);
    generateCode(data, d3.select('#mode').node().value);
}