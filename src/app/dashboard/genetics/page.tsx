"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Dna,
  Play,
  RefreshCw,
  Download,
  CheckCircle2,
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardBackground } from '@/components/dashboard-background'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Declare 3Dmol as a global
declare global {
  interface Window {
    $3Dmol: any
  }
}

const DEFAULT_SEQUENCE = "MKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL"

// Utility functions
const validateSequence = (sequence: string): boolean => {
  if (!sequence || sequence.trim().length === 0) return false
  const validChars = /^[ACDEFGHIKLMNPQRSTVWYacdefghiklmnpqrstvwy\s]+$/
  return validChars.test(sequence.replace(/\s/g, ''))
}

const predictStructure = async (sequence: string): Promise<string | null> => {
  const cleanSequence = sequence.replace(/\s/g, '').toUpperCase()
  
  const response = await fetch('https://api.esmatlas.com/foldSequence/v1/pdb/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: cleanSequence,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return await response.text()
}

const calculateAminoAcidDistribution = (sequence: string) => {
  const cleanSequence = sequence.replace(/\s/g, '').toUpperCase()
  const distribution: { [key: string]: number } = {}
  
  for (const char of cleanSequence) {
    if (/[ACDEFGHIKLMNPQRSTVWY]/.test(char)) {
      distribution[char] = (distribution[char] || 0) + 1
    }
  }
  
  return Object.entries(distribution)
    .map(([aminoAcid, count]) => ({ aminoAcid, count }))
    .sort((a, b) => a.aminoAcid.localeCompare(b.aminoAcid))
}

// 3D Viewer Component
const ProteinViewer: React.FC<{ pdbContent: string; style: string }> = ({ pdbContent, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    const initViewer = () => {
      if (!window.$3Dmol || !containerRef.current || !pdbContent) return

      if (!viewerRef.current) {
        viewerRef.current = window.$3Dmol.createViewer(containerRef.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
        })
      }

      const viewer = viewerRef.current
      viewer.clear()
      viewer.addModel(pdbContent, 'pdb')

      const styleMap: Record<string, any> = {
        cartoon: { cartoon: { color: 'spectrum' } },
        stick: { stick: { color: 'spectrum' } },
        sphere: { sphere: { color: 'spectrum', scale: 0.3 } },
        line: { line: { color: 'spectrum' } },
      }

      viewer.setStyle({}, styleMap[style] || styleMap.cartoon)
      viewer.setBackgroundColor(0x1a1a2e)
      viewer.zoomTo()
      viewer.render()
    }

    if (window.$3Dmol) {
      initViewer()
    } else {
      const interval = setInterval(() => {
        if (window.$3Dmol) {
          clearInterval(interval)
          initViewer()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [pdbContent, style])

  return (
    <div className="w-full h-[400px] rounded-xl border bg-[#1a1a2e] overflow-hidden relative">
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default function GeneticsPage() {
  const [sequence, setSequence] = useState(DEFAULT_SEQUENCE)
  const [pdbContent, setPdbContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visualStyle, setVisualStyle] = useState<'cartoon' | 'stick' | 'sphere' | 'line'>('cartoon')
  const [aminoAcidData, setAminoAcidData] = useState<{ aminoAcid: string; count: number }[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Load 3Dmol script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.$3Dmol) {
      const script = document.createElement('script')
      script.src = 'https://3dmol.org/build/3Dmol-min.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  const handlePredict = async () => {
    if (!validateSequence(sequence)) {
      setError('Неверная последовательность. Используйте только стандартные аминокислоты (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y).')
      return
    }

    const cleanSeq = sequence.replace(/\s/g, '').toUpperCase()
    if (cleanSeq.length > 400) {
      setError('Последовательность слишком длинная. Максимум 400 аминокислот для ESMFold API.')
      return
    }

    setIsLoading(true)
    setError(null)
    setPdbContent(null)

    try {
      const pdb = await predictStructure(cleanSeq)
      if (pdb) {
        setPdbContent(pdb)
        setAminoAcidData(calculateAminoAcidDistribution(cleanSeq))
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при предсказании структуры')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    const text = await file.text()
    
    // Parse FASTA
    const lines = text.split('\n')
    let seq = ''
    for (const line of lines) {
      if (!line.startsWith('>')) {
        seq += line.trim()
      }
    }
    
    if (seq && validateSequence(seq)) {
      setSequence(seq.toUpperCase())
      setAminoAcidData(calculateAminoAcidDistribution(seq))
    }
  }

  const handleDownloadPDB = () => {
    if (!pdbContent) return
    const blob = new Blob([pdbContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'predicted_structure.pdb'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setSequence(DEFAULT_SEQUENCE)
    setPdbContent(null)
    setError(null)
    setUploadedFile(null)
    setAminoAcidData([])
  }

  const isValid = validateSequence(sequence)
  const chartColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

  return (
    <div className="relative min-h-screen">
      <DashboardBackground />
      
      <div className="relative z-10 p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Protein Structure Prediction
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Предсказание 3D структуры белков по аминокислотной последовательности с использованием ESMFold API.
            Введите последовательность или загрузите FASTA файл.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-background/60 backdrop-blur-sm rounded-2xl border p-6 animate-fade-up stagger-1">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Аминокислотная последовательность</label>
            <textarea
              value={sequence}
              onChange={(e) => {
                setSequence(e.target.value)
                setError(null)
                if (validateSequence(e.target.value)) {
                  setAminoAcidData(calculateAminoAcidDistribution(e.target.value))
                }
              }}
              placeholder="Введите последовательность (например, MKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL)"
              className="w-full h-32 p-4 bg-background border rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Используйте однобуквенные коды аминокислот. Максимум 400 символов.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isValid && (
              <div className="flex items-center gap-2 text-sm text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Валидная последовательность ({sequence.replace(/\s/g, '').length} аминокислот)</span>
              </div>
            )}
            
            <div className="flex-1" />
            
            <label className="cursor-pointer">
              <input type="file" accept=".fasta,.txt,.fa" onChange={handleFileUpload} className="hidden" />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
                Загрузить FASTA
              </span>
            </label>
            
            <Button onClick={handlePredict} disabled={isLoading || !isValid} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Предсказание...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Предсказать структуру
                </>
              )}
            </Button>
          </div>

          {uploadedFile && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">{uploadedFile.name}</span>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setUploadedFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* 3D Structure */}
        {pdbContent && (
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border p-6 animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Предсказанная 3D структура</h3>
              <div className="flex items-center gap-3">
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value as any)}
                  className="px-3 py-2 bg-background border rounded-lg text-sm"
                >
                  <option value="cartoon">Cartoon</option>
                  <option value="stick">Stick</option>
                  <option value="sphere">Sphere</option>
                  <option value="line">Line</option>
                </select>
                <Button variant="outline" onClick={handleDownloadPDB} className="gap-2">
                  <Download className="w-4 h-4" />
                  Скачать PDB
                </Button>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Сбросить
                </Button>
              </div>
            </div>
            <div className="w-full max-w-full overflow-hidden">
              <ProteinViewer pdbContent={pdbContent} style={visualStyle} />
            </div>
          </div>
        )}

        {/* Amino Acid Distribution */}
        {aminoAcidData.length > 0 && (
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border p-6 animate-fade-up">
            <h3 className="text-lg font-medium mb-4">Распределение аминокислот</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aminoAcidData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="aminoAcid" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {aminoAcidData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
