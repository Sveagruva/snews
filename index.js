const fs = require('fs');
const p = require('path');
const fse = require('fs-extra');

const buildDir = p.join(__dirname, 'build');
if(!fs.existsSync(buildDir))
    fs.mkdirSync(buildDir);



const header = fs.readFileSync(p.join(__dirname, 'comp' , 'header.html'), 'utf-8');
const footer = fs.readFileSync(p.join(__dirname, 'comp', 'footer.html'), 'utf-8');

const globalsVars = {
    title: 'SNEWS',
};

const copyObj = obj => JSON.parse(JSON.stringify(obj));


const create = (from, to) => {
    fs.mkdirSync(p.dirname(to), { recursive: true });

    let html = header + fs.readFileSync(from, 'utf8') + footer;
    let vars = Object.assign(copyObj(globalsVars), JSON.parse(fs.readFileSync(p.join(p.dirname(from), 'vars.json'), 'utf-8')));

    // remove html comments
    html = html.replace(/<\!--.*?-->/mgis, '');
    html.match(/{{{.*?}}}/mgi).forEach(matched => {
        let variableName = matched.slice(3, -3);
        html = html.replace(matched, vars[variableName] === undefined ? '' : vars[variableName]);
    });

    fs.writeFileSync(to, html);
}


const sendAll = (from, abs) => {
    fs.readdirSync(from).forEach(element => {
        if(element.endsWith('.json')) return;

        if(element.endsWith('.html'))
            create(p.join(from, element), p.join(abs, element));
        else 
            sendAll(p.join(from, element), p.join(abs, element));
    });
}

fse.copySync(p.join(__dirname, 'docs'), buildDir);
sendAll(p.join(__dirname, 'site'), buildDir);
