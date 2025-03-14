export function handleRecognition() {
  let isStoppedByUser = false; // Add this line
  const resultText = document.getElementById('speech-text');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const languageSelect = document.getElementById('lang');
  const fontName = document.getElementById('fonts');
  const fontSizeRef = document.getElementById('size');

  let speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
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

    const symbolMappings = {
      "open bracket": "(", "close bracket": ")",
      "bracket opened": "(", "bracket closed": ")",
      "opened bracket": "(", "closed bracket": ")",
      
      "square bracket open": "[", "square bracket close": "]",
      "open square bracket": "[", "close square bracket": "]",
      "square bracket opened": "[", "square bracket closed": "]",

      "curly bracket open": "{", "curly bracket close": "}",
      "open curly bracket": "{", "close curly bracket": "}",
      "curly bracket opened": "{", "curly bracket closed": "}",

      "angle bracket open": "<", "angle bracket close": ">",
      "open angle bracket": "<", "close angle bracket": ">",

      "comma": ",", "full stop": ".", "fullstop": ".",
      "fullstops": ".",
      "dot": ".", "ellipsis": "...", "triple dot": "...",

      "question mark": "?", "exclamation mark": "!",
      "colon": ":", "semicolon": ";",
      
      "hyphen": "-", "dash": "—", "em dash": "—", "en dash": "–",
      
      "open double quote": "“", "close double quote": "”",
      "opening double quote": "“", "closing double quote": "”",
      
      "single quote": "'", "single quotes": "'",
      "double quote": "\"", "double quotes": "\"",
      
      "open single quote": "‘", "close single quote": "’",
      "opening single quote": "‘", "closing single quote": "’",
      
      "open single quotes": "‘", "close single quotes": "’",
      "opening single quotes": "‘", "closing single quotes": "’",
      
      "apostrophe": "’", "straight apostrophe": "'",
      
      "backtick": "`", "tilde": "~",
      
      "paragraph": "¶", "section": "§",
      
      "article": "Art.", "versus": "v.",
      "per cent": "%", "percent": "%", "percentage": "%",
      
      "honourable": "Hon'ble", "his lordship": "His Lordship",
      "her ladyship": "Her Ladyship", "learned counsel": "Ld. Counsel",
      
      "asterisk": "*", "hash": "#", "number sign": "#",
      "at symbol": "@", "ampersand": "&",
      
      "underscore": "_", "plus": "+", "minus": "-",
      
      "forward slash": "/", "backslash": "\\",
      "slash": "/", 
      
      "pipe": "|", "vertical bar": "|",
      
      "caret": "^", "circumflex": "^",
      
      "equal sign": "=", "not equal": "≠",
      
      "greater than": ">", "less than": "<",
      "greater than or equal to": "≥", "less than or equal to": "≤",

      "left arrow": "←", "right arrow": "→",
      "up arrow": "↑", "down arrow": "↓",
      
      "currency dollar": "$", "currency euro": "€",
      "currency pound": "£", "currency yen": "¥"
    };

    // Replace phrases with their corresponding symbols
    Object.keys(symbolMappings).forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi'); // Match whole words, case insensitive
      text = text.replace(regex, symbolMappings[key]);
    });

    if (lang === 'en') {
      replacedwords = text.replaceAll(/underscore/gi, "_")
        .replaceAll(/under score/gi, "_")
        .replaceAll(/copyright symbol/gi, "©")
        .replaceAll(/vertical bar/gi, "|")
        .replaceAll(/\bfull stop\b/gi, ".")
        .replaceAll(/\bfullstop\b/gi, ".")
        .replaceAll(/\bstop\b/gi, ".")
        .replaceAll(/colon/gi, ":")
        .replaceAll(/semi colon/gi, ";")
        .replaceAll(/dash/gi, "-")
        .replaceAll(/space/gi, " ")
        .replaceAll(/apostrophe/gi, "`")
        .replaceAll(/coma/gi, ",")
        .replaceAll(/comma/gi, ",")
        .replaceAll(/double quote/gi, '"')
        .replaceAll(/double coat/gi, '"')
        .replaceAll(/open bracket/gi, "(")
        .replaceAll(/close bracket/gi, ")")
        .replaceAll(/percent/gi, "%")
        .replaceAll(/percentage/gi, "%")
        .replaceAll(/at the rate/gi, "@")
        .replaceAll(/exclamation mark/gi, "!")
        .replaceAll(/question mark/gi, "?")
        .replaceAll(/ampersand/gi, "&")
        .replaceAll(/and sign/gi, "&")
        .replaceAll(/new line/gi, "<br/>")
        .replaceAll(/new paragraph/gi, "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
        .replaceAll(/bold/gi, "<strong>")
        .replaceAll(/no bold/gi, "</strong>")
        .replaceAll(/italic/gi, "<em>")
        .replaceAll(/no italic/gi, "</em>")
        .replaceAll(/underline/gi, "<u>")
        .replaceAll(/no underline/gi, "</u>")
        .replaceAll(/strike/gi, "<s>")
        .replaceAll(/no strike/gi, "</s>")
        .replaceAll(/sub/gi, "<sub>")
        .replaceAll(/no sub/gi, "</sub>")
        .replaceAll(/super/gi, "<sup>")
        .replaceAll(/no super/gi, "</sup>");
    } else {
      replacedwords = text.replaceAll("अंडरस्कोर", "_")
        .replaceAll("कॉपीराइट सिंबोल", "©")
        .replaceAll("वर्टीकल बार", "|")
        .replaceAll("फुलस्टॉप", ". ")
        .replaceAll("स्टॉप", ". ")
        .replaceAll("कोलन", ":")
        .replaceAll("सेमी कोलन", ";")
        .replaceAll("डॅश", "-")
        .replaceAll("स्पेस", " ")
        .replaceAll("अपोस्ट्रॉफी", "`")
        .replaceAll("कॉमा", ",")
        .replaceAll("ओपन सिंगल कोट", "'")
        .replaceAll("क्लोज सिंगल कोट", "'")
        .replaceAll("ओपन डबल कोट", '"')
        .replaceAll("क्लोज डबल कोट", '"')
        .replaceAll("ओपन ब्रॅकेट", "(")
        .replaceAll("क्लोज ब्रॅकेट", ")")
        .replaceAll("पर्सेंट", "%")
        .replaceAll("एक्सलमेशन मार्क", "!")
        .replaceAll("क्वेश्चन मार्क", "?")
        .replaceAll("अँपरसँड", "&")
        .replaceAll("न्यू लाईन", "<br/>")
        .replaceAll("न्यू प्यारा", "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;")
        .replaceAll("बोल्ड", "<strong>")
        .replaceAll("एन्ड बोल्ड", "</strong>")
        .replaceAll("इटॅलिक", "<em>")
        .replaceAll("एन्ड इटॅलिक", "</em>")
        .replaceAll("अंडरलाईन", "<u>")
        .replaceAll("एन्ड अंडरलाईन", "</u>")
        .replaceAll("स्ट्राईक", "<s>")
        .replaceAll("एन्ड स्ट्राईक", "</s>")
        .replaceAll("सब", "<sub>")
        .replaceAll("एन्ड सब", "</sub>")
        .replaceAll("सुपर", "<sup>")
        .replaceAll("एन्ड सुपर", "</sup>");
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

    recognition.onend = () => {
      if (!isStoppedByUser) {
        recognition.start(); // Restart if not stopped by user
      }
    };

    
    p = document.createElement("span");
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

      p.style.fontFamily = selectedFont;
      p.style.fontSize = selectedSize;
      p.innerHTML = processedTranscript;
    }); 

    recognition.onerror = (event) => {
      console.error("Error:", event.error);
    };
  }

  // Update the stop button event listener
  stop.addEventListener('click', function(){
    if(recognition) {
      isStoppedByUser = true; // Set flag to true
      recognition.stop();
    }
  });

  // Reset the flag when starting again
  start.addEventListener('click', function () {
    isStoppedByUser = false; // Reset flag
    speechtoText();
    recognition.start();
  });
}
