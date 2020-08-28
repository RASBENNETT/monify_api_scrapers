// REQUIREMENTS
const axios = require('axios')
const $ = require('cheerio')
const fs = require('fs');

const housesPromise = axios.get('https://www.rettie.co.uk/all-property-for-sale/sales/tag-house/up-to-750000?page_size=100')
const flatsPromise = axios.get('https://www.rettie.co.uk/all-property-for-sale/sales/tag-apartment/up-to-750000?page_size=100')

const properties = []
let id = 0

Promise.all([housesPromise, flatsPromise])
    .then(([housesHtml, flatsHtml]) => {
        dataConstructor(housesHtml.data, "House")
        dataConstructor(flatsHtml.data, "Flat")
        return properties
    })
    .then(res => {
        const propertiesJSON = JSON.stringify(res)
        fs.writeFile('jsonStore/properties.json', propertiesJSON, function (err) {
            if (err) return console.log(err);
            console.log('done');
          });

    })
    .catch(err => {
        console.log(err);
    })

dataConstructor = (html, category) => {

    // Isolate houses table html
    let housesTableHTML = $(' .results', html)[0].children

    // Map required data
    let bedrooms = $(' .property-meta', housesTableHTML)
    let addresses = $(' div > strong', housesTableHTML)
    let prices = $(' .block-content > .h7', housesTableHTML)
    let images = $(' .block-image > img', housesTableHTML)
    
    for (i = 0; i < 98; i ++) {
        let property = {}
        console.log(i);
        property.id = id
        property.parent_category = "Property"
        property.category = category
        property.address = addresses[i].children[0].data

        const priceString = prices[i].children[0].data
        const priceInt = priceString.split('£')[1]

        priceInt ? property.price = parseInt(priceInt.replace(',', '')) : property.price = "On Request"
        // property.price = prices[i].children[0].data

        const image = images[i].attribs.src
        property.img = "http:" + image

        const bedroom = bedrooms[i].children[2].data
        property.berooms = bedroom.replace(/\s/g, "")

        properties.push(property)
        id ++
    }

}
