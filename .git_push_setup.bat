@echo off
REM Script to push AI models to Real-World-Asset-Tokenization-AI repository (Windows)
REM Usage: .git_push_setup.bat

echo 🚀 Setting up Git repository for AI Models...

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
)

REM Add remote repository
echo 🔗 Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git

REM Checkout or create Models_AI branch
echo 🌿 Creating/checking out Models_AI branch...
git checkout -b Models_AI 2>nul || git checkout Models_AI

REM Add all files
echo 📝 Adding files...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ℹ️  No changes to commit.
) else (
    echo 💾 Committing changes...
    git commit -m "Add AI models: Real Estate Price Prediction and Investment Recommendation System

- XGBoost price prediction model (R² = 0.8392)
- 10-year forecasting model
- Investment recommendation system
- Geographic clustering (DBSCAN + MiniBatchKMeans)
- Complete documentation and setup files"
)

REM Push to remote
echo ⬆️  Pushing to remote repository...
git push -u origin Models_AI

echo ✅ Done! Your models are now on the Models_AI branch.
echo 🔗 Repository: https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI/tree/Models_AI
pause

