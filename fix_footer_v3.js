const fs = require('fs');

const htmlFile = 'index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// 1. RE-FIX Instagram (and only Instagram)
// We find the element containing instagram.com link
const instaRegex = /(<div id="element_(\d+)"[^>]*>.*?instagram\.com.*?<\/div><div class="backgroundOverlay"><\/div><\/div>)/gs;

html = html.replace(instaRegex, (fullMatch, p1, id) => {
    console.log(`Znaleziono Instagram (ID: element_${id}), powiększam do 80px...`);
    
    // Replace 30px (or any small value) with 80px
    let modified = fullMatch.replace(/width:\s*(\d+)px/g, 'width: 80px');
    modified = modified.replace(/height:\s*(\d+)px/g, 'height: 80px');
    modified = modified.replace(/transform-origin:\s*(\d+)px\s*(\d+)px/g, 'transform-origin: 40px 40px');
    
    // Update data-ww_rwd for all modes
    modified = modified.replace(/&quot;width&quot;:(\d+)/g, '&quot;width&quot;:80');
    modified = modified.replace(/&quot;height&quot;:(\d+)/g, '&quot;height&quot;:80');
    
    // Update internal img tags
    modified = modified.replace(/width="(\d+)px"/g, 'width="80px"');
    modified = modified.replace(/height="(\d+)px"/g, 'height="80px"');
    modified = modified.replace(/style="height:\s*(\d+)px;"/g, 'style="height: 80px;"');

    return modified;
});

// 2. Fix Phone/Location icons (bring back to 30px if they were accidentally enlarged)
const otherIcons = ['element_832', 'element_706'];
otherIcons.forEach(id => {
    const regex = new RegExp('(<div id="' + id + '"[^>]*style="[^"]*width:\\s*)80px(; height:\\s*)80px', 'g');
    html = html.replace(regex, '$130px$230px');
    // Also fix transform-origin
    const originRegex = new RegExp('(<div id="' + id + '"[^>]*transform-origin:\\s*)40px\\s+40px', 'g');
    html = html.replace(originRegex, '$115px 15px');
});

// 3. REMOVE BLACK BAR
// In WebWave, there's often a "shape" or "box" element used as background.
// Let's find element_10 or similar that was mentioned before as footer branding container.
// Or find elements with black background and no content in the footer area.
const blackBarIds = ['element_713', 'element_714', 'element_10']; 
blackBarIds.forEach(id => {
    const regex = new RegExp('<div id="' + id + '"[^>]*>(?:(?!<div id="element_\\d+").)*?</div><div class="backgroundOverlay"><\/div><\/div>', 'gs');
    html = html.replace(regex, () => {
        console.log(`Usunięto element tła/paska: ${id}`);
        return '';
    });
});

// Also remove any element containing "WebWave" even if not in our IDs
const webwaveRegex = /<div id="element_\d+"[^>]*>(?:(?!<div id="element_\\d+").)*?WebWave.*?<\/div><div class="backgroundOverlay"><\/div><\/div>/gs;
html = html.replace(webwaveRegex, '');

fs.writeFileSync(htmlFile, html);
console.log('Gotowe.');
