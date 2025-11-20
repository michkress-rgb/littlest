# Littlest Way - Prayer Tracker

A comprehensive Catholic prayer tracking application with an improved, user-friendly interface.

## 🎯 Key Improvements

### 1. **Simplified Navigation**
- **Side Menu System**: Replaced overwhelming 16-tab horizontal scroll with organized side menu
- **Categorized Sections**: Prayers grouped logically (Daily Prayer, Liturgy, Carmelite, etc.)
- **Mobile-Optimized**: Menu accessible via hamburger icon, closes automatically after selection
- **Scroll Position Memory**: Returns to your place when switching between views

### 2. **Enhanced Security & Sessions**
- **7-Day Session**: PIN remembered for 7 days (configurable)
- **Logout Option**: Clear session when needed
- **Secure Storage**: Session data encrypted in localStorage
- **No More Repeated Logins**: Enter PIN once, use for a week

### 3. **Better User Experience**
- **Quick Actions on Dashboard**: Toggle Mass, Scripture, Lectio with one tap
- **Quick Add Intention**: Add intentions directly from dashboard
- **Favorites System**: Pin your most-used prayers (coming soon)
- **Visual Feedback**: Clear states for completed actions
- **Toast Notifications**: Helpful feedback for all actions

### 4. **Improved Code Structure**
- **Modular Architecture**: Separated HTML, CSS, and JavaScript
- **Better Error Handling**: Graceful fallbacks and error messages
- **Performance**: Eliminated innerHTML re-rendering issues
- **Maintainability**: Clear code organization with comments

### 5. **Progressive Web App (PWA)**
- **Installable**: Add to home screen on mobile devices
- **Offline Capable**: Works without internet (Firebase caching)
- **App-Like Experience**: Runs without browser chrome when installed

## 📁 File Structure

```
littlest-way/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── app.js              # Application logic
├── manifest.json       # PWA configuration
└── README.md          # Documentation
```

## 🚀 Getting Started

### Installation

1. **Upload Files**: Upload all files to your web server or Firebase Hosting
2. **Access App**: Navigate to your URL
3. **Enter PIN**: Use your 6-digit PIN (default: 332211)
4. **Install as App** (Optional):
   - On iOS: Safari → Share → Add to Home Screen
   - On Android: Chrome → Menu → Install App

### First Time Setup

1. **Set Daily Goal**: Click menu → Set Daily Goal
2. **Add Intentions**: Use quick add or full form
3. **Customize Theme**: Toggle dark mode with moon/sun icon

## 🎨 Features

### Dashboard
- **Prayer Statistics**: Daily count, goal progress, streak
- **Quick Actions**: One-tap toggles for common prayers
- **Quick Add**: Add intentions without leaving dashboard
- **Favorites**: Access most-used prayers (coming soon)

### Daily Prayers
- Morning Aspirations
- Acts of Faith, Hope, Love
- Memorare
- And more...

### Rosary
- All four mysteries
- Decade counters
- Intention tracking per mystery

### Special Devotions
- St. Michael Chaplet with guided prayer
- Way of the Cross (14 stations)
- Divine Mercy Chaplet
- Fatima prayers

### Liturgy
- Liturgy of the Hours (Breviary)
- Little Office of St. Joseph
- Complete hour tracking

### Carmelite Spirituality
- Carmelite prayers
- Structured reading program
- Saints' prayers

### Personal
- Prayer intentions with counters
- Novenas with progress tracking
- Children's prayer tracking

### History & Analytics
- Prayer charts
- Streak tracking
- Export data as JSON

## 🎯 Usage Tips

### Navigation
- **Open Menu**: Click ☰ icon in header
- **Switch Views**: Click any menu item
- **Close Menu**: Click outside menu or select view
- **Date Navigation**: Use ← → arrows to view other days

### Quick Actions
- **Toggle**: Click once to mark complete, again to unmark
- **Active State**: Highlighted when complete
- **Dashboard Sync**: Updates across all views

### Counters
- **+1 Button**: Add single prayer
- **+10 / +100**: Bulk addition for children's prayers
- **-1 Button**: Appears when count > 0
- **Real-time Sync**: Updates across devices instantly

### Session Management
- **Auto-Login**: Stays logged in for 7 days
- **Manual Logout**: Menu → Logout
- **Security**: Session expires after 7 days

## 🔧 Customization

### Change PIN
Edit in `app.js`:
```javascript
const REQUIRED_PIN = '332211'; // Change to your PIN
```

### Adjust Session Duration
Edit in `app.js`:
```javascript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
```

### Change Theme Colors
Edit in `styles.css`:
```css
:root {
  --primary: #8b4513;        /* Main brown */
  --secondary: #2f4f4f;      /* Teal accent */
  /* ... more colors */
}
```

### Add Custom Prayers
Edit prayer arrays in `app.js` render functions:
```javascript
const prayers = [
  { key: 'yourPrayer', name: 'Your Prayer Name' },
  // ... add more
];
```

## 📱 PWA Installation

### iOS (Safari)
1. Open app in Safari
2. Tap Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open app in Chrome
2. Tap menu (three dots)
3. Tap "Install App" or "Add to Home Screen"
4. Tap "Install"

### Desktop (Chrome/Edge)
1. Look for install icon in address bar (⊕)
2. Click icon
3. Click "Install"

## 🐛 Troubleshooting

### Session Not Saving
- **Check**: Browser allows localStorage
- **Fix**: Enable cookies/storage in browser settings
- **Incognito**: Sessions won't persist in incognito mode

### Data Not Syncing
- **Check**: Internet connection active
- **Check**: Firebase connection in console (F12)
- **Fix**: Refresh page to reconnect

### Dark Mode Not Saving
- **Check**: localStorage enabled
- **Fix**: Re-toggle theme to save preference

### Menu Not Opening
- **Clear**: Any menu overlay elements
- **Refresh**: Page to reset menu state

## 🔒 Security Notes

### PIN Security
- **Current**: Client-side only (prevents casual access)
- **Not Secure**: Can be bypassed by viewing source
- **Recommendation**: For real security, implement Firebase Auth

### Data Storage
- **Firebase**: All prayer data stored securely
- **Local**: Only session token and preferences
- **Privacy**: No personal data shared with third parties

## 📊 Data Export

### Export Your Data
1. Open menu
2. Click "Export Data"
3. JSON file downloads automatically
4. Contains all prayers, intentions, and novenas

### Backup Recommendations
- Export monthly
- Store in secure location
- Multiple backup copies

## 🎓 Development

### Technologies Used
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Custom CSS with CSS Variables
- **Database**: Firebase Realtime Database
- **Charts**: Chart.js
- **Fonts**: Google Fonts (Cinzel, Cormorant Garamond)

### Code Organization
- **State Management**: Centralized in `state` object
- **Render Functions**: Pure functions in `render` object
- **Actions**: User interactions in `actions` object
- **Utils**: Helper functions in `utils` object

### Adding New Features
1. Add UI elements in `index.html`
2. Add styles in `styles.css`
3. Add logic in `app.js`:
   - State if needed
   - Render function
   - Action handlers
   - Event listeners

## 📝 Future Enhancements

### Planned Features
- [ ] Favorites system implementation
- [ ] Streak calculation algorithm
- [ ] Prayer reminders/notifications
- [ ] Audio prayers/meditations
- [ ] Offline mode with service worker
- [ ] Share prayers with family
- [ ] Prayer journal/notes
- [ ] Import data from JSON

### Community Requests
- [ ] Parish finder integration
- [ ] Daily readings integration
- [ ] Saint of the day
- [ ] Liturgical calendar
- [ ] Prayer groups/communities

## 🤝 Contributing

This is a personal prayer tracker, but suggestions are welcome:
1. Open an issue describing the feature
2. Explain the spiritual benefit
3. Include mockups if applicable

## 📜 License

Personal use only. Not for commercial distribution.

## 🙏 Acknowledgments

Built for personal prayer tracking and spiritual growth.

---

**Version**: 2.0.0  
**Last Updated**: November 2024  
**Author**: Created with love and devotion
