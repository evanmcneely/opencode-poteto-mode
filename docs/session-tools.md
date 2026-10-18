# Session tools

These tools use the official OpenCode APIs and restrict results to the plugin's project.

| Tool | Use |
| --- | --- |
| `pstack_recent_sessions` | Find recent top-level sessions by title. |
| `pstack_active_sessions` | List currently running sessions, including child sessions and their directories. |
| `pstack_session_messages` | Read a page of persisted messages. |
| `pstack_session_context` | Read the session context through the plugin API. |
| `pstack_session_diff` | Read file changes between session turns. |

## Read messages in pages

Pass `sessionID`. The default is 20 messages, newest first. Set `limit` from 1 to 50, `order` to `asc` or `desc`, and an optional message `type`.

The response contains `data` and `cursor`. Pass a returned cursor with the same session and type to read another page. The cursor controls order on later pages. A message count limit does not limit the size of an individual message.

Use message pages for recall and reflection. Read more pages when the evidence requires it. Use `session_context` when you need the context view rather than persisted message pages.

## Check running sessions

`active_sessions` gives a point-in-time list. It includes workers. An idle session is not listed, but it can still have unfinished work. Check Git state and session history before removing a worktree. An empty active list is not deletion approval.

## Inspect changes

Pass `sessionID` to `session_diff`. Optional `from` and `to` values select message IDs. `context` controls surrounding diff lines, from 0 to 20. Use the result alongside messages and live Git state. A diff does not prove that tests passed.

## Run folders

`pstack_run_dir` is not a session reader. It gives each run one folder for its artifacts: plans, `decisions.tsv`, reports, sketches, and orchestrate stores. Pass a kebab-case `slug`. It returns `{ directory }`, an absolute path at `$XDG_DATA_HOME/opencode/poteto/<project-id>/runs/<YYYY-MM-DD>-<slug>/`, which defaults to `~/.local/share/...`. The same slug returns the same folder on later days, so a pickup or subagent reaches the same trail. The folder is outside the repository, so it is never committed and survives worktree removal.

A repo that wants run artifacts elsewhere names the location in its `AGENTS.md`. The skills prefer that location over the tool.

The session tools discover the local OpenCode service. Discovery or API failures are reported as errors. These HTTP routes are experimental in the OpenCode V2 API.
