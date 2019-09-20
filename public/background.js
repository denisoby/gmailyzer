// chrome.browserAction.setBadgeText({text: '123'});

// todo store latest token update time
// chrome.storage.local.set({
//     authToken: 'ya29.GluIBz-rhQ2eOOzv0vuJLvglaUolWGnu7-hLnHAvJ5M0ct7Y-PImBEzacevIaGpjuR2wVQakswbf3UKmEY8gKaCv9MjW4EX4hvJSVzRPQB9BZSCfDP5Em66u5zaH'
// });


let userInfo = {
    "id": "106571555089661937507",
    "email": "dobydennykh@griddynamics.com",
    "verified_email": true,
    "picture": "https://lh3.googleusercontent.com/a-/AAuE7mDqDg1qvESh1uHZ0R2FUU8_wkLWY3y3xZGWPtRT",
    "hd": "griddynamics.com"
};

const apiKey = 'AIzaSyB2naQxJKGjAXANETb4UKNQiDCO9c34liI';

chrome.storage.local.get(['authToken'], function({authToken}) {
    alert('2 Value currently is ' + authToken);

    let init = {
        method: 'GET',
        async: true,
        headers: {
            Authorization: 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'contentType': 'json'
    };

    fetch(
        `https://www.googleapis.com/gmail/v1/users/${userInfo.email}/history&key=${apiKey}`,
        init)
        .then((response) => {
            debugger
            return response.json();
        })
        .then(function(data) {
            debugger;
            console.log(data)
            alert(JSON.stringify(data));
        });
});


// alert('ya29.GluIBz-rhQ2eOOzv0vuJLvglaUolWGnu7-hLnHAvJ5M0ct7Y-PImBEzacevIaGpjuR2wVQakswbf3UKmEY8gKaCv9MjW4EX4hvJSVzRPQB9BZSCfDP5Em66u5zaH');

// var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

// chrome.identity.getAuthToken({
//     interactive: true
// }, function(token) {
//     if (chrome.runtime.lastError) {
//         alert(chrome.runtime.lastError.message);
//         return;
//     }
//
//     alert(`Token: ${token}`);
//
//     var x = new XMLHttpRequest();
//     x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
//     x.onload = function() {
//         alert(x.response);
//     };
//     x.send();
// });

//
const clientID='704394217772-dn12jft8u1i5ga5jtkj3n7vvl292ugtl.apps.googleusercontent.com';
// Creation date
// Sep 19, 2019, 5:20:43 PM
// Application ID
// oddengdolebonceminanjmndgnookphp
