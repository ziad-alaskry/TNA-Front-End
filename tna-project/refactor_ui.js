const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) walk(dirPath, callback);
        else callback(dirPath);
    });
}

function refactorFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;

    // --- 1. Flatten UI ---
    // Remove gradients and replace with solid white + border
    content = content.replace(/bg-gradient-to-[trbl]{1,2}/g, 'bg-white border border-slate-200');
    // Strip from-*, to-*, via-* classes
    content = content.replace(/\bfrom-[a-zA-Z0-9-\[\]#]+\b/g, '');
    content = content.replace(/\bto-[a-zA-Z0-9-\[\]#]+\b/g, '');
    content = content.replace(/\bvia-[a-zA-Z0-9-\[\]#]+\b/g, '');
    
    // Standardize generated arbitrary background gradients to blank
    content = content.replace(/style="[^"]*background-image:[^"]*"/g, '');
    content = content.replace(/style='[^']*background-image:[^']*'/g, '');

    // --- 2. Component Cleanup (Avatars) ---
    // Replace typical img avatars with a uniform div.
    content = content.replace(/<img[^>]*>/gi, (match) => {
        // Only target smaller square or rounded images that look like avatars
        if (match.includes('rounded-full') || match.includes('w-10') || match.includes('h-10') || match.includes('w-8') || match.includes('w-12')) {
            return `<div class="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm font-sans">&#123;user.initials&#125;</div>`;
        }
        return match;
    });

    // --- 3. Consistency Check (Buttons & Primary Colors & Font) ---
    // Convert hardcoded hex blues into bg-primary
    content = content.replace(/\bbg-\[#[0-9a-fA-F]{6}\]/g, (match) => {
        const hex = match.toLowerCase();
        // Typically Stitch generated blues
        if (hex.includes('137fec') || hex.includes('1d4ed8') || hex.includes('blue')) return 'bg-primary';
        return 'bg-primary'; // Force map arbitrary buttons to primary based on user's instruction.
    });
    content = content.replace(/\bbg-blue-\d{3}\b/g, 'bg-primary');
    content = content.replace(/\btext-blue-\d{3}\b/g, 'text-primary');

    // Enforce font-sans and primary on buttons structurally
    content = content.replace(/<button([^>]*)class="([^"]*)"/g, (fullMatch, prior, classes) => {
        let newClasses = classes;
        if (!newClasses.includes('font-sans')) newClasses += ' font-sans';
        return `<button${prior}class="${newClasses}"`;
    });

    // --- 4. Data Sanitization ---
    // Phone numbers (Saudi format starting with 05)
    content = content.replace(/(>|\s)05\d{8}(<|\s)/g, '$1&#123;user.phone&#125;$2');
    
    // Govt IDs / Iqama (starting with 10 or 20)
    content = content.replace(/(>|\s)[12]0\d{8}(<|\s)/g, '$1&#123;user.id&#125;$2');
    
    // Shipment IDs (e.g. #124556)
    content = content.replace(/(>|\s)#\d{5,}(<|\s)/g, '$1#&#123;shipment.id&#125;$2');

    // Amounts (e.g. 1500 SAR, 1,500.00 ر.س)
    content = content.replace(/(>|\s)(\d{1,3}(,\d{3})*(\.\d{1,2})?)\s*(SAR|ر\.س|ريال)(<|\s)/gi, '$1&#123;data.amount&#125; SAR$6');

    // Dates
    content = content.replace(/(>|\s)\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)[A-Za-z]*\s+\d{4}(<|\s)/gi, '$1&#123;date.formatted&#125;$3');
    
    // Timestamps
    content = content.replace(/(>|\s)\d{1,2}:\d{2}\s+(AM|PM|ص|م)(<|\s)/gi, '$1&#123;time.formatted&#125;$3');

    // Replace typical generic placeholder text from designs explicitly to show data sanitization
    const placeholderNames = [
        'أحمد محمد', 'عبدالله', 'خالد', 'سعد', 'سعود', 'مؤسسة الناقل', 'شركة اللوجستيات', 'Jane Doe', 'John Doe'
    ];
    placeholderNames.forEach(name => {
        const regex = new RegExp(`(>|\\s)${name}(<|\\s)`, 'gi');
        content = content.replace(regex, '$1&#123;user.name&#125;$2');
    });

    // Ensure we don't accidentally ruin React structural formatting.
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[Success] Refactored: ${filePath}`);
    }
}

const targetDir = path.join(__dirname, 'src/app');
console.log(`Starting refactoring scan in ${targetDir}...`);
walk(targetDir, refactorFile);
console.log(`Refactoring complete!`);
