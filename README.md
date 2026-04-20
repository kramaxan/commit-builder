# Commit Message Builder

A simple browser utility for constructing standardized git commit messages.

**[Live Demo](https://kramaxan.github.io/commit-builder)**

## What it does

Builds commit messages in a strict `PREFIX-NUMBER:TEAM:TYPE: message` format, validates them against a regex in real time, and copies the result to your clipboard. Saved entries persist in localStorage so you can revisit and reuse them.

## Features

- Real-time preview with regex validation (Save button disabled until valid)
- Ticket prefix, number, team, and type selectors
- `git commit -m` wrapper toggle — wraps the output ready to paste into terminal
- PR suffix toggle with editable, persistent suffix text
- One-click copy to clipboard
- localStorage-backed history with navigation, per-item copy, and delete
- Responsive layout (mobile-friendly down to 380px)
- Keyboard accessible (focus-visible indicators, history items navigable via Tab/Enter)