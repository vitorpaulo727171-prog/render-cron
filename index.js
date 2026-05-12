const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const URL =
'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981';

let executando = false;
let ultimaExecucao = null;

// Função principal
async function executar() {

    if (executando) {
        console.log('Já existe uma execução em andamento');
        return;
    }

    executando = true;

    let browser;

    try {

        console.log('================================');
        console.log('INICIANDO:', new Date().toISOString());

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        });

        const page = await browser.newPage();

        // User Agent real
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
        );

        // Timeout padrão
        page.setDefaultNavigationTimeout(60000);

        // Logs do navegador
        page.on('console', msg => {
            console.log('BROWSER:', msg.text());
        });

        // Acessar página
        await page.goto(URL, {
            waitUntil: 'networkidle2'
        });

        // Esperar JS anti-bot concluir
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Capturar conteúdo
        const content = await page.content();

        // Capturar texto visível
        const bodyText = await page.evaluate(() => {
            return document.body.innerText;
        });

        console.log('RESPOSTA BODY:');
        console.log(bodyText);

        // Verificar sucesso
        if (
            bodyText.includes('Recargas processadas')
        ) {

            console.log('SUCESSO');

        } else {

            console.log('RESPOSTA INESPERADA');

        }

        ultimaExecucao = new Date().toISOString();

    } catch (e) {

        console.log('ERRO GERAL');
        console.log(e.message);

    } finally {

        executando = false;

        if (browser) {
            await browser.close();
        }

        console.log('FINALIZADO');
        console.log('================================');
    }
}

// Endpoint principal
app.get('/ping', async (req, res) => {

    await executar();

    res.send({
        success: true,
        ultimaExecucao
    });
});

// Status
app.get('/', (req, res) => {

    res.send({
        status: 'online',
        ultimaExecucao,
        executando
    });
});

// Auto execução a cada 5 minutos
setInterval(() => {

    executar();

}, 5 * 60 * 1000);

// Executa ao iniciar
executar();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log('SERVIDOR ONLINE');
});