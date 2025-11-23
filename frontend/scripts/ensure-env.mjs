#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Always write to frontend/.env (directory of this script is frontend/scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_BACKEND_URL'];

function parseEnv(content) {
  const map = {};
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map[m[1]] = m[2];
  });
  return map;
}

let existed = fs.existsSync(envPath);
let content = existed ? fs.readFileSync(envPath, 'utf8') : '';
let env = parseEnv(content);
let changed = false;

for (const key of required) {
  if (!env[key] || env[key].trim() === '') {
    changed = true;
    let val = '';
    if (key === 'VITE_BACKEND_URL') val = 'http://127.0.0.1:5000';
    content += (content.endsWith('\n') || content === '' ? '' : '\n') + `${key}=${val}` + '\n';
    // eslint-disable-next-line no-console
    console.warn(`[ensure-env] Added missing ${key} to frontend/.env`);
  }
}

if (!existed || changed) {
  fs.writeFileSync(envPath, content, 'utf8');
}
