$ErrorActionPreference = "Stop"
$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$env:Path;$nodeDir"
Set-Location $PSScriptRoot
& "$nodeDir\npm.cmd" run dev -- --hostname 0.0.0.0 --webpack
