import { FileText, UsersRound, Cpu, Images, FolderKanban } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'

export function StatOverview() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <StatCard label="Total prompts" value="1,284" delta={{ value: '12.4%', direction: 'up' }} icon={<FileText />} />
      <StatCard label="Active characters" value="37" delta={{ value: '4', direction: 'up' }} icon={<UsersRound />} />
      <StatCard label="AI engines" value="5" delta={{ value: '1', direction: 'up' }} icon={<Cpu />} />
      <StatCard label="Generated assets" value="9,486" delta={{ value: '18.2%', direction: 'up' }} icon={<Images />} />
      <StatCard label="Active projects" value="16" delta={{ value: '2.1%', direction: 'down' }} icon={<FolderKanban />} />
    </div>
  )
}
