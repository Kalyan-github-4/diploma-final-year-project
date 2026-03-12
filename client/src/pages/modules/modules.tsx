import { Button } from "@/components/ui/button"
import { ModuleCard } from "./ModuleCard"
import { modules } from "./ModuleData"

const Module = () => {
  return (
    <div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">

        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-grotesk text-(--text-primary)">
            Modules
          </h1>

          <p className="text-sm text-(--text-secondary) font-sans">
            Explore the various modules available in CodeKing.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Button variant="outline" size="lg" className="rounded-2xl px-4 py-2 cursor-pointer">
            Filter
          </Button>

          <Button size="lg" className="rounded-2xl px-4 py-2 cursor-pointer">
            View Roadmap
          </Button>
        </div>

      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

       {modules.map((module, index) => (
        <ModuleCard key={index} {...module} />
       ))}

      </div>

    </div>
  )
}

export default Module