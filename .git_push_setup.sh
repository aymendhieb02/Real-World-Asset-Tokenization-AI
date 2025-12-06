#!/bin/bash

# Script to push AI models to Real-World-Asset-Tokenization-AI repository
# Usage: ./git_push_setup.sh

echo "🚀 Setting up Git repository for AI Models..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add remote repository
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git

# Checkout or create Models_AI branch
echo "🌿 Creating/checking out Models_AI branch..."
git checkout -b Models_AI 2>/dev/null || git checkout Models_AI

# Add all files
echo "📝 Adding files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    echo "💾 Committing changes..."
    git commit -m "Add AI models: Real Estate Price Prediction and Investment Recommendation System

- XGBoost price prediction model (R² = 0.8392)
- 10-year forecasting model
- Investment recommendation system
- Geographic clustering (DBSCAN + MiniBatchKMeans)
- Complete documentation and setup files"
fi

# Push to remote
echo "⬆️  Pushing to remote repository..."
git push -u origin Models_AI

echo "✅ Done! Your models are now on the Models_AI branch."
echo "🔗 Repository: https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI/tree/Models_AI"

