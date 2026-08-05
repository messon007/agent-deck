# Router Conductor configuration

This directory keeps the reproducible configuration for the local
`conductor-router` session. It is intentionally isolated from Agent Deck core
code so upstream updates can be rebased or merged without touching the local
routing policy.

## Files

- `AGENTS.md` defines the conductor identity and safe startup behaviour.
- `POLICY.md` maps the current specialist sessions to their responsibilities.
- `install.sh` installs both files, configures Codex, and starts or restarts the
  conductor.

Runtime files such as `state.json`, `task-log.md`, session IDs, tmux names, and
Codex update-dismissal state are machine-specific and are not tracked here.

## Install or restore

Run from any directory:

```bash
bash /path/to/agent-deck/examples/conductor-router/install.sh
```

The first Agent Deck conductor setup may ask whether to configure a remote
channel. Answer `N` when only the local Studio/TUI entry point is needed.

The installer:

1. Creates `conductor-router` in the `default` profile when missing.
2. Backs up different existing `AGENTS.md` and `POLICY.md` files.
3. Installs the versioned files into the conductor runtime directory.
4. Adds `sandbox_workspace_write.network_access=true` to this Codex session.
5. Restarts the conductor so the configuration takes effect.

## Security note

On Linux, Codex workspace sandboxing blocks access to the tmux Unix socket.
Codex does not currently provide a Linux-only allowlist for one Unix socket, so
the conductor needs workspace-sandbox network access to inspect and message
Agent Deck sessions. Filesystem sandboxing remains enabled, but shell commands
inside this conductor can make network connections.

The policy therefore forbids unsolicited lifecycle actions. It may only start,
stop, restart, archive, delete, or rename a session after an explicit user
request.

## Verify

```bash
agent-deck -p default conductor status
agent-deck -p default session send conductor-router \
  "Run agent-deck status --json and report only the counts; do not mutate sessions." \
  --wait
```

When the conductor itself is processing the check, the expected snapshot for
the configuration created on 2026-08-05 was six waiting sessions, one running
session, and three error sessions.
