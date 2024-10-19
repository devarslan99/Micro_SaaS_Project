const axios = require('axios');
let PQueue; // Declare PQueue for later assignment

(async () => {
  const { default: ImportedPQueue } = await import('p-queue'); // Dynamically import PQueue
  PQueue = ImportedPQueue; // Assign the correct constructor

  // Create a request queue with concurrency of 1 (process requests one by one)
  const queue = new PQueue({ concurrency: 1 });

  // Max API requests allowed per minute
  const API_LIMIT = 55;
  const API_WINDOW_MS = 60000; // 1 minute

  // Helper function to check and update the request count
  let requestCount = 0;
  let firstRequestTime = null;

  const incrementRequestCount = () => {
    const now = Date.now();

    // Reset the counter if the time window has expired
    if (!firstRequestTime || now - firstRequestTime > API_WINDOW_MS) {
      requestCount = 0;
      firstRequestTime = now;
    }

    requestCount++;
    return requestCount;
  };

  // Centralized function to make Smartlead API calls with rate limiting
  const makeSmartleadApiRequest = async (url, options = {}) => {
    return queue.add(async () => { // Use the queue to ensure sequential processing
      const count = incrementRequestCount();

      // If the limit is exceeded, wait for the window to reset
      if (count > API_LIMIT) {
        const waitTime = API_WINDOW_MS - (Date.now() - firstRequestTime);
        console.log('Rate limit reached. Waiting for reset...');
        await new Promise(resolve => setTimeout(resolve, waitTime));
        requestCount = 1; // Reset count and set the first request time to now
        firstRequestTime = Date.now();
      }

      try {
        // Make the actual API call
        const response = await axios.get(url, options);
        console.log(`API call successful: ${url}`);
        return response.data;
      } catch (err) {
        console.error(`API call failed: ${url}`, err.message);
        throw new Error('Smartlead API request failed');
      }
    });
  };

  // Export the function after the queue is initialized
  module.exports = { makeSmartleadApiRequest };
})();
