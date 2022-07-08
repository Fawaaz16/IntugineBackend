const express = require('express')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const Customer = require('./models/customer')
const PurchaseOrder = require('./models/purchaseOrder')
const ShippingDetail = require('./models/shippingDetail')


//Database Connection
const url = 'mongodb://localhost/API';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log('Database connected...'))
    .catch((err) => console.log(err))  


app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000


app.get('/', (req, res) => {
    res.send('Hello')
})





//1.Add Customer Details
app.post('/customer', (req, res) => {
    console.log(req.body)
    const {name, email, number, city} = req.body
    if (!name || !email || !number || !city) {
        return res.send('Enter all the details')
    }

    const customer = new Customer({
        name,
        email,
        number,
        city
    })

    customer.save()
    .then( () => 
        console.log('Customer details saved')
    )
    .catch((err) => console.log(err))  
    res.redirect('/')
})






//2.Purchase Order
app.post('/purchaseOrder', (req, res) => {
    //console.log(req.body)
    const {productName, quantity, pricing, MRP, customerId} = req.body
    if ( !productName || !quantity || !pricing || !MRP || !customerId) {
        res.end('Enter all the details')
        return res.redirect('back')
    }

    if (quantity*MRP<pricing) {
        return res.end('The price of the purchased item is greater than its MRP')
    }

    const purchaseOrder = new PurchaseOrder({
        productName,
        quantity,
        pricing,
        MRP,
        customerId
    })

    purchaseOrder.save()
    .then( () => 
        console.log('purchaseOrder details saved')
    )
    .catch((err) => console.log(err))  
    res.redirect('/')
})





//3.Shipping
app.post('/shippingDetail', (req, res) => {
    const {address, city, pincode, purchaseId, customerId} = req.body
    if (!address || !city || !pincode || !purchaseId || !customerId) {
        return res.send('Enter all the details')
    }

    const shippingDetail = new ShippingDetail({
        address,
        city,
        pincode,
        purchaseId,
        customerId
    })

    shippingDetail.save()
    .then( () => 
        console.log('Shipping Details details saved')
    )
    .catch((err) => console.log(err))  
    res.redirect('/')
})




//4.Customers with shipment with city filter

async function fetch(City){
    const data = await ShippingDetail.find({city: City})
    let arr=[]
    const promisesToAwait = [];
    for (let i = 0; i < data.length; i++) {
        promisesToAwait.push(Customer.find({_id: data[i].customerId} ));
    }
    const response = await Promise.all(promisesToAwait)
    return response
    //await fetch1(data)
    // .then( (res) => 
    //    {return res}
    // )
    // .catch((err) => console.log(err))  
    //console.log(arr1)
    //return arr1
}


app.post('/shipment_cityFilter', async (req, res) => {
    //console.log(req.body)
    const { City } = req.body
    if (!City) {
        return res.send('Enter the city')
    }
    await fetch(City)
    .then( (ress) => 
       //console.log(ress)
       {res.send(ress)}
    )
    .catch((err) => console.log(err))  
})








//5.Customers with all purchase orders

app.get('/customers_purchaseOrders', async (req, res) => {
    const data = await Customer.find()
    let arr=[]
    for(i=0;i<data.length;i++){
        let data1= await PurchaseOrder.find({customerId: data[i]._id})
        let response = await Promise.all(data1)
        arr.push({customerId: data[i]._id, purchaseOrder: response})
    }
    return res.send(arr)

})


//6.Customers with all purchase orders and shipment details

app.get('/customers_purchaseOrdersShipment', async (req, res) => {
    const data = await Customer.find()
    let arr=[]
    for(i=0;i<data.length;i++){
        let data1= await PurchaseOrder.find({customerId: data[i]._id})
        let response1 = await Promise.all(data1)
        for(j=0;j<response1.length;j++){
            let data2 = await ShippingDetail.find({purchaseId: response1[j]._id})
            let response2 = await Promise.all(data2)
            response1[j].push(response2)
        }
        arr.push({customerId: data[i]._id, purchaseOrder: response1})
    }
    return res.send(arr)

})














app.listen(PORT, () => {
    console.log('Listening to port 3000')
})