const express = require('express');
const axios = require('axios');

const app = express();

async function atualizarStatus() {

    console.log('INICIANDO REQUEST');

    try {

        const response = await axios.get(
            'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981'
        );

        console.log('STATUS:', response.status);

        console.log('RESPOSTA:', response.data);

    } catch (error) {

        console.log('ERRO');

        if (error.response) {

            console.log('HTTP:', error.response.status);
            console.log(error.response.data);

        } else {

            console.log(error.message);

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
    console.log('Servidor iniciado');
});