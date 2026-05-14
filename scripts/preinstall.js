const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
for (const file of ['package-lock.json', 'yarn.lock']) {
  const filePath = path.join(root, file);
  try {
    fs.rmSync(filePath, { force: true });
  } catch {}
}

const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead of npm or yarn.');
  process.exit(1);
}
