import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { ProfileForm } from "@/components/profile-form"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Droplets,
  AlertCircle,
  Pill,
  Shield,
} from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { patient: true },
  })

  if (!user) redirect("/login")

  return (
    <>
      <DashboardHeader title="Профиль" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-foreground text-background flex items-center justify-center text-3xl font-semibold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-secondary">
                  {user.role === "PATIENT" ? "Пациент" : user.role === "DOCTOR" ? "Врач" : "Админ"}
                </span>
                <span className="text-xs text-muted-foreground">
                  С нами с {new Date(user.createdAt).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info Card */}
              <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
                <h3 className="font-medium mb-6 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Личные данные
                </h3>
                <ProfileForm user={user} patient={user.patient} />
              </div>

              {/* Medical Info Card */}
              <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
                <h3 className="font-medium mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Медицинская информация
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <InfoItem
                    icon={Droplets}
                    label="Группа крови"
                    value={user.patient?.bloodType || "Не указано"}
                  />
                  <InfoItem
                    icon={AlertCircle}
                    label="Аллергии"
                    value={user.patient?.allergies?.join(", ") || "Не указано"}
                  />
                  <InfoItem
                    icon={Pill}
                    label="Текущие препараты"
                    value={user.patient?.medications?.join(", ") || "Не указано"}
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Хронические заболевания"
                    value={user.patient?.conditions?.join(", ") || "Не указано"}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
                <h3 className="font-medium mb-4 text-sm">Контактная информация</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Телефон</p>
                      <p className="text-sm">{user.patient?.phone || "Не указан"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Адрес</p>
                      <p className="text-sm">{user.patient?.address || "Не указан"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
                <h3 className="font-medium mb-4 text-sm">Статистика</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Анализов</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Опросников</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">IoT сессий</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}


