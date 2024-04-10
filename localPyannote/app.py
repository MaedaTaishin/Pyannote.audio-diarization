from fastapi import FastAPI, File, UploadFile
from tempfile import NamedTemporaryFile
from pydub import AudioSegment
from pyannote.audio import Pipeline
import torch

app = FastAPI()

# Load the pretrained diarization pipeline and send it to GPU if available
pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="HUGGINGFACE_ACCESS_TOKEN_GOES_HERE"
)
#pipeline.to(torch.device("cuda")) for GPU

@app.get('/')
async def index():
    return open('index.html').read()

@app.post('/diarization')
async def diarization(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()
    audio_tmp = NamedTemporaryFile(suffix='.wav', delete=False)
    audio_tmp.write(audio_bytes)

    audio = AudioSegment.from_file(audio_tmp.name)

    # Perform speaker diarization using the pretrained pipeline
    diarization = pipeline(audio_tmp.name)

    # Get the diarization result and format it
    diarization_result = [
        {'start': turn.start, 'stop': turn.end, 'speaker': speaker}
        for turn, _, speaker in diarization.itertracks(yield_label=True)
    ]

    return {'diarization': diarization_result}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
