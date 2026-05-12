const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const app = express();

const URL =
'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981';

let executando = false;

async function executar() {

    if (executando) return;

    executando = true;

    let browser;

    try {

        console.log('INICIANDO');

        browser = await puppeteer.launch({

            args: chromium.args,

            defaultViewport: chromium.defaultViewport,

            executablePath: await chromium.executablePath(),

            headless: chromium.headless

        });

        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
        );

        await page.goto(URL, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        await new Promise(r => setTimeout(r, 5000));

        const texto = await page.evaluate(() => document.body.innerText);

        console.log('RESPOSTA:');
        console.log(texto);

    } catch (e) {

        console.log('ERRO');
        console.log(e);

    } finally {

        if (browser) {
            await browser.close();
        }

        executando = false;
    }
}

app.get('/ping', async (req, res) => {

    await executar();

    res.send('OK');
});

app.get('/', (req, res) => {

    res.send('Render Online');
});

setInterval(executar, 300000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log('Servidor iniciado');
});