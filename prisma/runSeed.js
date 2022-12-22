// it does not work to use && in prisma package.json seed configuration
// to not use shell scripts in case of lack of shell on your machine I use
// Node.js since everyone already needs to have it
const { spawnSync } = require('child_process')
const compilation = spawnSync('pnpm webpack --config prisma/webpack.config.js', {shell: true, stdio: 'inherit'})
if (compilation.status !== 0) throw Error('compilation failed')
spawnSync('node prisma/dist/seed.js', {shell: true, stdio: 'inherit'})
