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

    viewer.selectAll('')

    // drag
    // resize
    // zoom


}