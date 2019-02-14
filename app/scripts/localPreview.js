var localPreview = true;
localPreview = document.location === top.location;

function initializeLocalPreview() {
    window.EB._adConfig = {
        adId: 00000000,
        rnd: Math.random().toString().substring(2),
        uid: adId + "_" + rnd
    };

    window.EB.clickthrough = function(){
        console.log("EB.clickthrough: ", arguments);
    };
    window.EB.userActionCounter = function(){
        console.log("EB.userActionCounter: ", arguments);
    };
}


// function initializeLocalPreview() {
//     var ua = navigator.userAgent;
//     window.EB = {
//         _adConfig: {
//             adId: 0,
//             rnd: 0,
//             uid: 0,
//             versionID: "",
//             customJSVars: {
//                 //This will be a different list for each ad format, these are just example vars.
//                 //You only need to add the vars that the workspace script(s) may use, not vars that
//                 //are needed only in the custom script.
//
//                 //It's only the list of vars that you need to set to stop getting errors when locally previewing
//             }
//         },
//         clickthrough: function(){
//             console.log("EB.clickthrough: ", arguments);
//         },
//         userActionCounter: function(){
//             console.log("EB.userActionCounter: ", arguments);
//         },
//         _sendMessage: function () {
//             return;
//         },
//         API: {
//             browser: {
//                 webkit: ua.match(/webkit/i) !== null,
//                 firefox: ua.match(/firefox/i) !== null
//             },
//             os: {
//                 ios: ua.match(/ipod|iphone|ipad/i) !== null,
//                 android: ua.match(/android/i) !== null,
//                 windowphone: ua.match(/windows phone/i) !== null,
//                 mobile: ua.match(/ipod|iphone|ipad|android|windows phone/i) !== null
//             },
//             setStyle: function (obj, styles) {
//                 for(var style in styles) {
//                     if(!styles.hasOwnProperty(style)) continue;
//                     obj.style[style] = styles[style];
//                 }
//             },
//             getCustomVar: function (name) {
//                 return window.EB._adConfig.customJSVars[name];
//             }
//         },
//         Comm: {
//             setName: function (name) {
//                 return name;
//             },
//             isConnected: function (name) { return false; }
//
//         },
//         getSDKData: function () { return false; },
//         expand: function () { return false; },
//         collapse: function () { return false; }
//     };
//     window.EBG = {
//         px: function (n) {
//             if(n.toString().match(/^\d$|^\d+$/) !== null) {
//                 return n + "px";
//             }
//             return n;
//         }
//     };
//     // var visibilityStyle = document.createElement("style");
//     // visibilityStyle.innerHTML = "html, body, div, video {visibility: visible !important;}";
//     // document.getElementsByTagName("head")[0].appendChild(visibilityStyle);
// }
