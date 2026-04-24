const fs = require('fs');

const htmlFile = 'index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// 1. Better Instagram Resizing
// We target the element containing instagram.com
const instaRegex = /(<div id="element_(\d+)"[^>]*>.*?instagram\.com.*?<\/div><div class="backgroundOverlay"><\/div><\/div>)/gs;

html = html.replace(instaRegex, (fullMatch) => {
    console.log('Znaleziono kontener Instagrama, modyfikuję...');
    
    // Update style width/height
    let modified = fullMatch.replace(/width:\s*30px/g, 'width: 60px');
    modified = modified.replace(/height:\s*30px/g, 'height: 60px');
    modified = modified.replace(/transform-origin:\s*15px\s*15px/g, 'transform-origin: 30px 30px');
    
    // Update data-ww_rwd JSON (CRITICAL for WebWave)
    // WebWave stores dimensions in JSON like &quot;width&quot;:30
    modified = modified.replace(/&quot;width&quot;:30/g, '&quot;width&quot;:60');
    modified = modified.replace(/&quot;height&quot;:30/g, '&quot;height&quot;:60');
    
    // Update internal images
    modified = modified.replace(/width="30px"/g, 'width="60px"');
    modified = modified.replace(/height="30px"/g, 'height="60px"');
    modified = modified.replace(/style="height:\s*30px;"/g, 'style="height: 60px;"');

    return modified;
});

// 2. Remove the "Black Bar" (element_714 was empty and suspected)
// Also check for element_713 container if it left something
const elementsToRemove = ['element_714', 'element_713'];
elementsToRemove.forEach(id => {
    const regex = new RegExp('<div id="' + id + '"[^>]*>(?:(?!<div id="element_\\d+").)*?</div><div class="backgroundOverlay"><\/div><\/div>', 'gs');
    html = html.replace(regex, () => {
        console.log(`Usunięto potencjalny czarny pasek/pozostałość: ${id}`);
        return '';
    });
});

// 3. One more check for the "Website created in..." text in case it's in a different element
const webwaveTextRegex = /<div id="element_\d+"[^>]*>(?:(?!<div id="element_\\d+").)*?Website created in.*?<\/div><div class="backgroundOverlay"><\/div><\/div>/gs;
html = html.replace(webwaveTextRegex, () => {
    console.log('Usunięto dodatkowy element z tekstem WebWave');
    return '';
});

fs.writeFileSync(htmlFile, html);
console.log('Zakończono poprawki.');
