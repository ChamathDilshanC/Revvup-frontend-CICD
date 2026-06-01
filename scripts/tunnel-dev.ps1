# RevvUp — reliable Expo tunnel (Expo's built-in --tunnel often fails with "remote gone away").
# Prerequisites: ngrok installed → https://ngrok.com/download
# 1) Sign up, copy authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
# 2) ngrok config add-authtoken YOUR_TOKEN

param(
  [int]$Port = 8081
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
  Write-Host "Install ngrok first: winget install ngrok.ngrok  OR  https://ngrok.com/download" -ForegroundColor Yellow
  exit 1
}

$onPort = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($onPort) {
  Write-Host "Port $Port is in use. Close the other Expo/Metro window, or run:" -ForegroundColor Yellow
  Write-Host "  taskkill /PID $($onPort.OwningProcess) /F" -ForegroundColor Gray
  exit 1
}

Write-Host ""
Write-Host "=== RevvUp tunnel dev ===" -ForegroundColor Cyan
Write-Host "Terminal A (this window): ngrok -> port $Port"
Write-Host "Terminal B:             cd revvup-frontend; npx expo start -c --port $Port"
Write-Host ""
Write-Host "After ngrok shows 'Forwarding', copy the https://....ngrok-free.app URL"
Write-Host "In Expo Go: Enter URL manually -> exp://YOUR-SUBDOMAIN.ngrok-free.app"
Write-Host "  (use the host from ngrok, no https://)"
Write-Host ""
Write-Host "Optional — QR uses ngrok URL automatically:" -ForegroundColor DarkGray
Write-Host '  $env:EXPO_PACKAGER_PROXY_URL="https://YOUR.ngrok-free.app"; npx expo start -c --port' $Port
Write-Host ""

ngrok http $Port --host-header=localhost
