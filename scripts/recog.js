export function handleRecognition() {

const resultText = document.getElementById('speech-text');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const languageSelect = document.getElementById('lang');
const fontName = document.getElementById('fonts');
const fontSizeRef = document.getElementById('size');

let speechRecognition  = window.speechRecognition || window.webkitSpeechRecognition;
let recognition;
let speechGrammarList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();

const courtPhrases = [
  'writ', 'subpoena', 'affidavit', 'testimony', 'injunction', 'plea', 
  'defendant', 'plaintiff', 'deposition', 'court order', 'cross-examination',
  'voir dire', 'arraignment', 'bench warrant', 'bailiff'
];

function handleTextTransformations(text) {
  const lowerCasePhrase = "off capital";
  const capitalPhrase = "on capital";
  const backspacePhrase = "delete";

  let lowerCaseIndex = text.toLowerCase().indexOf(lowerCasePhrase);
  let capitalIndex = text.toLowerCase().indexOf(capitalPhrase);
  let backspaceIndex = text.toLowerCase().indexOf(backspacePhrase);

  console.log("Original Text:", text);
  console.log("Lowercase Index:", lowerCaseIndex);
  console.log("Capital Index:", capitalIndex);
  console.log("Delete Index:", backspaceIndex);

  if (backspaceIndex !== -1) {
    text = deleteLastWord(text, backspaceIndex);
    console.log("Text after delete:", text);
  }

  if (lowerCaseIndex !== -1 && capitalIndex !== -1) {
    if (lowerCaseIndex < capitalIndex) {
      text = text.slice(0, lowerCaseIndex) + text.slice(lowerCaseIndex + lowerCasePhrase.length).toLowerCase();
      text = text.slice(0, capitalIndex) + text.slice(capitalIndex + capitalPhrase.length).toUpperCase();
    } else {
      text = text.slice(0, capitalIndex) + text.slice(capitalIndex + capitalPhrase.length).toUpperCase();
      text = text.slice(0, lowerCaseIndex) + text.slice(lowerCaseIndex + lowerCasePhrase.length).toLowerCase();
    }
  } else if (lowerCaseIndex !== -1) {
    text = text.slice(0, lowerCaseIndex) + text.slice(lowerCaseIndex + lowerCasePhrase.length).toLowerCase();
  } else if (capitalIndex !== -1) {
    text = text.slice(0, capitalIndex) + text.slice(capitalIndex + capitalPhrase.length).toUpperCase();
  }

  courtPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    text = text.replace(regex, phrase.toUpperCase());
  });

  text = wordConcat(text, recognition.lang);

  // Capitalize the first letter of the entire text
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // Capitalize the first letter after sentence-ending punctuation
  text = text.replace(/([.!?]\s*)([a-z])/g, function(match, p1, p2) {
    return p1 + p2.toUpperCase();
  });

  return text;
}

function deleteLastWord(text, commandIndex) {
  // Find the position of the last space before the "delete" command
  const lastSpaceIndex = text.lastIndexOf(' ', commandIndex);
  
  // If no space is found, return an empty string (if the delete command is at the start)
  if (lastSpaceIndex === -1) {
    return '';
  }

  // Remove the last word by slicing the string up to the last space
  return text.slice(0, lastSpaceIndex).trim();
}

function wordConcat(text, lang) {
  let replacedwords;

  const abbreviations = {
    "number": "No.",
    "doctor": "Dr.",
    "honorable": "Hon'ble",
    "mister": "Mr."
  };

  // Replace full words with their abbreviations
  Object.keys(abbreviations).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi'); // Match whole words, case insensitive
    text = text.replace(regex, abbreviations[key]);
  });

  function parseMonth(month) {
    const months = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12"
    };
    return months[month.toLowerCase()] || null;
  }

  const spokenDatePattern = /(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)\s+(\d{4})/;
  text = text.replace(spokenDatePattern, function(match, day, month, year) {
    let numericMonth = parseMonth(month);
    if (numericMonth) {
      return `${day.padStart(2, '0')}/${numericMonth}/${year}`;
    }
    return match;
  });


  if (lang === 'en') {
    replacedwords = text.replaceAll(/add underscore/gi, "_")
    .replaceAll(/add under score/gi, "_")
    .replaceAll(/add copyright symbol/gi, "©")
    .replaceAll(/add copyright symbol/gi, "©")
    .replaceAll(/add vertical bar/gi, "|")
    .replaceAll(/add full stop/gi, ". ")
    .replaceAll(/add fullstop/gi, ". ")
    .replaceAll(/add stop/gi, ". ")
    .replaceAll(/add colon/gi, ":")
    .replaceAll(/add semi colon/gi, "")
    .replaceAll(/add dash/gi, "-")
    .replaceAll(/at dash/gi, "-")
    .replaceAll(/add space/gi, " ")
    .replaceAll(/add apostrophe/gi, "`")
    .replaceAll(/add coma/gi,",")
    .replaceAll(/add comma/gi, ",")
    .replaceAll(/add double quote/gi, '"')
    .replaceAll(/add double coat/gi, '"')
    .replaceAll(/at double quote/gi, '"')
    .replaceAll(/at double coat/gi, '"')
    .replaceAll(/8 double quote/gi, '"')
    .replaceAll(/8 double coat/gi, '"')
    .replaceAll(/add double Kot/gi, '"')
    .replaceAll(/add open bracket/gi, "(")
    .replaceAll(/add close bracket/gi, ")")
    .replaceAll(/add percent/gi, "%")
    .replaceAll(/add percentage/gi, "%")
    .replaceAll(/add percent/gi, "%")
    .replaceAll(/add percent age/gi, "%")
    .replaceAll(/add percentage/gi, "%")
    .replaceAll(/add at the rate/gi, "@")
    .replaceAll(/add exclamation mark/gi, "!")
    .replaceAll(/add question mark/gi, "?")
    .replaceAll(/add ampersand/gi, "&")
    .replaceAll(/add and sign/gi, "&")
    .replaceAll(/add new line/gi, "<br/>")
    .replaceAll(/add new paragraph/gi, "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
    .replaceAll(/add bold/gi,"<strong>")
    .replaceAll(/no bold/gi, "</strong>")
    .replaceAll(/no bold/gi, "</strong>")
    .replaceAll(/add italic/gi, "<em>")
    .replaceAll(/no italic/gi, "</em>")
    .replaceAll(/add underline/gi, "<u>")
    .replaceAll(/no underline/gi, "</u>")
    .replaceAll(/add strike/gi, "<s>")
    .replaceAll(/no strike/gi, "</s>")
    .replaceAll(/add sub/gi, "<sub>")
    .replaceAll(/no sub/gi, "</sub>")
    .replaceAll(/add super/gi, "<sup>")
    .replaceAll(/no super/gi, "</sup>")
  } else {
    replacedwords = text.replaceAll("अंडरस्कोर", "_")
    .replaceAll("ऍड अंडर स्कोर", "_")
    .replaceAll("ऍड कॉपीराइट सिंबोल", "©")
    .replaceAll("ऍड कॉपीराइट सिम्बॉल", "©")
    .replaceAll("ऍड कॉपीराइट सिंबॉल", "©")
    .replaceAll("ऍड कॉपीराइट सिंबल", "©")
    .replaceAll("ऍड कॉपीराइट", "©")
    .replaceAll("ऍड वर्टीकल बार", "|")
    .replaceAll("ऍड फुलस्टॉप", ". ")
    .replaceAll("ऍड स्टॉप", ". ")
    .replaceAll("ऍड कोलन", ":")
    .replaceAll("ऍड सेमी कोलन", "")
    .replaceAll("ऍड डॅश", "-")
    .replaceAll("ऍड स्पेस", " ")
    .replaceAll("ऍड अपोस्ट्रॉफी", "`")
    .replaceAll("ऍड अपो स्ट्रॉफी", "`")
    .replaceAll("ऍड कॉमा", ",")
    .replaceAll("ऍड कॉमा", ",")
    .replaceAll("ऍड ओपन सिंगल कोट", "'")
    .replaceAll("ऍड क्लोज सिंगल कोट", "'")
    .replaceAll("ऍड ओपन डबल कोट", '"')
    .replaceAll("ऍड क्लोज डबल कोट", '"')
    .replaceAll("ऍड ओपन ब्रॅकेट", "(")
    .replaceAll("ऍड क्लोज ब्रॅकेट", ")")
    .replaceAll("ऍड पर्सेंट", "%")
    .replaceAll("ऍड पर्सेंट", "%")
    .replaceAll("ऍड at the rate", "@")
    .replaceAll("ऍड एक्सलमेशन मार्क", "!")
    .replaceAll("ऍड क्वेश्चन मार्क", "?")
    .replaceAll("ऍड अँपरसँड", "&")
    // .replaceAll("हॅशटॅग", "#")
    // .replaceAll("हॅश टॅग", "#")
    .replaceAll("ऍड न्यू लाईन", "<br/>")
    .replaceAll("ऍड न्यू लाइन", "<br/>")
    .replaceAll("ऍड न्यू प्यारा", "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
    .replaceAll("ऍड न्यू पैरा", "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
    .replaceAll("ऍड न्यू लाईन", "<br/>")
    .replaceAll("ऍड न्यू प्यारा", "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
    .replaceAll("ऍड बोल्ड","<strong>")
    .replaceAll("एन्ड बोल्ड", "</strong>")
    .replaceAll("अँड बोल्ड", "</strong>")
    .replaceAll("एंड बोल्ड", "</strong>")
    .replaceAll("ऍड इटॅलिक ", "<em>")
    .replaceAll("अँड इटॅलिक ", "</em>")
    .replaceAll("एन्ड इटॅलिक ", "</em>")
    .replaceAll("ऍड अंडरलाईन ", "<u>")
    .replaceAll("अँड अंडरलाईन ", "</u>")
    .replaceAll("एन्ड अंडरलाईन ", "</u>")
    .replaceAll("ऍड स्ट्राईक ", "<s>")
    .replaceAll("अँड स्ट्राईक ", "</s>")
    .replaceAll("एन्ड स्ट्राईक ", "</s>")
    .replaceAll("ऍड सब ", "<sub>")
    .replaceAll("अँड सब ", "</sub>")
    .replaceAll("एन्ड सब ", "</sub>")
    .replaceAll("ऍड सुपर ", "<sup>")
    .replaceAll("अँड सुपर ", "</sup>")
    .replaceAll("एन्ड सुपर ", "</sup>")
    .replaceAll("ऍड सूपर ", "<sup>")
    .replaceAll("अँड सूपर ", "<sup>")
    .replaceAll("एन्ड सूपर ", "<sup>")
  }

  return replacedwords;
}

let p;

function speechtoText() {

  if (!speechRecognition) {
    console.error("Speech Recognition API is not supported in this browser.");
    return;
  }

  recognition = new speechRecognition();
  recognition.lang = languageSelect.value;
  recognition.interimResults = true;
  recognition.continuous = true;
    
  let p = document.createElement("span");
  resultText.appendChild(p);

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

      let processedTranscript = handleTextTransformations(transcript);
      processedTranscript = wordConcat(processedTranscript, recognition.lang);
      
      let selectedFont = fontName.value;
      let selectedSize = fontSizeRef.value;  

      // insertTextAtCaret(resultText, processedTranscript, selectedFont, selectedSize);
      p.style.fontFamily = selectedFont;
      p.style.fontSize = selectedSize;
      p.innerHTML = processedTranscript;
    
  }); 

  recognition.onerror = (event) => {
      console.error("Error:" , event.error);
  };
}

start.addEventListener('click', function () {
  speechtoText();
  recognition.start();
});

stop.addEventListener('click', function(){
  if(recognition) {
    recognition.stop();
  }
});

}
