// REQUIREMENTS
const axios = require('axios')
const $ = require('cheerio')
const fs = require('fs');

// URL OF WEBSITE TO BE SCRAPED
const url = 'https://www.rettie.co.uk/all-property-for-sale/sales/tag-apartment/up-to-750000?page_size=100'


axios.get(url)
    .then(res => {                    // FETCH RAW HTML
        return getHtmlData(res.data)  // SEND RAW HTML TO FILTER
    })
    .then(res => {  

        // WRITE JSON FILE WITH FILTERED HTML DATA

        const flatsJSON = JSON.stringify(res)
        fs.writeFile('flats.json', flatsJSON, function (err) {
            if (err) return console.log(err);
            console.log('done');
          });
    })
    .catch(err => {
        console.log(err);
    })

getHtmlData = (html) => {

    //Create empty array for flats
    let flats = []

    // Isolate flats table html
    let flatsTableHTML = $(' .results', html)[0].children

    // Map required data
    let bedrooms = $(' .property-meta', flatsTableHTML)
    let addresses = $(' div > strong', flatsTableHTML)
    let prices = $(' .block-content > .h7', flatsTableHTML)
    let images = $(' .block-image > img', flatsTableHTML)
    
    for (i = 0; i < 98; i ++) {
        let flat = {}

        flat.id = i + 98
        flat.parent_category = "Property"
        flat.category = "Flat"
        flat.address = addresses[i].children[0].data
        flat.price = prices[i].children[0].data

        const image = images[i].attribs.src
        flat.img = "http:" + image

        const bedroom = bedrooms[i].children[2].data
        flat.berooms = bedroom.replace(/\s/g, "")

        flats.push(flat)
    }

    return flats

}




