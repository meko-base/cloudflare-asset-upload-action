import { commandDeploy } from './command-deploy.js';
import { commandRollback } from './command-rollback.js';

import core from '@actions/core';

try {
  if (core.getInput('deploy')) {
    console.log('Starting deploy...');

    const version = await commandDeploy({
      distDir: core.getInput('dist')
    });

    core.setOutput('version', version);

    console.log('Deploy complete!');
  } else if (core.getInput('rollback')) {
    console.log('Starting rollback...');

    await commandRollback();

    console.log('Rollback complete!');
  }

  process.exit(0);
} catch (error) {
  core.setFailed(error.message);

  process.exit(1);
}
