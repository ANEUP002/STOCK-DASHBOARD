const http = require('http');
const cors = require('cors'); // Import cors
const config = require('./stockServerConfigV3.json');

// Function to calculate random variations
function getRand(varRange, upOnly) {
    return Math.floor(Math.random() * (upOnly ? varRange : 2 * varRange) - (upOnly ? 0 : varRange));
}

// Stock class to handle stock data and operations
class Stock {
    constructor(ticker, initPrice, rate, name, baseVolume, volRate, volTrend) {
        this.ticker = ticker;
        this.lastPrice = parseFloat(initPrice);
        this.rate = parseFloat(rate);
        this.fullName = name;
        this.volume = parseInt(baseVolume);
        this.volRate = parseFloat(volRate);
        this.volTrend = volTrend;
    }

    trade() {
        this.lastPrice += getRand(this.lastPrice * Math.abs(this.rate), this.rate >= 0);
        this.volume += getRand(this.volume * this.volRate, this.volTrend === "up");
    }
}

let stocks = config.stocks.reduce((acc, ticker) => {
    const stockConfig = config[ticker];
    acc[ticker] = new Stock(ticker, stockConfig.initPrice, stockConfig.rate, stockConfig.fullName, stockConfig.baseVolume, stockConfig.volumeRate, stockConfig.volumeTrend);
    return acc;
}, {});

// CORS options, adjust as needed or use cors() for default settings
const corsOptions = {
    origin: 'http://localhost:3000', // This is the default URL for React's local server
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Create an HTTP server
const server = http.createServer((req, res) => {
    cors(corsOptions)(req, res, () => {}); // Apply CORS middleware to handle CORS preflight requests

    const path = req.url.substr(1).toUpperCase(); // Get the path and convert to uppercase

    if (path === "") { // Check if the path is the root
        const instructions = {
            message: "Welcome to the Stock API. Use the following endpoints to access stock data:",
            endpoints: config.stocks.map(stock => `http://${config.hostname}:${config.port}/${stock}`),
            example: `Try http://${config.hostname}:${config.port}/IBM for IBM stock data`
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(instructions));
    } else if (path !== "FAVICON.ICO") {
        const stock = stocks[path];
        if (stock) {
            stock.trade();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                ticker: stock.ticker,
                name: stock.fullName,
                price: stock.lastPrice.toFixed(2),
                volume: stock.volume
            }));
        } else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: "Stock not found" }));
        }
    }
});

server.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
});
