  // Get audio element and define playlist
  let audio = document.getElementById("bgm"),
      playlist = [
        "music/Love_Me_like_U_Used_to.mp3",
        "music/Mariah_Carey_Fantasy(Sweet_Dub_Mix).mp3"
      ],
      current = 0;

  // Set the initial audio source
  audio.src = playlist[current];

  // Play/Pause functionality
  document.getElementById("playPause").onclick = () => {
    if (audio.paused) {
      audio.play();
      document.getElementById("playPause").setAttribute("data-playing", "true");
    } else {
      audio.pause();
      document.getElementById("playPause").setAttribute("data-playing", "false");
    }
  };

  // Next song functionality
  document.getElementById("nextSong").onclick = () => {
    current = (current + 1) % playlist.length;
    audio.src = playlist[current];
    audio.play();
  };

  // Previous song functionality
  document.getElementById("prevSong").onclick = () => {
    current = (current - 1 + playlist.length) % playlist.length;
    audio.src = playlist[current];
    audio.play();
  };

  // Automatically move to the next song when the current one ends
  audio.onended = () => {
    current = (current + 1) % playlist.length;
    audio.src = playlist[current];
    audio.play();
  };





document.getElementById('camera-bt').addEventListener('click', () => {
    // Trigger the hidden camera
    document.getElementById('camera-input').click();
});

document.getElementById('camera-input').addEventListener('change', function(event) {
    const file = event.target.files[0];  
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        document.getElementById('preview').src = imageUrl;
        document.getElementById('preview').style.display = 'block';

        // Add done button
        document.getElementById('done-bt').addEventListener('click', () => {
            sendImageToGoogleLens(file);
        });
    }
});

async function sendImageToGoogleLens(imageFile) {
    const base64Image = await fileToBase64(imageFile);

    try {
        const response = await fetch('http://localhost:5500/api/google-lens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_base64: base64Image }),
        });


        // Log the raw response for debugging
        const textData = await response.text();
        console.log('SerpAPI response:', textData);

        const data = await response.json();
        console.log(data);

        
    } catch (error) {
        console.error('Error:', error);
    }
}


function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);  // Remove 'data:image/...base64,'
        reader.onerror = error => reject(error);
    });
}