# Git LFS Setup for Large Files

This guide helps you set up Git LFS (Large File Storage) for model files and data files.

## Why Git LFS?

Model files (.pkl) and data files (.csv) can be very large (hundreds of MB to GB). Git LFS stores these files separately, keeping your repository lightweight.

## Installation

### Install Git LFS

**Windows:**
- Download from: https://git-lfs.github.com/
- Or use: `winget install Git.GitLFS`

**Linux:**
```bash
sudo apt-get install git-lfs  # Debian/Ubuntu
sudo yum install git-lfs      # CentOS/RHEL
```

**Mac:**
```bash
brew install git-lfs
```

### Initialize Git LFS

```bash
# Initialize Git LFS in your repository
git lfs install

# Track large files
git lfs track "*.pkl"
git lfs track "*.csv"
git lfs track "*.h5"
git lfs track "*.hdf5"

# Add .gitattributes file
git add .gitattributes
git commit -m "Add Git LFS tracking for large files"
```

## Verify Setup

```bash
# Check what's being tracked
git lfs track

# List LFS files
git lfs ls-files
```

## Pushing Files

After setting up LFS, push normally:

```bash
git add .
git commit -m "Add models and data files"
git push origin Models_AI
```

## Important Notes

1. **First Time:** The first push with LFS may take longer
2. **Bandwidth:** Ensure good internet connection for large files
3. **Storage:** GitHub LFS has storage limits (1GB free, then paid)
4. **Alternatives:** Consider storing large files in cloud storage (S3, GCS) and referencing them

## Alternative: Exclude Large Files

If you prefer not to use Git LFS, you can exclude large files:

1. Add to `.gitignore`:
```
*.pkl
*.csv
!example_data.csv
```

2. Store models in cloud storage and document URLs
3. Provide download scripts for users

## Troubleshooting

**Issue:** "Git LFS not installed"
- Solution: Install Git LFS (see Installation above)

**Issue:** "File too large" error
- Solution: Ensure Git LFS is tracking the file type

**Issue:** Slow push
- Solution: Normal for first push with LFS. Subsequent pushes are faster.

