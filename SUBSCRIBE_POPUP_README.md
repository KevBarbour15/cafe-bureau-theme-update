# Subscribe Popup Timing Functionality

## Overview

The subscribe popup has been enhanced to include simple timing logic that follows the same pattern as the existing `cookie-consent.js`. Instead of showing immediately on every visit, the popup now only appears when:

1. It's the user's first visit, OR
2. 30+ days have passed since their last visit

## How It Works

### Simple Timing Logic

- **First-time visitors**: Always see the popup
- **Returning visitors**: Only see the popup if 30+ days have passed
- **Dismissed/Subscribed users**: Never see the popup again

### Data Storage

Uses localStorage (same as cookie-consent.js):
- `subscribeDismissed`: Whether user dismissed or subscribed
- `subscribeLastVisit`: Timestamp of last visit

## Code Structure

The implementation follows the exact same pattern as `cookie-consent.js`:

```javascript
// Same initialization pattern
connectedCallback() {
  let subscribeDismissed = localStorage.getItem('subscribeDismissed');
  let lastVisitTime = localStorage.getItem('subscribeLastVisit');
  
  if (subscribeDismissed !== null) {
    this.hideContainer();
    return;
  }
  
  // Add timing check
  if (lastVisitTime && !this.shouldShowPopup(lastVisitTime)) {
    this.hideContainer();
    return;
  }
  
  // Show popup and record visit
  this.recordVisit();
  this.showContainer();
}
```

## Key Differences from cookie-consent.js

1. **Timing Check**: Added `shouldShowPopup()` method
2. **Visit Recording**: Added `recordVisit()` method
3. **Same Storage**: Uses localStorage like cookie-consent.js
4. **Same Pattern**: Identical structure and flow

## Testing

### Console Utilities

Simple test functions available at `window.subscribeTest`:

```javascript
// Check current status
window.subscribeTest.checkStatus();

// Reset timing
window.subscribeTest.reset();

// Simulate time passing
window.subscribeTest.simulateTime(35);
```

### Manual Testing

1. **First visit**: Popup shows immediately
2. **Subsequent visits**: Popup hidden (within 30 days)
3. **After 30+ days**: Popup shows again
4. **After dismiss/subscribe**: Never shows again

## Why This Approach?

- **Consistency**: Same pattern as existing cookie-consent.js
- **Simplicity**: No complex configuration or methods
- **Maintainability**: Easy to understand and modify
- **Reliability**: Uses proven localStorage approach

## Files Modified

- `assets/subscribe.js` - Main functionality (simplified)
- `assets/subscribe-test.js` - Testing utilities (simplified)
- `SUBSCRIBE_POPUP_README.md` - This documentation

## Future Considerations

If you need more sophisticated timing:
- Add configuration options to the constructor
- Extend the timing logic in `shouldShowPopup()`
- Keep the same simple structure and pattern
