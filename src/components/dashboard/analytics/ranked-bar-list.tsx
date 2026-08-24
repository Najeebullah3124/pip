interface RankedBarItem {
  name: string
  value: number
  color: string
}

export function RankedBarList({ items }: { items: RankedBarItem[] }) {
  const max = Math.max(...items.map((i) => i.value))

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-foreground-muted">{item.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
