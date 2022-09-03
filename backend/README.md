# Assignment - 3

In this project, we are trying to build a sports club management system which provides online services for club members and maintainers. The project provides comprehensive user manganement system for signup, login, and profile update with forgot password. In addition to the simple and secure user management system, it also has membership management and a payment system for membership, facility reservation management system, community blogging, and global search for users to fully use the online services provided by a typical sports club. In this project, we are also focused on addressing the management issues faced by club maintainers by providing a separate admin module where they can manage club's facilities, events etc. 

* *Date Created*: 15 JUL 2022
* *Last Modification Date*: 15 JUL 2022
* *Application URL*: <https://sportify-prd.herokuapp.com/>
* *Git Backend repository URL*: <https://git.cs.dal.ca/kabtiyal/5709-g10-sportify-backend>
* *Git Frontend repository URL*: <https://git.cs.dal.ca/ajayanthi/5709-group10>

## Authors

* [Alagu Swrnam Karruppiah](al581093@dal.ca) - *(Full Stack Developer for payment and merchandise feature)*
* [Aravind Jayanthi](ar687531@dal.ca) - *(Full Stack Developer for facility reservation management feature and CI-CD pipeline)*
* [Navya Jayapal](nv408879@dal.ca) - *(Full Stack Developer)*
* [Prachi Kabtiyal](pr522601@dal.ca) - *(Full Stack Developer)*
* [Samarth Jariwala](sm228153@dal.ca) - *(Full Stack Developer)*
* [Soham Kansodaria](sh788512@dal.ca) - *(Full Stack Developer)*


## Built With


* [NodeJS](https://nodejs.org/en/) - The language used to write the logic of the backend code.
* [Express](https://expressjs.com/) - The backend framework used to create APIs with proper routing, authentication and authorization.
* [Mongoose](https://mongoosejs.com/) - The Mongoose library is used to connect with MongoDB which is the database for our application. It also provides ORM capabilities to conver the results into JSON with appropriate properties.
* [uuid](https://www.npmjs.com/package/uuid) - This library is used to generate UUID values for the different models used in the project.


## Sources Used

If in completing your lab / assignment / project you used any interpretation of someone else's code, then provide a list of where the code was implement, how it was implemented, why it was implemented, and how it was modified. See the sections below for more details.

### File Name

*Lines ## - ##*

```
Copy and paste your code on lines mentioned 

```

The code above was created by adapting the code in [NAME](link) as shown below: 

```
Copy and paste the snippet of code you are referencing

```

- <!---How---> The code in [NAME](link) was implemented by...
- <!---Why---> [NAME](link)'s Code was used because...
- <!---How---> [NAME](link)'s Code was modified by...

*Repeat as needed*

### File Name - <https://git.cs.dal.ca/kabtiyal/5709-g10-sportify-backend/-/blob/main/models/merchandise.js>

_Lines 3-14_

```
    var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const merchandiseSchema = new Schema({

    product_name: String,
    product_price: Number,
    product_description: String,
    product_image: String,
    product_id: {type:ObjectIdSchema, default: function () { return new ObjectId()} }
    }, 
{ _id : false })


```

The code above was created by adapting the code in [Mongoose's Documentation ](https://mongoosejs.com/docs/schematypes.html#objectids) as shown below:

```
const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({ driver: mongoose.ObjectId });
const Car = mongoose.model('Car', carSchema);

const car = new Car();
car.driver = new mongoose.Types.ObjectId();

typeof car.driver; // 'object'
car.driver instanceof mongoose.Types.ObjectId; // true

car.driver.toString(); // Something like "5e1a0651741b255ddda996c4"
```

- The code in [Mongoose's Documentation](https://mongoosejs.com/docs/schematypes.html#objectids) was implemented
- [Mongoose's Documentation](https://mongoosejs.com/docs/schematypes.html#objectids)'s Code was used to get objectID
- [Mongoose's Documentation](https://mongoosejs.com/docs/schematypes.html#objectids)'s Code was modified by the app requirement


### File Name - <https://git.cs.dal.ca/kabtiyal/5709-g10-sportify-backend/-/blob/main/controllers/stripe.js>
_Lines 8-31_

```
const checkoutSession = async (request,response) => {
    const line_items = request.body.backendReqBody.map((item)=>{
        return{
            price_data: {
                currency: 'CAD',
                product_data: {
                    name: item.plan_name,
                },
                unit_amount: item.total_cost * 100,
              },
              quantity: 1,
        }
    })
    console.log(line_items)
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/purchased-membership?payment=success',
        cancel_url: 'http://localhost:3000/membership',
      });
    
      response.send({url: session.url});
    
}


```

The code above was created by adapting the code in [STRIPE DOCS](https://stripe.com/docs/payments/checkout/how-checkout-works) as shown below:


```

const stripe = require('stripe')('sk_test_51LAz4KC9WWOmeUQqrPNjR1MoMg8QUwat6VjKu7criZO85933G7zghbRiOZl4u6L8aY4VetIlnUEkxANmg24K018D000U1euugz');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));

```

- The code in [STRIPE DOCS ](https://stripe.com/docs/payments/checkout/how-checkout-works)was implemented
- [STRIPE DOCS](https://stripe.com/docs/payments/checkout/how-checkout-works)'s Code was used to get stripe payment
- [STRIPE DOCS](https://stripe.com/docs/payments/checkout/how-checkout-works)'s Code was modified by the app requirements I created.


## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
