import { NextRequest, NextResponse } from "next/server"
import { getIAMToken } from "@/lib/yandex-iam"

const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID || ""

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "kk-KZ" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    if (!YANDEX_FOLDER_ID) {
      return NextResponse.json({ error: "Yandex folder ID not configured" }, { status: 500 })
    }

    let iamToken: string
    try {
      iamToken = await getIAMToken()
    } catch (error) {
      console.error("Failed to get IAM token:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }

    // Выбор голоса в зависимости от языка
    let voice = "amira" // казахский женский голос
    if (lang === "ru-RU") {
      voice = "alena" // русский женский голос
    }

    // Yandex SpeechKit TTS API with IAM token
    const response = await fetch(
      "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${iamToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text,
          lang,
          voice,
          folderId: YANDEX_FOLDER_ID,
          format: "mp3",
          sampleRateHertz: "48000",
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Yandex TTS error:", error)
      return NextResponse.json({ error: "Speech synthesis failed" }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("TTS error:", error)
    return NextResponse.json({ error: "Speech synthesis failed" }, { status: 500 })
  }
}
