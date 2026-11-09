[CmdletBinding(PositionalBinding = $false)]
param(
    [string]$AtlasJavaHome,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$MaestroArguments
)

$ErrorActionPreference = 'Stop'
$atlasRoot = Split-Path -Parent $PSScriptRoot
$atlasToolRoot = Join-Path $atlasRoot '.tools\maestro'
$atlasLaunchers = @(Get-ChildItem -LiteralPath $atlasToolRoot -Filter maestro.bat -Recurse -File -ErrorAction SilentlyContinue)
if ($atlasLaunchers.Count -ne 1) {
    throw 'Verified Maestro installation not found. See docs/UI_ENVIRONMENT.md.'
}

# Keep Java selection local to this process; never rewrite the machine/user PATH.
if (-not $AtlasJavaHome) {
    $atlasCandidates = @($env:JAVA_HOME, (Join-Path $env:ProgramFiles 'Java\jdk-25'))
    foreach ($atlasCandidate in $atlasCandidates) {
        if (-not $atlasCandidate) { continue }
        $atlasJava = Join-Path $atlasCandidate 'bin\java.exe'
        if (Test-Path -LiteralPath $atlasJava) {
            $atlasVersion = (& $atlasJava -version 2>&1 | Out-String)
            if ($atlasVersion -match 'version "(\d+)' -and [int]$Matches[1] -ge 17) {
                $AtlasJavaHome = $atlasCandidate
                break
            }
        }
    }
}
if (-not $AtlasJavaHome) { throw 'Pass -AtlasJavaHome pointing to an installed JDK 17 or newer.' }
$atlasJava = Join-Path $AtlasJavaHome 'bin\java.exe'
if (-not (Test-Path -LiteralPath $atlasJava)) { throw 'The selected JDK has no bin\java.exe.' }
$atlasVersion = (& $atlasJava -version 2>&1 | Out-String)
if ($atlasVersion -notmatch 'version "(\d+)' -or [int]$Matches[1] -lt 17) { throw 'Maestro requires Java 17 or newer.' }

$atlasPreviousJavaHome = $env:JAVA_HOME
$atlasPreviousAnalytics = $env:MAESTRO_CLI_NO_ANALYTICS
$atlasPreviousUpdateCheck = $env:MAESTRO_DISABLE_UPDATE_CHECK
$atlasPreviousAnalysisNotification = $env:MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED
try {
    $env:JAVA_HOME = $AtlasJavaHome
    $env:MAESTRO_CLI_NO_ANALYTICS = 'true'
    $env:MAESTRO_DISABLE_UPDATE_CHECK = 'true'
    $env:MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED = 'true'
    & $atlasLaunchers[0].FullName @MaestroArguments
    if ($LASTEXITCODE -ne 0) { throw "Maestro exited with code $LASTEXITCODE." }
} finally {
    $env:JAVA_HOME = $atlasPreviousJavaHome
    $env:MAESTRO_CLI_NO_ANALYTICS = $atlasPreviousAnalytics
    $env:MAESTRO_DISABLE_UPDATE_CHECK = $atlasPreviousUpdateCheck
    $env:MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED = $atlasPreviousAnalysisNotification
}
