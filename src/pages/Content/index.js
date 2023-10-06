import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var CronJob = require('cron').CronJob;
// trigger on every 10th second, 10, 20, 30, 40, 50, 00
const pattern = '*/10 * * * * *';
// trigger every 60 minutes
const pattern2 = '0 * * * *';

// 2 mins
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
      console.log('Checking response', response);
      mod_response = JSON.parse(response);
      console.log('Checking the mod_response', mod_response);
      // Create an array to store all entries
      let entryArray = [];
      for (let [key, value] of Object.entries(mod_response)) {
        if (!mod_response.hasOwnProperty(key)) {
          //The current property is not a direct property of mod_response
          continue;
        }
        mod_response[key]['geolocation'] = geoLocation;
        if (mod_response[key]['time_on_site'] == 0) {
          delete mod_response[key];
        }
        // Create an object to store both URL and properties
        const entryObject = {
          urlLink: key, // Store the current mod_response[key] as urlLink
          properties: mod_response[key], // Store the properties
        };

        // Push the entryObject into the entryArray
        entryArray.push(entryObject);
      }
      console.log(entryArray);
      window.postMessage({
        direction: 'from-content-script',
        message: mod_response,
      });
      // }, console.log)
    }
  });
}

// async function messageBackend(wallet_address) {
//   const currentDate = new Date().toLocaleDateString('en-GB');
//   const timestamp = new Date().toLocaleTimeString('en-GB');
//   console.log(currentDate, timestamp);
//   let data = await fetch('http://localhost:3000/api/users/userdata', {
//     method: 'POST',
//     body: JSON.stringify({
//       publicAddress: wallet_address,
//       data: {
//         dataDate: currentDate,
//         urlData: {
//           urlLink: 'dframe.org',
//           timestamps: [timestamp],
//           tags: ['defi', 'crypto'],
//         },
//       },
//     }),
//     headers: { 'Content-Type': 'application/json' },
//   });
//   mod_response = {};
// }

// async function messageBackend(walletAddress) {
//   // Get tab data from localStorage
//   let tabData = JSON.parse(localStorage.getItem('tabData'));

//   // Loop through each tab data item
//   console.log(tabdata);
//   for (let data of tabData) {
//     // Destructure values
//     let { url, date, timestamp } = data;

//     // Make API call
//     let response = await fetch('http://localhost:3000/api/users/userdata', {
//       method: 'POST',
//       body: JSON.stringify({
//         publicAddress: walletAddress,
//         data: {
//           dataDate: date,
//           urlData: {
//             urlLink: url,
//             timestamps: [timestamp],
//             tags: ['defi', 'crypto'],
//           },
//         },
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }

//   // Clear localStorage
//   localStorage.removeItem('tabData');
// }

// Send tab data to API
async function messageBackend(walletAddress) {
  // Get tab data
  let tabData = JSON.parse(localStorage.getItem('tabData')) || [];
  // let tabData = chrome.storage.local.get('tabData') || [];
  console.log('Testing for local storage');
  // let tabData = await chrome.cookies.get({
  //   url: 'http://localhost:3001',
  //   name: 'tabData',
  // });

  console.log(tabData);

  let responses = [];

  // for (let data of tabData) {
  //   console.log(data);
  //   try {
  //     // Destructure data
  //     let { url, date, timestamp } = data;

  //     // Make API call
  //     let response = await fetch('http://localhost:3000/api/users/userdata', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         publicAddress: walletAddress,
  //         data: {
  //           dataDate: date,
  //           urlData: {
  //             urlLink: url,
  //             timestamps: [timestamp],
  //             tags: ['defi', 'crypto'],
  //           },
  //         },
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     // Log response
  //     console.log(response);

  //     responses.push(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  let currentDate = new Date().toLocaleDateString('en-GB');

  // Get the timestamp in 'en-GB' format
  let timestamp = new Date().toLocaleTimeString('en-GB');

  let response = await fetch('http://localhost:3000/api/users/userdata', {
    method: 'POST',
    body: JSON.stringify({
      publicAddress: walletAddress,
      data: {
        dataDate: currentDate,
        urlData: {
          urlLink: 'dframe.org',
          timestamps: [timestamp],
          tags: ['defi', 'crypto'],
        },
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Clear localStorage if all responses succeeded
  // if (responses.every((r) => r.ok)) {
  //   chrome.storage.local.remove('tabData');
  //   // localStorage.removeItem('tabData');
  // }
}

const job = new CronJob(pattern, messagePageScript);
const job2 = new CronJob(pattern, () => {
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
  console.log('Testing for local storage');
  messageBackend('0x659664dd23937edee4f19391A5C355FdbD4c93e6');
});

var port = window.chrome.runtime.connect({ name: 'knockknock' });

job.start();
job2.start();
