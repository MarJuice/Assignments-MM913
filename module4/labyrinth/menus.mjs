import KeyBoardManager from "./keyboardManager.mjs";
import ANSI from "./ANSI.mjs";
import { FPS } from "./gameConstants.mjs";
import { loadGame } from "./updateGame.mjs";
import * as fs from "fs";

// Show the splash screen at the start of the game
async function splashScreen() {
    console.log(ANSI.COLOR.GREEN + splash.startScreen + ANSI.COLOR_RESET);
    await new Promise(function (resolve) {
        setTimeout(resolve, 2000);
    });
}

// Draws the menu indicator and boldens the hovered option
function renderMenu(options, selectedIndex) {
    console.log(ANSI.CLEAR_SCREEN + ANSI.CURSOR_HOME);
    options.forEach(function (option, index) {
        if (index == selectedIndex) {
            console.log(ANSI.TEXT.BOLD + "-> " + option + ANSI.TEXT.BOLD_OFF);
        } else {
            console.log("   " + option);
        }
    });
}

// Display start menu that can be controlled with keyboard, uses KeyBoardManager
async function startMenu() {
    const options = ["New Game", "Load Game", "Exit"];
    let selectedIndex = 0;

    renderMenu(options, selectedIndex);

    while (true) { 
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
                fs.writeFileSync("saveFile.json", JSON.stringify(null));
                break;
            } else if (selectedIndex == 1) { // Load save file
                loadGame();
                break;
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

}

export { splashScreen, startMenu, splash };