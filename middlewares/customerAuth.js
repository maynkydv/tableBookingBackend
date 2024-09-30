const customerAuth = (req, res, next) => {

    const role = req.user.role;
    console.log("User role -> ", role);

    if (!role) {
        res.status(500).json({user:req ,message:"Please Login , Role not Found"});
    }
    if (role === 'customer') {
        console.log('verified as Customer');
        next();
    }
    else{
        res.status(401).json({message:"Please Login as Customer"});
    }
};

module.exports = customerAuth;