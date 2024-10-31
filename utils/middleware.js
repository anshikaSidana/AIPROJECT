const listing = require('../model/product');
const Rate = require('../model/review');

module.exports.isregister = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};

module.exports.saveredirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirecturl = req.session.redirectUrl; 
    }
    next();
};

// module.exports.ispermission =async(req,res,next)=>{
//     let {id} = req.params;
//     let list= await listing.findById(id)

//     if(  res.locals.curruser &&( res.locals.curruser.username )!=( list.username)){

//         return res.redirect(`/listing/${id}`);
//     }
//     next();
// }


// module.exports.deletereview  = async(req,res,next)=>{
//     let {id,reviewid} = req.params;
//     let review = await Rate.findById(reviewid);

//     if(res.locals.curruser &&( res.locals.curruser.username )!=( review.author)){

//         return res.redirect(`/listing/${id}`);
//     }
//     next();
// }