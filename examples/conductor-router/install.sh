#!/usr/bin/env bash

set -euo pipefail

profile="default"
name="router"
title="conductor-${name}"
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
data_home="${XDG_DATA_HOME:-${HOME}/.local/share}"
runtime_dir="${data_home}/agent-deck/conductor/${name}"

if ! command -v agent-deck >/dev/null 2>&1; then
  echo "agent-deck is not installed or is not on PATH" >&2
  exit 1
fi

if ! agent-deck -p "${profile}" session show "${title}" --json >/dev/null 2>&1; then
  agent-deck -p "${profile}" conductor setup "${name}" \
    --agent codex \
    --description "Route requests to specialist Agent Deck sessions"
fi

install -d -m 0755 "${runtime_dir}"

timestamp="$(date +%Y%m%d-%H%M%S)"
for file in AGENTS.md POLICY.md; do
  source_path="${script_dir}/${file}"
  target_path="${runtime_dir}/${file}"

  if [[ -f "${target_path}" ]] && ! cmp -s "${source_path}" "${target_path}"; then
    cp -p -- "${target_path}" "${target_path}.bak.${timestamp}"
    echo "Backed up ${target_path}"
  fi

  install -m 0644 "${source_path}" "${target_path}"
done

agent-deck -p "${profile}" session set "${title}" wrapper \
  "{command} -c sandbox_workspace_write.network_access=true"

if ! agent-deck -p "${profile}" session restart "${title}" --force; then
  agent-deck -p "${profile}" session start "${title}"
fi

echo
echo "Installed ${title} configuration."
echo "Verify with: agent-deck -p ${profile} conductor status"
