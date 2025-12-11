import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Users, Activity, Server, Shield } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <>
      <DashboardHeader title="Панель администратора" />
      <div className="flex-1 p-8 md:p-12 overflow-auto">
        <div className="max-w-6xl">
          {/* Welcome section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">
              Администрирование платформы
            </h2>
            <p className="text-muted-foreground">
              Управление пользователями, сервисами и мониторинг системы
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <QuickStat
              icon={Users}
              label="Пользователей"
              value="0"
              description="всего"
            />
            <QuickStat
              icon={Activity}
              label="Анализов"
              value="0"
              description="за сегодня"
            />
            <QuickStat
              icon={Server}
              label="Сервисы"
              value="6"
              description="активных"
            />
            <QuickStat
              icon={Shield}
              label="Статус"
              value="OK"
              description="системы"
            />
          </div>

          {/* Users overview */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-6">Пользователи по ролям</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-semibold mb-2">0</p>
                <p className="text-sm text-muted-foreground">Пациентов</p>
              </div>
              <div className="border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-semibold mb-2">0</p>
                <p className="text-sm text-muted-foreground">Врачей</p>
              </div>
              <div className="border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-semibold mb-2">1</p>
                <p className="text-sm text-muted-foreground">Админов</p>
              </div>
            </div>
          </div>

          {/* Services status */}
          <div>
            <h3 className="text-lg font-medium mb-6">Статус сервисов</h3>
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-3 text-left text-sm font-medium">Сервис</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Статус</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "S1 - CT/MRI", status: "active", url: "—" },
                    { name: "S2 - IoT", status: "active", url: "—" },
                    { name: "S3 - Опросники", status: "active", url: "—" },
                    { name: "S4 - Генетика", status: "coming", url: "—" },
                    { name: "S5 - Кровь", status: "coming", url: "—" },
                    { name: "S6 - Реабилитация", status: "active", url: "—" },
                  ].map((service) => (
                    <tr key={service.name}>
                      <td className="px-6 py-4 text-sm">{service.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                            service.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {service.status === "active" ? "Активен" : "Скоро"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{service.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function QuickStat({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType
  label: string
  value: string
  description: string
}) {
  return (
    <div className="border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}


