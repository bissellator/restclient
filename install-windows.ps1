# REST Client - Windows Installer
# Run as: powershell -ExecutionPolicy Bypass -File install-windows.ps1

Write-Host "REST Client - Windows Installer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is required but not installed." -ForegroundColor Red
    Write-Host "Install it from https://nodejs.org"
    exit 1
}

# Check for Rust
try {
    $rustVersion = rustc --version
    Write-Host "Rust found: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Rust is required but not installed." -ForegroundColor Yellow
    Write-Host "Installing Rust via rustup..."

    # Download and run rustup
    $rustupInit = "$env:TEMP\rustup-init.exe"
    Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile $rustupInit
    Start-Process -FilePath $rustupInit -ArgumentList "-y" -Wait

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    Write-Host "Rust installed successfully" -ForegroundColor Green
}

# Install npm dependencies
Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
npm install

# Build the app
Write-Host ""
Write-Host "Building REST Client (this may take a few minutes on first build)..." -ForegroundColor Cyan
npm run tauri:build

# Find the built installer
$installerPath = "src-tauri\target\release\bundle\nsis\REST Client_1.0.0_x64-setup.exe"
$msiPath = "src-tauri\target\release\bundle\msi\REST Client_1.0.0_x64_en-US.msi"

if (Test-Path $installerPath) {
    Write-Host ""
    Write-Host "Running installer..." -ForegroundColor Cyan
    Start-Process -FilePath $installerPath -Wait
    Write-Host ""
    Write-Host "Installation complete!" -ForegroundColor Green
    Write-Host "You can now launch 'REST Client' from the Start Menu."
} elseif (Test-Path $msiPath) {
    Write-Host ""
    Write-Host "Running installer..." -ForegroundColor Cyan
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$msiPath`"" -Wait
    Write-Host ""
    Write-Host "Installation complete!" -ForegroundColor Green
    Write-Host "You can now launch 'REST Client' from the Start Menu."
} else {
    Write-Host ""
    Write-Host "Error: Built installer not found at expected location." -ForegroundColor Red
    Write-Host "Check the build output above for errors."
    exit 1
}
