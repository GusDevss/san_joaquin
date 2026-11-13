// Empaqueta el contenido de dist/ en san-joaquin-hostinger.zip (listo para subir a public_html)
import fs from 'node:fs';
import { ZipArchive } from 'archiver';
const out = fs.createWriteStream('san-joaquin-hostinger.zip');
const zip = new ZipArchive({ zlib: { level: 9 } });
zip.pipe(out);
zip.directory('dist/', false);
await zip.finalize();
out.on('close', () => console.log(`san-joaquin-hostinger.zip — ${(zip.pointer() / 1024 / 1024).toFixed(2)} MB`));
