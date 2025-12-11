import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServiceCard } from "@/components/service-card"
import { DashboardBackground } from "@/components/dashboard-background"
import { services } from "@/lib/services"
import { 
  Activity, 
  FileText, 
  TrendingUp, 
  Calendar,
  Brain,
  Heart,
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  CheckCircle2,
  ArrowUpRight,
  Flame,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role === "DOCTOR") {
    redirect("/doctor/dashboard")
  }
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  return (
    <>
      <DashboardHeader title="Панель управления" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Welcome + Health Score Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Welcome Card */}
            <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Добро пожаловать</p>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
                    {session.user.name || "Пользователь"}
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Начните с прохождения диагностики для получения персональных рекомендаций от AI
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  <span>7 дней подряд</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button size="sm" className="rounded-full gap-2" asChild>
                  <Link href="/dashboard/questionnaire">
                    <Sparkles className="w-4 h-4" />
                    Пройти опросник
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full gap-2" asChild>
                  <Link href="/dashboard/ct-mri">
                    <Brain className="w-4 h-4" />
                    Загрузить снимок
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full gap-2" asChild>
                  <Link href="/dashboard/iot">
                    <Activity className="w-4 h-4" />
                    IoT мониторинг
                  </Link>
                </Button>
              </div>
            </div>

            {/* Health Score Card */}
            <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Health Score</span>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-semibold tracking-tight text-emerald-500">78</span>
                <span className="text-sm text-muted-foreground mb-2">/ 100</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Хороший результат! Рекомендуем повторить через 2 недели
              </p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-emerald-500 rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <QuickStat
              icon={Activity}
              label="Анализов"
              value="12"
              description="всего проведено"
              trend="up"
            />
            <QuickStat
              icon={FileText}
              label="Опросников"
              value="5"
              description="заполнено"
              trend="up"
            />
            <QuickStat
              icon={TrendingUp}
              label="Уровень стресса"
              value="32%"
              description="низкий"
              trend="down"
            />
            <QuickStat
              icon={Calendar}
              label="Следующий визит"
              value="15"
              description="декабря"
              trend={null}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* AI Services - 2 columns */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-medium">AI сервисы</h3>
                <span className="text-xs text-muted-foreground">{services.length} доступно</span>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    iconName={service.iconName}
                    href={service.href}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar - Recommendations & Tasks */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="border border-border rounded-2xl p-5 bg-background/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-medium text-sm">AI Рекомендации</h3>
                </div>
                <div className="space-y-3">
                  <RecommendationItem
                    icon={Heart}
                    title="Проверьте сердечный ритм"
                    description="Рекомендуем IoT мониторинг"
                    priority="high"
                  />
                  <RecommendationItem
                    icon={Brain}
                    title="Когнитивный тест"
                    description="Пройдите опросник MMSE"
                    priority="medium"
                  />
                  <RecommendationItem
                    icon={Zap}
                    title="Уровень стресса"
                    description="Оценка через PSS-10"
                    priority="low"
                  />
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="border border-border rounded-2xl p-5 bg-background/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <h3 className="font-medium text-sm">Задачи</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">2/3</span>
                </div>
                <div className="space-y-3">
                  <TaskItem title="Заполнить профиль" completed={true} />
                  <TaskItem title="Пройти первый опросник" completed={true} />
                  <TaskItem title="Подключить IoT устройство" completed={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Activity & Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="border border-border rounded-2xl p-5 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <h3 className="font-medium text-sm">Последняя активность</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  Вся история
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                <ActivityItem 
                  title="MRI анализ завершён"
                  description="Патологий не обнаружено"
                  time="2 часа назад"
                  type="success"
                />
                <ActivityItem 
                  title="Опросник PSS-10"
                  description="Уровень стресса: низкий"
                  time="Вчера"
                  type="info"
                />
                <ActivityItem 
                  title="IoT синхронизация"
                  description="Данные за 7 дней загружены"
                  time="2 дня назад"
                  type="default"
                />
              </div>
            </div>

            {/* Health Insights */}
            <div className="border border-border rounded-2xl p-5 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <h3 className="font-medium text-sm">Показатели здоровья</h3>
                </div>
                <span className="text-xs text-muted-foreground">За неделю</span>
              </div>
              
              {/* Mini Charts Placeholder */}
              <div className="grid grid-cols-3 gap-4">
                <MiniMetric label="HRV" value="62" unit="ms" trend="up" />
                <MiniMetric label="SpO2" value="98" unit="%" trend={null} />
                <MiniMetric label="Стресс" value="32" unit="%" trend="down" />
              </div>

              {/* Simple chart visualization */}
              <div className="mt-4 h-24 rounded-xl bg-secondary/30 p-3 flex items-end gap-1">
                {[40, 55, 45, 70, 65, 80, 75, 85, 78, 82, 88, 78].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-foreground/20 rounded-t-sm hover:bg-foreground/40 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
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
  trend,
}: {
  icon: React.ElementType
  label: string
  value: string
  description: string
  trend: "up" | "down" | null
}) {
  return (
    <div className="border border-border rounded-2xl p-4 bg-background/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={`text-xs flex items-center gap-0.5 ${trend === "up" ? "text-green-600" : "text-red-500"}`}>
            <ArrowUpRight className={`w-3 h-3 ${trend === "down" ? "rotate-90" : ""}`} />
            12%
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

function RecommendationItem({
  icon: Icon,
  title,
  description,
  priority,
}: {
  icon: React.ElementType
  title: string
  description: string
  priority: "high" | "medium" | "low"
}) {
  const priorityColors = {
    high: "bg-foreground text-background",
    medium: "bg-secondary",
    low: "bg-secondary/50",
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${priorityColors[priority]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

function TaskItem({ title, completed }: { title: string; completed: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        completed ? "border-foreground bg-foreground" : "border-border"
      }`}>
        {completed && <CheckCircle2 className="w-3 h-3 text-background" />}
      </div>
      <span className={`text-sm ${completed ? "text-muted-foreground line-through" : ""}`}>
        {title}
      </span>
    </div>
  )
}

function MiniMetric({
  label,
  value,
  unit,
  trend,
}: {
  label: string
  value: string
  unit: string
  trend: "up" | "down" | null
}) {
  return (
    <div className="text-center p-3 rounded-xl bg-secondary/30">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold">
        {value}
        <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string
  description: string
  time: string
  type: "success" | "info" | "default"
}) {
  const colors = {
    success: "bg-emerald-500",
    info: "bg-blue-500",
    default: "bg-muted-foreground",
  }

  return (
    <div className="flex items-start gap-3 p-2">
      <div className="relative mt-1">
        <div className={`w-2 h-2 rounded-full ${colors[type]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  )
}
