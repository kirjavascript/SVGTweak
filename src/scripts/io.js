import { read, write } from './editor';

export function generateCode (data, mode='xml') {

    if (mode == 'xml') {

        let out = `<svg xmlns="http://www.w3.org/2000/svg">\n`;

        data.forEach(d => {

            let attr = d.attr
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

            d.attr.filter(a => a.name).forEach(d => {
                out += `\t.attr('${d.name}', '${d.value}')\n`;
            })

            out += '\n';
        })

        write(out, 'javascript');

    }

}

let parser = new DOMParser();

export function parseXML(data) {

    return parser.parseFromString(data, "application/xml")

}