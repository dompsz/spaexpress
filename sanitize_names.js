const fs = require('fs');
const path = require('path');

const oldDirName = 'Spa Express_files';
const newDirName = 'Spa_Express_files';
const oldHtmlName = 'Spa Express.html';
const newHtmlName = 'index.html';

// 1. Rename directory if exists
if (fs.existsSync(oldDirName)) {
    fs.renameSync(oldDirName, newDirName);
    console.log(`Zmieniono nazwę folderu: ${oldDirName} -> ${newDirName}`);
}

// 2. Rename files inside the directory
const files = fs.readdirSync(newDirName);
const fileRenames = {};

files.forEach(file => {
    if (file.includes(' ')) {
        const newFileName = file.replace(/ /g, '_');
        fs.renameSync(path.join(newDirName, file), path.join(newDirName, newFileName));
        fileRenames[file] = newFileName;
        console.log(`Zmieniono nazwę pliku: ${file} -> ${newFileName}`);
    }
});

// 3. Update HTML content
if (fs.existsSync(oldHtmlName)) {
    let htmlContent = fs.readFileSync(oldHtmlName, 'utf8');

    // Update directory reference
    // Escape space for regex to be safe
    const dirRegex = new RegExp(oldDirName.replace(/ /g, ' '), 'g');
    htmlContent = htmlContent.replace(dirRegex, newDirName);

    // Update file references that had spaces
    for (const [oldName, newName] of Object.entries(fileRenames)) {
        // We look for the filename in the context of the new directory path
        const fileRegex = new RegExp(oldName.replace(/ /g, ' '), 'g');
        htmlContent = htmlContent.replace(fileRegex, newName);
    }

    fs.writeFileSync(newHtmlName, htmlContent);
    console.log(`Zaktualizowano ${newHtmlName} i zapisano jako index.html`);
    
    // Optional: Remove old HTML if it was the one we just processed
    if (oldHtmlName !== newHtmlName) {
        fs.unlinkSync(oldHtmlName);
        console.log(`Usunięto stary plik: ${oldHtmlName}`);
    }
}
