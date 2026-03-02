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
- No external dependencies for web version

## Quick Start

### Web Version (Zero Dependencies)

```bash
node server.js
```

Open http://localhost:8010 in your browser.

### Desktop App (Electron)

```bash
npm install
npm start
```

## Building Installers

Build for your platform:

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

Installers will be in the `dist/` folder.

## Project Structure

```
restclient/
├── package.json       # Dependencies and build config
├── main.js            # Electron entry point
├── server.js          # HTTP server + proxy endpoint
└── public/
    ├── index.html     # Main UI
    └── logo.png       # App icon
```

## How It Works

The app runs a local HTTP server that:
1. Serves the static web UI
2. Provides a `/api/request` proxy endpoint to make requests to external APIs (avoiding CORS issues)

## License

MIT
