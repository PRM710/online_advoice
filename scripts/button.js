export function handleButtons() {

var textArea = document.getElementById('speech-text');
var optionsButtons = document.querySelectorAll('.color-btn2');
const dashboardReturn = document.getElementById('dash');
const profile = document.getElementById('prof');
const howtoUse = document.getElementById('htu');

//Text Formatting
const modifyText = (command, defaultUi, value) => {
    //execCommand executes command on selected text
    document.execCommand(command, defaultUi, value);
    };

    document.querySelectorAll('.color-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.color-btn2').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn2').forEach(btn => {
                 btn.classList.remove('active');
            });
        
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.color-btn3').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn3').forEach(btn => {
                btn.classList.remove('active');
            });
        
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.color-btn4').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn4').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.color-btn5').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn5').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
    document.querySelectorAll('.color-btn6').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.color-btn6').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });

//Clear Text
var cleartext = document.getElementById('clear');
cleartext.addEventListener('click', function() {
    textArea.innerHTML = '';
}, false);

// // import { Document, Packer, Paragraph, TextRun } from "docx";
// import { saveAs } from "file-saver";

//Download
$(document).ready(function() {
    
    $('#download').on('click', function() {
        // Get the content from the contenteditable div
        var content = $('#speech-text').html();
        var textContent = $('<div>').html(content).text();
        Export2Word(textContent);
    });
    function Export2Word(textContent) {
        var preHtml = '<html><head><meta charset="utf-8"></head><body>';
        var postHtml = '</body></html>';
        var fullHtml = preHtml + textContent + postHtml;

        var convt = htmlDocx.asBlob(fullHtml);
        // var blob = new Blob([textContent], {type: "text/plain;charset=utf-8"});
        saveAs(convt, "draft.docx");
    }
});


//Routing
// dashboardReturn.addEventListener('click', function() {
//     window.location.href = 'home.html';
// });
// profile.addEventListener('click', function(){
//     window.location.href = "profile.html"
// });

//Insert punctuation
$(document).ready(function () {
    function addPunc(punctuation){
        const textArea = $('#speech-text');
        const currentText = textArea.html();

        textArea.html(currentText + punctuation);
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(textArea[0]);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        textArea.focus();
    }
    $(".punc").on('click', function () {
        const punctuation = $(this).data('punc');
        addPunc(punctuation);
    });
    $(".punc-name").on('click', function () {
        const punctuation = $(this).data('punc');
        addPunc(punctuation);
    });
});
}
