async function searchYouTube() {
  const query = document.getElementById('searchInput').value;
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  const ul = document.getElementById('results');
  ul.innerHTML = '';
  results.forEach(video => {
    const li = document.createElement('li');
    li.textContent = video.title;
    li.onclick = () => playStream(video.videoId, video.title);
    ul.appendChild(li);
  });
}

async function playStream(videoId, title) {
  const audio = document.getElementById('player');
  const src = document.getElementById('source');
  src.src = `/api/stream?id=${videoId}`;
  audio.load();
  audio.play();
  saveToPlaylist({ title, videoId });
}

async function saveToPlaylist(song) {
  await fetch('/api/savePlaylist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(song)
  });
}
