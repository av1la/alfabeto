# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

**Alfabeto** is a zero-dependency, static front-end typing game (vanilla JS + HTML + CSS). Letters fall from the top of a game box; the player presses matching keys to score points. No build step, no package manager, no backend.

### Running the dev server

```bash
python3 -m http.server 8080 --directory /workspace
```

Then open `http://localhost:8080` in a browser. There is no build/compile/lint/test pipeline — changes to `index.html`, `game.js`, or `style.css` are picked up on browser refresh.

### Game controls (for manual testing)

- `[A-Z]` — type the letter matching the oldest falling letter to score a point
- `1` — pause
- `2` — unpause
- `3` — restart (resets score to 0)

### Notes

- There is no `package.json`, no bundler, and no test framework. Linting and automated tests are not configured.
- The game auto-pauses when the browser tab loses focus (`visibilitychange` event).
