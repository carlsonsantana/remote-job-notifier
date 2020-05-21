const dialog = require('dialog');

const getGitHubJobsPromise = require('./github.js');

getGitHubJobsPromise().then((jobs) => {
  const message = jobs.reduce((accumulator, job) => {
    const endString = job.title + '\n' + job.url + '\n\n';
    if (typeof accumulator === 'string') {
      return accumulator + endString;
    }
    return endString;
  });

  if (message) {
    dialog.info(message);
  }
});
