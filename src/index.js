const fs = require('fs');

const fetch = require('node-fetch');

const GITHUB_FRONTEND_VAGAS = (
  'https://api.github.com/repos/frontendbr/vagas/issues'
);

fetch(GITHUB_FRONTEND_VAGAS).then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}).then((response) => {
  return response.map(
    ({title, body, html_url, created_at}) => {
      return {
        title,
        description: body,
        url: html_url,
        publishedAt: created_at
      };
    }
  );
}).then((response) => {
  fs.writeFileSync('./jobs.json', JSON.stringify(response), 'utf-8');
});
