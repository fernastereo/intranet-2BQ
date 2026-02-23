import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.argv[2] || 'production';

const sourceFile = join(__dirname, '..', 'public', `.htaccess.${env}`);
const targetFile = join(__dirname, '..', 'public', '.htaccess');

if (!existsSync(sourceFile)) {
  console.error(`❌ Error: No existe el archivo ${sourceFile}`);
  process.exit(1);
}

try {
  copyFileSync(sourceFile, targetFile);
  console.log(`✅ Copiado .htaccess.${env} → .htaccess`);
} catch (error) {
  console.error(`❌ Error copiando .htaccess: ${error.message}`);
  process.exit(1);
}
