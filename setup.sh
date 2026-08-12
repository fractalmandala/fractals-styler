#!/usr/bin/env sh
set -eu

pnpm install --frozen-lockfile
pnpm check
pnpm build
