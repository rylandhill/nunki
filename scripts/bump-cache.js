#!/usr/bin/env node
/**
 * Bump the service worker cache version in public/sw.js.
 * Run before deploy so users get fresh assets.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = join(__dirname, '../public/sw.js');

const content = readFileSync(swPath, 'utf8');
const match = content.match(/nunki-(?:shell|data)-v(\d+)/);
if (!match) {
  console.error('Could not find cache version in sw.js');
  process.exit(1);
}
const next = parseInt(match[1], 10) + 1;
const updated = content.replace(
  /nunki-(?:shell|data)-v\d+/g,
  (m) => m.replace(/\d+$/, String(next))
);
writeFileSync(swPath, updated);
console.log(`Bumped cache to v${next}`);
