---
name: Orval Zod version compatibility
description: Orval may emit Zod 4 syntax even when the workspace uses Zod 3.
---

The generated API validation package must match the workspace's installed Zod major version.

**Why:** Orval 8 can default to Zod 4 output based on incomplete package metadata, while this workspace's shared catalog may still resolve Zod 3; generated `zod.int()` and `zod.email()` then fail typechecking.

**How to apply:** When codegen emits Zod 4-only helpers in this workspace, set `override.zod.version: 3` in the Orval config rather than hand-editing generated files.