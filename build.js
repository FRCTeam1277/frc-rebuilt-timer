const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// Ensure dist exists
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// Read source files
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const jsFiles = ['audio.js', 'alliance.js', 'script.js', 'uiux.js'];
const jsContents = {};
for (const f of jsFiles) {
    jsContents[f] = fs.readFileSync(path.join(ROOT, f), 'utf8');
}

// Inline CSS: replace <link rel="stylesheet" href="style.css"> with <style>
html = html.replace(
    /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/i,
    `<style>\n${css}\n</style>`
);

// Inline JS: replace each <script defer src="X.js"></script> with <script>
for (const f of jsFiles) {
    const escaped = f.replace('.', '\\.');
    html = html.replace(
        new RegExp(`<script\\s+defer\\s+src="${escaped}"\\s*><\\/script>`, 'i'),
        `<script>\n${jsContents[f]}\n</script>`
    );
}

// Flatten audio paths: ./audio/X.wav -> ./X.wav
html = html.replace(/\.\/audio\//g, './');

// Remove service worker registration block (not useful in single-file deploy)
const swBlock = html.indexOf('// Register service worker');
if (swBlock !== -1) {
    // Find the end: match closing braces after the registration
    const afterSw = html.substring(swBlock);
    // The block ends with "});\n            }" 
    const endMatch = afterSw.match(/\}\);\s*\n\s*\}/);
    if (endMatch) {
        const endIdx = swBlock + endMatch.index + endMatch[0].length;
        html = html.substring(0, swBlock) + html.substring(endIdx);
    }
}

// Remove PWA manifest link (manifest.json not in dist)
html = html.replace(/\s*<link\s+rel="manifest"\s+href="manifest\.json"\s*\/?>/i, '');

// Remove icon links (icons/ not in dist)
html = html.replace(/\s*<link\s+rel="apple-touch-icon"\s+href="icons\/icon-192\.png"\s*\/?>/i, '');
html = html.replace(/\s*<link\s+rel="icon"\s+href="icons\/icon-192\.png"\s*\/?>/i, '');

// Remove <audio> elements (Web Audio API handles playback; these are just fallback)
// Actually keep them as fallback, but paths are already flattened above

// Write output
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// Copy audio files to dist root (flat)
const audioDir = path.join(ROOT, 'audio');
for (const f of fs.readdirSync(audioDir)) {
    fs.copyFileSync(path.join(audioDir, f), path.join(OUT, f));
}

console.log('Built to dist/');
console.log('  dist/index.html  (single file, all CSS/JS inlined)');
console.log('  dist/*.wav       (audio files, flat)');
