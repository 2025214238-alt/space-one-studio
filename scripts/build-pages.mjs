import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const owner = '2025214238-alt';
const repository = 'space-one-studio';
const site = `https://${owner}.github.io/${repository}/`;

execFileSync('npm', ['run', 'build', '--', `--base=/${repository}/`], { stdio: 'inherit' });
const html = readFileSync('dist/index.html', 'utf8').replaceAll('https://space-one-studio.baze.cloud/', site);
writeFileSync('dist/index.html', html);
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log(`GitHub Pages build: ${site}`);
