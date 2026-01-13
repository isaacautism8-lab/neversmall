# Cloudflare Pages Environment Variables Setup Script
# Run this after: npx wrangler login

$projectName = "neversmall"

# Read values from .env file
$envContent = Get-Content .env
$notionApiKey = ($envContent | Select-String "NOTION_API_KEY=").ToString().Split('=')[1]
$projectsDbId = ($envContent | Select-String "NOTION_PROJECTS_DB_ID=").ToString().Split('=')[1]
$updatesDbId = ($envContent | Select-String "NOTION_UPDATES_DB_ID=").ToString().Split('=')[1]
$adminPassphrase = ($envContent | Select-String "ADMIN_PASSPHRASE=").ToString().Split('=')[1]
$baseUrl = "https://neversmall.com.au"

Write-Host "Setting Cloudflare Pages environment variables..." -ForegroundColor Cyan

# Set environment variables (production)
if ($notionApiKey) {
    Write-Host "Setting NOTION_API_KEY..." -ForegroundColor Yellow
    npx wrangler pages secret put NOTION_API_KEY --project-name=$projectName
}

if ($projectsDbId) {
    Write-Host "Setting NOTION_PROJECTS_DB_ID..." -ForegroundColor Yellow
    npx wrangler pages secret put NOTION_PROJECTS_DB_ID --project-name=$projectName
}

if ($updatesDbId) {
    Write-Host "Setting NOTION_UPDATES_DB_ID..." -ForegroundColor Yellow
    npx wrangler pages secret put NOTION_UPDATES_DB_ID --project-name=$projectName
}

if ($adminPassphrase) {
    Write-Host "Setting ADMIN_PASSPHRASE..." -ForegroundColor Yellow
    npx wrangler pages secret put ADMIN_PASSPHRASE --project-name=$projectName
}

Write-Host "Setting NEXT_PUBLIC_BASE_URL..." -ForegroundColor Yellow
npx wrangler pages secret put NEXT_PUBLIC_BASE_URL --project-name=$projectName

Write-Host "`nDone! Environment variables set." -ForegroundColor Green
Write-Host "Note: You'll be prompted to enter each value when running the commands above." -ForegroundColor Gray
