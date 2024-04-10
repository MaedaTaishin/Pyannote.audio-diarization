document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('audio', document.getElementById('audio-file').files[0]);

    const response = await fetch('/diarization', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    const audioPlayer = document.getElementById('audio');
    audioPlayer.src = URL.createObjectURL(document.getElementById('audio-file').files[0]);

    document.getElementById('audio-container').style.display = 'block';
    document.getElementById('results').innerHTML = '';
    document.getElementById('results').style.display = 'none';

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    for (const speaker of data.speakers) {
        resultsDiv.innerHTML += `<p>Speaker ${speaker.id}: ${speaker.duration.toFixed(2)} seconds</p>`;
    }

    document.getElementById('perform-diarization').style.display = 'block';
});

document.getElementById('perform-diarization').addEventListener('click', async function() {
    const audioFile = document.getElementById('audio-file').files[0];
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch('/diarization', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    for (const speaker of data.speakers) {
        resultsDiv.innerHTML += `<p>Speaker ${speaker.id}: ${speaker.duration.toFixed(2)} seconds</p>`;
    }
});
