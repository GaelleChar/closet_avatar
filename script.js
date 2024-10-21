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
        const response = await fetch('http://localhost:3000/api/google-lens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_base64: base64Image }),
        });
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