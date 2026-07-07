$port = 8765
$url  = "http://localhost:$port/"
$file = Join-Path $PSScriptRoot "PTW_Helpdesk.html"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try { $listener.Start() } catch {
    Write-Host "Port $port already in use." -ForegroundColor Yellow
    Start-Process $url; exit
}

Write-Host "PTW Helpdesk running at $url  (close this window to stop)" -ForegroundColor Cyan
$html = [System.IO.File]::ReadAllBytes($file)

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    $res.ContentType = "text/html; charset=utf-8"
    $res.ContentLength64 = $html.Length
    $res.OutputStream.Write($html, 0, $html.Length)
    $res.OutputStream.Close()
}
