const express = require('express');
const puppeteer = require('puppeteer');   // substitui o axios

const app = express();

async function atualizarStatus() {
    console.log('INICIANDO REQUEST COM PUPPETEER');

    let browser;
    try {
        // Inicia o navegador headless (modo moderno)
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']  // importante para ambientes como Render
        });

        const page = await browser.newPage();

        // Configura um User-Agent realista e viewport
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        // Acessa a URL e aguarda a resolução do desafio e carregamento completo da página
        await page.goto('https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981', {
            waitUntil: 'networkidle0',  // espera todos os scripts e conexões terminarem
            timeout: 30000
        });

        // Após a execução do JavaScript, obtemos o conteúdo final da página (texto puro)
        const conteudo = await page.evaluate(() => document.body.innerText.trim());
        console.log('RESPOSTA FINAL:', conteudo || '(vazio)');

        // Também podemos obter o HTML completo se necessário
        // const html = await page.content();

    } catch (error) {
        console.log('ERRO NO PUPPETEER');
        if (error.message) {
            console.log('Mensagem:', error.message);
        }
        // Captura erros de navegação ou timeout
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
    console.log('Servidor iniciado na porta ' + PORT);
});