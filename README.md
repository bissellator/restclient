# REST Client

A simple REST client available as both a web app and standalone desktop application.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- Make HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Custom headers support
- Request body editor
- Response viewer with status, headers, and body
- Request timing information
- Debug mode for troubleshooting
- Lightweight desktop app (~5 MB vs 200+ MB for Electron-based alternatives)

## Quick Start

### Web Mode (Zero Build Required)

```bash
npm run web
```

Open http://localhost:8010 in your browser. No build step needed.

### Install Desktop App

**macOS:**
```bash
./install-mac.sh
```

**Windows (PowerShell as Administrator):**
```powershell
powershell -ExecutionPolicy Bypass -File install-windows.ps1
```

The install scripts will:
1. Check for Node.js (required)
2. Install Rust if not present
3. Build the native app
4. Install to Applications (Mac) or Program Files (Windows)

## Prerequisites

- **Node.js** - Required for both web and desktop modes
- **Rust** - Required for desktop build (auto-installed by install scripts)

## Project Structure

```
restclient/
├── package.json         # Dependencies and scripts
├── server.js            # HTTP server + proxy endpoint
├── install-mac.sh       # macOS installer script
├── install-windows.ps1  # Windows installer script
├── public/
│   ├── index.html       # Main UI
│   └── logo.png         # App icon
└── src-tauri/           # Tauri (desktop) configuration
    ├── Cargo.toml
    ├── tauri.conf.json
    └── src/main.rs
```

## How It Works

The app runs a local HTTP server that:
1. Serves the static web UI
2. Provides a `/api/request` proxy endpoint to make requests to external APIs (avoiding CORS issues)

The desktop version wraps this in a native window using [Tauri](https://tauri.app), resulting in a much smaller footprint than Electron-based alternatives.

## Development

```bash
# Run in development mode with hot reload
npm install
npm run tauri:dev

# Build without installing
npm run tauri:build
```

## License

MIT
