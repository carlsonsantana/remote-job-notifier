const fs = require('fs');

const datetime = require('node-datetime');
const fetch = require('node-fetch');

const DATE_FORMAT_STRING = 'Y-m-dT00:00:00Z';
const DATE_TODAY_STRING = datetime.create().format(DATE_FORMAT_STRING);
const DATE_TODAY = datetime.create(DATE_TODAY_STRING);
const DATE_YESTERDAY = datetime.create(DATE_TODAY_STRING);
DATE_YESTERDAY.offsetInDays(-1);
const DATE_YESTERDAY_STRING = DATE_YESTERDAY.format(DATE_FORMAT_STRING);

const GITHUB_FRONTEND_VAGAS = (
  'https://api.github.com/repos/frontendbr/vagas/issues?since='
  + DATE_YESTERDAY_STRING
);

function convertResponseToJSON(response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

function convertGitHubJSONToJobs(githubJSON) {
  return githubJSON.map(({title, body, html_url, created_at}) => {
    return {
      title,
      description: body,
      url: html_url,
      publishedAt: new Date(datetime.create(created_at).getTime())
    };
  });
}

function filterJobs(jobs) {
  return jobs.filter((job) => {
    return (
      (job.publishedAt.getTime() > DATE_YESTERDAY.getTime())
      && (job.publishedAt.getTime() < DATE_TODAY.getTime())
    );
  });
}

function saveJobs(jobs) {
  fs.writeFileSync('./jobs.json', JSON.stringify(jobs), 'utf-8');
}

fetch(GITHUB_FRONTEND_VAGAS).then(convertResponseToJSON).then(
  convertGitHubJSONToJobs
).then(filterJobs).then(saveJobs);
