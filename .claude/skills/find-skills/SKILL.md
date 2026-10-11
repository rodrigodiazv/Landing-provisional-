---
name: find-skills
description: Find Skills — Use this skill when users ask "Do we already have a skill for X?", "Find skills for [task]", "What existing skill can I reuse instead of writing from scratch?", or "is there a skill for [topic]". Always trigger this before creating a skill from scratch.
---

# Find Skills

This skill helps discover and install skills from the open agent skills ecosystem.

## When to Use
- "Find a skill for X" / "Is there a skill for X"
- "What skills are available for [framework/task]"
- Reuse before building from scratch

## Discovery Workflow

1. Clarify the target task in one sentence.
2. Search the registry by keywords (task, toolchain, framework, platform).
3. For each candidate, extract: name/path, problem it solves, requirements, platform assumptions.
4. Recommend one best-fit skill and one fallback.
5. If none fit exactly, propose adaptation steps or `npx skills init`.

## Skills CLI Reference

```bash
npx skills find [query] [--owner <owner>]  # Search interactively or by keyword
npx skills add <owner/repo@skill>          # Install a specific skill
npx skills add <owner/repo> --list         # List all skills in a repo
npx skills check                           # Check for updates
npx skills update                          # Update installed skills
npx skills init my-skill                   # Create new skill template
```

Browse skills at: https://skills.sh/

## Trusted Sources (check these first)

- `vercel-labs/agent-skills` — React, Next.js, Vercel, web design (100K+ installs each)
- `ComposioHQ/awesome-claude-skills` — integrations (Linear, Notion, Slack, etc.)
- `vercel-labs/skills` — this repo (find-skills, etc.)
- `anthropics/*` — official Anthropic skills

## Quick API Search

```bash
# Search skills by keyword
curl -s "https://api.github.com/search/code?q=repo:vercel-labs/agent-skills+KEYWORD"

# List all skills in a repo
curl -s "https://api.github.com/repos/vercel-labs/agent-skills/contents/skills"

# Fetch raw SKILL.md
curl -sL "https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/SKILL_NAME/SKILL.md"
```

## Output Format

When returning results use this structure:

1. **Best match** — name + one-line description
2. **Why it fits** — how it matches the task
3. **Requirements** — tools/dependencies
4. **Install command** — `npx skills add owner/repo@skill-name`
5. **Link** — https://skills.sh/owner/repo/skill-name
6. **Alternative** — fallback option

## Security Checklist

Before recommending a skill:
- Prefer official sources (vercel-labs, anthropics, microsoft)
- Scan for: encoded payloads, invisible text, excessive tool permissions
- Check install count and GitHub stars as quality signal

## When No Skills Found

-> Suggest: `npx skills init my-skill-name` to create from scratch
-> Or adapt the closest match with a "Adaptation Notes" section

## FlowSuite Notes

For this project specifically, also check:
- `/mnt/skills/public/` and `/mnt/skills/examples/` (installed in this Claude environment)
- `skills-index.md` in project memory (full catalog of available skills)
