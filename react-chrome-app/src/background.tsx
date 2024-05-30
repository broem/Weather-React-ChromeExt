export { };

console.log('Background script running!');

let port: chrome.runtime.Port | null;

chrome.runtime.onConnect.addListener((newPort) => {
  console.log('Connected to content script');

  // Disconnect the previous port object, if it exists
  if (port) {
    port.disconnect();
  }

  port = newPort;

  // Add an error listener to the port
  port.onDisconnect.addListener(() => {
    console.log('Disconnected from content script');
    port = null;
  });

  // Listen for messages from the content script
  port.onMessage.addListener((message) => {
    console.log('Received message from content script:', message);
  });

  // Send a message to the content script
  port.postMessage({ type: 'backgroundScriptMessage', data: 'Hello from background script!' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.popupStart) {
    console.log(request.popupStart); // "Hello from popup(index) script!"
  }

  if (request.type === 'colorList' && port) {
    port.postMessage({ type: 'colorList', data: [request.data] });
  }

  if (request.type === 'toggleSnow' && port) {
    port.postMessage({ type: 'toggleSnow' })
  }
});