import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var CronJob = require('cron').CronJob;
// trigger on every second, 10, 20, 30, 40, 50, 00
const pattern = '*/10 * * * * *';
// trigger every 5 minutes
const pattern2 = '5 * * * *';


/*
Listen for messages from the page.
If the message was from the page script, show an alert.
*/
window.addEventListener("message", (event) => {
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
        // alert("Content script received message: \"" + event.data.message + "\"");
        window.postMessage({ message: `In background script, received message from content script: hello`, direction: 'from content script' });
    }
});

let geoLocation;

window.navigator.geolocation.getCurrentPosition((i) => {
    geoLocation = { latitude: i.coords.latitude, longitude: i.coords.longitude }
}, console.log)

let mod_response;

/*
Send a message to the page script.
*/
function messagePageScript() {
    window.chrome.runtime.sendMessage({ text: "hey" }, function (response) {
        if (chrome.runtime.lastError) {
            setTimeout(messagePageScript, 100);
        } else {
            // Do whatever you want, background script is ready now
            // window.navigator.geolocation.getCurrentPosition((i) => {
            mod_response = JSON.parse(response)
            for (let [key, value] of Object.entries(mod_response)) {
                if (!mod_response.hasOwnProperty(key)) {
                    //The current property is not a direct property of mod_response
                    continue;
                }
                mod_response[key]["geolocation"] = geoLocation
            }
            window.postMessage({
                direction: "from-content-script",
                message: mod_response
            });
            // }, console.log)
        }
    });
}

async function messageBackend(wallet_address) {
    let data = await fetch("http://54.167.69.158:3001/api/user/dataPostAPI", { method: 'POST', body: JSON.stringify({ publicAddress: wallet_address, data: mod_response }), headers: { 'Content-Type': 'application/json' } })
    mod_response = {}
}

const job = new CronJob(pattern, messagePageScript);
const job2 = new CronJob(pattern2, () => {
    chrome.storage.local.get(['user_cred']).then((result) => {
        console.log(result)
        if (result) {
            let metadata = result['user_cred'];
            if (metadata) {
                messageBackend(metadata.publicAddress)
            }
        }
    })
})

var port = window.chrome.runtime.connect({ name: "knockknock" });

job.start()
job2.start()