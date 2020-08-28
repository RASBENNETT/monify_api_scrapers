const fs = require("fs")

const fashion = require("./jsonStore/fashion.json")
const properties = require("./jsonStore/properties.json")

const store = {}

store.properties = properties
store.fashion = fashion

const storeJSON = JSON.stringify(store)
fs.writeFile('store.json', storeJSON, function (err) {
    if (err) return console.log(err);
    console.log('done');
});

