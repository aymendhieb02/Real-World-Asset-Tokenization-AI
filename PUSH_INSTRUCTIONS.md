# Instructions to Push to Repository

Follow these steps to push your AI models to the `Models_AI` branch.

## Prerequisites

1. **Git installed** - Check with: `git --version`
2. **GitHub account** with access to the repository
3. **Git LFS installed** (optional, for large files) - See `SETUP_GIT_LFS.md`

## Step-by-Step Instructions

### Step 1: Navigate to Your Project Directory

```bash
cd "C:\Users\Msi\OneDrive\Bureau\Ai_Odyssey_hackaton\models"
```

### Step 2: Initialize Git (if not already done)

```bash
git init
```

### Step 3: Add Remote Repository

```bash
git remote add origin https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git
```

If remote already exists, update it:
```bash
git remote set-url origin https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git
```

### Step 4: Create and Checkout Models_AI Branch

```bash
git checkout -b Models_AI
```

### Step 5: Add All Files

```bash
git add .
```

**Important:** Review what you're adding:
```bash
git status
```

### Step 6: Commit Changes

```bash
git commit -m "Add AI models: Real Estate Price Prediction and Investment Recommendation System

- XGBoost price prediction model (R² = 0.8392)
- 10-year forecasting model  
- Investment recommendation system
- Geographic clustering (DBSCAN + MiniBatchKMeans)
- Complete documentation and setup files"
```

### Step 7: Push to Remote

```bash
git push -u origin Models_AI
```

You may be prompted for GitHub credentials. Use a Personal Access Token if 2FA is enabled.

## Using the Setup Scripts (Easier)

### Windows (PowerShell)

```powershell
.\git_push_setup.bat
```

### Linux/Mac

```bash
chmod +x .git_push_setup.sh
./.git_push_setup.sh
```

## Handling Large Files

### Option 1: Use Git LFS (Recommended)

```bash
# Install Git LFS first (see SETUP_GIT_LFS.md)
git lfs install
git lfs track "*.pkl"
git lfs track "*.csv"
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### Option 2: Exclude Large Files

If files are too large, they're already in `.gitignore`. You can:
1. Store models in cloud storage (S3, Google Drive, etc.)
2. Document download links in README
3. Provide download scripts

## Verify Push

After pushing, verify on GitHub:
1. Go to: https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI
2. Switch to `Models_AI` branch
3. Verify all files are present

## Troubleshooting

### "Permission denied" error
- Check GitHub credentials
- Use Personal Access Token instead of password

### "File too large" error
- Set up Git LFS (see `SETUP_GIT_LFS.md`)
- Or exclude large files in `.gitignore`

### "Branch already exists" error
- Pull first: `git pull origin Models_AI`
- Or force push (use carefully): `git push -f origin Models_AI`

### "Remote already exists" error
- Update remote: `git remote set-url origin <url>`
- Or remove and re-add: `git remote remove origin && git remote add origin <url>`

## Next Steps

After pushing:
1. Create a Pull Request from `Models_AI` to `main` (if needed)
2. Update main repository README to reference this branch
3. Set up CI/CD for model testing (optional)
4. Document API integration points

## Files Included

The following files will be pushed:
- ✅ `README.md` - Comprehensive documentation
- ✅ `MODELS_README.md` - Quick reference
- ✅ `requirements.txt` - Python dependencies
- ✅ `setup.py` - Installation script
- ✅ `.gitignore` - Git ignore rules
- ✅ `USA_Real_Estate_NoteBook.ipynb` - Main notebook
- ✅ `DEPLOYMENT.md` - Deployment guide
- ⚠️ Model files (.pkl) - Use Git LFS or exclude
- ⚠️ Data files (.csv) - Use Git LFS or exclude

## Need Help?

- Check `SETUP_GIT_LFS.md` for large file handling
- Check `DEPLOYMENT.md` for deployment options
- Check `MODELS_README.md` for usage examples

