# 🚀 Quick Start Guide

Get Match Madness running in 2 minutes!

## Step 1: Verify Prerequisites

```bash
node --version   # Should be 18 or higher
npm --version    # Should be 9 or higher
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org)

## Step 2: Start the App

**Windows:**
```bash
install.bat
```

**Mac/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Or manually:**
```bash
npm run dev
```

## Step 3: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the Match Madness landing page!

## Step 4: Play the Game

1. Click "Start Learning →"
2. Match items from all three columns:
   - **French**: The French word
   - **English**: The English translation
   - **Type**: The grammatical type
3. Watch your progress and streak!

## 🎯 Example Match

Correct match:
- **French**: `le`
- **English**: `the`
- **Type**: `Masculine Singular`

All three refer to the same word!

## 🛠️ Common Issues

### Port 3000 already in use?

```bash
npm run dev -- -p 3001
```

### TypeScript errors?

```bash
npm run build
```

This will show detailed error messages.

### Dependencies not installed?

```bash
npm install
```

## 📱 Next Steps

1. **Customize Settings**: Edit `lib/utils/constants.ts`
2. **Add Words**: Edit `data/function-words/articles.ts`
3. **Change Colors**: Edit `tailwind.config.ts`
4. **Build for Production**: Run `npm run build`

## 📚 Documentation

- [README.md](README.md) - Complete documentation
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [Architecture](README.md#-architecture) - System design

## 🎮 Game Controls

- **Click** to select items
- **Auto-submit** when all 3 items selected
- **Visual feedback** for correct/wrong matches
- **Streak tracking** for consecutive correct matches

## 🔊 Features

- ✅ Sound effects (beeps as placeholders)
- ✅ Progress tracking
- ✅ Statistics on completion
- ✅ Responsive design
- ✅ Type-safe code

## 💡 Tips

- Match the **same word** across all three columns
- Watch for the **green highlight** on selected items
- Build a **streak** for bonus satisfaction
- Complete all **200 matches** to see your stats!

---

**Happy Learning! 🎉**
