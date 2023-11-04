import axios from 'axios';
import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

var CronJob = require('cron').CronJob;
// trigger on every 10th second, 10, 20, 30, 40, 50, 00
const pattern = '*/10 * * * * *';
// trigger every 60 minutes
const pattern2 = '0 * * * *';
const pattern6Hours = '0 */6 * * *';

// 50 seconds
const pattern3 = '*/50 * * * * *';

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

function messagePageScript() {
  window.chrome.runtime.sendMessage({ text: 'hey' }, function (response) {
    if (chrome.runtime.lastError) {
      setTimeout(messagePageScript, 100);
    } else {
      // Parse the response from the background script
      const mod_response = JSON.parse(response);
      window.postMessage({
        direction: 'from-content-script',
        message: mod_response,
      });
      // Get the entryArray from localStorage
      let entryArray = JSON.parse(localStorage.getItem('entryArray')) || [];

      // Loop through the data from mod_response
      for (let [key, value] of Object.entries(mod_response)) {
        if (!mod_response.hasOwnProperty(key)) {
          //The current property is not a direct property of mod_response
          continue;
        }

        // Add the geolocation
        mod_response[key]['geolocation'] = geoLocation;

        // Filter based on 'time_on_site' and create an entryObject
        if (mod_response[key]['time_on_site'] === 0) {
          delete mod_response[key];
        } else {
          const entryObject = {
            urlLink: key,
            properties: mod_response[key],
          };

          // Check if urlLink already exists in entryArray
          const existingEntry = entryArray.find(
            (entry) => entry.urlLink === key
          );

          if (existingEntry) {
            // Compare timestamps and push only if the difference is at least 60 minutes (in milliseconds)
            const timestampDifference =
              entryObject.properties.timeStamp -
              existingEntry.properties.timeStamp;
            if (timestampDifference >= 2 * 60 * 60 * 1000) {
              entryArray.push(entryObject);
              console.log('Added entryObject to entryArray:', entryObject);
            } else {
              console.log(
                'Skipped entryObject due to timestamp difference:',
                entryObject
              );
            }
          } else {
            entryArray.push(entryObject);
            console.log('Added entryObject to entryArray:', entryObject);
          }
        }
      }

      // Store the updated entryArray in localStorage
      localStorage.setItem('entryArray', JSON.stringify(entryArray));
      console.log('Stored data in local storage:', JSON.parse(entryArray));

      // Send a message to the page's window
    }
  });
}
// Get the user's public address from local storage
const address = window.localStorage.getItem('userPublicAddress');

// Send the address to the background script
chrome.runtime.sendMessage({ userPublicAddress: address });

async function messageBackend() {
  console.log('Entered message backend');
  let address = window.localStorage.getItem('userPublicAddress');
  console.log('Testing address', address);
  chrome.runtime.sendMessage({ userPublicAddress: address });

  let tabData = JSON.parse(localStorage.getItem('entryArray'));
  if (Array.isArray(tabData)) {
    console.log('Tab data is array', tabData);
  } else {
    console.log('Tab Data is NOT ARRAY');
  }
  await axios
    .post(`http://localhost:8080/user/api/user-data/${address}`, {
      tabData,
    })
    .then((response) => {
      console.log('Successfull SENT DATA', response);
    })
    .catch((error) => console.log('error SENT DATA', error));
  localStorage.removeItem('entryArray');
  console.log('Removed entry array');

  // for (let data of tabData) {
  //   console.log(data);
  //   try {
  //     // Destructure data
  //     let { url, date, timestamp } = data;

  //     // Make API call
  //     let response = await fetch('https://dframe-user-alpha.vercel.app/api/users/userdata', {
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

  // Clear localStorage if all responses succeeded
  // if (responses.every((r) => r.ok)) {
  //   chrome.storage.local.remove('tabData');
  //   // localStorage.removeItem('tabData');
  // }
}

const job = new CronJob(pattern, messagePageScript);

const job2 = new CronJob(pattern6Hours, () => {
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
  messageBackend();
});

var port = window.chrome.runtime.connect({ name: 'knockknock' });

// if (true) {
//   console.log('RUNNING CRON JOB');
//   job.start();
//   job2.start();
// }

// Define a function to start or stop cron jobs based on the toggle value
function startOrStopCronJobs(newValue) {
  if (newValue) {
    console.log('RUNNING CRON JOB');
    job.start();
    job2.start();
  } else {
    console.log('Your is OFF');
  }
}

// Use chrome.storage.onChanged to listen for changes in the 'toggle' value
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.toggle) {
    const newValue = changes.toggle.newValue;
    startOrStopCronJobs(newValue);
  }
});

// Initial check of the 'toggle' value
chrome.storage.sync.get(['toggle'], (result) => {
  if (result.toggle) {
    startOrStopCronJobs(result.toggle);
  } else {
    console.log('Your is OFF');
  }
});
