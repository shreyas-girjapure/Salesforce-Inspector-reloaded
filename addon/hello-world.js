/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable space-infix-ops */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
import { sfConn, apiVersion } from "./inspector.js";

// Initializers and Constants
let isDarkMode = false;

// domNodes
let analyzeButton = document.getElementById("analyze");
const darkModeButton = document.getElementById('darkModeToggle');
const flowSelect = document.getElementById('flowSelect');

// Listeners 
analyzeButton.addEventListener('click', () => {
    seeWhatIsSession();
});

flowSelect.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);
});

darkModeButton?.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('bg-dark', 'text-light');
    } else {
        document.body.classList.remove('bg-dark', 'text-light');
    }
});
// Functions
async function seeWhatIsSession() {
    let args = new URLSearchParams(location.search.slice(1));
    let sfHost = args.get("host");
    await sfConn.getSession(sfHost);
    let limitsPromise = await sfConn.rest("/services/data/v" + apiVersion + "/" + "limits");
    console.log(limitsPromise);
}



