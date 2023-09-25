import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var CronJob = require('cron').CronJob;
// trigger on every 10th second, 10, 20, 30, 40, 50, 00
const pattern = '*/10 * * * * *';
// trigger every 60 minutes
const pattern2 = '0 * * * *';
const pattern3 = '*/2 * * * *';

/*
Listen for messages from the page.
If the message was from the page script, show an alert.
*/
window.addEventListener('message', (event) => {
  if (
    event.source == window &&
    event.data &&
    event.data.direction == 'from-page-script'
  ) {
    // alert("Content script received message: \"" + event.data.message + "\"");
    window.postMessage({
      message: `In background script, received message from content script: hello`,
      direction: 'from content script',
    });
  }
});

let geoLocation;

window.navigator.geolocation.getCurrentPosition((i) => {
  geoLocation = { latitude: i.coords.latitude, longitude: i.coords.longitude };
}, console.log);

let mod_response;

/*
Send a message to the page script.
*/
function messagePageScript() {
  window.chrome.runtime.sendMessage({ text: 'hey' }, function (response) {
    if (chrome.runtime.lastError) {
      setTimeout(messagePageScript, 100);
    } else {
      // Do whatever you want, background script is ready now
      // window.navigator.geolocation.getCurrentPosition((i) => {
      mod_response = JSON.parse(response);
      for (let [key, value] of Object.entries(mod_response)) {
        if (!mod_response.hasOwnProperty(key)) {
          //The current property is not a direct property of mod_response
          continue;
        }
        mod_response[key]['geolocation'] = geoLocation;
        if (mod_response[key]['time_on_site'] == 0) {
          delete mod_response[key];
        }
      }
      window.postMessage({
        direction: 'from-content-script',
        message: mod_response,
      });
      // }, console.log)
    }
  });
}

async function messageBackend(wallet_address) {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const timestamp = new Date().toLocaleTimeString('en-GB');
  console.log(currentDate, timestamp);
  let data = await fetch('http://localhost:3000/api/users/userdata', {
    method: 'POST',
    body: JSON.stringify({
      publicAddress: wallet_address,
      data: {
        dataDate: currentDate,
        urlData: {
          urlLink: 'dframe.org',
          timestamps: [timestamp],
          tags: ['defi', 'crypto'],
        },
      },
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  mod_response = {};
}

const job = new CronJob(pattern, messagePageScript);
const job2 = new CronJob(pattern3, () => {
  // console.log('Job2 called');
  // chrome.storage.local.get(['user_cred']).then((result) => {
  //   console.log(result);
  //   if (result) {
  //     let metadata = result['user_cred'];
  //     if (metadata) {
  //       messageBackend(metadata.publicAddress);
  //     }
  //   }
  // });
  messageBackend('0x659664dd23937edee4f19391A5C355FdbD4c93e6');
});

var port = window.chrome.runtime.connect({ name: 'knockknock' });

job.start();
job2.start();
