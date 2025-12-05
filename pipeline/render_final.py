# ======================================
# YOcreator — Final Render Pipeline
# pipeline/render_final.py
# ======================================

import os
import subprocess
import uuid
from pathlib import Path

FINAL_DIR = "/app/output/final"
Path(FINAL_DIR).mkdir(parents=True, exist_ok=True)

def render_final(inputs):
    """
    inputs = {
        "voice_path": "/app/output/voice/xxx.wav",
        "avatar_path": "/app/output/avatar/xxx.mp4",
        "background_path": "/app/assets/bg/default.mp4",  # optional
        "music_path": "/app/assets/music/theme1.mp3",     # optional
        "volume": 1.0,
        "music_volume": 0.4
    }
    """

    voice = inputs.get("voice_path")
    avatar = inputs.get("avatar_path")
    bg = inputs.get("background_path", None)
    music = inputs.get("music_path", None)

    out_id = str(uuid.uuid4())
    out_path = f"{FINAL_DIR}/{out_id}.mp4"

    # ======================================================
    # 1. BASE VIDEO (avatar only)
    # ======================================================
    base_video = avatar

    # ======================================================
    # 2. Optional background composite
    # ======================================================
    if bg:
        composite_video = f"{FINAL_DIR}/{out_id}_composite.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-i", bg,
            "-i", base_video,
            "-filter_complex", "[1:v]scale=1280:720[scaled];[0:v][scaled]overlay=0:0",
            composite_video
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        base_video = composite_video

    # ======================================================
    # 3. Add VOICE + optional MUSIC
    # ======================================================
    audio_inputs = []
    filter_complex = []
    map_flags = []

    idx = 0

    # voice
    if voice:
        audio_inputs.extend(["-i", voice])
        filter_complex.append(f"[{idx}:a]volume=1.0[aud1]")
        idx += 1

    # music
    if music:
        audio_inputs.extend(["-i", music])
        filter_complex.append(f"[{idx}:a]volume=0.4[aud2]")
        idx += 1

    # audio combining logic
    if music:
        filter_complex.append("[aud1][aud2]amix=inputs=2:dropout_transition=3[aout]")
        audio_map = "[aout]"
    else:
        audio_map = "[aud1]"

    cmd = [
        "ffmpeg", "-y",
        "-i", base_video,
        *audio_inputs,
        "-filter_complex", ";".join(filter_complex),
        "-map", "0:v",
        "-map", audio_map,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        out_path
    ]

    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return out_path
