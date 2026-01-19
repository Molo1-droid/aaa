# Snake Game Sandbox

A simple, browser-based Snake game you can play locally. Use the arrow keys to steer the snake and collect food without hitting the walls or yourself.

## How to Run

1. Start a local static server from this folder:
   ```bash
   python -m http.server 8000
   ```
2. Open your browser at:
   ```
   http://localhost:8000
   ```

## Controls

- **Arrow keys / WASD**: Move the snake
- **Space**: Pause / resume
- **R**: Restart

## Notes

- The game uses a fixed grid for consistent movement and collision behavior.
- Your best score is stored locally in the browser.
