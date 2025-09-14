import { RoadmapVisualization } from "@/components/roadmap-visualization"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">コンピューターを完全に理解したい</h1>
          <p className="text-muted-foreground text-lg">完全理解へのロードマップ（仮）</p>
        </div>
        <RoadmapVisualization />
      </div>
    </main>
  )
}
