// Test file for subscribe popup timing functionality
// This file demonstrates how to use the simplified timing features

console.log('Subscribe popup test utilities loaded');

// Example: Check current popup status
function checkPopupStatus() {
  const dismissed = localStorage.getItem('subscribeDismissed');
  const lastVisit = localStorage.getItem('subscribeLastVisit');
  
  console.log('=== Popup Status ===');
  console.log('Dismissed:', dismissed);
  console.log('Last visit:', lastVisit ? new Date(parseInt(lastVisit)).toLocaleDateString() : 'Never');
  
  if (lastVisit) {
    const daysDiff = (new Date().getTime() - parseInt(lastVisit)) / (1000 * 3600 * 24);
    console.log('Days since last visit:', daysDiff.toFixed(1));
    console.log('Should show popup:', !dismissed && daysDiff >= 30);
  } else {
    console.log('Should show popup:', !dismissed);
  }
  console.log('===================');
}

// Example: Reset popup timing (useful for testing)
function resetPopup() {
  try {
    localStorage.removeItem('subscribeLastVisit');
    localStorage.removeItem('subscribeDismissed');
    console.log('Popup timing reset successfully');
    checkPopupStatus();
  } catch (error) {
    console.log('Failed to reset popup timing:', error);
  }
}

// Example: Simulate time passing (for testing)
function simulateTimePassing(days) {
  try {
    const lastVisit = localStorage.getItem('subscribeLastVisit');
    if (lastVisit) {
      const lastVisitTime = parseInt(lastVisit);
      const newTime = lastVisitTime - (days * 24 * 60 * 60 * 1000); // Subtract days in milliseconds
      localStorage.setItem('subscribeLastVisit', newTime.toString());
      console.log(`Simulated ${days} days passing`);
      checkPopupStatus();
    } else {
      console.log('No last visit time found');
    }
  } catch (error) {
    console.error('Error simulating time passing:', error);
  }
}

// Make functions available globally for testing
window.subscribeTest = {
  checkStatus: checkPopupStatus,
  reset: resetPopup,
  simulateTime: simulateTimePassing
};

console.log('Test functions available at window.subscribeTest');
console.log('Usage examples:');
console.log('- window.subscribeTest.checkStatus() - Check current popup status');
console.log('- window.subscribeTest.reset() - Reset popup timing');
console.log('- window.subscribeTest.simulateTime(35) - Simulate 35 days passing'); 
