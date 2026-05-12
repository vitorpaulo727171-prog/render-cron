const express = require('express');
const axios = require('axios');

const app = express();

async function atualizarStatus() {

    try {

        const response = await axios.get(
            'https://vsonline.wuaze.com/atualiza_todos_status.php?token=VS_87443981'
        );

        console.log(
            new Date().toISOString(),
            response.data
        );

    } catch (error) {

        console.log(
            new Date().toISOString(),
            error.message
        );

    }
}

// endpoint para uptime robot
app.get('/ping', async (req, res) => {

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
