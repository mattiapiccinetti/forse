const fs = require('fs'), crypto = require('crypto');
const tips = fs.readFileSync('tips.txt', 'utf8').split('\n').filter(l => l.trim());
const obj = {};
tips.forEach(t => { obj[crypto.createHash('md5').update(t).digest('hex')] = t; });
const encoded = Buffer.from(JSON.stringify(obj)).toString('base64');
fs.writeFileSync('built.html', fs.readFileSync('index.html', 'utf8').replace('{{TIPS}}', encoded));
