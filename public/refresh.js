// This script forces a hard refresh of the site
// Using ES module format
// Add a timestamp to break cache
const timestamp = new Date().getTime();

// Check if this is a fresh load
if (!sessionStorage.getItem('pageLoadTimestamp') || 
    parseInt(sessionStorage.getItem('pageLoadTimestamp')) < timestamp - 300000) { // 5 minutes
  
  // Set timestamp
  sessionStorage.setItem('pageLoadTimestamp', timestamp);
  
  // Force reload without cache
  window.location.reload(true);
}
