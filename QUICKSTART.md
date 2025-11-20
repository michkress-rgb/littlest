# Quick Start Guide

Get up and running with the new Littlest Way in 5 minutes!

## 📦 What You Have

You should see these files:
- ✅ **index.html** - Main app file
- ✅ **styles.css** - All styling
- ✅ **app.js** - Application logic
- ✅ **manifest.json** - PWA config
- ✅ **README.md** - Full documentation
- ✅ **MIGRATION.md** - Upgrade guide
- ✅ **COMPARISON.md** - Before/after details

## 🚀 Three Ways to Use

### Option 1: Local Testing (Quickest)
Perfect for trying it out right away.

1. **Save all files** to a folder on your computer
2. **Double-click** `index.html`
3. **Enter PIN**: 332211
4. Start using!

⚠️ **Note**: Some features may not work locally (Firebase needs proper hosting)

### Option 2: Web Hosting (Recommended)
Best for regular use and multiple devices.

1. **Upload files** to your web host
   - All 4 files in same directory
   - No special configuration needed
2. **Visit** your URL
3. **Enter PIN**: 332211
4. **Bookmark** for easy access

✅ **Works with**: Any web hosting, Firebase Hosting, Netlify, Vercel, GitHub Pages

### Option 3: Firebase Hosting (Best)
Optimal performance with Firebase backend.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## 🎯 First 5 Minutes

### 1. Login (30 seconds)
- Enter PIN: **332211**
- Check "Remember me" feeling for 7 days
- Click Enter

### 2. Explore Navigation (1 minute)
- Click **☰** menu icon
- Browse categories
- Notice organization
- Click **Dashboard** to return

### 3. Try Quick Actions (1 minute)
- Click **Mass** button → See it highlight
- Click **Scripture** → See it toggle
- Click again → See it untoggle

### 4. Add Your First Intention (1 minute)
- Type in "Quick Add Intention" field
- Click **Add** button
- See it appear below

### 5. Record a Prayer (1 minute)
- Open menu → **Daily Prayers**
- Find "Morning Aspirations"
- Click **+1** button
- See count increase

### 6. Check Your Stats (30 seconds)
- Return to **Dashboard**
- See your prayer count updated
- Notice goal progress changed

**Congratulations!** You're now using the new Littlest Way! 🎉

## 🎨 Customize It

### Change PIN (Optional)
**If you want a different PIN:**

1. Open `app.js` in text editor
2. Find line: `const REQUIRED_PIN = '332211';`
3. Change to your PIN: `const REQUIRED_PIN = '123456';`
4. Save file
5. Upload/refresh

### Set Your Daily Goal
1. Open menu
2. Click **Set Daily Goal**
3. Enter your target (e.g., 20)
4. Click OK

### Enable Dark Mode
1. Click **☾** moon icon (top right)
2. Enjoy easier on eyes
3. Preference saved automatically

## 📱 Install as App

### On Your Phone

**iPhone (Safari):**
1. Open app in Safari
2. Tap **Share** button (⬆️)
3. Scroll → **Add to Home Screen**
4. Tap **Add**

**Android (Chrome):**
1. Open app in Chrome
2. Tap **⋮** menu
3. Tap **Install App**
4. Tap **Install**

### On Your Computer

**Chrome/Edge:**
1. Look for **⊕** icon in address bar
2. Click it
3. Click **Install**

Now it opens like a regular app - no browser bars!

## 🆘 Troubleshooting

### "Page is blank!"
- **Check**: All files uploaded?
- **Check**: Internet connection?
- **Try**: Refresh page (Ctrl+R or Cmd+R)
- **Try**: Clear cache and reload

### "PIN doesn't work!"
- **Check**: Using correct PIN (332211)?
- **Try**: Clear browser data
- **Check**: JavaScript enabled in browser

### "My prayers aren't saving!"
- **Check**: Internet connection
- **Check**: Firebase config in app.js
- **Try**: Refresh page
- **Check**: Browser console for errors (F12)

### "Menu won't open!"
- **Try**: Refresh page
- **Check**: Click exactly on ☰ icon
- **Try**: Different browser

### "Dark mode won't stay!"
- **Check**: Cookies/localStorage enabled
- **Try**: Toggle theme again
- **Check**: Not in incognito mode

## 💡 Daily Usage Tips

### Morning Routine
1. Open app (auto-login!)
2. Toggle **Mass** if attending
3. Toggle **Scripture** after reading
4. Quick add any new intentions

### Throughout Day
- Use menu to navigate
- Record prayers as you say them
- Check dashboard for progress

### Evening Review
1. Review dashboard stats
2. Add any missed prayers
3. Check intention progress
4. Plan tomorrow's prayers

## 📚 Next Steps

### Explore More Features
- [ ] Try the **Rosary** counters
- [ ] Record a **Novena**
- [ ] Track **St. Michael Chaplet**
- [ ] Use **Way of the Cross** stations
- [ ] Try **Silent Prayer** timer

### Read Documentation
- **README.md** - Complete feature guide
- **MIGRATION.md** - If upgrading from old version
- **COMPARISON.md** - See all improvements

### Set Up Routine
1. Decide daily goal
2. Identify favorite prayers
3. Set up intention list
4. Create prayer schedule

### Backup Your Data
1. Use menu → **Export Data**
2. Save JSON file
3. Repeat monthly
4. Store securely

## 🎯 Pro Tips

### Navigation
- **Swipe** menu away by clicking outside
- **Arrow keys** work in date navigator
- **Tab key** navigates between fields
- **Enter key** submits forms

### Efficiency
- Use **Quick Actions** for daily prayers
- Add common intentions to favorites (coming)
- Set realistic daily goal
- Review stats weekly

### Mobile
- **Install as app** for full-screen experience
- **Dark mode** saves battery on OLED screens
- **Portrait mode** works best
- **Swipe right** from edge (on some devices) opens menu

### Multiple Devices
- Login with same PIN
- Data syncs across devices
- Session works on each device
- Export data as backup

## ✅ Verification Checklist

Before regular use, verify:
- [ ] Can login with PIN
- [ ] Dashboard shows stats
- [ ] Menu opens and closes
- [ ] Quick actions toggle
- [ ] Can add intention
- [ ] Can navigate between views
- [ ] Prayers counters work
- [ ] Date navigator works
- [ ] Dark mode toggles
- [ ] Session persists after reload

## 🚨 Important Notes

### Security
- **PIN is client-side** (prevents casual access only)
- **Not cryptographically secure**
- **Don't store sensitive data**
- For real security → Use Firebase Auth

### Privacy
- **Data stored in Firebase**
- **No tracking or analytics**
- **Local storage** for session only
- **Export** your data anytime

### Support
- **Check README.md** for details
- **Check console** (F12) for errors
- **Try different browser** if issues
- **Keep backup** of your data

## 🎉 Enjoy!

You're all set! The app should now feel:
- **Cleaner** - Less clutter
- **Faster** - Better performance
- **Easier** - Intuitive navigation
- **Smoother** - Modern experience

Start your prayer journey with your improved tracker!

---

**Need Help?** 
- Check **README.md** for full docs
- See **COMPARISON.md** for what's new
- Read **MIGRATION.md** if upgrading

**Have Ideas?** 
The app is built to grow with your needs!
