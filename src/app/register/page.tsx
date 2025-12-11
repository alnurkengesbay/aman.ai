"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { ArrowRight, Check, Loader2, Eye, EyeOff, X } from "lucide-react"

const features = ["Доступ ко всем AI-сервисам", "Анализ медицинских изображений", "История диагностик"]

const passwordRequirements = [
  { id: "length", label: "Минимум 8 символов", test: (p: string) => p.length >= 8 },
  { id: "letter", label: "Одна буква", test: (p: string) => /[a-zA-Zа-яА-Я]/.test(p) },
  { id: "number", label: "Одна цифра", test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [focused, setFocused] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const activityLevel = useMemo(() => {
    return Math.min((name.length + email.length + password.length) / 40, 1)
  }, [name, email, password])

  const activeCells = useMemo(() => {
    const total = name.length + email.length + password.length
    const cellCount = Math.min(Math.floor(total / 2), 36)
    const cells = new Set<number>()

    const centerCells = [14, 15, 20, 21]
    const rings = [
      [8, 9, 10, 13, 16, 19, 22, 25, 26, 27],
      [2, 3, 4, 7, 11, 12, 17, 18, 23, 24, 28, 31, 32, 33],
      [0, 1, 5, 6, 29, 30, 34, 35],
    ]

    let added = 0
    for (const cell of centerCells) {
      if (added >= cellCount) break
      cells.add(cell)
      added++
    }
    for (const ring of rings) {
      for (const cell of ring) {
        if (added >= cellCount) break
        cells.add(cell)
        added++
      }
    }

    return cells
  }, [name, email, password])

  const passwordStrength = useMemo(() => {
    return passwordRequirements.filter((req) => req.test(password)).length
  }, [password])

  const isPasswordValid = passwordStrength === passwordRequirements.length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const canProceedStep1 = name.length >= 2 && email.includes("@") && email.includes(".")
  const canProceedStep2 = isPasswordValid && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (canProceedStep1) {
        setStep(2)
      }
      return
    }

    if (!canProceedStep2) return

    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Ошибка регистрации")
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Произошла ошибка. Попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-12 grid grid-cols-6 grid-rows-6 gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            {[...Array(36)].map((_, i) => {
              const isActive = activeCells.has(i)
              return (
                <div
                  key={i}
                  className="rounded-lg transition-all duration-500 ease-out"
                  style={{
                    borderWidth: "1px",
                    borderColor: isActive
                      ? `rgba(255, 255, 255, ${0.3 + activityLevel * 0.4})`
                      : "rgba(255, 255, 255, 0.05)",
                    backgroundColor: isActive ? `rgba(255, 255, 255, ${0.05 + activityLevel * 0.1})` : "transparent",
                    transform: isActive ? `scale(${1 + activityLevel * 0.05})` : "scale(1)",
                    boxShadow: isActive
                      ? `0 0 ${20 * activityLevel}px rgba(255, 255, 255, ${0.1 * activityLevel})`
                      : "none",
                  }}
                />
              )
            })}
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: activityLevel * 0.5 }}>
          <line x1="20%" y1="30%" x2="40%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-700" style={{ strokeDasharray: "100", strokeDashoffset: 100 - activityLevel * 100 }} />
          <line x1="60%" y1="50%" x2="80%" y2="70%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-700" style={{ strokeDasharray: "100", strokeDashoffset: 100 - activityLevel * 100 }} />
          <line x1="40%" y1="50%" x2="60%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="transition-all duration-700" style={{ strokeDasharray: "100", strokeDashoffset: 100 - activityLevel * 100 }} />
        </svg>

        <div className="absolute bottom-12 left-12 right-12 space-y-6">
          <h3 className="text-background/40 text-xs uppercase tracking-widest">Возможности платформы</h3>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-background/80 text-sm opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="w-5 h-5 rounded-full border border-background/30 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex flex-col">
        <header className="p-8 lg:p-12">
          <Link href="/" className="inline-block">
            <Logo size="default" />
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-8 lg:px-12 pb-24">
          <div className="w-full max-w-sm opacity-0 animate-fade-up">
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= 1 ? "bg-foreground text-background" : "bg-secondary"}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <div className={`h-0.5 w-8 transition-colors ${step > 1 ? "bg-foreground" : "bg-border"}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= 2 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                    2
                  </div>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight mb-3">
                  {step === 1 ? "Регистрация" : "Создание пароля"}
                </h1>
                <p className="text-muted-foreground">
                  {step === 1 ? "Введите ваши данные для создания аккаунта" : "Придумайте надёжный пароль"}
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 ? (
                  <div className="space-y-6">
                    {/* Name field */}
                    <div className="relative">
                      <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "name" || name ? "text-xs -top-6 text-foreground" : "text-sm top-3 text-muted-foreground"}`}>
                        Имя
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 px-0 border-0 border-b-2 border-border rounded-none bg-transparent focus:border-foreground focus-visible:ring-0 transition-colors"
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Email field */}
                    <div className="relative">
                      <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "email" || email ? "text-xs -top-6 text-foreground" : "text-sm top-3 text-muted-foreground"}`}>
                        Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-0 border-b-2 border-border rounded-none bg-transparent focus:border-foreground focus-visible:ring-0 transition-colors border-0"
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Password field */}
                    <div className="relative">
                      <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "password" || password ? "text-xs -top-6 text-foreground" : "text-sm top-3 text-muted-foreground"}`}>
                        Пароль
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 px-0 pr-10 border-0 border-b-2 border-border rounded-none bg-transparent focus:border-foreground focus-visible:ring-0 transition-colors"
                          onFocus={() => setFocused("password")}
                          onBlur={() => setFocused(null)}
                          required
                          disabled={loading}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Password requirements */}
                      <div className="mt-4 space-y-2">
                        {passwordRequirements.map((req) => {
                          const passed = req.test(password)
                          return (
                            <div key={req.id} className={`flex items-center gap-2 text-xs transition-colors ${passed ? "text-green-600" : "text-muted-foreground"}`}>
                              {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {req.label}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="relative">
                      <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "confirmPassword" || confirmPassword ? "text-xs -top-6 text-foreground" : "text-sm top-3 text-muted-foreground"}`}>
                        Подтвердите пароль
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`h-12 px-0 pr-10 border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 transition-colors ${
                            confirmPassword && (passwordsMatch ? "border-green-500" : "border-destructive")
                          } ${!confirmPassword && "border-border focus:border-foreground"}`}
                          onFocus={() => setFocused("confirmPassword")}
                          onBlur={() => setFocused(null)}
                          required
                          disabled={loading}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-destructive mt-2">Пароли не совпадают</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {step === 2 && (
                    <Button type="button" variant="outline" className="h-14 rounded-full px-6" onClick={() => setStep(1)} disabled={loading}>
                      Назад
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="flex-1 h-14 rounded-full text-base group" 
                    disabled={loading || (step === 1 ? !canProceedStep1 : !canProceedStep2)}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>{step === 1 ? "Далее" : "Создать аккаунт"}</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
