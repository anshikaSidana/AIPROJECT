require('dotenv').config();
const express =  require('express');
const app   =  express();
const path =  require('path');
const axios = require('axios');
engine = require('ejs-mate');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local')
const passport = require('passport')
const session = require('express-session');
const User = require('./model/user')
const asyncWrap = require('./utils/asyncWrap');
const ExpressError = require('./utils/ExpressError');

const {isregister,ispermission,saveredirect}= require('./utils/middleware');

const Cart = require('./model/addtocart')
const MongoStore = require('connect-mongo');
const {deletereview,isAuthenticated} = require('./utils/middleware');
const product = require('./model/product');
const Rate = require('./model/review')
const flash = require('connect-flash');
const methodOverride = require('method-override');

// ----------------------






//  middleware @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true })); // For form submissions
app.use(bodyParser.json()); // For JSON payloads



app.use(methodOverride('_method'));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}
main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log("ERROR IS : " + err);
    })


const sessionOptions = {
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        crypto:{
            secret: process.env.secret,
        },
        touchAfter : 24*3600

    })
};
app.use(session(sessionOptions));  
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.failure= req.flash('failure');
    res.locals.curruser = req.user;
    next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// request-------------------------------------------------------------------------------------------------------------------



app.get('/home',async(req,res)=>{
    const products =  await product.find();
    res.render('home',{products});
})

app.get('/product/:id',async(req,res)=>{
    const {id } = req.params;
    let list = await product.findById(id).populate('review');
    res.render('show',{list});
})



// add to product request
app.get('/addproduct',isAuthenticated,async(req,res)=>{
    res.render('addproduct');
})

app.post('/addproduct',async(req,res)=>{
    const data = new product(req.body.listing);
    data.username = req.user.username;
    await data.save();
    req.flash('success',"product is Added ");
    res.redirect('/home');

})

// ----user request -----------------------------------------------------------------------------------------------
app.get('/signup',(async(req,res)=>{
    res.render("./user/signup.ejs")
}))

app.post('/signup',async(req,res)=>{
    try{
        const {username,email,password} = req.body
         const newUser = new User({username,email});
        const resultuser= await User.register(newUser,password);

        const r = req.login(resultuser,(err)=>{
            if(err){
                return next(err);
            };
        

        console.log(r);
        req.flash("success","Welcome");
        res.redirect('/home');
        
    });

    }catch(err){
        console.log(err);
        req.flash("failure","User is already exists .");
        res.redirect('/signup');
    }
    }
);

app.get('/login',(async(req,res)=>{
    res.render("./user/login.ejs")
}))

app.post('/login',saveredirect,passport.authenticate('local', { failureRedirect: '/login'}), function(req, res) {
    req.flash("success","you are logged in . Welcome ");
    if(res.locals.redirecturl){
       return  res.redirect(res.locals.redirecturl);
    }
    res.redirect('/home')
  
});


//log out
app.get('/logout',(req, res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    });
    req.flash('success',"you are successfully logout");
    res.redirect('/home');
});


// ----------------------------------------------------------------------------------------------------------------------------------------------


// Add to cart route
app.post('/addtocart/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
        userCart = new Cart({ userId, items: [] });
    }

    const productId = new mongoose.Types.ObjectId(id);

    // Check if the item already exists in the cart
    const item = userCart.items.find(item => item.productId && item.productId.equals(productId));

    if (item) {
        item.quantity += 1; 
    } else {
        userCart.items.push({ productId, quantity: 1 }); 
    }

    await userCart.save();
    res.redirect('/cart');
});




app.get('/cart', async (req, res) => {
    const userId = req.session.userId;
  
    const userCart = await Cart.findOne({ userId }).populate('items.productId');
    let Amount = 0;
    const cartItems = userCart ? userCart.items : [];
  

    cartItems.forEach(item => {
      Amount += item.productId.price * item.quantity;
    });
  
    res.render('cart', { cartItems, Amount });
  });
  

  app.post('/update-cart/:productId', async (req, res) => {
    const {productId} = req.params;
    const action = req.body.action; 
    const userId = req.session.userId;
  
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      const cartItem = userCart.items.find(item => item.productId.equals(productId));
  
      if (cartItem) {
        if (action === 'increment') {
          cartItem.quantity += 1;
        } else if (action === 'decrement') {
          cartItem.quantity -= 1;

           if (cartItem.quantity <= 0) {
            userCart.items = userCart.items.filter(item => !item.productId.equals(productId));
        }
        }
      }
  
      await userCart.save();
    }
  
    res.redirect('/cart');
  });
  

//-----------------------------------------------------------------------------------------------------------------





app.delete('/product/:id/review/:reviewid',deletereview,isregister,asyncWrap(async(req,res)=>{
    let {id,reviewid} = req.params;
    await product.findByIdAndUpdate(id, {$pull:{review : reviewid}});       
    await Rate.findByIdAndDelete(reviewid);
    res.redirect(`/product/${id}`);
}))





////// review -----------------------------------------------------------------------------------------------------------------\
app.post('/product/:id/review', isregister,asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body.Rate;

    if (!content) {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    try {
        // Find product by ID
        const foundProduct = await product.findById(id);  // Changed variable name for clarity

        // Call AI model API to check if review is fake
        const response = await axios.post('http://localhost:5000/predict', { content });
        const isFake = response.data.isFake;

        // Save the review
        const review = new Rate({ content, rating, author: req.user.username, isFake });
        await review.save();

        // Link review to product
        foundProduct.review.push(review._id);
        await foundProduct.save();

        res.redirect(`/product/${id}`);
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).json({ message: 'An error occurred while submitting the review.' });
    }
}));


// Route to see reviews and analysis


app.get('/see-my-products', isAuthenticated, async (req, res) => {
    const products = await product.find({ username: req.user.username });

    if (!products.length) {
        return res.render('my-products', { message: "You haven't added any products yet" });
    }

    res.render('my-products', { products , message : null});
});



app.get('/product/:id/reviews', isAuthenticated, async (req, res) => {
    const products = await product.findById(req.params.id).populate('review');
    const reviews = products.review;

    const totalReviews = reviews.length;
    const fakeReviews = reviews.filter(review => review.isFake).length;
    const realReviews = totalReviews - fakeReviews;

    res.render('reviews', {
        products,
        reviews,
        totalReviews,
        fakeReviews,
        realReviews,
    });
});


app.post('/product/:id/reviews/delete-fake',isregister,asyncWrap( async(req, res) => {
    const products = await product.findById(req.params.id).populate('review');
    
    // Delete fake reviews
    for (const review of products.review) {
        if (review.isFake) {
            await Rate.findByIdAndDelete(review._id);
        }
    }

    // Update product's reviews
    products.review = products.review.filter(review => !review.isFake);
    await products.save();

    res.redirect(`/product/${products._id}/reviews`);
}));



app.delete('/:id',isregister,ispermission,asyncWrap(async (req, res) => {
    let { id } = req.params;
    await product.findByIdAndDelete(id);
    req.flash('success', 'Product deleted successfully');
    res.redirect('/home');
}))


app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render('error.ejs', { message });

});



const port  =  3000;
app.listen(port,()=>{
    console.log("Port is running successfully");
})













// Admin
//  pass - 12345