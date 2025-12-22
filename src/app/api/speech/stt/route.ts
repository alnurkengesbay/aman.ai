import { NextRequest, NextResponse } from "next/server"
import { getIAMToken } from "@/lib/yandex-iam"

const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID || ""

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 })
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

    const audioBuffer = await audioFile.arrayBuffer()

    // Yandex SpeechKit STT API with IAM token
    const response = await fetch(
      `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${YANDEX_FOLDER_ID}&lang=kk-KZ&format=oggopus`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${iamToken}`,
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
