import * as d3 from './d3';

export default function() {
    d3.selectAll('.window, .panel')
        .each(function() {
            let node = d3.select(this).node();

            d3.selectAll('.panelH')
                .filter((d,i,a) => a[i].parentNode == node)
                .style('width', (d,i,a) => `${100/a.filter(d=>d).length}%`)

            d3.selectAll('.panelV')
                .filter((d,i,a) => a[i].parentNode == node)
                .style('height', (d,i,a) => `${100/a.filter(d=>d).length}%`)
        })
}