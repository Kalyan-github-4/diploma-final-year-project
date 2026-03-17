const badges = [
  { title: "Scripting Guru", img: "/badge-1.png" },
  { title: "Bug Hunter", img: "/badge-2.png" },
  { title: "Code Master", img: "/badge-3.png" },
]

const Achievement = () => {
  return (
    <div className="bg-(--bg-elevated) rounded-3xl border border-border p-6 xl:p-7">

      {/* Badge Row */}
      <div className="grid grid-cols-3 items-center">
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center justify-center">

            <img
              src={badge.img}
              alt={badge.title}
              className="
                w-full h-auto
                max-w-27
                sm:max-w-29
                md:max-w-32
                xl:max-w-36
                object-contain
              "
            />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Footer */}
      <div className="flex items-center justify-center">
        <p className="text-xs text-(--text-secondary) cursor-pointer hover:text-(--accent)">
          View all 12 badges
        </p>
      </div>

    </div>
  )
}

export default Achievement