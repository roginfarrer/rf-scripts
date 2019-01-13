const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const yargsParser = require('yargs-parser');
const {
  hasFile,
  resolveBin,
  fromRoot,
  getConcurrentlyArgs
} = require('../../utils');

const crossEnv = resolveBin('cross-env');
const rollup = resolveBin('rollup');
const args = process.argv.slice(2);
const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');
const parsedArgs = yargsParser(args);

const useBuiltinConfig =
  !args.includes('--config') && !hasFile('rollup.config.js');
const config = useBuiltinConfig
  ? `--config ${hereRelative('../../config/rollup.config.js')}`
  : args.includes('--config') ? '' : '--config'; // --config will pick up the rollup.config.js file

const environment = parsedArgs.environment
  ? `--environment ${parsedArgs.environment}`
  : '';
const watch = parsedArgs.watch ? '--watch' : '';
const sizeSnapshot = parsedArgs['size-snapshot'];

let formats = ['esm', 'cjs', 'umd', 'umd.min'];

if (typeof parsedArgs.bundle === 'string') {
  formats = parsedArgs.bundle.split(',');
}

const defaultEnv = 'BUILD_ROLLUP=true';

const getCommand = (env, ...flags) =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch, ...flags]
    .filter(Boolean)
    .join(' ');

const scripts = getConcurrentlyArgs(getCommands());

const cleanBuildDirs = !args.includes('--no-clean');

if (cleanBuildDirs) {
  rimraf.sync(fromRoot('dist'));
}

const result = spawn.sync(resolveBin('concurrently'), scripts, {
  stdio: 'inherit'
});

function getCommands() {
  return formats.reduce((cmds, format) => {
    const [formatName, minify = false] = format.split('.');
    const nodeEnv = minify ? 'production' : 'development';
    const sourceMap = formatName === 'umd' ? '--sourcemap' : '';
    const buildMinify = Boolean(minify);

    cmds[format] = getCommand(
      [
        `BUILD_FORMAT=${formatName}`,
        `BUILD_MINIFY=${buildMinify}`,
        `NODE_ENV=${nodeEnv}`,
        `BUILD_SIZE_SNAPSHOT=${sizeSnapshot}`,
        `BUILD_NODE=${process.env.BUILD_NODE || false}`
      ].join(' '),
      sourceMap
    );
    return cmds;
  }, {});
}

process.exit(result.status);
