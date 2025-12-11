import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react"

// Mock patients
const patients = [
  { 
    id: "1", 
    name: "Алексей Ким", 
    email: "alexey@example.com",
    phone: "+7 777 123 4567",
    age: 45,
    lastVisit: "Сегодня",
    totalAnalyses: 12,
    status: "active",
    riskLevel: "low",
  },
  { 
    id: "2", 
    name: "Мария Сергеева", 
    email: "maria@example.com",
    phone: "+7 777 234 5678",
    age: 38,
    lastVisit: "Вчера",
    totalAnalyses: 8,
    status: "active",
    riskLevel: "moderate",
  },
  { 
    id: "3", 
    name: "Дмитрий Павлов", 
    email: "dmitry@example.com",
    phone: "+7 777 345 6789",
    age: 52,
    lastVisit: "3 дня назад",
    totalAnalyses: 5,
    status: "pending",
    riskLevel: "high",
  },
  { 
    id: "4", 
    name: "Анна Иванова", 
    email: "anna@example.com",
    phone: "+7 777 456 7890",
    age: 29,
    lastVisit: "Неделю назад",
    totalAnalyses: 3,
    status: "active",
    riskLevel: "low",
  },
]

export default async function DoctorPatientsPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "DOCTOR") redirect("/dashboard")

  return (
    <>
      <DashboardHeader title="Пациенты" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-1">Мои пациенты</h2>
              <p className="text-muted-foreground text-sm">{patients.length} пациентов под наблюдением</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Поиск пациента..." className="pl-10 w-[200px]" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Фильтр
              </Button>
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Добавить
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-border rounded-xl p-4 bg-background/60 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Всего пациентов</p>
              <p className="text-2xl font-semibold">{patients.length}</p>
            </div>
            <div className="border border-border rounded-xl p-4 bg-background/60 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Активных</p>
              <p className="text-2xl font-semibold">{patients.filter(p => p.status === "active").length}</p>
            </div>
            <div className="border border-border rounded-xl p-4 bg-background/60 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Высокий риск</p>
              <p className="text-2xl font-semibold text-red-500">{patients.filter(p => p.riskLevel === "high").length}</p>
            </div>
            <div className="border border-border rounded-xl p-4 bg-background/60 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Новых за месяц</p>
              <p className="text-2xl font-semibold">2</p>
            </div>
          </div>

          {/* Patients Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {patients.map((patient, index) => (
              <Link
                key={patient.id}
                href={`/doctor/patients/${patient.id}`}
                className="border border-border rounded-2xl p-5 bg-background/60 backdrop-blur-sm hover:border-foreground/20 hover:shadow-lg transition-all cursor-pointer group opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center text-lg font-medium">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-xs text-muted-foreground">{patient.age} лет</p>
                    </div>
                  </div>
                  <RiskBadge level={patient.riskLevel} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {patient.lastVisit}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      {patient.totalAnalyses} анализов
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function RiskBadge({ level }: { level: string }) {
  const styles = {
    low: "bg-green-500/10 text-green-600",
    moderate: "bg-yellow-500/10 text-yellow-600",
    high: "bg-red-500/10 text-red-600",
  }

  const labels = {
    low: "Низкий",
    moderate: "Средний",
    high: "Высокий",
  }

  return (
    <span className={`px-2 py-1 text-[10px] rounded-full ${styles[level as keyof typeof styles]}`}>
      {labels[level as keyof typeof labels]} риск
    </span>
  )
}


