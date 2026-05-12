const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

async function executar() {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(
        'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981',
        {
            waitUntil: 'networkidle2',
            timeout: 60000
        }
    );

    const content = await page.content();

    console.log(content);

    await browser.close();
}

app.get('/ping', async (req, res) => {

    try {

        await executar();

        res.send('OK');

    } catch (e) {

        console.log(e);

        res.send('ERRO');
    }
});

app.listen(3000);