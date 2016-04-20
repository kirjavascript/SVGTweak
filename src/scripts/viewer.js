import * as d3 from './d3';
import { SVG, update } from './index';

var padding = 35;

var viewer = d3.select('#viewer')
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

// move into attr.js?

function setAttrs(d) {

    let attrs = {};

    // add/edit

    d.attrs.forEach(d => {
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

    let moveTimer = 0;

    self.on('mousedown', dragStart)
        .on('mouseup', dragEnd)

    function dragStart() {
        d3.select(document.body)
            .on('mousemove', dragMove)

        moveTimer = setInterval(d =>
            requestAnimationFrame(d =>
                update({code:1,menu:1}
            )
        ), 100);

        mouse = {
            x: d3.event.clientX,
            y: d3.event.clientY,
        }

        bbox = self.node().getBBox();

        if (this.attributes.x && this.attributes.y) {
            attrs = { x: 'x', y: 'y'};
        }
        else if (this.attributes.cx && this.attributes.cy) {
            attrs = { x: 'cx', y: 'cy', circle: 1};
        }

        d3.event.preventDefault()
    }

    function dragMove() {

        if (attrs) {
            let delta = {
                x: d3.event.clientX - mouse.x,
                y: d3.event.clientY - mouse.y,
            }


            bbox.x += delta.x;
            bbox.y += delta.y;


            if(attrs.circle) {
                self
                    .attr(attrs.x, bbox.x + bbox.width/2)
                    .attr(attrs.y, bbox.y + bbox.height/2)

                d.attrs.find(d => d.name == attrs.x).value = bbox.x + bbox.width/2;
                d.attrs.find(d => d.name == attrs.y).value = bbox.y + bbox.height/2;
            }
            else {
                self
                    .attr(attrs.x, bbox.x)
                    .attr(attrs.y, bbox.y)

                d.attrs.find(d => d.name == attrs.x).value = bbox.x;
                d.attrs.find(d => d.name == attrs.y).value = bbox.y;
            }


            mouse = {
                x: d3.event.clientX,
                y: d3.event.clientY,
            }
        }

    }

    function dragEnd() {
        clearInterval(moveTimer);
        d3.select(document.body).on('mousemove', null)
        attrs = null;
        update({all:1});
    }
}
