"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOff, Volume2, Loader2, MessageSquare } from "lucide-react"
import { DashboardBackground } from "@/components/dashboard-background"
import Vapi from "@vapi-ai/web"

const VAPI_PUBLIC_KEY = "77dcbf9a-c62f-4d95-966e-e943c5785890"
const VAPI_ASSISTANT_ID = "e4be2d3f-64c4-4d4c-b368-aab247474824"

export default function VoiceAssistantPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const [error, setError] = useState("")
  const [volumeLevel, setVolumeLevel] = useState(0)

  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    // Initialize Vapi
    const vapi = new Vapi(VAPI_PUBLIC_KEY)
    vapiRef.current = vapi

    // Event listeners
    vapi.on("call-start", () => {
      console.log("Call started")
      setIsConnected(true)
      setIsConnecting(false)
    })

    vapi.on("call-end", () => {
      console.log("Call ended")
      setIsConnected(false)
      setIsSpeaking(false)
    })

    vapi.on("speech-start", () => {
      console.log("AI speaking")
      setIsSpeaking(true)
    })

    vapi.on("speech-end", () => {
      console.log("AI stopped speaking")
      setIsSpeaking(false)
    })

    vapi.on("message", (message) => {
      console.log("Message:", message)
      
      if (message.type === "transcript" && message.transcriptType === "final") {
        if (message.role === "user") {
          setMessages(prev => [...prev, { role: "user", text: message.transcript }])
        } else if (message.role === "assistant") {
          setMessages(prev => [...prev, { role: "ai", text: message.transcript }])
        }
      }
    })

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level)
    })

    vapi.on("error", (error) => {
      console.error("Vapi error:", error)
      setError("Қате орын алды / Произошла ошибка")
      setIsConnecting(false)
    })

    return () => {
      vapi.stop()
    }
  }, [])

  const startCall = async () => {
    if (!vapiRef.current) return
    
    setError("")
    setIsConnecting(true)
    setMessages([])
    
    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID)
    } catch (err) {
      console.error("Failed to start call:", err)
      setError("Қоңырауды бастау мүмкін болмады / Не удалось начать звонок")
      setIsConnecting(false)
    }
  }

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop()
    }
    setIsConnected(false)
    setIsSpeaking(false)
  }

  return (
    <div className="min-h-screen relative">
      <DashboardBackground />
      
      <div className="relative z-10 p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🎤 Дауыстық көмекші / Голосовой ассистент</h1>
          <p className="text-muted-foreground">
            AI-мен қазақша немесе орысша сөйлесіңіз — VAPI технологиясы
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Voice Control */}
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border p-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-center mb-8">
                {isConnecting && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-lg font-medium">Қосылуда... / Подключение...</span>
                  </div>
                )}
                {isConnected && !isSpeaking && (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-lg font-medium">Тыңдаймын... / Слушаю...</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center gap-2 text-amber-500">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                    <span className="text-lg font-medium">AI сөйлеуде... / AI говорит...</span>
                  </div>
                )}
                {!isConnected && !isConnecting && (
                  <span className="text-lg text-muted-foreground">
                    Қоңырау бастау үшін басыңыз / Нажмите для начала
                  </span>
                )}
              </div>

              {/* Volume indicator */}
              {isConnected && (
                <div className="w-32 h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-100"
                    style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
                  />
                </div>
              )}

              {/* Main Button */}
              {isConnected ? (
                <button
                  onClick={endCall}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center shadow-2xl hover:shadow-red-500/50 transition-all duration-300 relative z-50 cursor-pointer"
                >
                  <PhoneOff className="w-12 h-12" />
                </button>
              ) : (
                <button
                  onClick={startCall}
                  disabled={isConnecting}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 relative z-50 cursor-pointer"
                >
                  {isConnecting ? (
                    <Loader2 className="w-12 h-12 animate-spin" />
                  ) : (
                    <Phone className="w-12 h-12" />
                  )}
                </button>
              )}

              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 text-red-500 text-center max-w-sm">
                  {error}
                </div>
              )}

              <p className="mt-8 text-sm text-muted-foreground text-center max-w-sm">
                💡 Нажмите для начала разговора. AI будет слушать и отвечать голосом.
              </p>
            </div>
          </div>

          {/* Chat History */}
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h2 className="font-semibold">Сөйлесу тарихы / История разговора</h2>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Phone className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Әзірше хабарлама жоқ / Пока нет сообщений</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl ${
                      msg.role === "user"
                        ? "bg-muted/50 ml-8"
                        : "bg-emerald-500/10 mr-8 border border-emerald-500/20"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {msg.role === "user" ? "Сіз / Вы" : "AI"}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="bg-background/60 backdrop-blur-sm rounded-xl border p-4 text-center">
            <div className="text-2xl mb-2">🇰🇿</div>
            <h3 className="font-medium">Қазақ тілі</h3>
            <p className="text-sm text-muted-foreground">VAPI + Azure</p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm rounded-xl border p-4 text-center">
            <div className="text-2xl mb-2">🇷🇺</div>
            <h3 className="font-medium">Русский язык</h3>
            <p className="text-sm text-muted-foreground">Полная поддержка</p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm rounded-xl border p-4 text-center">
            <div className="text-2xl mb-2">🎙️</div>
            <h3 className="font-medium">Real-time</h3>
            <p className="text-sm text-muted-foreground">Живой разговор</p>
          </div>
        </div>
      </div>
    </div>
  )
}
