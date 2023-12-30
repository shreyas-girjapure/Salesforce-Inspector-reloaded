/* eslint-disable keyword-spacing */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable space-infix-ops */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
import { sfConn, apiVersion } from "./inspector.js";

// Initializers and Constants
let isDarkMode = false;

//Session managers
let args = new URLSearchParams(location.search.slice(1));
let sfHost = args.get("host");


// domNodes
let analyzeButton = document.getElementById("analyze");
const darkModeButton = document.getElementById('darkModeToggle');
const flowSelect = document.getElementById('flowSelect');

// Listeners 
analyzeButton.addEventListener('click', () => {
    initiateLoad();
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

async function initiateLoad() {
    await sfConn.getSession(sfHost);
    let listOfFlowData = await getAllFlows();
    if (listOfFlowData) {
        addFlowOptionItems(listOfFlowData);
    }
}

async function getAllFlows() {
    let listOfFlow = await sfConn.rest("/services/data/v" + apiVersion + "/tooling/query/?q=" + encodeURIComponent("select id, DeveloperName  , ActiveVersion.MasterLabel,ActiveVersion.VersionNumber from FlowDefinition order by LastModifiedDate desc"));
    return listOfFlow;
}

function addFlowOptionItems(listOfFlowDefinitionData) {
    const selectElement = document.getElementById('flowSelect');
    const records = listOfFlowDefinitionData.records;

    // Clear existing options
    selectElement.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Flow';
    defaultOption.value = '';
    selectElement.appendChild(defaultOption);

    // Add options for each flow in the records
    records.forEach((record, index) => {
        const option = document.createElement('option');
        option.value = record.DeveloperName;
        option.text = record.DeveloperName; // Assuming DeveloperName is the desired field for the option text
        selectElement.appendChild(option);
    });
}
