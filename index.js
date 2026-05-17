const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const app = express();

async function atualizarStatus() {
    console.log('INICIANDO REQUEST COM PUPPETEER-CORE + CHROMIUM');

    let browser;
    try {
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log('Navegando para a URL...');
        await page.goto('https://recargapro.gt.tc/atualiza_todos_status.php?token=VS_87443981', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Aguarda 2 segundos extras (garante execução de scripts pendentes)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const conteudo = await page.evaluate(() => document.body.innerText.trim());
        console.log('RESPOSTA FINAL:', conteudo || '(vazio)');

    } catch (error) {
        console.log('ERRO AO ATUALIZAR STATUS');
        console.error(error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

app.get('/ping', async (req, res) => {
    console.log('PING RECEBIDO');
    await atualizarStatus();
    res.send('OK');
});

app.get('/', (req, res) => {
    res.send('Render Cron Online');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});