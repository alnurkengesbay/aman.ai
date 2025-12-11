import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, 
  ClipboardCheck, 
  FileText, 
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Brain,
  Activity,
  Calendar,
  ArrowUpRight,
  Sparkles,
  UserPlus,
} from "lucide-react"

// Mock data
const pendingReviews = [
  { id: "1", patient: "Алексей К.", type: "CT_MRI", date: "2 часа назад", priority: "high" },
  { id: "2", patient: "Мария С.", type: "IOT", date: "5 часов назад", priority: "medium" },
  { id: "3", patient: "Дмитрий П.", type: "QUESTIONNAIRE", date: "Вчера", priority: "low" },
]

const recentPatients = [
  { id: "1", name: "Алексей Ким", lastVisit: "Сегодня", status: "active", analyses: 5 },
  { id: "2", name: "Мария Сергеева", lastVisit: "Вчера", status: "active", analyses: 3 },
  { id: "3", name: "Дмитрий Павлов", lastVisit: "3 дня назад", status: "pending", analyses: 2 },
]

export default async function DoctorDashboardPage() {
  const session = await auth()

  if (!session) redirect("/login")
  if (session.user.role !== "DOCTOR") redirect("/dashboard")

  return (
    <>
      <DashboardHeader title="Панель врача" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Welcome Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Добрый день</p>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
                    {session.user.name || "Доктор"}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    У вас {pendingReviews.length} анализ(а) на проверку
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="text-right">
                    <p className="text-3xl font-semibold">{new Date().getDate()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("ru-RU", { weekday: "long", month: "long" })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="rounded-full gap-2" asChild>
                  <Link href="/doctor/reviews">
                    <ClipboardCheck className="w-4 h-4" />
                    Проверить анализы
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full gap-2" asChild>
                  <Link href="/doctor/patients">
                    <Users className="w-4 h-4" />
                    Мои пациенты
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full gap-2" asChild>
                  <Link href="/doctor/reports">
                    <FileText className="w-4 h-4" />
                    Создать отчёт
                  </Link>
                </Button>
              </div>
            </div>

            {/* AI Accuracy Card */}
            <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Точность AI</span>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-semibold tracking-tight">94</span>
                <span className="text-2xl text-muted-foreground mb-1">%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Подтверждённых диагнозов
              </p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-foreground rounded-full" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Пациентов"
              value="0"
              description="под наблюдением"
              trend={12}
            />
            <StatCard
              icon={ClipboardCheck}
              label="На проверку"
              value={pendingReviews.length.toString()}
              description="анализов AI"
              trend={null}
              highlight
            />
            <StatCard
              icon={FileText}
              label="Отчётов"
              value="0"
              description="создано"
              trend={5}
            />
            <StatCard
              icon={Calendar}
              label="Приёмов"
              value="0"
              description="на этой неделе"
              trend={null}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Reviews */}
            <div className="lg:col-span-2 border border-border rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h3 className="font-medium text-sm">Ожидают проверки</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                  <Link href="/doctor/reviews">
                    Все
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
              
              {pendingReviews.length > 0 ? (
                <div className="divide-y divide-border">
                  {pendingReviews.map((review, index) => (
                    <div
                      key={review.id}
                      className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer group opacity-0 animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            review.priority === "high" ? "bg-red-500" :
                            review.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                          }`} />
                          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                            {review.type === "CT_MRI" ? <Brain className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.patient}</p>
                            <p className="text-xs text-muted-foreground">
                              {review.type === "CT_MRI" ? "МРТ снимок" : review.type === "IOT" ? "IoT сессия" : "Опросник"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Все анализы проверены</p>
                </div>
              )}
            </div>

            {/* Recent Patients */}
            <div className="border border-border rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <h3 className="font-medium text-sm">Недавние пациенты</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                  <Link href="/doctor/patients">
                    Все
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="divide-y divide-border">
                {recentPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer group opacity-0 animate-fade-up"
                    style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{patient.analyses} анализов</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <UserPlus className="w-4 h-4" />
                  Добавить пациента
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  highlight,
}: {
  icon: React.ElementType
  label: string
  value: string
  description: string
  trend: number | null
  highlight?: boolean
}) {
  return (
    <div className={`border rounded-2xl p-4 backdrop-blur-sm ${
      highlight ? "border-orange-500/30 bg-orange-500/5" : "border-border bg-background/60"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          highlight ? "bg-orange-500/20" : "bg-secondary"
        }`}>
          <Icon className={`w-4 h-4 ${highlight ? "text-orange-500" : ""}`} />
        </div>
        {trend !== null && (
          <span className="text-xs flex items-center gap-0.5 text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            {trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">{description}</p>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
