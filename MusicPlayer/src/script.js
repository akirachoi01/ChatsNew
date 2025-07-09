const YOUTUBE_API_KEY = 'AIzaSyCT5uYssh2bfXO_mOIMTwDVoQ0r5mxsstU';
const GITHUB_TOKEN = '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'; // Personal Access Token

let playlist = [];
let currentIndex = 0;

function searchYouTube() {
  const query = document.getElementById('search').value;
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const results = document.getElementById('results');
      results.innerHTML = '';
      data.items.forEach(item => {
        const title = item.snippet.title;
        const videoId = item.id.videoId;

        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>${title}</strong></p>
          <button onclick="addToPlaylist('${videoId}', '${title.replace(/'/g, "\\'")}')">Add to Playlist</button>
          <hr/>
        `;
        results.appendChild(div);
      });
    });
}

function addToPlaylist(videoId, title) {
  playlist.push({ title, youtubeId: videoId });
  updatePlaylist();
  currentIndex = playlist.length - 1;
  playVideo(currentIndex);
}

function updatePlaylist() {
  const ul = document.getElementById('playlist');
  ul.innerHTML = '';
  playlist.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${i + 1}. ${item.title}
      <button onclick="playVideo(${i})">▶</button>
    `;
    ul.appendChild(li);
  });
}

function playVideo(index) {
  const video = playlist[index];
  document.getElementById('nowPlaying').innerText = video.title;
  document.getElementById('player').src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
  currentIndex = index;
}

function savePlaylistToGist() {
  const gistData = {
    description: "Auto-saved YouTube Music Playlist",
    public: false,
    files: {
      "playlist.json": {
        content: JSON.stringify(playlist, null, 2)
      }
    }
  };

  fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(gistData)
  })
    .then(res => res.json())
    .then(data => {
      alert("Playlist saved! Gist URL: " + data.html_url);
      console.log("Saved Gist:", data);
    })
    .catch(err => {
      console.error('Error:', err);
      alert("Failed to save playlist.");
    });
}
