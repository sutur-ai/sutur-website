# sutur-website — working agreement

Read this before you start. It is for whoever is working here: Moussa (Claude
Code), Henrique, Hermesitto, or a human.

This file is tracked in git on purpose. It is the only channel that reaches
every machine that clones this repo — a local git hook or a doc in someone's
home directory reaches exactly one.

## This repo is PUBLIC

Everything committed here is world-readable, including the commit history and
anything a force-push has already published. No client names, no deal values, no
internal architecture, no screenshots of a client's Odoo. If a change would tell
a competitor who we work with or what we charge, it does not belong here.

That cuts against the Jira convention below, so be deliberate: a branch name and
a PR title are public on this repo. `SUTUR-31: fix nav spacing` is fine. Naming a
client or a deal in the title is not.

## Jira: every branch and PR carries its issue key

Work here is tracked at `sutur-ai.atlassian.net`, project **SUTUR**. Two rules,
and you need both:

- Branch name: `feature/SUTUR-<n>-<short-slug>`
- PR title:    `SUTUR-<n>: <what changed>`

Jira's GitHub app links branches by branch name and pull requests by title — and
it needs the key in the **source branch name** for the PR link to resolve too.
Miss the key and the work is simply invisible from Jira. Nothing errors; the
link just never appears.

Use **SUTUR** keys, never SALES ones. `SALES` is a Jira business project with no
development panel, so a `SALES-n` key in a branch renders nowhere.

Label website work `client-internal`.

## What this repo is

The public Sutur company website (Next.js), served at sutur.ai. `package.json`
has the scripts; Playwright config is checked in for browser tests.
