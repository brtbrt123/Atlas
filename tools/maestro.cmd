@echo off
setlocal
rem Launch the official local CLI without requiring PowerShell script execution.
set "ATLAS_MAESTRO=%~dp0..\.tools\maestro\maestro\bin\maestro.bat"
if not exist "%ATLAS_MAESTRO%" (
  echo Maestro is not installed locally. See docs\UI_ENVIRONMENT.md. 1>&2
  exit /b 1
)
rem ATLAS_JAVA_HOME can override the JDK already verified for this project.
if defined ATLAS_JAVA_HOME (
  set "JAVA_HOME=%ATLAS_JAVA_HOME%"
) else if exist "%ProgramFiles%\Java\jdk-25\bin\java.exe" (
  set "JAVA_HOME=%ProgramFiles%\Java\jdk-25"
)
set "MAESTRO_CLI_NO_ANALYTICS=true"
set "MAESTRO_DISABLE_UPDATE_CHECK=true"
set "MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true"
call "%ATLAS_MAESTRO%" %*
exit /b %ERRORLEVEL%
