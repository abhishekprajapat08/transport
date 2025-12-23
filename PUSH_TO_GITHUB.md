# Push to GitHub - Quick Commands

Your repository: `https://github.com/abhishekprajapat08/transport.git`

## Commands to Run

### Step 1: Initialize Git (if not already done)

```powershell
git init
```

### Step 2: Add All Files

```powershell
git add .
```

### Step 3: Create Initial Commit

```powershell
git commit -m "Initial commit: Transport Analytics Admin Panel"
```

### Step 4: Add Remote Repository

```powershell
git remote add origin https://github.com/abhishekprajapat08/transport.git
```

### Step 5: Rename Branch to Main

```powershell
git branch -M main
```

### Step 6: Push to GitHub

```powershell
git push -u origin main
```

---

## If You Get "remote origin already exists" Error

If you've already added the remote, remove it first:

```powershell
git remote remove origin
git remote add origin https://github.com/abhishekprajapat08/transport.git
git branch -M main
git push -u origin main
```

---

## Authentication Note

When you run `git push`, GitHub will ask for:
- **Username**: `abhishekprajapat08`
- **Password**: Use a **Personal Access Token** (not your GitHub password)

To create a token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "transport-repo"
4. Select scope: `repo` (check all boxes)
5. Click "Generate token"
6. **Copy the token** (you'll only see it once!)
7. Use this token as your password when prompted

---

## Complete Command Sequence (Copy & Paste)

```powershell
git init
git add .
git commit -m "Initial commit: Transport Analytics Admin Panel"
git remote add origin https://github.com/abhishekprajapat08/transport.git
git branch -M main
git push -u origin main
```

