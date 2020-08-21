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

        // const birdsJSON = JSON.stringify(res)
        // fs.writeFile('birds.json', birdsJSON, function (err) {
        //     if (err) return console.log(err);
        //     console.log('done');
        //   });
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
    let prices = $(' .block-content > p', housesTableHTML)
    let images = $(' .block-image > img', housesTableHTML)

    // console.log(bedrooms[0].children[2].data);
    // console.log(addresses[3].children[0].data);
    // console.log(prices[0].children[0].data); // evens 
    // console.log(images[1].attribs.src); // evens 

    for (i = 0; i < 98; i ++) {
        let y = 0
        let house = {}

        // console.log(i);

        house.id = i
        house.address = addresses[i].children[0].data
        house.price = prices[y].children[0].data
        house.bedrooms = bedrooms[i].children[2].data
        house.img = images[i].attribs.src

        houses.push(house)
        y += 2
    }

    console.log(houses);

    // let family = ($('.mw-headline', html)[i].attribs.id.replace(/_/g, " "))
    // console.log(`length: ${(tables[i].children.length - 1) /2}`);
    // bird.name = $('td > a', html)[j].attribs.title
           
}




