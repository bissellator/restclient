$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\REST Client.lnk")
$Shortcut.TargetPath = "C:\Users\bisse\bin\restclient.cmd"
$Shortcut.WorkingDirectory = "C:\Users\bisse\github\restclient"
$Shortcut.WindowStyle = 7
$Shortcut.Save()
Write-Host "Shortcut created at: $env:APPDATA\Microsoft\Windows\Start Menu\Programs\REST Client.lnk"
