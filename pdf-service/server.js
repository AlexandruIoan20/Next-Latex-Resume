const express = require('express'); 
const fs = require('fs').promises; 
const { exec } = require('child_process'); 
const path = require('path'); 
const crypto = require('crypto'); 

const app = express(); 
app.use(express.json({ limit: "10mb" })); 

app.post('/generate-pdf', async(req, res) => { 
    const { tex } = req.body; 
    if(!tex) return res.status(400).send("No tex provided."); 

    const id = crypto.randomBytes(16).toString('hex'); 
    const workDir = path.join(__dirname, 'tmp', id); 
    const texFile = path.join(workDir,'resume.tex'); 
    const pdfFile = path.join(workDir, 'resume.pdf');

    try {
        await fs.mkdir(workDir, { recursive: true });
        await fs.writeFile(texFile, tex);

        exec(`pdflatex -interaction=nonstopmode -output-directory="${workDir}" "${texFile}"`, async (error, stdout, stderr) => { 
            if (error) {
                console.error("Eroare la compilarea LaTeX:\n", error);
            }

            try { 
                const pdfBuffer = await fs.readFile(pdfFile); 
                res.setHeader('Content-Type', 'application/pdf'); 
                res.send(pdfBuffer); 
            } catch (readErr) { 
                res.status(500).send("A apărut o eroare la generarea PDF-ului.");
            } finally { 
                await fs.rm(workDir, { recursive: true, force: true }); 
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Eroare de server la scrierea fișierelor.");
    }
}); 

app.listen(4050, () => console.log('Listening on 4050'));