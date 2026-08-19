import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const viDir = path.join(projectRoot, 'public', 'i18n', 'vi');
const manifestPath = path.join(projectRoot, 'public', 'i18n', 'manifest.json');

function getJsonFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath, baseDir));
    } else if (file.endsWith('.json')) {
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      results.push(relativePath);
    }
  });
  return results;
}

try {
  if (fs.existsSync(viDir)) {
    const files = getJsonFiles(viDir);
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2), 'utf8');
    console.log(`[i18n] Generated manifest.json with ${files.length} translation files.`);
  } else {
    console.warn(`[i18n] Directory not found: ${viDir}`);
  }
} catch (err) {
  console.error('[i18n] Error generating manifest:', err);
}
