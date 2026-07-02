$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$serviceAccountPath = "C:\Users\SHIVAM KUMAR\Documents\portfolio-secrets\llm-depth-service-account.json"

if (!(Test-Path $serviceAccountPath)) {
  throw "Firebase service account file not found: $serviceAccountPath"
}

Set-Location $repoRoot

$serviceJson = Get-Content -Raw $serviceAccountPath
$env:FIREBASE_SERVICE_ACCOUNT_BASE64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($serviceJson))
$env:FIREBASE_PROJECT_ID = "llm-depth"
$env:FIRESTORE_DATABASE_ID = "default"

if (!$env:ADMIN_SECRET) {
  $env:ADMIN_SECRET = "local-admin-secret-change-me"
}
if (!$env:SESSION_COOKIE_SECRET) {
  $env:SESSION_COOKIE_SECRET = "local-session-cookie-secret-change-me"
}
if (!$env:IP_HASH_SALT) {
  $env:IP_HASH_SALT = "local-ip-hash-salt-change-me"
}
if (!$env:COURSE_SESSION_MINUTES) {
  $env:COURSE_SESSION_MINUTES = "45"
}
if (!$env:DAILY_SESSION_LIMIT) {
  $env:DAILY_SESSION_LIMIT = "2"
}
if (!$env:DEVTOOLS_WARNING_LIMIT) {
  $env:DEVTOOLS_WARNING_LIMIT = "2"
}

Write-Host "Starting Portfolio + Course at http://localhost:8888"
Write-Host "Open the portfolio first, then click the Protected Course card."
Write-Host "Demo login: teacher001 / ChangeMe-12345"
Write-Host "Admin secret for local testing: $env:ADMIN_SECRET"

$existingServer = Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($existingServer) {
  Write-Host "Port 8888 is already running. Open http://localhost:8888 in your browser."
  exit 0
}

node .\scripts\local-dev.cjs
