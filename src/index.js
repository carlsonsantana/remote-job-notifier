const dialog = require('dialog');
const jobs = require('jobs-promise');

jobs.githubIssuesPromise().then((jobs) => {
  const message = jobs.map((job) => job.title + '\n' + job.url).join('\n\n');

  if (message.length > 0) {
    dialog.info(message);
  }
});
