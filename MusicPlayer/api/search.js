export default async function handler(req, res) {
  const query = req.query.q;
  const apiKey = process.env.YT_API_KEY;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=5&type=video`);
  const data = await response.json();
  const results = data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id.videoId
  }));
  res.json(results);
}
