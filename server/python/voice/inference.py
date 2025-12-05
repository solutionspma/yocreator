# ======================================
# YOcreator — Voice Inference Engine
# server/python/voice/inference.py
# ======================================

import os
import uuid
from gtts import gTTS  # TEMP STUB: replace with XTTS/OpenVoice
from pathlib import Path

OUTPUT_DIR = "/app/output/voice"
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

def run_voice(payload):
    """
    payload = {
        "text": "hello world",
        "voice_id": "default",
        "speed": 1.0,
        "emotion": "neutral"
    }
    """

    text = payload.get("text", "")
    voice_id = payload.get("voice_id", "default")

    # filename
    file_id = str(uuid.uuid4())
    out_path = f"{OUTPUT_DIR}/{file_id}.wav"

    # =====================================================
    # TEMP: gTTS placeholder so pipeline WORKS immediately
    # =====================================================
    try:
        tts = gTTS(text=text, lang="en")
        tts.save(out_path)
    except Exception as e:
        raise Exception(f"Voice generation failed: {str(e)}")

    # RETURN final path (worker.py will upload it)
    return out_path


# ==========================================================
# READY FOR REAL MODELS
# ----------------------------------------------------------
# Replace the above block with:
#
# from TTS.api import TTS
# model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cuda")
#
# audio = model.tts(text=text, speaker_wav="models/voice/jason.wav")
# audio.save(out_path)
#
# ===========================================================
