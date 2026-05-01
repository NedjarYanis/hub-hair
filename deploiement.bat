@echo off
chcp 65001 > nul
echo ===================================================
echo 🚀 SCRIPT DE SAUVEGARDE ET DEPLOIEMENT BARBER APP
echo ===================================================
echo.

:: 1. Demande le nom de la modification
set /p commitMsg="📝 Qu'as-tu modifie ? (Message du commit) : "

echo.
echo [1/3] 💾 Sauvegarde du code source sur GitHub (main)...
git add .
git commit -m "%commitMsg%"
git push origin main

echo.
echo [2/3] 🧹 Nettoyage des anciens fichiers...
rmdir /s /q dist 2>nul
rmdir /s /q .expo 2>nul

echo.
echo [3/3] 🌐 Deploiement du site sur GitHub Pages...
call npm run deploy

echo.
echo ===================================================
echo ✅ TERMINE ! Ton code est sauve et le site se met a jour.
echo (Attends 2-3 minutes avant de rafraichir la page web)
echo ===================================================
pause