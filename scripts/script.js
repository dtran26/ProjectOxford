$(function () {

    Webcam.set({
        flip_horiz: true,
    });

    Webcam.attach( '#my_camera' );

    function take_snapshot() {
        Webcam.snap( function(data_uri) {
            document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
            getFaceInfo(dataURItoBlob(data_uri));         
        } );

 
      showImage(); 

    }

    $("#cameraButton").click(take_snapshot);

    var showImage = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        if (imageUrl) {
            $("#ImageToAnalyze").attr("src", imageUrl);
        }
    };
    

    function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
    }
  

    var getFaceInfo = function (photo) {

        var subscriptionKey = "4f0308887d724b2393c2c49e8ef6a590";


        var imageUrl = photo;


        var webSvcUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";


        var outputDiv = $("#OutputDiv");


        outputDiv.text("Analyzing...");
        
    
        $.ajax({
            type: "POST",
            url: webSvcUrl,
            processData: false,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/octet-stream",
            data: photo
        }).done(function (data) {


            if (data.length > 0) {

                var faceRectange = data[0].faceRectangle;
                var faceWidth = faceRectange.width;
                var faceHeight = faceRectange.height;
                var faceLeft = faceRectange.left;
                var faceTop = faceRectange.top;


                function floatFormat( number ) {
                    return Math.round( number * Math.pow( 10 , 6 ) ) / Math.pow( 10 , 6 ) ;
                }

                var faceScore = data[0].scores;
                var faceAnger = floatFormat(faceScore.anger);
                var faceContempt =  floatFormat(faceScore.contempt);
                var faceDisgust = floatFormat(faceScore.disgust);
                var faceFear = floatFormat(faceScore.fear);
                var faceHappiness = floatFormat(faceScore.happiness);
                var faceNeutral = floatFormat(faceScore.neutral);
                var faceSadness = floatFormat(faceScore.sadness);
                var faceSurprise = floatFormat(faceScore.surprise);                

                var outputText = "";
                outputText += "<h3>" + "Result:" + "</h3>";
                outputText += "anger: " + faceAnger + "<br>";
                outputText += "contempt: " + faceContempt + "<br>";
                outputText += "disgust: " + faceDisgust + "<br>";
                outputText += "fear: " + faceFear + "<br>";
                outputText += "happiness: " + faceHappiness + "<br>";
                outputText += "neutral: " + faceNeutral + "<br>";
                outputText += "sadness: " + faceSadness + "<br>";
                outputText += "surprise: " + faceSurprise + "<br>";

                outputDiv.html(outputText);

            }

            else {
                outputDiv.text("Detection Failed");
            }

        }).fail(function (err) {
            if(document.getElementById('imageUrlTextbox').value!="")
            {
                $("#OutputDiv").text("ERROR!" + err.responseText);
            }   
        });

    };

    var hideMarkers = function () {
        $("#Rectangle").css("display", "none");
    };

    $("#imageUrlTextbox").change(function () {
        hideMarkers();
        showImage();
        getFaceInfo();
    });



});