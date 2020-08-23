// REQUIREMENTS
const axios = require('axios')
const $ = require('cheerio')
const fs = require('fs');

// URL OF WEBSITE TO BE SCRAPED
const url = 'https://www.rettie.co.uk/all-property-for-sale/sales/tag-house/up-to-750000?page_size=100'


axios.get(url)
    .then(res => {                    // FETCH RAW HTML
        return getHtmlData(res.data)  // SEND RAW HTML TO FILTER
    })
    .then(res => {  

        // WRITE JSON FILE WITH FILTERED HTML DATA

        const housesJSON = JSON.stringify(res)
        fs.writeFile('houses.json', housesJSON, function (err) {
            if (err) return console.log(err);
            console.log('done');
          });
    })
    .catch(err => {
        console.log(err);
    })

getHtmlData = (html) => {

    //Create empty array for houses
    let houses = []

    // Isolate houses table html
    let housesTableHTML = $(' .results', html)[0].children

    // Map required data
    let bedrooms = $(' .property-meta', housesTableHTML)
    let addresses = $(' div > strong', housesTableHTML)
    let prices = $(' .block-content > .h7', housesTableHTML)
    let images = $(' .block-image > img', housesTableHTML)
    
    for (i = 0; i < 98; i ++) {
        let house = {}

        house.id = i
        house.parent_category = "Property"
        house.category = "House"
        house.address = addresses[i].children[0].data
        house.price = prices[i].children[0].data

        const image = images[i].attribs.src
        house.img = "http:" + image

        const bedroom = bedrooms[i].children[2].data
        house.berooms = bedroom.replace(/\s/g, "")

        houses.push(house)
    }

    return houses

}




