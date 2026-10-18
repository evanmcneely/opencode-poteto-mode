import { describe, expect, test } from "bun:test"
import { mkdtemp, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { resolveRunDirectory, runsRoot } from "./run-dir.ts"

describe("run directories", () => {
  test("roots runs under the OpenCode data directory per project", () => {
    expect(runsRoot("project", { XDG_DATA_HOME: "/data" })).toBe("/data/opencode/poteto/project/runs")
    expect(runsRoot("project", {})).toEndWith("/.local/share/opencode/poteto/project/runs")
  })

  test("creates a dated folder and returns it again for the same slug", async () => {
    const root = join(await mkdtemp(join(tmpdir(), "poteto-runs-")), "runs")
    const first = await resolveRunDirectory(root, "clerk-identity", new Date(2026, 9, 15))
    expect(first).toBe(join(root, "2026-10-15-clerk-identity"))
    expect((await stat(first)).isDirectory()).toBe(true)

    const later = await resolveRunDirectory(root, "clerk-identity", new Date(2026, 9, 18))
    expect(later).toBe(first)

    const other = await resolveRunDirectory(root, "identity", new Date(2026, 9, 18))
    expect(other).toBe(join(root, "2026-10-18-identity"))
  })

  test("rejects slugs that are not a single path segment", async () => {
    const root = await mkdtemp(join(tmpdir(), "poteto-runs-"))
    await expect(resolveRunDirectory(root, "../escape")).rejects.toThrow("Run slug")
    await expect(resolveRunDirectory(root, "Upper")).rejects.toThrow("Run slug")
  })
})
