# Dynamic HTTP Listener for Sketch Construction
# Serves local HTML, CSS, JS, and PNG files at localhost

$port = 8090
$started = $false
$listener = New-Object System.Net.HttpListener
$lastError = ""

while (-not $started -and $port -lt 8100) {
    try {
        $listener.Prefixes.Clear()
        $listener.Prefixes.Add("http://127.0.0.1:$port/")
        $listener.Start()
        $started = $true
    } catch {
        $lastError = $_.Exception.Message
        $port++
    }
}

if (-not $started) {
    Write-Error "Failed to start listener on any port from 8090 to 8099. Last error: $lastError"
    exit 1
}

Write-Host "--------------------------------------------------"
Write-Host "Sketch Construction preview server successfully started."
Write-Host "Open your browser and navigate to: http://127.0.0.1:$port/"
Write-Host "Press Ctrl+C in terminal (or terminate the background task) to stop."
Write-Host "--------------------------------------------------"

$workspaceDir = "d:\SKETCH Construction\google gravity"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Decode path (e.g. spaces represented by %20)
        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Standardize path slashes for Windows
        $subPath = $urlPath.Substring(1).Replace('/', '\')
        $filePath = Join-Path $workspaceDir $subPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set appropriate headers
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            } elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css; charset=utf-8"
                $response.Headers.Add("Cache-Control", "public, max-age=31536000, immutable")
            } elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "application/javascript; charset=utf-8"
                $response.Headers.Add("Cache-Control", "public, max-age=31536000, immutable")
            } elseif ($filePath.EndsWith(".png")) {
                $response.ContentType = "image/png"
                $response.Headers.Add("Cache-Control", "public, max-age=31536000, immutable")
            } elseif ($filePath.EndsWith(".jpg") -or $filePath.EndsWith(".jpeg")) {
                $response.ContentType = "image/jpeg"
                $response.Headers.Add("Cache-Control", "public, max-age=31536000, immutable")
            } elseif ($filePath.EndsWith(".webp")) {
                $response.ContentType = "image/webp"
                $response.Headers.Add("Cache-Control", "public, max-age=31536000, immutable")
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $urlPath")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    } catch {
        # Log exception but continue serving subsequent requests
        Write-Host "Server log: Connection reset or handled: $_"
    }
}
