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
- Zero npm dependencies for web mode
- Lightweight desktop app (~5 MB)

## Quick Start

### Web Mode (Zero Dependencies)

```bash
node server.js
```

Open http://localhost:8010. No `npm install` required.

### Desktop App

**Option 1: Download pre-built release**

Download the latest `.dmg` (macOS) or `.exe` (Windows) from [GitHub Releases](https://github.com/bissellator/restclient/releases).

**Option 2: Build from source**

macOS:
```bash
./install-mac.sh
```

Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File install-windows.ps1
```

The install scripts will check for Node.js, install Rust and Tauri CLI if needed, build the app, and install it.

## Prerequisites

- **Node.js** - Required for web mode and building from source
- **Rust** - Required for building from source (auto-installed by install scripts)

## Project Structure

```
restclient/
├── server.js            # HTTP server + proxy (zero dependencies)
├── install-mac.sh       # macOS build script
├── install-windows.ps1  # Windows build script
├── public/
│   ├── index.html       # Main UI
│   └── logo.png         # App icon
└── src-tauri/           # Tauri desktop configuration
```

## How It Works

The app runs a local HTTP server that:
1. Serves the static web UI
2. Provides a `/api/request` proxy endpoint to avoid CORS issues

The desktop version wraps this in a native window using [Tauri](https://tauri.app).

## Creating a Release

Tag a version to trigger the build workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This builds `.dmg` and `.msi`/`.exe` installers and publishes them to GitHub Releases.

## License

MIT
