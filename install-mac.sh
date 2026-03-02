#!/bin/bash
set -e

echo "REST Client - macOS Installer"
echo "=============================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    echo "Install it from https://nodejs.org or via Homebrew: brew install node"
    exit 1
fi
echo "Node.js found: $(node --version)"

# Check for Rust
if ! command -v rustc &> /dev/null; then
    echo ""
    echo "Rust is required but not installed."
    echo "Installing Rust via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi
echo "Rust found: $(rustc --version)"

# Check for Tauri CLI
if ! command -v cargo-tauri &> /dev/null; then
    echo ""
    echo "Installing Tauri CLI..."
    cargo install tauri-cli
fi
echo "Tauri CLI found"

# Build the app
echo ""
echo "Building REST Client (this may take a few minutes on first build)..."
cd src-tauri
cargo tauri build
cd ..

# Find and copy the app
APP_PATH="src-tauri/target/release/bundle/macos/REST Client.app"
if [ -d "$APP_PATH" ]; then
    echo ""
    echo "Installing to /Applications..."
    rm -rf "/Applications/REST Client.app"
    cp -R "$APP_PATH" "/Applications/"
    echo ""
    echo "Installation complete!"
    echo "You can now launch 'REST Client' from your Applications folder."
else
    echo ""
    echo "Error: Built app not found at expected location."
    echo "Check the build output above for errors."
    exit 1
fi
