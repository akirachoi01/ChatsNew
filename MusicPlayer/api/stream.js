import { spawn } from 'child_process';

export default function handler(req, res) {
  const videoId = req.query.id;
  res.setHeader('Content-Type', 'audio/mpeg');

  const process = spawn('yt-dlp', [
    '-f', 'bestaudio',
    `https://www.youtube.com/watch?v=${videoId}`,
    '-o', '-', '--quiet'
  ]);

  process.stdout.pipe(res);
  process.stderr.on('data', (data) => console.error(data.toString()));
}
