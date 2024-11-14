const listing = require('../model/product');
const Rate = require('../model/review');
const user = require('../model/user')

module.exports.isregister = (req,res,next)=>{
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","you must be loggged in.");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveredirect = (req,res,next)=>{

    if(req.session.redirectUrl ){
        res.locals.redirecturl = req.session.redirectUrl ; 
    }
    next();
}



module.exports.ispermission =async(req,res,next)=>{
    let {id} = req.params;
    let list= await listing.findById(id)

    if(  res.locals.curruser &&( res.locals.curruser.username )!=( list.username)){
        req.flash('failure',"You are not owner of this listing . ");
        return res.redirect(`/product/${id}`);
    }
    next();
}




module.exports.isAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()) {  // `req.isAuthenticated()` is a Passport.js function
        return next();
    }
    res.redirect('/login');  // Redirect to login if the user is not authenticated
}



module.exports.deletereview = async (req, res, next) => {
    let { id, reviewid } = req.params;
    
    // Attempt to find the review by ID
    let review = await Rate.findById(reviewid);

    // Check if the review exists
    if (!review) {
        req.flash('failure', "Review not found.");
        return res.redirect(`/product/${id}`);
    }

    // Check if the current user is the author of the review
    if (res.locals.curruser && (res.locals.curruser.username) !== review.author) {
        req.flash('failure', "You are not the author of this review.");
        return res.redirect(`/product/${id}`);
    }

    // If everything is fine, proceed to the next middleware or route handler
    next();
};






