const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const app = express();

const URL =
'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981';

async function executar() {

    let browser;

    try {

        console.log('ABRINDO');

        browser = await puppeteer.launch({

            args: chromium.args,

            executablePath: await chromium.executablePath(),

            headless: true

        });

        const page = await browser.newPage();

        await page.goto(URL, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await new Promise(r => setTimeout(r, 5000));

        const texto = await page.evaluate(() => document.body.innerText);

        console.log(texto);

    } catch (e) {

        console.log('ERRO');
        console.log(e.message);

    } finally {

        if (browser) {
            await browser.close();
        }
    }
}

app.get('/ping', async (req, res) => {

    await executar();

    res.send('OK');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('ONLINE');
});