import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel voice

interface RenderJob {
  id: string;
  type: string;
  status: string;
  payload: any;
  progress?: number;
}

// Fetch next queued job
async function fetchQueuedJob(): Promise<RenderJob | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/render_jobs?status=eq.queued&order=created_at.asc&limit=1`,
      {
        headers: { apikey: SUPABASE_SERVICE_KEY },
      }
    );
    if (!res.ok) {
      console.error("Failed to fetch jobs:", await res.text());
      return null;
    }
    const jobs = await res.json();
    return Array.isArray(jobs) ? jobs[0] || null : null;
  } catch (err) {
    console.error("fetchQueuedJob error:", err);
    return null;
  }
}

// Update job status
async function updateJob(
  id: string,
  updates: { status?: string; progress?: number; output_url?: string; error?: string }
) {
  await fetch(`${SUPABASE_URL}/rest/v1/render_jobs?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
  });
}

// Process VOICE job using ElevenLabs (preferred) or OpenAI TTS
async function processVoiceJob(job: RenderJob): Promise<string> {
  const { text, speaker, voice_id } = job.payload;
  
  await updateJob(job.id, { progress: 20 });

  // Try ElevenLabs first (better voice cloning)
  if (ELEVENLABS_API_KEY) {
    try {
      const voiceId = voice_id || ELEVENLABS_VOICE_ID;
      
      await updateJob(job.id, { progress: 40 });

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.55,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (response.ok) {
        await updateJob(job.id, { progress: 80 });
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");
        await updateJob(job.id, { progress: 100 });
        return `data:audio/mpeg;base64,${base64Audio}`;
      }
      
      console.warn("ElevenLabs failed, falling back to OpenAI");
    } catch (err) {
      console.warn("ElevenLabs error, falling back to OpenAI:", err);
    }
  }

  // Fallback to OpenAI TTS
  if (!OPENAI_API_KEY) {
    throw new Error("No voice API configured (need ELEVENLABS_API_KEY or OPENAI_API_KEY)");
  }

  await updateJob(job.id, { progress: 40 });

  // Map speaker to OpenAI voice
  const voiceMap: Record<string, string> = {
    default: "alloy",
    male_1: "onyx",
    male_2: "echo",
    female_1: "nova",
    female_2: "shimmer",
    custom: "alloy",
  };

  const voice = voiceMap[speaker] || "alloy";

  await updateJob(job.id, { progress: 60 });

  // Call OpenAI TTS API
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: text,
      voice: voice,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS failed: ${error}`);
  }

  await updateJob(job.id, { progress: 80 });

  // Get audio as base64 (in production, upload to storage)
  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");
  const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

  await updateJob(job.id, { progress: 100 });

  return audioUrl;
}

// Process VIDEO job (creates script/storyboard via OpenAI)
async function processVideoJob(job: RenderJob): Promise<string> {
  const { script, template } = job.payload;

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  await updateJob(job.id, { progress: 10 });

  // For now, generate a storyboard/treatment with GPT-4
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a video production assistant. Create a detailed shot-by-shot storyboard for a ${template} video.`,
        },
        {
          role: "user",
          content: `Script: ${script}\n\nCreate a storyboard with scenes, camera angles, and timing.`,
        },
      ],
      max_tokens: 1500,
    }),
  });

  await updateJob(job.id, { progress: 50 });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI failed: ${error}`);
  }

  const data = await response.json();
  const storyboard = data.choices[0]?.message?.content || "Storyboard generation failed";

  await updateJob(job.id, { progress: 100 });

  // Return as a text result (real implementation would render video)
  return `storyboard:${Buffer.from(storyboard).toString("base64")}`;
}

// Process AVATAR job
async function processAvatarJob(job: RenderJob): Promise<string> {
  const { name, style, pixarMode } = job.payload;

  await updateJob(job.id, { progress: 20 });

  // For avatar, we'd use image generation
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = pixarMode
    ? `A Pixar-style 3D animated character portrait of a person named ${name}, high quality, detailed, friendly expression`
    : `A ${style} digital avatar portrait of a person named ${name}, professional, high quality`;

  await updateJob(job.id, { progress: 40 });

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    }),
  });

  await updateJob(job.id, { progress: 80 });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DALL-E failed: ${error}`);
  }

  const data = await response.json();
  const imageUrl = data.data[0]?.url || "";

  await updateJob(job.id, { progress: 100 });

  return imageUrl;
}

// Main processor
async function processJob(job: RenderJob): Promise<string> {
  switch (job.type) {
    case "voice":
      return processVoiceJob(job);
    case "video":
      return processVideoJob(job);
    case "avatar":
      return processAvatarJob(job);
    default:
      throw new Error(`Unknown job type: ${job.type}`);
  }
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE." },
        { status: 500 }
      );
    }

    // Parse body safely
    let body: any = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // Empty body is OK
    }
    
    const jobId = body?.jobId;

    let job: RenderJob | null;

    if (jobId) {
      // Fetch specific job
      const res = await fetch(`${SUPABASE_URL}/rest/v1/render_jobs?id=eq.${jobId}`, {
        headers: { apikey: SUPABASE_SERVICE_KEY },
      });
      const jobs = await res.json();
      job = Array.isArray(jobs) ? jobs[0] || null : null;
    } else {
      // Fetch next queued job
      job = await fetchQueuedJob();
    }

    if (!job) {
      return NextResponse.json({ message: "No jobs in queue", processed: 0 }, { status: 200 });
    }

    // Mark as processing
    await updateJob(job.id, { status: "processing", progress: 0 });

    // Process the job
    const outputUrl = await processJob(job);

    // Mark as completed
    await updateJob(job.id, { status: "completed", progress: 100, output_url: outputUrl });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      type: job.type,
      outputUrl,
    });
  } catch (error: any) {
    console.error("Job processing error:", error);

    return NextResponse.json(
      { error: error?.message || String(error) || "Processing failed" },
      { status: 500 }
    );
  }
}

// GET - Process all queued jobs
export async function GET() {
  const results: any[] = [];
  let processed = 0;
  const maxJobs = 5; // Process up to 5 jobs per request

  while (processed < maxJobs) {
    const job = await fetchQueuedJob();
    if (!job) break;

    try {
      await updateJob(job.id, { status: "processing", progress: 0 });
      const outputUrl = await processJob(job);
      await updateJob(job.id, { status: "completed", progress: 100, output_url: outputUrl });
      results.push({ jobId: job.id, status: "completed", outputUrl });
    } catch (error: any) {
      await updateJob(job.id, { status: "error", error: error.message });
      results.push({ jobId: job.id, status: "error", error: error.message });
    }

    processed++;
  }

  return NextResponse.json({
    processed,
    results,
    message: processed === 0 ? "No jobs in queue" : `Processed ${processed} jobs`,
  });
}
