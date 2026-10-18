import { mkdir, readdir } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

export const RUN_SLUG_PATTERN = "^[a-z0-9][a-z0-9-]{0,63}$"

export function runsRoot(projectID: string, env: Record<string, string | undefined> = process.env): string {
  const dataHome = env.XDG_DATA_HOME || join(homedir(), ".local", "share")
  return join(dataHome, "opencode", "poteto", projectID, "runs")
}

function localDate(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export async function resolveRunDirectory(root: string, slug: string, now: Date = new Date()): Promise<string> {
  if (!new RegExp(RUN_SLUG_PATTERN).test(slug)) {
    throw new Error(`Run slug must be lowercase letters, digits, and hyphens: ${slug}`)
  }

  await mkdir(root, { recursive: true })
  const existing = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}-/.test(entry.name) && entry.name.slice(11) === slug)
    .map((entry) => entry.name)
    .sort()
    .at(-1)

  const directory = join(root, existing ?? `${localDate(now)}-${slug}`)
  await mkdir(directory, { recursive: true })
  return directory
}
