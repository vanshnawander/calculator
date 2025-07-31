@echo off
echo Updating lockfile after dependency changes...

REM Remove node_modules and lockfile to ensure clean install
if exist node_modules rmdir /s /q node_modules
if exist bun.lock del bun.lock

REM Reinstall dependencies
bun install

echo Lockfile updated successfully!
echo You can now run: eas build -p android --profile preview
