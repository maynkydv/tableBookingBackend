const ownerAuth = (req, res, next) => {

    const role = req.user.role;
    console.log("User role -> ", role);

    if (!role) {
        res.status(500).json({message:"Please Login , Role not Found"});
    }
    if (role === 'owner') {
        next();
    }
    else{
        res.status(401).json({message:"Please Login as Owner"})
    }
};
module.exports = ownerAuth;