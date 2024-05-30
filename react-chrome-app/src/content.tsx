export { };
// Define the interface for a snowflake
interface Snowflake {
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
    color: string;
}
let animationFrameId: number;
// Create a new <canvas> element and set its attributes
const canvas = document.createElement('canvas');
canvas.id = 'snow-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';

// Get the dimensions of the window
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// Set the dimensions of the <canvas> element to match the window dimensions
canvas.width = windowWidth;
canvas.height = windowHeight;

// Create a 2D rendering context for the <canvas> element
const context = canvas.getContext('2d');

// Define the properties of the snowflakes
const numFlakes = 100;
const flakes: Snowflake[] = [];

const colors = ['#ffffff', '#cccccc', '#dddddd', '#eeeeee', '#f2f2f2'];

for (let i = 0; i < numFlakes; i++) {
    flakes.push({
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5,
        angle: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

// Define a function to draw the snowflakes on the <canvas> element
function drawSnowflakes() {
    // Clear the canvas
    context!.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each snowflake on the canvas
    flakes.forEach((flake) => {
        const radians = (flake.angle * Math.PI) / 180;
        const x = flake.x + Math.cos(radians) * flake.speed;
        const y = flake.y + Math.sin(radians) * flake.speed;

        if (x > windowWidth) {
            flake.x = 0;
        } else if (x < 0) {
            flake.x = windowWidth;
        } else {
            flake.x = x;
        }

        if (y > windowHeight) {
            flake.y = 0;
        } else {
            flake.y = y;
        }

        context!.beginPath();
        context!.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        context!.fillStyle = flake.color;
        context!.fill();
    });

    // Move the snowflakes for the next frame
    animationFrameId = requestAnimationFrame(drawSnowflakes);
}

// Define a function to toggle the snow and canvas
let snowRunning = false;
function toggleSnow() {
    if (snowRunning) {
        // Stop the snow
        cancelAnimationFrame(animationFrameId);
        // Remove the canvas
        document.body.removeChild(canvas);
        // Set the flag to false
        snowRunning = false;
    } else {
        // Start the snow
        drawSnowflakes();
        // Add the canvas
        document.body.appendChild(canvas);
        // Set the flag to true
        snowRunning = true;
    }
}
// Define a function to scrape all HTML on the page
function scrapeHTML(): string {
    return document.documentElement.outerHTML;
}
if (chrome.runtime && chrome.runtime.connect) {
    const port = chrome.runtime.connect();
    port.postMessage({ type: 'contentScriptMessage', data: scrapeHTML() });

    port.onMessage.addListener((message) => {
        console.log('Received message from background script:', message);
        if (message.type === 'colorList') {
            console.log('recieved colorList');
            colors.length = 0;
            colors.push(...message.data);
            flakes.forEach((flake) => {
                flake.color = colors[Math.floor(Math.random() * colors.length)];
            });
        }

        if (message.type === 'toggleSnow') {
            toggleSnow();
        }
    });
    // Add an error listener to the port
    port.onDisconnect.addListener(() => {
        console.log('Disconnected from background script');
    });

    // Add an unload listener to the content script's window object
    window.addEventListener('unload', () => {
        port.disconnect();
    });

} else {
    console.log('Chrome runtime is not available.');
}

