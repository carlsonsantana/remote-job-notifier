const dialog = require('dialog');
const jobs = require('jobs-promise');

const YESTERDAY = new Date(Date.now() - 86400000);
YESTERDAY.setMilliseconds(0);
YESTERDAY.setSeconds(0);
YESTERDAY.setMinutes(0);
YESTERDAY.setHours(0);

jobs.githubIssuesPromise(YESTERDAY).then((jobs) => {
  const message = jobs.map((job) => job.title + '\n' + job.url).join('\n\n');

  if (message.length > 0) {
    dialog.info(message);
  }
});
