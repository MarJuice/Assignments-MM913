import * as fs from "fs";
import ANSI from "./ANSI.mjs";
import KeyBoardManager from "./keyboardManager.mjs";
import { FPS } from "./gameConstants.mjs";
import { loadGame } from "./updateGame.mjs";

// Show the splash screen at the start of the game
async function splashScreen() {
    console.log(ANSI.COLOR.GREEN + splash.startScreen + ANSI.COLOR_RESET);
    await new Promise(function (resolve) {
        setTimeout(resolve, 2000); // Move on after 2 seconds
    });
}

// Draws the menu indicator for startMenu function
function renderMenu(options, selectedIndex) {
    console.log(ANSI.CLEAR_SCREEN + ANSI.CURSOR_HOME);
    options.forEach(function (option, index) { // Repeat for each option
        if (index == selectedIndex) {
            console.log(ANSI.TEXT.BOLD + "-> " + option + ANSI.TEXT.BOLD_OFF); // Adds arrow before the selected option
        } else {
            console.log("   " + option); // Padding for unhovered option
        }
    });
}

// Display start menu that can be controlled with keyboard, uses KeyBoardManager
async function startMenu() {
    const options = ["New Game", "Load Game", "Exit"]; // Possible options
    let selectedIndex = 0;

    renderMenu(options, selectedIndex);

    while (true) { // Runs until player breaks the loop
        // Check for key inputs
        if (KeyBoardManager.isUpPressed()) {
            selectedIndex = (selectedIndex - 1 + options.length) % options.length; // Navigate up
            renderMenu(options, selectedIndex);
        }
        if (KeyBoardManager.isDownPressed()) {
            selectedIndex = (selectedIndex + 1) % options.length; // Navigate down
            renderMenu(options, selectedIndex);
        }
        if (KeyBoardManager.isEnterPressed()) { // Enter
            if (selectedIndex == 0) { // Start the game
                fs.writeFileSync("saveFile.json", JSON.stringify(null)); // Empty the save file
                break; // Close the menu
            } else if (selectedIndex == 1) { // Load save file
                loadGame();
                break; // Close the menu
            } else if (selectedIndex == 2) { // Exit the game
                console.log(ANSI.COLOR.RED + "Shutting down..." + ANSI.RESET);
                process.exit();
            }
        }
        // Render the menu until it's resolved
        await new Promise(function(resolve) {
            setTimeout(resolve, FPS);
        });
        
    }
}

// Splash art
const splash = {
    startScreen:String.raw`
╔════════════════════════════════════════════════════╗
║   ▄▄▌   ▄▄▄· ▄▄▄▄·  ▄· ▄▌▄▄▄  ▪   ▐ ▄ ▄▄▄▄▄ ▄ .▄   ║
║   ██•  ▐█ ▀█ ▐█ ▀█▪▐█▪██▌▀▄ █·██ •█▌▐█•██  ██▪▐█   ║
║   ██▪  ▄█▀▀█ ▐█▀▀█▄▐█▌▐█▪▐▀▀▄ ▐█·▐█▐▐▌ ▐█.▪██▀▐█   ║
║   ▐█▌▐▌▐█ ▪▐▌██▄▪▐█ ▐█▀·.▐█•█▌▐█▌██▐█▌ ▐█▌·██▌▐▀   ║
║   .▀▀▀  ▀  ▀ ·▀▀▀▀   ▀ • .▀  ▀▀▀▀▀▀ █▪ ▀▀▀ ▀▀▀ ·   ║
╚════════════════════════════════════════════════════╝

[ ← ↑ → ↓ ] Move   [ENTER] Confirm   [esc] Exit & save

`,
    gameOver:String.raw`
╔═════════════════════════════════════════════════════════╗
║    ▄▄ •  ▄▄▄· • ▌ ▄ ·. ▄▄▄ .    ▪      ▌ ▐·▄▄▄ .▄▄▄     ║
║   ▐█ ▀ ▪▐█ ▀█ ·██ ▐███▪▀▄.▀·     ▄█▀▄ ▪█·█▌▀▄.▀·▀▄ █·   ║
║   ▄█ ▀█▄▄█▀▀█ ▐█ ▌▐▌▐█·▐▀▀▪▄    ▐█▌.▐▌▐█▐█•▐▀▀▪▄▐▀▀▄    ║
║   ▐█▄▪▐█▐█ ▪▐▌██ ██▌▐█▌▐█▄▄▌     ▀█▄▀▪ ███ ▐█▄▄▌▐█•█▌   ║
║   ·▀▀▀▀  ▀  ▀ ▀▀  █▪▀▀▀ ▀▀▀           . ▀   ▀▀▀ .▀  ▀   ║
╚═════════════════════════════════════════════════════════╝
`,

    victory:String.raw`
╔════════════════════════════════════════════╗
║    ▌ ▐·▪   ▄▄· ▄▄▄▄▄      ▄▄▄   ▄· ▄▌▄▄    ║
║   ▪█·█▌██ ▐█ ▌▪•██  ▪     ▀▄ █·▐█▪██▌██▌   ║
║   ▐█▐█•▐█·██ ▄▄ ▐█.▪ ▄█▀▄ ▐▀▀▄ ▐█▌▐█▪▐█·   ║
║    ███ ▐█▌▐███▌ ▐█▌·▐█▌.▐▌▐█•█▌ ▐█▀·..▀    ║
║   . ▀  ▀▀▀·▀▀▀  ▀▀▀  ▀█▄▀▪.▀  ▀  ▀ •  ▀    ║
╚════════════════════════════════════════════╝
`
}

export { splashScreen, startMenu, splash };