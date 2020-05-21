const datetime = require('node-datetime');
const fetch = require('node-fetch');

const DATE_FORMAT_STRING = 'Y-m-dT00:00:00Z';
const DATE_TODAY_STRING = datetime.create().format(DATE_FORMAT_STRING);
const DATE_TODAY = datetime.create(DATE_TODAY_STRING);
const DATE_YESTERDAY = datetime.create(DATE_TODAY_STRING);
DATE_YESTERDAY.offsetInDays(-1);
const DATE_YESTERDAY_STRING = DATE_YESTERDAY.format(DATE_FORMAT_STRING);

const REPOSITORIES = [
  {owner: 'frontendbr', repo: 'vagas'},
  {owner: 'backend-br', repo: 'vagas'}
];

function getURLFromRepository({owner, repo}) {
  const date = DATE_YESTERDAY_STRING;
  return `https://api.github.com/repos/${owner}/${repo}/issues?since=${date}`;
}

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

function getJobsPromiseFromGitHub() {
  const promises = [];

  REPOSITORIES.forEach((repository) => promises.push(
    fetch(getURLFromRepository(repository)).then(convertResponseToJSON).then(
      convertGitHubJSONToJobs
    ).then(filterJobs)
  ));

  return Promise.all(promises);
}

function getJobsPromise() {
  return getJobsPromiseFromGitHub().then((jobs) => jobs.flat());
}

module.exports = getJobsPromise;
