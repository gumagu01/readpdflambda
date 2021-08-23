const fs = require("fs");
const PDFParser = require("pdf2json");;
var {Buffer} = require('buffer')

const files = [1];

const fileContents = fs.readFileSync('./notasbase64.txt').toString()
let notes = [];

const config = {
    api: {
      bodyParser: false,
    },
  };
  
function base64_decode(base64str, file) {
    var bitmap = Buffer.from(base64str, 'base64');
    fs.writeFileSync(file, bitmap);
    
}

var signatures = {
    JVBERi0: "application/pdf",
  };
  
function detectMimeType(b64) {
    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
}

(async () => {
    console.log(detectMimeType(fileContents));
    const mimetype=detectMimeType(fileContents);
    if(mimetype=='application/pdf'){
        await Promise.all(files.map(async (file) => {

            let pdfParser = new PDFParser(this, 1);
            base64_decode(fileContents, 'copy.pdf');
            pdfParser.loadPDF('copy.pdf');
    
            var regexcpf =/(\d{3}\x2E\d{3}\x2E\d{3}\x2D\d{2})/;
            var regexdata = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/;
            var regexcorretora = /^(.*?(\bCLEAR\b)[^$]*)$/;
    
            let note = await new Promise(async (resolve, reject) => {
    
               
                pdfParser.on("pdfParser_dataReady", (pdfData) => {
    
                   
                    const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
                    
                    var foundcpf = raw.match(regexcpf);
                    var founddata = raw.match(regexdata)
                    var foundcorretora = raw.match(regexcorretora)
                    var result = raw.search("CLEAR");
                    if(result>=0){
                        result = "CLEAR";
                    }else{
                        result ="CLEAR";
                    }
                    resolve({
                        rawdata:raw,
                        cpf:foundcpf[0],
                        data:founddata[0],
                        corretora:result,
                    });
    
                });
    
            });
    
            
            notes.push(note);
    
        }));
        fs.writeFileSync("notes.json", JSON.stringify(notes));
        fs.unlinkSync('copy.pdf')
    }else{
        return "erro";
    }
    

    
})();  