const express = require('express')
const app = express()
const fetch = require('node-fetch');
var cors = require('cors')

let cachedData;
const port = 9909;

app.use(cors());

app.get('/', function (req, res) {

    const Chart1HRPM25 = cachedData.Chart1HRPM25.West.Data;
    const ChartPM25 = cachedData.ChartPM25.West.Data;
    const curr25 = Chart1HRPM25[Chart1HRPM25.length - 1];
    const currPSI = ChartPM25[ChartPM25.length - 1];
    res.send({ curr25, currPSI})
})

app.get('/psi', function (req, res) {
    res.send(cachedData)
})

getPSI()
setInterval(function () {
    getPSI()
}, 30 * 60 * 1000);

function getPSI() {
    const now = parseInt((+new Date()) / 1000, 10);
    fetch(`https://www.haze.gov.sg/api/airquality/jsondata/${now}`,
        {
            "method": "GET",
            "headers": {},
            "mode": "cors"
        }).then(
            function (response) {
                if (response.status !== 200) {
                    console.log(response);
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function (data) {
                    // console.log(data);
                    const Chart1HRPM25 = data.Chart1HRPM25.West.Data;
                    const ChartPM25 = data.ChartPM25.West.Data;
                    // console.log(Chart1HRPM25)
                    const curr25 = Chart1HRPM25[Chart1HRPM25.length - 1];
                    const currPSI = ChartPM25[ChartPM25.length - 1];
                    console.log(port, now, currPSI, curr25)
                    cachedData = data;
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}


app.listen(port);