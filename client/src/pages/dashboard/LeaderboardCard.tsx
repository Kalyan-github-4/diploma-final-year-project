import { Crown } from "lucide-react"

const players = [
  { rank: 1, name: "John Doe", xp: 42000, color: "#F59E0B" },
  { rank: 2, name: "Aarav Sharma", xp: 38100, color: "#9CA3AF" },
  { rank: 3, name: "Riya Sen", xp: 35200, color: "#F97316" }
]

const LeaderboardCard = () => {
  return (
    <div className="bg-(--bg-elevated) rounded-3xl border border-border">
      
      {/* Title */}
      {/* <h2 className="text-sm font-semibold text-(--text-secondary) mb-4">
        Top Coders
      </h2> */}

      {/* Player Rows */}
      <div className="">
        {players.map((p, i) => (
          <div
            key={p.rank}
            className={`flex items-center gap-4 px-5 py-4 transition
              ${p.rank === 1 ? "bg-(--bg-elevated)" : "bg-background"}
              ${p.rank === 1 ? "rounded-t-3xl" : "rounded-none"}
               ${i !== 0 && i !== players.length - 1 ? "border-b border-border" : ""}
            `}
          >
            {/* Rank */}
            <p
              className="text-lg font-bold w-5 text-center"
              style={{ color: p.color }}
            >
              {p.rank}
            </p>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
              {p.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {p.name}
              </h3>
              <p className="text-xs text-(--text-secondary)">
                {p.xp.toLocaleString()} xp
              </p>
            </div>

            {/* Glow indicator */}
            {p.rank === 1 && (
              <Crown className="w-5 h-5 text-yellow-400" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-center">
        <p className="text-xs text-(--accent) cursor-pointer hover:text-(--accent)">
          FULL RANKING
        </p>
      </div>
    </div>
  )
}

export default LeaderboardCard