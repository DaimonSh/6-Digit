chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("MSR");
	console.log("RID" + request.requestId);
	
	if(request.requestId == 1)
	{
		console.log("M1");
		var video = document.getElementsByTagName("video")[0];
		if (video != document.pictureInPictureElement)
			video.requestPictureInPicture();
		else if(document.pictureInPictureElement != null)
			document.exitPictureInPicture();
	}
	else if(request.requestId == 2)
	{
		console.log("M2");
		console.log("FGOV");
		//$("body").css("filter", "invert(1)");
		$("head").prepend(
    `<style>
       body { filter:invert(1);}
      </style> `);
	}
	
	/*
	$("head").prepend(
    `<style>
       .dv {
          height: 100px;
          width: 100px;
		  background-color: #3366CC;
        }
      </style> `
  );
  $("body").prepend(
    `<div class="dv">000</div>`
    
  );
  */
	
  //$(`#${request.imageDivId}`).click(function() {
  //  $(`#${request.imageDivId}`).remove(`#${request.imageDivId}`);
  //});
  sendResponse({ fromcontent: "This message from content.js" });
});


/*

var video = document.getElementsByTagName("video")[0];
	if(document.getElementsByTagName("video")[0])
	{
	if (video !== document.pictureInPictureElement)
		await video.requestPictureInPicture();
	else
		await document.exitPictureInPicture();

*/