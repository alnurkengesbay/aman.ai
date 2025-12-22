"use client"

import { useState, useRef } from "react"
import { Mic, MicOff, Volume2, Loader2, X } from "lucide-react"

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void
  className?: string
}

export function VoiceAssistant({ onTranscript, className }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        stream.getTracks().forEach(track => track.stop())
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Microphone error:", err)
      setError("Микрофонға қол жеткізу мүмкін емес")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setTranscript("")
    setResponse("")

    try {
      // 1. Speech to Text
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const sttResponse = await fetch("/api/speech/stt", {
        method: "POST",
        body: formData,
      })

      if (!sttResponse.ok) {
        throw new Error("Speech recognition failed")
      }

      const sttData = await sttResponse.json()
      const recognizedText = sttData.text

      if (!recognizedText) {
        setError("Сөйлеу танылмады. Қайталап көріңіз.")
        setIsProcessing(false)
        return
      }

      setTranscript(recognizedText)
      onTranscript?.(recognizedText)

      // 2. Get AI response
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: recognizedText }],
        }),
      })

      if (!chatResponse.ok) {
        throw new Error("Chat API failed")
      }

      const chatData = await chatResponse.json()
      const aiResponse = chatData.message

      setResponse(aiResponse)

      // 3. Text to Speech
      await speakResponse(aiResponse)
    } catch (err) {
      console.error("Processing error:", err)
      setError("Өңдеу қатесі. Қайталап көріңіз.")
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true)

      // Определяем язык по тексту (простая эвристика)
      const isRussian = /[а-яё]/i.test(text) && !/[әғқңөұүһі]/i.test(text)
      const lang = isRussian ? "ru-RU" : "kk-KZ"

      const ttsResponse = await fetch("/api/speech/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      })

      if (!ttsResponse.ok) {
        throw new Error("TTS failed")
      }

      const audioBlob = await ttsResponse.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
      }
    } catch (err) {
      console.error("TTS error:", err)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSpeaking(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${className}`}
      >
        <Mic className="w-6 h-6" />
      </button>
    )
  }

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      
      <div className={`fixed bottom-24 right-6 z-50 w-80 bg-background/95 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Дауыстық көмекші</h3>
              <p className="text-xs text-muted-foreground">Қазақша сөйлеңіз</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          {transcript && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Сіз:</p>
              <p className="text-sm bg-muted/50 p-2 rounded-lg">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">AI:</p>
              <p className="text-sm bg-emerald-500/10 p-2 rounded-lg">{response}</p>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Өңделуде...
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t flex items-center justify-center gap-4">
          {isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
            </button>
          ) : isRecording ? (
            <button
              onClick={stopRecording}
              className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse hover:bg-red-600 transition-colors"
            >
              <MicOff className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground pb-3">
          {isRecording ? "Сөйлеңіз... Аяқтау үшін басыңыз" : "Микрофонды басыңыз"}
        </p>
      </div>
    </>
  )
}

