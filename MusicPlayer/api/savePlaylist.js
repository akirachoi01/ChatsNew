import { Octokit } from '@octokit/rest';

let playlist = [];

export default async function handler(req, res) {
  const song = req.body;
  playlist.push(song);

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const { owner, repo } = parseRepo(process.env.GITHUB_REPO);
  const path = 'MusicPlayer/assets/playlist.json';

  const { data: current } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: process.env.GITHUB_BRANCH || 'main'
  });

  const sha = current.sha;
  const content = Buffer.from(JSON.stringify(playlist, null, 2)).toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: 'Update playlist.json',
    content,
    sha,
    branch: process.env.GITHUB_BRANCH || 'main'
  });

  res.json({ status: 'ok' });
}

function parseRepo(repoStr) {
  const [owner, repo] = repoStr.split('/');
  return { owner, repo };
}
