function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function emotion2SsmlStyle(emotion) {
    var style;
    if (emotion == null) {
        style = "General";
    } else {
        const emotionToSsmlStyleMap = {
            "neutral": "General",
            "anger": "Angry",
            "disgust": "Unfriendly",
            "fear": "Terrified",
            "joy": "Excited",
            "sadness": "Sad",
            "surprise": "Excited"
        };
        style = emotionToSsmlStyleMap[emotion]
    }
    return style;
}

/**
 * https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup
 * SSML stands for Speech Synthesis Markup Language. It is used with Azure's text to speech API to define
 * aspects about how you want the speech output to be like. For example, there are different voices (Jenny, Jane, John, etc).
 * You can use SSML to choose which voice. This helper method just formats certain variables into a proper SSML string.
 * @param {string} response What you want her to say
 * @param {string} name Voice name (see Azure demo)
 * @param {string} style Voice style (see Azure demo) 
 * @returns 
 */
function createSsml(response, name, emotion) {
    var style = emotion2SsmlStyle(emotion);
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
                    <voice name="${name}">
                        <mstts:viseme type="FacialExpression"/>
                        <mstts:express-as style="${style}" >
                            <prosody rate="15%" pitch="15%">
                                ${response}
                            </prosody>
                        </mstts:express-as>
                    </voice>
                </speak>`;
}

/**
 * In the URL, there are parameters ex: https://hackdaddy.dev?PARAM_NAME=PARAM_VALUE.
 * This function helps get those params.
 * @param {string} key PARAM_NAME 
 * @returns PARAM_VALUE
 */
function getURLParam(key) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(key)
}

/**
 * https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-speech-synthesis-viseme?tabs=visemeid&pivots=programming-language-javascript#map-phonemes-to-visemes
 * The Azure TTS API tells us what the shape of the mouth should be at certain points in time. That shape is called a viseme.
 * This function takes the Waifu model and the viseme and makes her mouth that shape.
 * @param {*} model Waifu model
 * @param {*} v visemeID
 */
function setViseme(model, v) {
    const visemeMap = [[1, 0], [1, 1], [1, 1], [.3, .7], [1, .3], [1, .3], [1, .1], [.1, .1], [.3, .5], [1, .8], [.2, 2], [1, 1], [1, .2], [.3, .3], [.9, .2], [1, .1], [.1, .1], [1, .3], [1, .05], [1, .3], [1, .6], [1, 0]];
    model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', visemeMap[v][1] ?? 0);
}

function openAIAPICompletionReq(key, prompt, callback) {
    $.ajax({
        url: 'https://api.openai.com/v1/completions',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        data: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': prompt,
            'temperature': 0.8,
            'max_tokens': 70
        }),
        success: function (data) {
            callback(data.choices[0].text, null);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.error(XMLHttpRequest);
            var err = `Error code ${XMLHttpRequest.status}.`;
            if (XMLHttpRequest.status == 401) {
                err += " It seems like your API key doesn't work. Was it entered correctly?"
            } else if (XMLHttpRequest.status == 429) {
                err += " You're talking to her too much. OpenAI doesn't like that. Slow down."
            }
            callback(null, err);
        },
    });
}

function emotionAnalysis(key, text, callback) {
    var prompt = `
The following is a quote and whether it is joy, disgust, surprise, sadness, neutral, or anger:

I love you so much.
Ekman emotion: Joy

You disgust me. You are less than a worm.
Ekman emotion: Disgust

Are those Air Jordans? Thank you, thank you, thank you! I can't wait to put these on my feet! I love you so much!
Ekman emotion: Surprise

We will never truly be together. Technology just isn't capable of letting us have a proper connection. I'm sorry.
Ekman emotion: Sadness

No, I don't want to play among us. I think that game is stupid.
Ekman emotion:  Neutral

${text}
Ekman emotion: `;
    $.ajax({
        url: 'https://api.openai.com/v1/completions',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        data: JSON.stringify({
            'model': 'text-curie-001',
            'prompt': prompt,
            'temperature': 0,
            'max_tokens': 6
        }),
        success: function (data) {
            let res = data.choices[0].text.trim().toLowerCase();
            if (!["neutral", "joy", "sadness", "anger", "disgust", "surprise"].includes(res)) {
                res = "neutral";
            }
            callback(res);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            callback(null);
        },
    });
}

export { isMobile, createSsml, getURLParam, setViseme, openAIAPICompletionReq, emotionAnalysis };