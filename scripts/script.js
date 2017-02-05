$(function () {

    Webcam.attach( '#my_camera' );

    function take_snapshot() {
        Webcam.snap( function(data_uri) {
                
           
        } );

        showImage(); 
        getFaceInfo();  
    }

    var showImage = function () {
        var imageUrl = $("#imageUrlTextbox").val();
        if (imageUrl) {
            $("#ImageToAnalyze").attr("src", imageUrl);
        }
    };
  
  
    var getFaceInfo = function () {

        var subscriptionKey = "4f0308887d724b2393c2c49e8ef6a590";


        var imageUrl = $("#imageUrlTextbox").val();


        var webSvcUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";


        var outputDiv = $("#OutputDiv");

        if(document.getElementById('imageUrlTextbox').value=="")
        {

            outputDiv.text("Please enter the URL of the image");
        }
        else{

            outputDiv.text("Analyzing...");
        }
    

        $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{ "Url": "' + imageUrl + '" }'
        }).done(function (data) {


            if (data.length > 0) {

                var faceRectange = data[0].faceRectangle;
                var faceWidth = faceRectange.width;
                var faceHeight = faceRectange.height;
                var faceLeft = faceRectange.left;
                var faceTop = faceRectange.top;


                $("#Rectangle").css("top", faceTop);
                $("#Rectangle").css("left", faceLeft);
                $("#Rectangle").css("height", faceHeight);
                $("#Rectangle").css("width", faceHeight);
                $("#Rectangle").css("display", "block");

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