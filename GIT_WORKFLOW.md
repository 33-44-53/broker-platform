# Git Collaboration Workflow

## Branch Strategy

### Main Branches
- `main` - Production ready code
- `develop` - Integration branch for features

### Feature Branches
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

## Daily Workflow

### 1. Start New Feature
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/order-management

# Start coding...
```

### 2. Work on Feature
```bash
# Make changes
# Edit files...

# Stage and commit
git add .
git commit -m "Add order status dropdown"

# Push to GitHub
git push origin feature/order-management
```

### 3. Create Pull Request
1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Select your branch
4. Add description:
   ```
   ## What Changed
   - Added order status dropdown
   - Updated order management UI
   
   ## Testing
   - Tested on Chrome/Firefox
   - Verified API calls work
   
   ## Screenshots
   [Add screenshots if UI changes]
   ```
5. Click "Create pull request"

### 4. Code Review
- Team members review code
- Add comments/suggestions
- Make requested changes
- Once approved, merge

### 5. After Merge
```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete feature branch
git branch -d feature/order-management
```

## Commit Message Format

### Good Examples ✅
```bash
git commit -m "Add order status updates to artisan dashboard"
git commit -m "Fix product image loading issue"
git commit -m "Update user profile API endpoint"
```

### Bad Examples ❌
```bash
git commit -m "fix"
git commit -m "changes"
git commit -m "update stuff"
```

## Handling Merge Conflicts

### When Conflicts Happen
```bash
# Pull latest changes
git pull origin main

# Fix conflicts in your editor
# Look for <<<<<<< HEAD markers

# After fixing, stage and commit
git add .
git commit -m "Resolve merge conflicts"
git push origin your-branch
```

### Conflict Example
```javascript
<<<<<<< HEAD
const apiUrl = 'http://localhost:8000/api';
=======
const apiUrl = 'http://localhost:3001/api';
>>>>>>> feature/new-api
```

Choose the correct version and remove conflict markers.

## Team Rules

### Before Starting Work
- Always pull latest changes
- Create new branch for each feature
- Check if someone else is working on same feature

### Before Committing
- Test your changes locally
- Run migrations if database changed
- Write clear commit messages

### Before Creating PR
- Test thoroughly
- Update documentation if needed
- Add screenshots for UI changes

### Code Review Guidelines
- Be constructive and helpful
- Test the changes locally
- Check for security issues
- Verify database migrations work

## Emergency Procedures

### Revert Last Commit
```bash
git revert HEAD
```

### Reset to Previous State
```bash
# WARNING: This deletes uncommitted changes
git reset --hard HEAD~1
```

### Stash Changes Temporarily
```bash
# Save current work
git stash

# Switch branches
git checkout main

# Restore work later
git stash pop
```

## Quick Reference

```bash
# Common commands
git status                    # Check current status
git log --oneline            # View commit history
git branch                   # List branches
git checkout branch-name     # Switch branch
git merge branch-name        # Merge branch
git push origin branch-name  # Push to GitHub
git pull origin main         # Pull latest changes
```