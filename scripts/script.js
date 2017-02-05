$(function () {

    $('#ok').hide();
    $('#redo').hide();
    $('#redoredo').hide();
    $('#rectangle').hide();


    Webcam.set({
        flip_horiz: true,
    });

    Webcam.attach( '#my_camera' );

    function take_snapshot() {
        Webcam.snap( function(data_uri) {
            document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
            $('#my_camera').hide();
            $('#my_result').show();
            $('#ok').text("Ok");
            $('#redo').text("Re-take");
            $('#ok').show();
            $('#redo').show();
            getFaceInfo(dataURItoBlob(data_uri));
            $('table').hide();
            $('#cameraButton').hide();
            $('.result_div').hide();
        });

    }

    $("#cameraButton").click(take_snapshot)
    
    
    $('#ok').on('click',function(){
        $(this).hide();
        $('#redo').hide();
        $('#cameraButton').hide();
        $('table').show();
        $('#redoredo').text('Re-take')
        $('#redoredo').show();
        $('.result_div').show();
        $("#rectangle").css("display", "inline");

    });

    $('#redo').on('click',function(){
        $('#my_result').hide();
        $('#my_camera').show();
        $('#ok').hide();
        $(this).hide();
        $('table').hide();
        $('#cameraButton').show();
        $('.result_div').hide();
    });

    $('#redoredo').on('click',function(){
        $('#my_camera').show();
        $('#my_result').hide();
        $('table').hide();
        $("#cameraButton").show();
        $(this).hide();
        $('.result_div').hide();
    })

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


        var APIUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";


        var resultDiv = $(".result_div");


        var articleDiv = $(".article");


        resultDiv.text("Analyzing...");
        
    
        $.ajax({
            type: "POST",
            url: APIUrl,
            processData: false,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/octet-stream",
            data: photo
        }).done(function (data) {


            if (data.length > 0) {


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


                var outputs = {"anger":faceAnger,"contempt":faceContempt,
                               "disgust":faceDisgust,"fear":faceFear,
                               "happiness":faceHappiness,"neutral":faceNeutral,
                               "sadness":faceSadness,"surprise":faceSurprise}
                console.log(outputs)
                var newOutputs = []
                for(var prop in outputs) {
                    newOutputs.push(outputs[prop])
                }

                console.log(newOutputs)

                var maxOutput = Math.max.apply(Math,newOutputs)

                var outputText = "";

                if (maxOutput == faceNeutral){
                    if(faceNeutral > 0.85 && faceHappiness < 0.25){
                        outputText = "<h3>" + "We've detected " + "<i>" + "a resting bitch face" + "</i>" + "</h3><h4><i>(hint: smile)</i></h4>"
                    }
                    else if(faceNeutral > 0.6 && faceSadness > 0.15){
                        outputText = "<h3>" + "We've detected " + "<i>" + "a resting bitch face" + "</i>" + "</h3><h4><i>(hint: smile)</i></h4>"
                    }
                    else{
                        outputText = "<h3>" + "We couldn't detect " + "<i>" + "a resting bitch face" + "</i>" + "</h3>"
                    }
                }

                else{

                    for (var prop in outputs) {
                       if (outputs[prop] == maxOutput) {
                            outputText = "<h3>" + "We've detected " + "<i>" + prop + "</i>" + "</h3>"
                         }
                     }
                 }
                

                console.log(outputText)


                resultDiv.html(outputText);

            }
            else {
                resultDiv.text("Detection Failed");
            }

        })

    };

});