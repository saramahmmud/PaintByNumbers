`use strict`

const express = require("express");
const app = express();

const port = process.env.PORT || 8000;

const forceHTTPS = (req, res, next) => {
    if (req.protocol === "https" || req.headers.host.split(":")[0] === "localhost") {
        next();
    } else {
        res.redirect("https://" + req.headers.host + req.url);
    }
}

app.enable('trust proxy');
app.use(forceHTTPS);

app.use((req, res, next) => {
    req.method = "GET";
    next();
});

const _app_folder = './frontend/dist/frontend';

app.get('*.*', express.static(_app_folder, { maxAge: '1y' }));
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: _app_folder });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});