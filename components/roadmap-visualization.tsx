"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Circle, ArrowRight, Star, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  title: string
  priority: "高" | "中"
  prerequisites: number[]
  outcomes: string
  validation: string
  completed: boolean
  completedDate?: string
}

const tasks: Task[] = [
  {
    id: 1,
    title: "テンプレ倉庫と計測基盤",
    priority: "高",
    prerequisites: [],
    outcomes: "CMake + clang/msvc, asan/ubsan/tsan, clang-tidy, gtest, CI, ベンチ雛形",
    validation: "CI緑化、失敗テストでCIが落ちる",
    completed: true,
  },
  {
    id: 2,
    title: "可観測性の標準化（ログ/metrics/tracing）",
    priority: "高",
    prerequisites: [1],
    outcomes: "共通ロガー、メトリクス、トレース",
    validation: "例外系イベントがダッシュボードに出る",
    completed: false,
  },
  {
    id: 3,
    title: "式言語（字句/構文/AST/バイトコードVM）",
    priority: "高",
    prerequisites: [1, 2],
    outcomes: "関数・クロージャ対応VM",
    validation: "単体/プロパティテスト合格、REPL動作",
    completed: false,
  },
  {
    id: 4,
    title: "GC（Mark-Sweep最小）",
    priority: "中",
    prerequisites: [3],
    outcomes: "到達可能性ベース回収",
    validation: "負荷テストでリーク無し、ポーズ時間計測",
    completed: false,
  },
  {
    id: 5,
    title: "基本コンテナ/文字列/ハッシュ（libc最小片）",
    priority: "高",
    prerequisites: [1],
    outcomes: "vector/string/hashmap、境界チェック",
    validation: "fuzzerとUBSanで未定義動作ゼロ",
    completed: false,
  },
  {
    id: 6,
    title: "メモリアロケータ（arena/region + 自作malloc最小）",
    priority: "中",
    prerequisites: [5],
    outcomes: "固定/成長arena、簡易malloc",
    validation: "断片化とスループット比較",
    completed: false,
  },
  {
    id: 7,
    title: "HTTP/1.1サーバ（keep-alive/pipeline/静的配信）",
    priority: "高",
    prerequisites: [5, 6],
    outcomes: "ルータ、ゼロコピー送信",
    validation: "ローカル1万req/s以上、p99<5ms",
    completed: false,
  },
  {
    id: 8,
    title: "ユーザ空間TCP/IP（ARP/ICMP/IPv4/TCP Reno）",
    priority: "高",
    prerequisites: [7],
    outcomes: "三者握手、再送、輻輳制御",
    validation: "自作HTTP直載せで大容量転送が安定",
    completed: false,
  },
  {
    id: 9,
    title: "ELF/PE静的ローダ + toyシェル",
    priority: "中",
    prerequisites: [5],
    outcomes: "ELF64/PE64読込・再配置最小",
    validation: "サンプル実行体を起動可能",
    completed: false,
  },
  {
    id: 10,
    title: "LLVMフロントエンド→IR→JIT（ORC）",
    priority: "高",
    prerequisites: [3, 5],
    outcomes: "言語→LLVM IR→JIT実行",
    validation: "Cサブセット関数がJITで動作、既成最適化パス通過",
    completed: false,
  },
  {
    id: 11,
    title: "ストレージ基盤（LSM または B+木 KV）",
    priority: "高",
    prerequisites: [5],
    outcomes: "KV API、範囲走査、バルクロード",
    validation: "読取/書込/混合ベンチの再現手順あり",
    completed: false,
  },
  {
    id: 12,
    title: "永続化/WALとクラッシュリカバリ",
    priority: "高",
    prerequisites: [11],
    outcomes: "WAL、ログリプレイ、スナップショット",
    validation: "故障注入で整合性維持",
    completed: false,
  },
  {
    id: 13,
    title: "TLS 1.3 クライアント統合（既存実装使用）",
    priority: "中",
    prerequisites: [8],
    outcomes: "mbedTLS/OpenSSLで証明書検証とALPN",
    validation: "外部サイトとハンドシェイク計測",
    completed: false,
  },
  {
    id: 14,
    title: "HTTP/2 または gRPC over TLS（最小）",
    priority: "中",
    prerequisites: [7, 13],
    outcomes: "ストリーム多重、HPACKは既成実装で可",
    validation: "並行リクエストでスループット向上を確認",
    completed: false,
  },
  {
    id: 15,
    title: "合意アルゴリズム Raft",
    priority: "高",
    prerequisites: [11, 12],
    outcomes: "ログ複製、リーダ選出、スナップショット",
    validation: "ネット分断/クラッシュ注入でも安全性維持",
    completed: false,
  },
  {
    id: 16,
    title: "分散KV（シャーディング + レプリカ）",
    priority: "高",
    prerequisites: [15],
    outcomes: "一貫性モデル（線形化推奨）、再配置手順",
    validation: "線形化チェッカまたはJepsen系テスト通過",
    completed: false,
  },
  {
    id: 17,
    title: "最小ブラウザ（HTML→DOM、CSSセレクタ/カスケード、ブロックレイアウト、ソフト描画）",
    priority: "中",
    prerequisites: [],
    outcomes: "静的HTMLのレンダリング",
    validation: "既知のレイアウトケースで一致",
    completed: false,
  },
  {
    id: 18,
    title: "セキュリティ衛生（脅威モデリング/入力検証/権限分離/定数時間比較）",
    priority: "高",
    prerequisites: [1, 2],
    outcomes: "各プロジェクトにセキュリティ方針とチェック",
    validation: "静的解析＋模擬攻撃で主要脆弱性を抑止",
    completed: false,
  },
  {
    id: 19,
    title: "可観測性ダッシュボード（統一メトリクス集約）",
    priority: "中",
    prerequisites: [2, 7, 11, 16],
    outcomes: "p50/p95/p99、エラー率、CPU/メモリ/IO、トレース表示",
    validation: "性能退行と異常を可視で検知",
    completed: false,
  },
  {
    id: 20,
    title: "キャップストーン（いずれか選択）",
    priority: "高",
    prerequisites: [8, 9, 13, 14, 16], // A選択の場合
    outcomes: "A) 薄OS→TCP→TLS→HTTP/2→分散KV→管理UI / B) 言語フルパス / C) 推論ランタイム最小",
    validation: "外部ユーザ利用、SLA、再現手順、故障注入とp99を公開",
    completed: false,
  },
]

export function RoadmapVisualization() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<"all" | "高" | "中">("all")

  const filteredTasks = tasks.filter((task) => filter === "all" || task.priority === filter)

  const getPrerequisiteNames = (prerequisites: number[]) => {
    return prerequisites
      .map((id) => {
        const task = tasks.find((t) => t.id === id)
        return task ? `${id}. ${task.title}` : `タスク ${id}`
      })
      .join(", ")
  }

  const isHighPriority = (priority: string) => priority === "高"

  return (
    <div className="space-y-6">
      {/* フィルターとレジェンド */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
            すべて
          </Button>
          <Button variant={filter === "高" ? "default" : "outline"} onClick={() => setFilter("高")} size="sm">
            重要度: 高
          </Button>
          <Button variant={filter === "中" ? "default" : "outline"} onClick={() => setFilter("中")} size="sm">
            重要度: 中
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            <span>重要度: 高</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>重要度: 中</span>
          </div>
        </div>
      </div>

      {/* タスクグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTasks.map((task) => (
          <Dialog key={task.id}>
            <DialogTrigger asChild>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                  isHighPriority(task.priority) ? "border-accent bg-accent/5 hover:bg-accent/10" : "hover:bg-muted/50",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-mono",
                          isHighPriority(task.priority) ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        #{task.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isHighPriority(task.priority) ? (
                        <Star className="h-4 w-4 text-accent" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge
                        variant={isHighPriority(task.priority) ? "default" : "secondary"}
                        className={cn("text-xs", isHighPriority(task.priority) && "bg-accent text-accent-foreground")}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle
                    className={cn("text-sm leading-tight", isHighPriority(task.priority) && "text-foreground")}
                  >
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription
                    className={cn(
                      "text-xs line-clamp-2",
                      isHighPriority(task.priority) ? "text-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {task.outcomes}
                  </CardDescription>
                  {task.prerequisites.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <ArrowRight className="h-3 w-3" />
                      <span
                        className={cn(isHighPriority(task.priority) ? "text-foreground/70" : "text-muted-foreground")}
                      >
                        前提: {task.prerequisites.join(", ")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">タスク #{task.id}</span>
                  <Badge
                    variant={isHighPriority(task.priority) ? "default" : "secondary"}
                    className={cn(isHighPriority(task.priority) && "bg-accent text-accent-foreground")}
                  >
                    重要度: {task.priority}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">成果</h4>
                  <p className="text-sm text-muted-foreground">{task.outcomes}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">検証方法</h4>
                  <p className="text-sm text-muted-foreground">{task.validation}</p>
                </div>

                {task.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">前提条件</h4>
                    <p className="text-sm text-muted-foreground">{getPrerequisiteNames(task.prerequisites)}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">{task.completed ? "完了済み" : "未完了"}</span>
                  {task.completedDate && (
                    <span className="text-xs text-muted-foreground ml-2">完了日: {task.completedDate}</span>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">総タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">重要度: 高</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{tasks.filter((t) => t.priority === "高").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">完了済み</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{tasks.filter((t) => t.completed).length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
