import os, time, requests, json
from pipeline.forge_voice import forge_voice
from pipeline.forge_avatar import forge_avatar
from pipeline.forge_video import forge_video
from pipeline.render_final import render_final

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE")

def fetch_job():
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/render_jobs?status=eq.queued&select=*",
        headers={"apikey": SERVICE_KEY}
    )
    jobs = r.json()
    return jobs[0] if jobs else None

def update_job(id, status, result=None, error=None):
    payload = {"status": status}
    if result: payload["result_url"] = result
    if error: payload["error"] = error

    requests.patch(
        f"{SUPABASE_URL}/rest/v1/render_jobs?id=eq.{id}",
        headers={"apikey": SERVICE_KEY, "Content-Type":"application/json"},
        data=json.dumps(payload)
    )

while True:
    job = fetch_job()
    if not job:
        time.sleep(3)
        continue

    update_job(job["id"], "processing")
    p = job["payload"]

    try:
        if job["type"] == "voice":
            out = forge_voice(p)

        elif job["type"] == "avatar":
            out = forge_avatar(p)

        elif job["type"] == "video":
            out = forge_video(p)

        elif job["type"] == "final":
            out = render_final(p)

        else:
            raise Exception("Unknown job type")

        update_job(job["id"], "completed", out)

    except Exception as e:
        update_job(job["id"], "error", error=str(e))
