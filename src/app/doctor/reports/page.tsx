"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBackground } from "@/components/dashboard-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Plus,
  Search,
  Calendar,
  User,
  ChevronRight,
  Download,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"

// Mock reports
const reports = [
  {
    id: "1",
    title: "Заключение по МРТ",
    patient: "Алексей Ким",
    date: "Сегодня",
    status: "draft",
  },
  {
    id: "2",
    title: "Итоговый отчёт за квартал",
    patient: "Мария Сергеева",
    date: "Вчера",
    status: "sent",
  },
  {
    id: "3",
    title: "Рекомендации по лечению",
    patient: "Дмитрий Павлов",
    date: "3 дня назад",
    status: "sent",
  },
]

export default function DoctorReportsPage() {
  const [showNewReport, setShowNewReport] = useState(false)

  return (
    <>
      <DashboardHeader title="Отчёты" />
      <div className="flex-1 overflow-auto relative pb-20 lg:pb-0">
        <DashboardBackground />
        
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-1">Мои отчёты</h2>
              <p className="text-muted-foreground text-sm">{reports.length} отчётов создано</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-10 w-[200px]" />
              </div>
              <Button size="sm" className="gap-2" onClick={() => setShowNewReport(true)}>
                <Plus className="w-4 h-4" />
                Новый отчёт
              </Button>
            </div>
          </div>

          {/* New Report Form */}
          {showNewReport && (
            <div className="border border-border rounded-2xl p-6 bg-background/60 backdrop-blur-sm mb-8 animate-fade-up">
              <h3 className="font-medium mb-6">Создание нового отчёта</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Название отчёта</label>
                  <Input placeholder="Например: Заключение по МРТ" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Пациент</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option>Выберите пациента</option>
                    <option>Алексей Ким</option>
                    <option>Мария Сергеева</option>
                    <option>Дмитрий Павлов</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Содержание</label>
                <textarea 
                  className="w-full min-h-[200px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  placeholder="Введите текст отчёта..."
                />
              </div>
              <div className="flex items-center gap-3">
                <Button>Сохранить черновик</Button>
                <Button variant="outline">Отправить пациенту</Button>
                <Button variant="ghost" onClick={() => setShowNewReport(false)}>Отмена</Button>
              </div>
            </div>
          )}

          {/* Reports List */}
          <div className="border border-border rounded-2xl bg-background/60 backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-border text-xs text-muted-foreground font-medium">
              <span>Отчёт</span>
              <span>Дата</span>
              <span>Статус</span>
              <span></span>
            </div>

            {reports.map((report, index) => (
              <div
                key={report.id}
                className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors items-center opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.patient}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{report.date}</span>
                <StatusBadge status={report.status} />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    draft: "bg-yellow-500/10 text-yellow-600",
    sent: "bg-green-500/10 text-green-600",
  }

  const labels = {
    draft: "Черновик",
    sent: "Отправлен",
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}


