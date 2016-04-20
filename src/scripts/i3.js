import * as d3 from './d3';

i3();

export function i3() {
    d3.selectAll('.window, .panel')
        .each(function () {
            let node = d3.select(this).node();

            d3.selectAll('.panelH')
                .filter((d,i,a) => a[i].parentNode == node)
                .style('width', (d,i,a) => `${100/a.filter(d=>d).length}%`)

            d3.selectAll('.panelV')
                .filter((d,i,a) => a[i].parentNode == node)
                .style('height', (d,i,a) => `${100/a.filter(d=>d).length}%`)
        })
}

d3.selectAll('#intense, #calmdown').on('click', toggle)

function toggle() {

    var intense = d3.event.target.id == "intense";

    var t = d3.transition()
        .duration(400)
        .ease(d3.easeQuadInOut);

    d3.selectAll('.menuPanel')
        .transition(t)
        .styleTween('width', d => {
            let i = d3.interpolate(intense ? 50 : 0, intense ? 0 : 50);
            return t => `${i(t)}%`
        })

    d3.selectAll('#editor')
        .transition(t)
        .styleTween('height', d => {
            let i = d3.interpolate(intense ? 25 : 0, intense ? 0 : 25);
            return t => `${i(t)}%`
        })

    // d3.select('.editorPanel')
    //     .transition(t)
    //     .styleTween('width', d => {
    //         let i = d3.interpolate(intense ? 100 : 0, intense ? 0 : 100);
    //         return t => `${i(t)}%`
    //     })

    d3.select('#calmdown')
        .transition(t)
        .style('opacity', intense ? 1 : 0)

    d3.select('.rightPanel')
        .transition(t)
        .styleTween('width', d => {
            let i = d3.interpolate(intense ? 50 : 100, intense ? 100 : 50);
            return t => `${i(t)}%`
        })
}
