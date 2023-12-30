/* eslint-disable space-in-parens */
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
const flowAnalyzerApiPath = "https://flow-incoming-edge-analyzer.onrender.com/analyze";
const flowDefinitionQuery = "select id, DeveloperName  , ActiveVersionId from FlowDefinition where ActiveVersion.ProcessType in ('Flow','AutoLaunchedFlow') order by LastModifiedDate desc";
const flowMetadataDetailsQuery = "select id, FullName , Metadata from Flow where id = ";

let currentSelectedFlow = '';

//Session managers
let args = new URLSearchParams(location.search.slice(1));
let sfHost = args.get("host");


// domNodes
let analyzeButton = document.getElementById("analyze");
const darkModeButton = document.getElementById('darkModeToggle');
const flowSelect = document.getElementById('flowSelect');
const resultContainer = document.getElementById('result-container');
const spinner = document.querySelector('#analyze .spinner-border');
// Listeners 

// DOM Connected callback
document.addEventListener('DOMContentLoaded', () => {
    initiateLoad();
})

analyzeButton.addEventListener('click', async () => {
    if (!currentSelectedFlow) {
        alert('Please Select Flow For Analysis')
        return;
    }

    toggleSpinner(spinner, true);
    try {
        let flowMetadataDetails = await getSelectedFlowMetadataDetails(currentSelectedFlow);

        let flowMetadata = flowMetadataDetails?.records[0]?.Metadata;
        if (flowMetadata) {
            let analysisResult = await sendFlowMetadataForAnalysis(flowMetadata);
            if (analysisResult) {
                displayFlowAnalyzedData(analysisResult);
            }
            console.log(analysisResult);
        }
    } catch (error) {
        console.error('Error occurred during analysis:', error);
    } finally {
        toggleSpinner(spinner, false);
    }

});

flowSelect.addEventListener('change', (e) => {
    currentSelectedFlow = e.target.value;
    resetValuesOnSelect();
    console.log(currentSelectedFlow);
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
    let listOfFlow = await sfConn.rest("/services/data/v" + apiVersion + "/tooling/query/?q=" + encodeURIComponent(flowDefinitionQuery));
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
        option.value = record.ActiveVersionId;
        option.text = record.DeveloperName; // Assuming DeveloperName is the desired field for the option text
        selectElement.appendChild(option);
    });
}

async function getSelectedFlowMetadataDetails(flowId) {
    let flowMetadataDetails = await sfConn.rest("/services/data/v" + apiVersion + "/tooling/query/?q=" + encodeURIComponent(flowMetadataDetailsQuery + `'${flowId}'`));

    return flowMetadataDetails;
}

async function sendFlowMetadataForAnalysis(flowMetadata) {

    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(flowMetadata),
        redirect: 'follow'
    };

    try {
        const response = await fetch(flowAnalyzerApiPath, requestOptions);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function displayFlowAnalyzedData(flowAnalysisResult) {

    resultContainer.classList.add('mt-3');

    const heading = document.createElement('h4');
    heading.textContent = 'Elements Without Incoming Edge:';

    const ul = document.createElement('ul');

    if (flowAnalysisResult?.result?.length === 0) {
        const li = document.createElement('li');
        li.textContent = "All Flow Elements Are Properly Mapped 🥳";
        ul.appendChild(li);
    }

    flowAnalysisResult?.result.forEach(item => {
        for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
                const li = document.createElement('li');
                li.textContent = key;
                ul.appendChild(li);
            }
        }
    });

    resultContainer.appendChild(heading);
    resultContainer.appendChild(ul);
}

function resetValuesOnSelect() {
    resultContainer.innerHTML = '';
}

function toggleSpinner(spinner, show) {
    spinner.style.display = show ? 'inline-block' : 'none'; // Show/hide spinner
}