let accessToken;

function googleLoginCallback(response) {
  accessToken = response.credential;
  setButtonStyleSignin();
  callSheetAPI();
}

// TODO(developer): Set to client ID and API key from the Developer Console
const API_KEY = "AIzaSyDRSq8gasjbzvoSe8hG9bX3UQez_a-pf1k";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

document.getElementById("signout_button").style.visibility = "hidden";

function setButtonStyleSignin() {
  document.getElementById("signout_button").style.visibility = "visible";
  document.getElementById("authorize_button").innerText = "Refresh";
}

function setButtonStyleSignout() {
  document.getElementById("authorize_button").innerText = "Authorize";
  document.getElementById("signout_button").style.visibility = "hidden";
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  google.accounts.id.prompt();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  if (accessToken !== null) {
    google.accounts.id.revoke(accessToken);
    accessToken = null;
    setButtonStyleSignout();
    document.getElementById("content").innerText = "";
  }
}

async function callSheetAPI() {
  await listMajors();
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById("content").innerText = "No values found.";
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
    (str, row) => `${str}${row[0]}, ${row[4]}\n`,
    "Name, Major:\n"
  );
  document.getElementById("content").innerText = output;
}
