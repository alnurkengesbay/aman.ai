"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    email: string
  }
  patient: {
    dateOfBirth: Date | null
    gender: string | null
    phone: string | null
    address: string | null
  } | null
}

export function ProfileForm({ user, patient }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [name, setName] = useState(user.name || "")
  const [phone, setPhone] = useState(patient?.phone || "")
  const [address, setAddress] = useState(patient?.address || "")
  const [dateOfBirth, setDateOfBirth] = useState(
    patient?.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split("T")[0] : ""
  )
  const [gender, setGender] = useState(patient?.gender || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, dateOfBirth, gender }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Имя</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Телефон</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11"
            placeholder="+7 (777) 123-45-67"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Дата рождения</label>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="h-11"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Пол</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Не указан</option>
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Адрес</label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-11"
          placeholder="Город, улица, дом"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Сохранить
        </Button>
        {success && (
          <span className="text-sm text-green-600 animate-fade-up">Сохранено!</span>
        )}
      </div>
    </form>
  )
}


