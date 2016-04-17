import * as d3 from './d3';
import { update } from './index';

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

    viewer = viewer.append('g').attr('id', 'graphics')
}

export default function(data) {

    let draw = viewer.selectAll('[data-tweaker]')
        .data(data, d => d.index)

    draw.exit().remove();

    let drawEnter = draw
        .enter()
        .append(d => document.createElementNS(d3.namespaces.svg, d.shape))
        .attr('data-tweaker', true)
        .each(drag)

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

function drag(d) {
    let self = d3.select(this);
    
    let mouse, bbox, attrs;

    self.on('mousedown', function() {
        d3.select(document.body)
            .on('mousemove', drag)



        mouse = {
            x: d3.event.clientX,
            y: d3.event.clientY,
        }
        bbox = self.node().getBBox();

        d3.event.preventDefault()

    })
    //.on('mouseout', dragend)
    .on('mouseup', dragend)

    function drag() {

        let delta = {
            x: d3.event.clientX - mouse.x,
            y: d3.event.clientY - mouse.y,
        }
        
        self
            .attr('x', bbox.x += delta.x)
            .attr('y', bbox.y += delta.y)

        d.attr.find(d => d.name == 'x').value = bbox.x;
        d.attr.find(d => d.name == 'y').value = bbox.y;

        mouse = {
            x: d3.event.clientX,
            y: d3.event.clientY,
        }
    }

    function dragend() {
        d3.select(document.body).on('mousemove', null)
        update();
    }
}