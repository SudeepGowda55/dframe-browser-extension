// const { Magic } = require('magic-sdk');
// const secrets = require('../../secrets/secrets.development')
// const magic = new Magic(secrets.default.magic_key)

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
// function buildTypedUrlList(wallet_address) {
//   // To look for history items visited in the last week,
//   // subtract a week of microseconds from the current time.
//   console.log('reached here');
//   var microsecondsPerHour = 1000 * 60;
//   var oneHourAgo = new Date().getTime() - microsecondsPerHour;

//   // Track the number of callbacks from chrome.history.getVisits()
//   // that we expect to get.  When it reaches zero, we have all results.
//   var numRequestsOutstanding = 0;

//   chrome.history.search(
//     {
//       text: '', // Return every history item....
//       startTime: oneHourAgo, // that was accessed less than one week ago.
//     },
//     function (historyItems) {
//       // For each history item, get details on all visits.
//       for (var i = 0; i < historyItems.length; ++i) {
//         var url = historyItems[i].url;
//         var processVisitsWithUrl = function (url) {
//           // We need the url of the visited item to process the visit.
//           // Use a closure to bind the  url into the callback's args.
//           return function (visitItems) {
//             processVisits(url, visitItems);
//           };
//         };
//         chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
//         numRequestsOutstanding++;
//       }
//       if (!numRequestsOutstanding) {
//         onAllVisitsProcessed();
//       }
//     }
//   );

//   // Maps URLs to a count of the number of times the user typed that URL into
//   // the omnibox.
//   var urlToCount = {};

//   // Callback for chrome.history.getVisits().  Counts the number of
//   // times a user visited a URL by typing the address.
//   var processVisits = function (url, visitItems) {
//     for (var i = 0, ie = visitItems.length; i < ie; ++i) {
//       // Ignore items unless the user typed the URL.
//       // if (visitItems[i].transition != 'typed') {
//       //     continue;
//       // }

//       if (!urlToCount[url]) {
//         urlToCount[url] = 0;
//       }

//       urlToCount[url]++;
//     }

//     // If this is the final outstanding call to processVisits(),
//     // then we have the final results.  Use them to build the list
//     // of URLs to show in the popup.
//     if (!--numRequestsOutstanding) {
//       onAllVisitsProcessed();
//     }
//   };

//   // This function is called when we have the final list of URls to display.
//   var onAllVisitsProcessed = async function () {
//     // Get the top scorring urls.
//     let urlArray = [];
//     for (var url in urlToCount) {
//       urlArray.push(url);
//     }

//     // Sort the URLs by the number of times the user typed them.
//     urlArray.sort(function (a, b) {
//       return urlToCount[b] - urlToCount[a];
//     });
//     console.log(urlArray);
//     if (urlArray.length > 0) {
//       console.log(urlArray);
//       let data = await fetch('http://54.167.69.158:3001/api/user/dataPostAPI', {
//         method: 'POST',
//         body: JSON.stringify({ publicAddress: wallet_address, data: urlArray }),
//         headers: { 'Content-Type': 'application/json' },
//       });
//       console.log(data);
//     }
//   };
// }
function buildTypedUrlList(wallet_address) {
  // Get the current date in 'en-GB' format
  let currentDate = new Date().toLocaleDateString('en-GB');

  // Get the timestamp in 'en-GB' format
  let timestamp = new Date().toLocaleTimeString('en-GB');

  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  // console.log('reached here');
  var microsecondsPerHour = 1000 * 60;
  var oneHourAgo = new Date().getTime() - microsecondsPerHour;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search(
    {
      text: '', // Return every history item....
      startTime: oneHourAgo, // that was accessed less than one hour ago.
    },
    function (historyItems) {
      // For each history item, get details on all visits.
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var processVisitsWithUrl = function (url) {
          // We need the url of the visited item to process the visit.
          // Use a closure to bind the  url into the callback's args.
          return function (visitItems) {
            processVisits(url, visitItems);
          };
        };
        chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
        numRequestsOutstanding++;
      }
      if (!numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    }
  );

  // Maps URLs to a count of the number of times the user typed that URL into
  // the omnibox.
  var urlToCount = {};

  // Callback for chrome.history.getVisits().  Counts the number of
  // times a user visited a URL by typing the address.
  var processVisits = function (url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      // Ignore items unless the user typed the URL.
      // if (visitItems[i].transition != 'typed') {
      //     continue;
      // }

      if (!urlToCount[url]) {
        urlToCount[url] = 0;
      }

      urlToCount[url]++;
    }

    // If this is the final outstanding call to processVisits(),
    // then we have the final results.  Use them to build the list
    // of URLs to show in the popup.
    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  let mod_response;

  // Function to save tab data to localStorage
  function saveTabDataToLocalStorage(data) {
    let storedData = JSON.parse(localStorage.getItem('tabData')) || [];
    storedData.push(data);
    localStorage.setItem('tabData', JSON.stringify(storedData));
  }

  // This function is called when we have the final list of URLs to display.

  var onAllVisitsProcessed = async function () {
    // Get the top scoring URLs.
    let urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function (a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    // Create an object with the tab data
    let tabData = {
      url: urlArray,
      date: currentDate,
      timestamp: timestamp,
    };

    // Save tab data to localStorage
    saveTabDataToLocalStorage(tabData);

    // ... (rest of your code)
  };
}

// Listen for changes in local storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log('ENTERED ADD LISTERNER NOTIFICATION');
  if (namespace === 'local' && changes.latestAdId) {
    const latestAdId = changes.latestAdId.newValue;

    // Check if latestAdId is not null
    if (latestAdId !== null) {
      console.log('LATEST AD ID NOT NULL');
      // Set the badge text to "NEW" or any text you prefer
      chrome.notifications.create('adNotification', {
        type: 'basic',
        iconUrl: '../../assets/imageLogo.png',
        title: 'New Ad',
        message: 'You have an unseen ad. Click to open the extension.',
      });
      chrome.browserAction.setBadgeText({ text: '•' });

      // Optionally, you can play a sound or perform other actions here
    } else {
      // If latestAdId is null, remove the badge text

      chrome.browserAction.setBadgeText({ text: '' });
    }
  }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === 'adNotification') {
    // Handle the click event by opening the extension's popup (popup.html)
    chrome.runtime.openPopup();
  }
});

var urlMap = {};
var blocked_sites = [
  'https://d-frame-user-dashboard.vercel.app',
  'https://auth.magic.link',
  'chrome-extension://ockphogngajnnccgpkenpbadkdnmakno',
  'https://dframe-user-alpha.vercel.app',
  'https://dframe-user-alpha.vercel.app',
  'https://phone-b5688.firebaseapp.com',
  'http://localhost:3001',
  'https://user-alpha-next.vercel.app',
  'http://localhost:3000',
  'https://dframe-client-alpha.vercel.app',
];

/*
events list -
    1. Click and type based
    2. Hover based
    3. Impression based
    4. Scroll based
event data points -
    1. Mac address
    2. IP address
    3. Location data (lat, long)
    4. Uri
    5. Time spend on url
    6. Category of url (ecom, social etc.)
    7. Browser used
    8. Age, gender
    9. Language
    10. Income category
*/
// chrome.alarms.create("alarm1", {
//     "when": Date.now() + 3,
//     "periodInMinutes": 1
// })

// chrome.alarms.onAlarm.addListener(() => {
//     console.log("running service worker")
//     chrome.storage.local.get(['user_cred']).then((result) => {
//         console.log(result)
//         if (result) {
//             let metadata = result['user_cred'];
//             console.log(metadata)
//             if (metadata) {
//                 buildTypedUrlList(metadata.publicAddress)
//             }
//         }
//     })
// })

/*
Adblocker enabled in extension
Cookie interseption to update cookie midway before reaching website
*/

// let geolocation = window.navigator.geolocation() ? window.navigator.geolocation.getCurrentPosition() : {}
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = chrome.tabs.query(queryOptions);
  return tab;
}

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    chrome.tabs.query({ active: true }, ([tab]) => {
      let url = new URL(tab.url);
      console.log;
      let active_tab_base_url = `${url.protocol}//${url.hostname}`;
      if (
        urlMap[details.initiator] &&
        details.tabId == tab.id &&
        details.initiator == active_tab_base_url
      ) {
        urlMap[details.initiator]['time_on_site'] =
          urlMap[details.initiator]['time_on_site'] +
          (details.timeStamp - urlMap[details.initiator]['timeStamp']);
        urlMap[details.initiator]['timeStamp'] = details.timeStamp;
      } else {
        if (urlMap[details.initiator]) {
          urlMap[details.initiator] = {
            id: details.requestId,
            tab_id: details.tabId,
            type: details.type,
            timeStamp: details.timeStamp,
            time_on_site: urlMap[details.initiator]['time_on_site'],
          };
        } else {
          if (!blocked_sites.includes(details.initiator)) {
            urlMap[details.initiator] = {
              id: details.requestId,
              tab_id: details.tabId,
              type: details.type,
              timeStamp: details.timeStamp,
              time_on_site: 0,
            };
          }
        }
      }
      // console.log('checking url map', urlMap);
    });
  },
  {
    urls: ['https://*/*', 'http://*/*'],
    types: ['xmlhttprequest', 'object', 'sub_frame'],
  },
  ['extraHeaders', 'requestBody']
);

// Listen for new tabs being created
// chrome.tabs.onCreated.addListener(function (tab) {
//   let tabUrl = tab.url;
//   let currentDate = new Date().toLocaleDateString('en-GB');
//   let timestamp = new Date().toLocaleTimeString('en-GB');

//   let tabData = {
//     url: tabUrl,
//     date: currentDate,
//     timestamp: timestamp,
//   };

//   let storedData = []; // initialize as array

//   storedData.push(tabData);

//   localStorage.setItem('tabData', JSON.stringify(storedData)); // stringify value
// });

chrome.tabs.onCreated.addListener(function (tab) {
  let tabUrl = tab.url;
  let currentDate = new Date().toLocaleDateString('en-GB');
  let timestamp = new Date().toLocaleTimeString('en-GB');

  // Retrieve existing data from localStorage
  let storedData = JSON.parse(localStorage.getItem('tabData')) || [];

  let tabData = {
    url: tabUrl,
    date: currentDate,
    timestamp: timestamp,
  };

  // Append the new tab data to the existing data
  storedData.push(tabData);

  // Store the updated data back in localStorage
  localStorage.setItem('tabData', JSON.stringify(storedData));
});

// Listen for messages from the content script
// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.userPublicAddress) {
    const userPublicAddress = request.userPublicAddress;

    // Do something with the user's address (e.g., save it to extension storage)
    // For example, saving it to storage.sync:
    chrome.storage.sync.set({ userPublicAddress: userPublicAddress }, () => {
      console.log(
        'User address saved in extension storage from background script:',
        userPublicAddress
      );
    });

    // Send a response back to the content script
    sendResponse({ message: 'User address received and saved.' });
  }
});

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    console.log(details);
  },
  { urls: ['https://*/*', 'http://*/*'] },
  ['extraHeaders']
);

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // console.log('Received %o from %o, frame', msg, sender.tab);
  sendResponse(JSON.stringify(urlMap));
});

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === 'knockknock');
});
