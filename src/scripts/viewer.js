import * as d3 from './d3';

var viewer;
var padding = 35;

export function initView() {

    viewer = d3.select('#viewer')
        .append('g')
        .attr("transform", `translate(${padding} ${padding})`);

    var scale = d3.scaleLinear()
            .range([0, 1000])
            .domain([0, 1000])

    let xAxis = d3.axisTop(scale).ticks(20);
    let yAxis = d3.axisLeft(scale).ticks(20);

    viewer
        .append("g")
        .attr("class", "axis xAxis")
        .call(xAxis);

    viewer
        .append("g")
        .attr("class", "axis yAxis")
        .call(yAxis);
}

export default function(data) {

    let draw = viewer.selectAll('[data-tweaker]')
        .data(data, d => d.index)

    draw.exit().remove();

    let drawEnter = draw
        .enter()
        .append(d => document.createElementNS(d3.namespaces.svg, d.shape))
        .attr('data-tweaker', true)

    let drawMerge = drawEnter.merge(draw);

    drawMerge.attrs(setAttrs)

}

function setAttrs(d) {

    let attrs = {};

    // add/edit

    d.attr.forEach(d => {
        d.name && (attrs[d.name] = d.value)
    });

    // remove

    let remove = [...this.attributes]
        .filter(d => d.name != 'data-tweaker' && attrs[d.name] === undefined)
        .map(d => d.name);

    remove.forEach(d => this.removeAttribute(d))

    return attrs;

}


