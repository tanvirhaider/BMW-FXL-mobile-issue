
/*------------------------*/
/*-----> VARIABLES  <-----*/
/*------------------------*/
var creativeId = "HTMLResponsiveRichMediaBanner";
var creativeVersion = "1.1.0";
var lastModified = "2017-02-07";
var lastUploaded = "2017-02-07";
var templateVersion = "2.0.24";
var templateName = "cf_deluxe_banner_mobile_flex_xl_video_1x1_" + creativeVersion + "_6266"; // cf_[format_name]_[template_name]_[wxh]_version_BlockID
var scrollPos = {
	x: undefined,
	y: undefined
};
var adId, rnd, uid;

var isMobile = (/Mobi/i).test(navigator.userAgent);

/*-----> VIDEO VARS <-----*/
var videoContainer;
var video;
var isIOS = (/iPhone|iPad|iPod/i).test(navigator.userAgent);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var videoIsPlaying = false;
var autoPlayMuted = false; // Used to differentiate between initial muted state and later UI muted states.
var UI_whileAutoPlay = false;

var elemsAnimatingArray = [];

var USE_RESIZE_LISTENER = false;

var isInView = null; // isInView will only be set to true/false when visibility data is being collected.  Leave null when not in use.
var custScriptMraidViewabilityListenerID = null;
var custScriptMraidViewabilityDataAvailable = null;

/*------------------------------*/
/*-----> TEMPLATE CONFIG  <-----*/
/*------------------------------*/
var creativeConfigObj = {
	// portraitFitStyle - Sets the content sizing behavior of the creative in portrait orientation only.
	// Setting 2:3 will maintain the standard 2:3 aspect ratio at the largest size possible in the available area and flood fill the remainder on the left & right sides or bottom as required.
	// Setting fullWidth will display the same as 2:3 with the following exceptions:
	//		1) The creative content area will become full width.
	//		2) As the content area is no longer a set aspect ratio, the background image will crop as necessary cover while maintaining the image assets original aspect ratio of 2:3.
	//		3) Flood fill, if required, will only populate to the bottom of the creative content.
	// Acceptable values are "2:3" or "fullWidth" - any other value will default to "2:3" creative behavior.
	portraitFitStyle: "fullWidth",

	// Creative content boarder color.
	// Boarder is one pixel.
	// Boarder will only display if a color value is listed.
	boarderColor: null,

	// Background fill color when 2:3 aspect ratio creative content does not fill entire available area.
	// Any valid CSS color value is acceptable.
	floodColor: "#fff",

	// background image optimal size = 2:3 aspect ratio. Images will be set to 100% stretched/cropped as required.
	backgroundImageURL: "images/bg.jpg",

	// Only the logo src URL and height are required.
	// With will adjust as required to accomidate the height listed.
	// Logo is set to a fixed 15px left and top padding as requested in creative specs.
	// If logo is not requred set to blank string or null.
	logo: {
		logoURL: "images/logo.png"
	},

	// headline = 1 line max.
	// description = 1 line max.
	// If headline or description is not requred set to blank string or null.
	copy: {
        headline: {
            copy: "THE X7",
            color: "#FFF"
        },
        description: {
            copy: "Make every day legendary",
            color: "#FFF"
		}
	},

	// Mobile layout CTA will auto size in both width and height with a max width of the unit current width - 30px ( 15px padding from creative edges required per creative specs x2 ).
	// If no CTA is requred set to blank string or null.
	cta: {
		copy: "EXPLORE NOW",
		color: "#FFF",
		borderColor: "#FFF"
	},

	// Video assets must include files for the following 3 encodings; mp4, ogv and webm
	// aspectRatio - Mobile acceptable valuse are "2:3" or "9:16" - any other value will default to "2:3" creative behaviour.
	// srcURL - While the assets available must include mp4, ogv and webm, only one asset is required to be listed in srcURL for reference
	// scrURL - File extension may be omitted or left in. EG: "videos/video_1x1" or "videos/video_1x1.mp4"
	// backgroundColor - Fill color of the video area letter-boxing where applicable.  Default = black.
	// controlsColor - Color of the play and pause buttons.  Default = white.
	// controlsColor - Please note the mute and unmute buttons, used only for autoplay creatives, utilize images for the icons and will require updating the images "soundOn.png" & "soundOff.png" to match controlsColor value.
	// controlsBackgroundColor - Background color of the video controls which have a boarder.  Currently all controls with the exception of the pause button.
	// autoPlay - Determines if the video should autoplay or not.  Acceptable values are true or false
	// thirdPartyQuartileTrackingPxls - Unused third party tracking quartiles should be set to blank string or null.
	// thirdPartyQuartileTrackingPxls - Each quartile will only fire once per video per layout.
	// If video is not requred set to blank string or null.
	video: {
		aspectRatio: "2:3",
		srcURL: "videos/2_3Ratio.mp4",
		backgroundColor: null,
		controlsColor: null, // *NOTE: mute and unmute buttons, used only for autoplay creatives, utilize images for the icons and will require updating the images "soundOn.png" & "soundOff.png" to match controlsColor value.
		controlsBackgroundColor: null,
		autoPlay: false,
		thirdPartyQuartileTrackingPxls: {
			start: {
				pxl: ""
			},
			q1: {
				pxl: ""
			},
			q2: {
				pxl: ""
			},
			q3: {
				pxl: ""
			},
			complete: {
				pxl: ""
			}
		}
	}
}
/*-----> END TEMPLATE CONFIG  <-----*/


/*----------------------------*/
/*-----> INITIALIZATION <-----*/
/*----------------------------*/
function checkIfAdKitReady(event) {
	try {
		if (window.localPreview) {
			adkit.onReady(function() {
				window.initializeLocalPreview(); // In localPreview.js
				USE_RESIZE_LISTENER = true;
				initializeCreative();
			});
			return;
		} else {
			window.localPreview = false;
		}
	} catch (e) {
		window.localPreview = false;
	}

	// below comment by MSD
	// adkit.onReady(initializeCreative);

	// START ADD BY MSD
	if (window.adkit) {
		adkit.onReady(initializeCreative);
	} else {
		initializeCreative();
	}
	// END ADD BY MSD
}

function initializeCreative(event) {
	var viewportMeta = document.querySelector('meta[name="viewport"]');
	viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");

	window.setTimeout(function(e) {
		viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");
	}, 500);

	//Workaround (from QB6573) for Async EB Load where Modernizr isn't properly initialized
	typeof Modernizr == "object" && (Modernizr.touch = Modernizr.touch || "ontouchstart" in window);

	EBG.pm.bind("sendCreativeId", function() {eventManager.apply(this, arguments);}, this);
	EBG.pm.bind("eventCallback", function() {eventManager.apply(this, arguments);}, this);

	initializeGlobalVariables();
	setCreativeVersion();

	//-->

	// if local preview run creative right away as viewability data will not be checked.
	// otherwise runCreative() will be called by chcekInitialVCDispatch() to make sure the proper method to attain viewability data is set and initial viewability data has been received prior to launching the creative.
	if(localPreview === true){
		runCreative();
	}
}

function runCreative(){
	setCreativeElements();
	addEventListeners();
	positionCreativeElements();

	window.setTimeout(function(e) {
		document.getElementById("adWrapper").style.visibility = "visible";
		document.getElementById("adWrapper").style.opacity = "1";
		positionCreativeElements();
	}, 250);
}

function initializeGlobalVariables() {
	try { adId = EB._adConfig.adId; } catch (Error) {}
    try {rnd = EB._adConfig.rnd; } catch (Error) {}
    try {uid = EB._adConfig.uid; } catch (Error) {}
}

/*-----------------------*/
/*-----> FUNCTIONS <-----*/
/*-----------------------*/

/*-----> SET UP <-----*/
function setCreativeElements() {
	// Size creative area peravailable total area so 2:3 aspect ratio cretive content will not overflow the available screen space.
	sizeContentArea(null);

	if (isIOS) {
		centerWebkitVideoControls();
	}

	videoContainer = document.getElementById("video-container");

	// set bg overflow flood fill color
	document.getElementById("adWrapper").style.backgroundColor = creativeConfigObj.floodColor;

	// Add boarder and set boarder color if boarderColor has a value
	if (creativeConfigObj.boarderColor !== "" && creativeConfigObj.boarderColor !== null) {
		var contentBorders = document.getElementsByClassName("contentBorder");

		for (var i = 0; i < contentBorders.length; i++) {
			contentBorders[i].style.display = "block";
			contentBorders[i].style.backgroundColor = creativeConfigObj.boarderColor;
		}
	}

	//set video
	if (creativeConfigObj.video.srcURL !== "" && creativeConfigObj.video.srcURL !== null) {
		setUpVideo(creativeConfigObj.video.srcURL, creativeConfigObj.video.aspectRatio);

		moveOnStageFadeIn(document.getElementById("playBtn"));

		if (creativeConfigObj.video.aspectRatio === "9:16") {
			document.getElementById("pauseBtn").classList.add("altPos");
			document.getElementById("muteBtn").classList.add("altPos");
			document.getElementById("unmuteBtn").classList.add("altPos");
		}

		if (creativeConfigObj.video.backgroundColor !== "" && creativeConfigObj.video.backgroundColor !== null) {
			document.getElementById("video-container").style.backgroundColor = creativeConfigObj.video.backgroundColor;
			document.getElementById("video").style.backgroundColor = creativeConfigObj.video.backgroundColor;
		}

		if (creativeConfigObj.video.controlsColor !== "" && creativeConfigObj.video.controlsColor !== null) {
			document.getElementById("playBtn").style.borderColor = creativeConfigObj.video.controlsColor;
			document.getElementById("playBtnArrow").style.borderLeftColor = creativeConfigObj.video.controlsColor;
			document.getElementById("pauseBtnLineRight").style.backgroundColor = creativeConfigObj.video.controlsColor;
			document.getElementById("pauseBtnLineLeft").style.backgroundColor = creativeConfigObj.video.controlsColor;

			document.getElementById("mute").style.borderColor = creativeConfigObj.video.controlsColor;
			document.getElementById("unmute").style.borderColor = creativeConfigObj.video.controlsColor;
		}

		if (creativeConfigObj.video.controlsBackgroundColor !== "" && creativeConfigObj.video.controlsBackgroundColor !== null) {
			document.getElementById("playBtn").style.backgroundColor = creativeConfigObj.video.controlsBackgroundColor;

			document.getElementById("mute").style.backgroundColor = creativeConfigObj.video.controlsBackgroundColor;
			document.getElementById("unmute").style.backgroundColor = creativeConfigObj.video.controlsBackgroundColor;
		}
	}

	// set background
	document.getElementById("mobileBgImg").style.backgroundImage = "url(" + creativeConfigObj.backgroundImageURL + ")";

	// set logo
	if (creativeConfigObj.logo.logoURL !== "" && creativeConfigObj.logo.logoURL !== null) {
		document.getElementById("mobileLogo").getElementsByTagName("img")[0].src = creativeConfigObj.logo.logoURL;
		document.getElementById("mobileLogo").style.display = "block";
	}

	// set CTA
	if (creativeConfigObj.cta.copy !== "" && creativeConfigObj.cta.copy !== null) {
		if (creativeConfigObj.cta.color !== "" && creativeConfigObj.cta.color !== null) {
			document.getElementById("mobileCtaCopy").style.color = creativeConfigObj.cta.color;
		}

		if (creativeConfigObj.cta.borderColor !== "" && creativeConfigObj.cta.borderColor !== null) {
			document.getElementById("mobileCta").style.borderColor = creativeConfigObj.cta.borderColor;
		}

		document.getElementById("mobileCtaCopy").innerHTML = creativeConfigObj.cta.copy;
		document.getElementById("mobileCta").style.display = "block";
	}

	// set headline copy
	if (creativeConfigObj.copy.headline.copy !== "" && creativeConfigObj.copy.headline.copy !== null) {
		document.getElementById("mobileHeadlineCopy").innerHTML = creativeConfigObj.copy.headline.copy;

		if (creativeConfigObj.copy.headline.color !== "" && creativeConfigObj.copy.headline.color !== null) {
			document.getElementById("mobileHeadlineCopy").style.color = creativeConfigObj.copy.headline.color;
		}

		document.getElementById("bgGrad").style.display = "block";
		document.getElementById("mobileHeadlineCopy").style.display = "block";
	}

	// set description copy
	if (creativeConfigObj.copy.description.copy !== "" && creativeConfigObj.copy.description.copy !== null) {
		document.getElementById("mobileDescriptorCopy").innerHTML = creativeConfigObj.copy.description.copy;

		if (creativeConfigObj.copy.description.color !== "" && creativeConfigObj.copy.description.color !== null) {
			document.getElementById("mobileDescriptorCopy").style.color = creativeConfigObj.copy.description.color;
		}

		document.getElementById("bgGrad").style.display = "block";
		document.getElementById("mobileDescriptorCopy").style.display = "block";
	}
}

// Size creative area per available total area so 2:3 aspect ratio creative content will not overflow the available screen space.
// The parameter "data" will be populated only by the response from the custom scripts "creativeResize" event.  When calling this function from manually pass "null".  When accessing the "data" parameter make sure to do a check its existance prior to accessing.
function sizeContentArea(data) {
	var adWrapper = document.getElementById("adWrapper");
	var adWrappoerWidth = adWrapper.offsetWidth;

	var adWrappoerHeight = adWrapper.offsetHeight;

	var adContainer = document.getElementById("adContainer");

	var contentContainer = document.getElementById("contentContainer");

	var initialWidth = adWrappoerWidth;

	var initialHeight = Math.round(adWrappoerWidth * 1.5);

	// If sizeContentArea is called by response from the custom scripts "creativeResize" event and
	// the creative is in a safe frame and the safe frame geom data is passed in the data parameter,
	// use the safe frame geom data passed in to determine orientation otherwise use window.innerHeight/window.innerWidth
	var winW = (data && typeof data.sfGeomObj !== "undefined") ? data.sfGeomObj.win.w : window.innerWidth;
	var winH = (data && typeof data.sfGeomObj !== "undefined") ? data.sfGeomObj.win.h : window.innerHeight;
	var winO = window.orientation || null;
	var determinedOrientation = (winH <= winW || winO === 90 || winO === -90) ? "land" : "port";

	var finalWidth;
	var finalHeight;	// if creative content would overflow available display space reduce creative content area

	if (initialHeight > adWrappoerHeight) {
		finalWidth = Math.round(adWrappoerHeight * 0.66666);
		finalHeight = adWrappoerHeight;
	} else {
		finalWidth = initialWidth;
		finalHeight = initialHeight;
	}

	// adContainer.style.width = finalWidth + "px";
	adContainer.style.width = (determinedOrientation === "port" && creativeConfigObj.portraitFitStyle === "fullWidth") ? "100%" : finalWidth + "px" ;
	document.getElementById("videoControlsContainer").style.width = finalWidth + "px";
	adContainer.style.height = finalHeight + "px";
	contentContainer.style.height = finalHeight + "px";
}

function setUpVideo(srcURL, aspectRatio) {
    console.log("set up video ", srcURL);
	var srcURL_NoFileExt = (srcURL.slice(-6).indexOf(".") === -1) ? srcURL : srcURL.substring(0, srcURL.lastIndexOf("."));
	var setToAutoPlay = creativeConfigObj.video.autoPlay;
	var trackingObj = creativeConfigObj.video.thirdPartyQuartileTrackingPxls;

	// add / reset third party quartile tracking progress trackers
	trackingObj.start.tracked	 = false;
	trackingObj.q1.tracked	 	 = false;
	trackingObj.q2.tracked	 	 = false;
	trackingObj.q3.tracked		 = false;
	trackingObj.complete.tracked = false;

	document.getElementById("video-container").innerHTML = "<video id=\"video\" webkit-playsinline playsinline" + ((setToAutoPlay === true) ? " autoplay muted" : "") + "></video>";

	video = document.getElementById("video");
	videoTrackingModule = new EBG.VideoModule(video);

	addVideoListeners(video);

    // If video is autoplay set autoPlayMuted.  autoPlayMuted is used to differentiate between initial muted state and later UI muted states.
    if(setToAutoPlay === true){
        autoPlayMuted = true;
		addViewabilityListener();
        video.addEventListener("play", onVideoAutoPlayFirstStart, false);
        document.getElementById("contentContainer").addEventListener("mousedown", onUI_whileAutoPlay, false);

		video.oncanplay = function(){
			video.play();
	    };
    }

    video.innerHTML += "<source src=\"" + srcURL_NoFileExt + ".mp4\" type=\"video/mp4\" />";
    video.innerHTML += "<source src=\"" + srcURL_NoFileExt + ".webm\" type=\"video/webm\" />";
    video.innerHTML += "<source src=\"" + srcURL_NoFileExt + ".ogg\" type=\"video/ogg\" />";
    video.innerHTML += "Your browser does not support the <code>video</code> element.";
}

function positionCreativeElements() {
	verticalyAlignText(document.getElementById("mobileCtaCopy"));
}

function addEventListeners() {
	// USE_RESIZE_LISTENER should only be set to true during local testing
	// NYT does not allow resize listeners to be set in the creative JS to keep load on the environment to a minimum.
	if (USE_RESIZE_LISTENER === true) {
		window.addEventListener("resize", sizeContentArea, false)
	}

	// Track all elements that have started but not completed animating via a keyframe animation

	// Add to array when keyframe animation starts
	document.addEventListener("webkitAnimationStart", function(e){
		addElemToAnimTrackingAry(e.target);
	}, false);
	document.addEventListener("animationstart", function(e){
		addElemToAnimTrackingAry(e.target);
	}, false);

	// Remove from array when keyframe animation ends
	document.addEventListener("webkitAnimationEnd", function(e){
		addElemToAnimTrackingAry(e.target);
	}, false);
	document.addEventListener("animationend", function(e){
		removeElemToAnimTrackingAry(e.target);
	}, false);

	document.getElementById("mobileCta").addEventListener("click", onCtaClk, false);
	document.getElementById("mobileLogo").addEventListener("click", onLogoClk, false);
	document.getElementById("mobileCopyContainer").addEventListener("click", onMessagingClk, false);

	var bgClks = document.getElementsByClassName("genClk");
	for (var i = 0; i < bgClks.length; i++) {
		bgClks[i].addEventListener("click", onBgClk, false);
	}

	if (creativeConfigObj.video.srcURL !== "" && creativeConfigObj.video.srcURL !== null) {
		document.getElementById("playBtn").addEventListener("click", onVideoPlayClk, false);
		document.getElementById("pauseBtn").addEventListener("click", onVideoPauseClk, false);

		if (creativeConfigObj.video.autoPlay === true) {
			document.getElementById("unmuteBtn").addEventListener("click", onVideoUnmuteClk, false);
			document.getElementById("muteBtn").addEventListener("click", onVideoMuteClk, false);
		}
	}
}

function addVideoListeners(video){
	video.addEventListener("play", onVideoPlay, false);
    video.addEventListener("pause", onVideoPause, false);

    video.addEventListener("play", thirdPartyQuartileTracking, false);
	video.addEventListener('pause', thirdPartyQuartileTracking, false);
	video.addEventListener("ended", thirdPartyQuartileTracking, false);
	video.addEventListener("timeupdate", thirdPartyQuartileTracking, false);
}

function addViewabilityListener(){
	if(custScriptMraidViewabilityDataAvailable === true){
		custScriptMraidViewabilityListenerID = addCustomScriptEventListener('viewabilityChange', onVisibilityUpdate);
	}else{
		EB.addEventListener(EBG.EventName.VISIBILITY, onVisibilityUpdate);
	}
}
function removeViewabilityListener(){
	if(custScriptMraidViewabilityDataAvailable === true){
		removeCustomScriptEventListener(custScriptMraidViewabilityListenerID);
		custScriptMraidViewabilityListenerID = null;
	}else{
		EB.removeEventListener(EBG.EventName.VISIBILITY, onVisibilityUpdate);
	}
}

function showVideoPlayState() {
	videoContainer.style.visibility = "visible";

	if (creativeConfigObj.cta.copy !== "" && creativeConfigObj.cta.copy !== null) {
		moveOnStageFadeIn(videoContainer, document.getElementById("mobileCta"));
	}

	if ((creativeConfigObj.copy.headline.copy !== "" && creativeConfigObj.copy.headline.copy !== null) || (creativeConfigObj.copy.description.copy !== "" && creativeConfigObj.copy.description.copy !== null)) {
		fadeOutMoveOffStage(document.getElementById("mobileCopyContainer"));
	}

	if (creativeConfigObj.logo.logoURL !== "" && creativeConfigObj.logo.logoURL !== null) {
		fadeOutMoveOffStage(document.getElementById("mobileLogo"));
	}

	if (creativeConfigObj.video.autoPlay === true) {
		if (video.muted === false) {
			moveOnStageFadeIn(document.getElementById("muteBtn"));
		} else {
			moveOnStageFadeIn(document.getElementById("unmuteBtn"));
		}
	}
}

function hideVideoPlayState() {
	if ((creativeConfigObj.copy.headline.copy !== "" && creativeConfigObj.copy.headline.copy !== null) || (creativeConfigObj.copy.description.copy !== "" && creativeConfigObj.copy.description.copy !== null)) {
		moveOnStageFadeIn(document.getElementById("mobileCopyContainer"));
	}

	if (creativeConfigObj.logo.logoURL !== "" && creativeConfigObj.logo.logoURL !== null) {
		moveOnStageFadeIn(document.getElementById("mobileLogo"));
	}

	if (creativeConfigObj.cta.copy !== "" && creativeConfigObj.cta.copy !== null) {
		fadeOutMoveOffStage(videoContainer, document.getElementById("mobileCta"));
	}

	if (creativeConfigObj.video.autoPlay === true) {
		fadeOutMoveOffStage(document.getElementById("unmuteBtn"), document.getElementById("muteBtn"));
	}
}

function togglePlayPauseBtn() {
	if (videoIsPlaying === true) {
		fadeOutMoveOffStage(document.getElementById("playBtn"));
		moveOnStageFadeIn(document.getElementById("pauseBtn"));
	} else {
		fadeOutMoveOffStage(document.getElementById("pauseBtn"));
		moveOnStageFadeIn(document.getElementById("playBtn"));
	}
}

function toggleMuteUnmuteBtn() {
	if (video.muted === false) {
		fadeOutMoveOffStage(document.getElementById("unmuteBtn"));
		moveOnStageFadeIn(document.getElementById("muteBtn"));
	} else {
		fadeOutMoveOffStage(document.getElementById("muteBtn"));
		moveOnStageFadeIn(document.getElementById("unmuteBtn"));
	}
}

function addElemToAnimTrackingAry(elm){
	if(elemsAnimatingArray.indexOf(elm) === -1){
		elemsAnimatingArray.push(elm);
	}
}

function removeElemToAnimTrackingAry(elm){
	if(elemsAnimatingArray.indexOf(elm) !== -1){
		removeArryElem(elemsAnimatingArray, elm);
	}
}

function fastCompleteAllActiveCSSAnim(){
	for(var i=0; i<elemsAnimatingArray.length; i++){
		fastCompleteCSSAnim(elemsAnimatingArray[i]);
	}
}

/*-----> VIDEO FUNCTIONS <-----*/
function centerWebkitVideoControls() {
	document.body.classList.add("ios-center-video-controls");
}

function pauseVideo() {
	if (video) {
		video.pause();
	}
}

function muteVideo() {
	video.muted = true;

	if (creativeConfigObj.video.autoPlay === true) {
		toggleMuteUnmuteBtn();
	}
}

function unmuteVideo(){
    if(autoPlayMuted === true){
        autoPlayMuted = false;
		removeViewabilityListener();
    }
    video.muted = false;

    if(creativeConfigObj.video.autoPlay === true){
        toggleMuteUnmuteBtn();
    }
}

function updateVideoStatePerCurrentViewability(){
	if(localPreview === true){
		return;
	}

	if(isInView === true && videoIsPlaying === false && autoPlayMuted === true && UI_whileAutoPlay === false){
		video.play();
	}else if(isInView !== true && videoIsPlaying === true && autoPlayMuted === true && UI_whileAutoPlay === false){
		video.pause();
	}else{
		// For Testing
	}
}


/*-----------------------------*/
/*-----> EVENT LISTENERS <-----*/
/*-----------------------------*/
function onUI_whileAutoPlay(e) {
	UI_whileAutoPlay = true;
	document.getElementById("contentContainer").removeEventListener("mousedown", onUI_whileAutoPlay, false);
}

function onVideoAutoPlayFirstStart(e){
    video.removeEventListener("play", onVideoAutoPlayFirstStart, false);
    updateVideoStatePerCurrentViewability();
}

function onVisibilityUpdate(e){
	var lastState = isInView;

	isInView = readVisibilityData(e);

	if(isInView !== lastState){
		updateVideoStatePerCurrentViewability();
	}
}

function readVisibilityData(data){
	var inView = null;

	if(custScriptMraidViewabilityDataAvailable === true){
		inView = data.isViewable;
    }else{
		try{
	        if(EB._visibilityData.percentage > 50){
	            inView = true;
	        }else if(EB._visibilityData.percentage < 50){
	            inView = false;
	        }
	    }catch(err){
			//
	    }
	}

	return inView;
}

function onVideoPlayClk(e) {
	if(autoPlayMuted === true){
        autoPlayMuted = false;
		removeViewabilityListener();
        unmuteVideo();
    }
    video.play();
}

function onVideoPauseClk(e){
    video.pause();
}
function onVideoMuteClk(e){
    muteVideo();
}

function onVideoUnmuteClk(e){
    unmuteVideo();
}

function onVideoPlay(e){
    videoIsPlaying = true;
    togglePlayPauseBtn();
    showVideoPlayState();
}

function onVideoPause(e){
    videoIsPlaying = false;
    togglePlayPauseBtn();
    hideVideoPlayState();
}

function thirdPartyQuartileTracking(e) {
	var currentTime = e.target.currentTime;
    var totalTime = e.target.duration;
    var percent = currentTime / totalTime * 100;

    var pxlObj = creativeConfigObj.video.thirdPartyQuartileTrackingPxls;

    switch(e.type){
        case "play":
			if(!pxlObj.start.tracked){
				fireThirdPartyQuartilePxl(pxlObj.start);
			}
            break;
        case "timeupdate":
            if(!pxlObj.q1.tracked && percent >= 25){
                fireThirdPartyQuartilePxl(pxlObj.q1);
            }else if(!pxlObj.q2.tracked && percent >= 50){
                fireThirdPartyQuartilePxl(pxlObj.q2);
            }else if(!pxlObj.q3.tracked && percent >= 75){
                fireThirdPartyQuartilePxl(pxlObj.q3);
            }
            break;
        case "ended":
            	fireThirdPartyQuartilePxl(pxlObj.complete);

				resetThirdPartyQuartileTracking(pxlObj);
            break;
        default:
            break;
    }

	function resetThirdPartyQuartileTracking(obj){
		obj.start.tracked = false;
		obj.q1.tracked = false;
		obj.q2.tracked = false;
		obj.q3.tracked = false;
		obj.complete.tracked = false;
	}

    function fireThirdPartyQuartilePxl(obj){
        obj.tracked = true;
        if(obj.pxl !== "" && obj.pxl !== null){
            fire1x1Pixel(obj.pxl);
        }
    }
}

/*-----> CLICK OUTS <-----*/
function onCtaClk(e) {
	pauseVideo();
	window.setTimeout(function(e){
		fastCompleteAllActiveCSSAnim();
		EB.clickthrough('CTA_Click');
	}, 50);
}

function onLogoClk(e) {
	pauseVideo();
	window.setTimeout(function(e){
		fastCompleteAllActiveCSSAnim();
		EB.clickthrough('Logo_Click');
	}, 50);
}

function onMessagingClk(e) {
	pauseVideo();
	EB.clickthrough('Messaging_Click');
	window.setTimeout(function(e){
		fastCompleteAllActiveCSSAnim();
		// EB.clickthrough();
	}, 50);
}

function onBgClk(e) {
	pauseVideo();
	EB.clickthrough('Background_Click');
	window.setTimeout(function(e){
		fastCompleteAllActiveCSSAnim();
		// EB.clickthrough();
	}, 50);
}


/*-------------------------------------------------------------*/
/*-----> CUSTOM SCRIPT EVENT LISTENER CALLBACK FUNCTIONS <-----*/
/*-------------------------------------------------------------*/
// Check initial, and possible only, dispatch of viewabilityChange custom event to
// set variable later used to determine the method to check viewability if required
// due to use of auto play in the template implementation.
function chcekInitialVCDispatch(e){
	removeCustomScriptEventListener(custScriptMraidViewabilityListenerID);

	custScriptMraidViewabilityListenerID = null;
	custScriptMraidViewabilityDataAvailable = e.isMRAID;
	isInView = readVisibilityData(e);

	// creative must be launched here when live to be sure data required from
	// custom script event listener has been attained prior to launch.
	runCreative();
}


/*------------------------------*/
/*-----> HELPER FUNCTIONS <-----*/
/*------------------------------*/
// Items must be on stage prior to being passed to this function for proper alignemnt
function verticalyAlignText(obj) {
	var parentContainerHeight = obj.parentNode.offsetHeight;
	var copyContainerHeight = obj.offsetHeight;
	var pushMargin = (Math.floor((parentContainerHeight - copyContainerHeight) / 2)) + "px";

	obj.style.marginTop = pushMargin;
}

function moveOnStageFadeIn(arg) {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].style.WebkitAnimation = "moveOnStageFadeIn .25s ease forwards";
		arguments[i].style.animation = "moveOnStageFadeIn .25s ease forwards";
	}
}

function fadeOutMoveOffStage(arg) {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].style.WebkitAnimation = "fadeOutMoveOffStage .25s ease forwards";
		arguments[i].style.animation = "fadeOutMoveOffStage .25s ease forwards";
	}
}

function fastCompleteCSSAnim(arg) {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].style.WebkitAnimationDelay = "1ms";
		arguments[i].style.animationDelay = "1ms";

		arguments[i].style.WebkitAnimationDuration = "1ms";
		arguments[i].style.animationDuration = "1ms";
	}
}

function removeArryElem(ary, elm){
	var index = ary.indexOf(elm);

	if(index !== -1){
		ary.splice(index, 1);
	}
}

function fire1x1Pixel(src) {
	// Fire 3rd party tracking pixels only when live.
	//
	if (localPreview === false) {
		var pixel = new Image();
		pixel.src = src;
	} else {
		console.log("" + src);
	}
}

/*------------------------------*/
/*-----> BASE FORMAT CODE <-----*/
/*------------------------------*/
/*******************
UTILITIES
*******************/
function setCreativeVersion() {
	sendMessage("setCreativeVersion", {
		creativeId: creativeId + " - " + templateName,
		creativeVersion: creativeVersion,
		creativeLastModified: lastModified,
		uid: uid
	});
}

function onPageScroll(event) {
	// use scrollPos anywhere to know the current x/y coordinates.
	scrollPos.x = event.scrollXPercent;
	scrollPos.y = event.scrollYPercent;
}

/*********************************
HTML5 Event System - Do Not Modify
*********************************/
var listenerQueue;
var creativeIFrameId;

function sendMessage(type, data) {
	//note: the message type we're sending is also the name of the function inside
	//		the custom script's messageHandlers object, so the case must match.

	if (!data.type) data.type = type;
	EB._sendMessage(type, data);
}

function addCustomScriptEventListener(eventName, callback, interAd) {
	listenerQueue = listenerQueue || {};
	var data = {
		uid: uid,
		listenerId: Math.ceil(Math.random() * 1000000000),
		eventName: eventName,
		interAd: !!(interAd),
		creativeIFrameId: creativeIFrameId
	};
	sendMessage("addCustomScriptEventListener", data);
	data.callback = callback;
	listenerQueue[data.listenerId] = data;
	return data.listenerId;
}

function dispatchCustomScriptEvent(eventName, params) {
	params = params || {};
	params.uid = uid;
	params.eventName = eventName;
	params.creativeIFrameId = creativeIFrameId;
	sendMessage("dispatchCustomScriptEvent", params);
}

function removeCustomScriptEventListener(listenerId) {
	var params = {
		uid: uid,
		listenerId: listenerId,
		creativeIFrameId: creativeIFrameId
	};

	sendMessage("removeCustomScriptEventListener", params);
	if (listenerQueue[listenerId])
		delete listenerQueue[listenerId];
}

function eventManager(event) {
	var msg;

	if (typeof event == "object" && event.data) {
		msg = JSON.parse(event.data);

	} else {
		// this is safe frame.
		msg = {
			type: event.type,
			data: event
		};
	}
	if (msg.type && msg.data && (!uid || (msg.data.uid && msg.data.uid == uid))) {
		switch (msg.type) {
			case "sendCreativeId":
				creativeIFrameId = msg.data.creativeIFrameId;

				addCustomScriptEventListener('pageScroll', onPageScroll);
				addCustomScriptEventListener('creativeResize', sizeContentArea);

				// For the NYT custom scripts;
				// MRAID viewability data will be passed in and only available via this listener.
				// This listener will be dispatched for the first time after the "setCreativeVersion" message in is sent by the creative.
				// The first dispatch of this listener will contain data listing if MRAID viewability data will be available for the serve.
				// If MRAID viewability data will not be available, which is the case in all mobile web serves, this listener will only dispatch once to inform the creative that MRAID viewability data is not available, by way of isMRAID having a value of false, otherwise it will continually dispatch on MRAID viewability changes.
				// For those reasons we must subscribe to the listener before calling setCreativeVersion() to be sure to catch the initial and possibly only dispatch.
				custScriptMraidViewabilityListenerID = addCustomScriptEventListener('viewabilityChange', chcekInitialVCDispatch);

				sendMessage("dispatchScrollPos", {
					uid: uid
				});
				if (creativeContainerReady)
					creativeContainerReady();
				break;
			case "eventCallback": // Handle Callback
				var list = msg.data.listenerIds;
				var length = list.length;
				for (var i = 0; i < length; i++) {
					try {
						var t = listenerQueue[list[i]];
						if (!t) continue;
						t.callback(msg.data);
					} catch (e) {}
				}
				break;
		}
	}
}

// NOTE: The message listener below, and more importantly eventManager portion, have
//		 been commented out as the calls to the eventManager function are being pushed
//		 in via the 2 bindings to EGB.pm, as seen in the initializeCreative function.
//		 When the below was left in the code, while serving in MRAID, two calls per
//		 event were being received.  With the below removed all environments now
//		 receive only a single call per event.
//		 This commented out code was not deleted to avoid accidental addition back
//		 into the code by one not familiar with the template since it is boilerplate
//		 code for the base custom format.
// window.addEventListener("message", function() {
// 	try {
// 		eventManager.apply(this, arguments);
// 	} catch (e) {}
// }, false);

/*************************************
End HTML5 Event System - Do Not Modify
*************************************/

window.addEventListener("load", checkIfAdKitReady);