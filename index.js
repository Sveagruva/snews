const fs = require('fs');
const p = require('path');

const copmsPath = p.join(__dirname, 'comp');

const header = fs.readFileSync(p.join(__dirname, 'comp' , 'header.html'), 'utf-8');
const footer = fs.readFileSync(p.join(__dirname, 'comp', 'footer.html'), 'utf-8');


const create = (from, to) => {
    // console.log(from, to);

    fs.mkdirSync(p.dirname(to), { recursive: true });

    let html = header + fs.readFileSync(from, 'utf8') + footer;
    let vars = JSON.parse(fs.readFileSync(p.join(p.dirname(from), 'vars.json'), 'utf-8'));

    let matches = html.match(/{{{.*?}}}/mgi);
    // I prefer lighter

    matches.forEach(match => {
        let variableName = match.slice(3, -3);
        let value = '';

        if(vars[variableName] !== undefined) 
            value = vars[variableName];

        html = html.replace(match, value);
    });

    fs.writeFileSync(to, html);
}


const sendAll = (from, abs) => {
    let all = fs.readdirSync(from);

    all.forEach(element => {
        if(element.endsWith('.json')) return;

        if(element.endsWith('.html'))
            create(p.join(from, element), p.join(abs, element));
        else 
            sendAll(p.join(from, element), p.join(abs, element));
    });
}

sendAll(p.join(__dirname, 'site'), p.join(__dirname, 'docs'));