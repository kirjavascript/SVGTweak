import * as d3 from './d3';
import { SVG, update } from './index';
import { read, write } from './editor';
import htmlParse from 'html-parse-stringify';

export function generateCode (data, mode='xml') {

    mode = d3.select('#mode').node().value;

    if (mode == 'xml') {

        let out = `<svg xmlns="http://www.w3.org/2000/svg">\n`;

        data.forEach(d => {

            let attr = d.attrs
                .filter(a => a.name)
                .map(a => `${a.name}="${a.value}"`)
                .join(" ");

            attr = attr ? ' '+attr : ''; 

            out += `\t<${d.shape}${attr}/>\n`;
        })


        out += `</svg>`;

        write(out, 'html');

    }
    else if (mode == 'd3') {

        let out = ``;

        data.forEach(d => {

            out += `d3.select(this)\n`;
            out += `\t.append('${d.shape}')\n`;

            d.attrs.filter(a => a.name).forEach(d => {
                out += `\t.attr('${d.name}', '${d.value}')\n`;
            })

            out += '\n';
        })

        write(out, 'javascript');

    }

}



export function parse(data) {

    if (d3.select('#mode').node().value != 'xml') {
        return 0;
    }

    SVG.reset();

    let tree = htmlParse.parse(data);

    tree
        .filter(d => d.name.toLowerCase() == "svg")
        .forEach(d => {

            // get viewbox / width / height

            d.children.filter(d => d.type != 'text').forEach(d => {

                SVG.add(d.name, getAttrs(d.attrs));

            })

        });

    update({viewer:1,menu:1})

    // move into attr.js?

    function getAttrs(d) {
        return Object.keys(d).map(i => ({name: i, value: d[i]}));
    }

}