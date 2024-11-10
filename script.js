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

// Camera Lens

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

async function sendImageToGoogleLens(imageBase64) {
  try {
      const response = await fetch('http://localhost:5500/api/google-lens', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_base64: imageBase64 }), // Send in the body
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers.get('content-type'));

      if (!response.ok) {
          const errorData = await response.json(); // Handle non-200 responses
          console.error('Response Data:', errorData);
          throw new Error(`Server error: ${errorData.error}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      console.log('Response Data:', data);
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

// Repeat sections
const titles = ["Tops", "Bottoms", "Shoes"]; // Array of section titles
let pageStates = {}; // Store the current page for each title
const itemsPerPage = 3; // Number of items per page

let items = [];

for (let i = 1; i <= 9; i++) {
  items.push({
      name: `Item ${i}`,
      img: '', 
      price: 'undetermined',
      type: (i % 3 === 1) ? 'ad' : '', 
      button: '+'
  });
}

// Initialize sections by looping through titles and calling createSection
titles.forEach(title => {
    createSection(title);
});

// Function to handle button click
function toggleButton(index, title) {
  const item = items[index];
  if (item.button === '+') {
      item.button = '-'; // Change to '-' if currently '+'
  } else {
      item.button = '+'; // Change back to '+' if currently '-'
  }
  renderItems(title); // Re-render items to show updated button states
}

function createSection(title) {
    // Initialize page state for this title
    pageStates[title] = 0;

    // Create section structure with pagination buttons
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'each-section';
    sectionDiv.innerHTML = `
        <h1 class="section-title">${title}</h1>
        <div id="cont">
            <button onclick="prevPage('${title}')">Previous</button>       
            <div class="item-add"></div>
            <div class="item-add"></div>
            <div class="item-add"></div>
            <button onclick="nextPage('${title}')">Next</button>
        </div>
    `;

    // Append the section to the shopping div
    document.getElementById('shopping').appendChild(sectionDiv);

    // Render initial items for this section
    renderItems(title);
}

function renderItems(title) {
  const currentPage = pageStates[title]; // Get the current page for this title

  // Find the section that matches the title
  const section = Array.from(document.querySelectorAll('.each-section')).find(
      sec => sec.querySelector('.section-title').innerText === title
  );

  // Get the item-add containers from the found section
  const containers = section.querySelectorAll('.item-add');

  if (!containers.length) {
      console.log("No containers found for title:", title);
      return;
  }

  // Clear contents of each item-add container
  containers.forEach(container => {
      container.innerHTML = '';
  });

  // Calculate start and end indices for pagination
  const start = currentPage * itemsPerPage;
  const end = Math.min(start + itemsPerPage, items.length);

  // Loop through items for the current page and assign each to a container
  let containerIndex = 0; // Start from the first container
  for (let i = start; i < end && containerIndex < containers.length; i++, containerIndex++) {
      const item = items[i];
      const container = containers[containerIndex];

      const itemDiv = document.createElement('div');
      itemDiv.className = 'outer';
      itemDiv.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <p>${item.type}</p>
          <button onclick="toggleButton(${i}, '${title}')">${item.button}</button>
          <p>${item.name}</p>
          <p>${item.price}</p>
      `;
      container.appendChild(itemDiv);
  }
}



// Pagination functions for navigating pages within a section
function nextPage(title) {
    const currentPage = pageStates[title];
    if ((currentPage + 1) * itemsPerPage < items.length) {
        pageStates[title]++; // Increment page for the specific section
        renderItems(title);
    }
}

function prevPage(title) {
    const currentPage = pageStates[title];
    if (currentPage > 0) {
        pageStates[title]--; // Decrement page for the specific section
        renderItems(title);
    }
}
