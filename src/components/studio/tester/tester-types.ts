import type { CompiledPackage, CompileInput } from '@/lib/prompt-compile'

export interface TestRunVersion {
  version: string
  source: 'original' | 'optimized'
  createdAt: string
}

export interface TestRun {
  id: string
  label: string
  createdAt: string
  config: CompileInput
  original: CompiledPackage
  optimized: CompiledPackage | null
  originalScore: number
  optimizedScore: number | null
  improvements: string[]
  changedSections: string[]
  version: string
  versions: TestRunVersion[]
  originalTestResult: string | null
  optimizedTestResult: string | null
}
