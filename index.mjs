import core from '@actions/core';

import { commandDeploy } from './command-deploy.mjs';
import { commandRollback } from './command-rollback.mjs';

(async () => {
  try {
    if (core.getInput('deploy')) {
      console.log('Starting deploy...');
  
      const version = await commandDeploy({
        distDir: core.getInput('dist_dir')
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
    console.log(error.message);
    core.setFailed(error.message);
  
    process.exit(1);
  }  
})();
