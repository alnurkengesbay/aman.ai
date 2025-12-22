import { NextRequest, NextResponse } from "next/server"

const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID || ""
const YANDEX_API_KEY = process.env.YANDEX_API_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 })
    }

    if (!YANDEX_FOLDER_ID || !YANDEX_API_KEY) {
      console.error("Missing Yandex config:", { hasFolderId: !!YANDEX_FOLDER_ID, hasApiKey: !!YANDEX_API_KEY })
      return NextResponse.json({ error: "Yandex not configured" }, { status: 500 })
    }

    const audioBuffer = await audioFile.arrayBuffer()

    // Yandex SpeechKit STT API with Api-Key
    const response = await fetch(
      `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${YANDEX_FOLDER_ID}&lang=kk-KZ&format=oggopus`,
      {
        method: "POST",
        headers: {
          "Authorization": `Api-Key ${YANDEX_API_KEY}`,
          "Content-Type": "audio/ogg",
        },
        body: audioBuffer,
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Yandex STT error:", error)
      return NextResponse.json({ error: "Speech recognition failed" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ text: data.result || "" })
  } catch (error) {
    console.error("STT error:", error)
    return NextResponse.json({ error: "Speech recognition failed" }, { status: 500 })
  }
}
