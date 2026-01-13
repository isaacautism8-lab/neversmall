# Set Cloudflare Pages Environment Variables
# Run this after you have:
# 1. NOTION_PROJECTS_DB_ID from Notion
# 2. NOTION_UPDATES_DB_ID from Notion
# 3. ADMIN_PASSPHRASE (use the generated one or create your own)

$projectName = "neversmall"

Write-Host "`n=== Cloudflare Pages Environment Variables Setup ===" -ForegroundColor Cyan
Write-Host "Project: $projectName`n" -ForegroundColor Gray

# Read from .env file
$envContent = Get-Content .env
$notionApiKey = ($envContent | Select-String "NOTION_API_KEY=").ToString().Split('=')[1]
$projectsDbId = ($envContent | Select-String "NOTION_PROJECTS_DB_ID=").ToString().Split('=')[1]
$updatesDbId = ($envContent | Select-String "NOTION_UPDATES_DB_ID=").ToString().Split('=')[1]
$adminPassphrase = ($envContent | Select-String "ADMIN_PASSPHRASE=").ToString().Split('=')[1]

# Check if values are missing
if (-not $projectsDbId -or $projectsDbId -eq "") {
    Write-Host "⚠️  NOTION_PROJECTS_DB_ID is missing!" -ForegroundColor Yellow
    Write-Host "   Get it from your Notion database URL (see GET_NOTION_IDS.md)" -ForegroundColor Gray
    Write-Host "   Then add it to your .env file and run this script again.`n" -ForegroundColor Gray
    exit 1
}

if (-not $updatesDbId -or $updatesDbId -eq "") {
    Write-Host "⚠️  NOTION_UPDATES_DB_ID is missing!" -ForegroundColor Yellow
    Write-Host "   Get it from your Notion database URL (see GET_NOTION_IDS.md)" -ForegroundColor Gray
    Write-Host "   Then add it to your .env file and run this script again.`n" -ForegroundColor Gray
    exit 1
}

if (-not $adminPassphrase -or $adminPassphrase -eq "") {
    Write-Host "⚠️  ADMIN_PASSPHRASE is missing!" -ForegroundColor Yellow
    Write-Host "   Use the generated one: 600b1s5TTVBIBpTOQajfi9ZTBObR6H2bncjQ4VPY4" -ForegroundColor Gray
    Write-Host "   Or create your own and add it to your .env file, then run this script again.`n" -ForegroundColor Gray
    exit 1
}

Write-Host "Setting environment variables in Cloudflare Pages...`n" -ForegroundColor Green

# Set NOTION_API_KEY
Write-Host "Setting NOTION_API_KEY..." -ForegroundColor Yellow
echo $notionApiKey | npx wrangler pages secret put NOTION_API_KEY --project-name=$projectName

# Set NOTION_PROJECTS_DB_ID
Write-Host "Setting NOTION_PROJECTS_DB_ID..." -ForegroundColor Yellow
echo $projectsDbId | npx wrangler pages secret put NOTION_PROJECTS_DB_ID --project-name=$projectName

# Set NOTION_UPDATES_DB_ID
Write-Host "Setting NOTION_UPDATES_DB_ID..." -ForegroundColor Yellow
echo $updatesDbId | npx wrangler pages secret put NOTION_UPDATES_DB_ID --project-name=$projectName

# Set ADMIN_PASSPHRASE
Write-Host "Setting ADMIN_PASSPHRASE..." -ForegroundColor Yellow
echo $adminPassphrase | npx wrangler pages secret put ADMIN_PASSPHRASE --project-name=$projectName

# Set NEXT_PUBLIC_BASE_URL
Write-Host "Setting NEXT_PUBLIC_BASE_URL..." -ForegroundColor Yellow
echo "https://neversmall.com.au" | npx wrangler pages secret put NEXT_PUBLIC_BASE_URL --project-name=$projectName

Write-Host "`n✅ All environment variables set successfully!" -ForegroundColor Green
Write-Host "   Your site should now work. Visit /admin/ to test." -ForegroundColor Gray
