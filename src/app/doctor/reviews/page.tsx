import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Activity, 
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react"

// Mock reviews
const pendingReviews = [
  { 
    id: "1", 
    patient: { name: "Алексей Ким", age: 45 },
    type: "CT_MRI",
    title: "МРТ головного мозга",
    date: "2 часа назад",
    priority: "high",
    aiConfidence: 0.92,
    aiResult: "Выявлены признаки начальной стадии атрофии",
    findings: ["Лёгкая атрофия коры", "Расширение желудочков"],
  },
  { 
    id: "2", 
    patient: { name: "Мария Сергеева", age: 38 },
    type: "IOT",
    title: "IoT мониторинг (30 мин)",
    date: "5 часов назад",
    priority: "medium",
    aiConfidence: 0.87,
    aiResult: "Повышенный уровень стресса",
    findings: ["HRV: 35ms (низкий)", "Стресс: 68%"],
  },
  { 
    id: "3", 
    patient: { name: "Дмитрий Павлов", age: 52 },
    type: "QUESTIONNAIRE",
    title: "Опросник PSS-10",
    date: "Вчера",
    priority: "low",
    aiConfidence: 0.95,
    aiResult: "Умеренный уровень стресса",
    findings: ["Балл: 21/40", "Категория: средний"],
  },
]

const typeIcons: Record<string, React.ElementType> = {
  CT_MRI: Brain,
  IOT: Activity,
  QUESTIONNAIRE: ClipboardList,
}

export default async function DoctorReviewsPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "DOCTOR") redirect("/dashboard")

  return (
    <>
      <DashboardHeader title="Проверка анализов" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-1">Ожидают проверки</h2>
              <p className="text-muted-foreground text-sm">{pendingReviews.length} анализов требуют вашего внимания</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Высокий
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Средний
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Низкий
              </span>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {pendingReviews.map((review, index) => {
              const Icon = typeIcons[review.type] || Activity
              return (
                <div
                  key={review.id}
                  className="border border-border rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          review.priority === "high" ? "bg-red-500" :
                          review.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{review.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {review.patient.name}, {review.patient.age} лет
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {review.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Result */}
                  <div className="p-5 bg-secondary/30">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">AI Заключение</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">
                            {Math.round(review.aiConfidence * 100)}% уверенность
                          </span>
                        </div>
                        <p className="font-medium mb-3">{review.aiResult}</p>
                        <div className="flex flex-wrap gap-2">
                          {review.findings.map((finding, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-lg bg-background border border-border">
                              {finding}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Подробнее
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Комментарий
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:border-red-200">
                        <ThumbsDown className="w-4 h-4" />
                        Отклонить
                      </Button>
                      <Button size="sm" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Подтвердить
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {pendingReviews.length === 0 && (
            <div className="border border-border rounded-2xl p-12 bg-background/60 backdrop-blur-sm text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Все анализы проверены</h3>
              <p className="text-sm text-muted-foreground">Новые анализы появятся здесь автоматически</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


