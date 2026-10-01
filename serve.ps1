param([int]$Port = 4173)
$siteRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Output "Portfolio preview: http://localhost:$Port"
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream)
      $request = $reader.ReadLine()
      if (-not $request) { continue }
      while ($reader.ReadLine()) {}
      $route = [Uri]::UnescapeDataString(($request.Split(' ')[1].Split('?')[0]))
      if ($route -eq '/') { $route = '/index.html' }
      $file = [IO.Path]::GetFullPath([IO.Path]::Combine($siteRoot, $route.TrimStart('/')))
      $status = '200 OK'
      if (-not $file.StartsWith($siteRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or -not [IO.File]::Exists($file)) {
        $status = '404 Not Found'
        $body = [Text.Encoding]::UTF8.GetBytes('Not found')
        $mime = 'text/plain'
      } else {
        $body = [IO.File]::ReadAllBytes($file)
        $types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.webp'='image/webp'; '.mp4'='video/mp4'; '.webm'='video/webm' }
        $mime = $types[[IO.Path]::GetExtension($file)]
        if (-not $mime) { $mime = 'application/octet-stream' }
      }
      $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
      $stream.Write($header,0,$header.Length)
      $stream.Write($body,0,$body.Length)
    } finally { $client.Dispose() }
  }
} finally { $listener.Stop() }
