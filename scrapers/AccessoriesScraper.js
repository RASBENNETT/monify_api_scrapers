const axios = require('axios')
const $ = require('cheerio')
const fs = require('fs');

const womensBags = axios.get("https://www.harveynichols.com/womens/all-accessories/bags//sort_by=high_to_low/")
const mensWatches = axios.get("https://www.harveynichols.com/mens/all-accessories/watches//sort_by=high_to_low/")
const mensSunglasses = axios.get("https://www.harveynichols.com/mens/all-accessories/sunglasses//sort_by=high_to_low/")

let fashion = []
let id = 0

Promise.all([womensBags, mensWatches, mensSunglasses])
  .then(([womensBagsHtml, mensWatchesHtml, mensSunglassesHtml]) => {
        dataConstructor(womensBagsHtml.data, "Handbag", "Womens")
        dataConstructor(mensWatchesHtml.data, "Watch", "Mens")
        dataConstructor(mensSunglassesHtml.data, "Sunglasses", "Mens")
        return fashion
    })
    .then(res => {
        const fashionJSON = JSON.stringify(res)
        fs.writeFile('jsonStore/fashion.json', fashionJSON, function (err) {
            if (err) return console.log(err);
            console.log('done');
        });

    })
    .catch(err => {
        console.log(err);
    })

dataConstructor = (html, category, gender) => {

// Isolate houses table html
    let productTableHTML = $(' .items__list', html)[0].children

// Map required data
    let brands = $(' .product__brand', productTableHTML)
    //[0].children[0].data
    // console.log(brands);
    let names = $(' .product__name', productTableHTML)
    //[0].children[0].data
    // console.log(names);
    let prices = $(' .price', productTableHTML)

    let images = $(' .product__image', productTableHTML)
    //[0].children[0].data



for (i = 0; i < 60; i ++) {
    let product = {}
    console.log(i);
    product.id = id
    product.parent_category = "Fashion"
    product.category = category
    product.gender = gender

    product.brand = brands[i].children[0].data

    product.name = names[i].children[0].data

    const priceString = prices[i].children[0].data
    const priceInt = priceString.split('£')[1]
    priceInt ? product.price = parseInt(priceInt.replace(',', '')) : product.price = "On Request"

    images[i].attribs ? product.img = images[i].attribs.src : product.img = "No Image"

    fashion.push(product)
    id ++
}

}