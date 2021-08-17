const fs = require("fs");
const PDFParser = require("pdf2json");


const files = fs.readdirSync("notas");


let notes = [];


(async () => {

    
    await Promise.all(files.map(async (file) => {

      
        let pdfParser = new PDFParser(this, 1);

        pdfParser.loadPDF(`notas/${file}`);

    
        let note = await new Promise(async (resolve, reject) => {

           
            pdfParser.on("pdfParser_dataReady", (pdfData) => {

               
                const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");

                
                resolve({
                    rawdata:raw
                });

            });

        });

        
        notes.push(note);

    }));

    fs.writeFileSync("notes.json", JSON.stringify(notes));

})();  