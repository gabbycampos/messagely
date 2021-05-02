const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function(req, res, next) {
    // try {
    //     const { username, password } = req.body;
    //     const result = await db.query(
    //         `SELECT password FROM users WHERE username = $1`, [username]);
    //     let user = result.rows[0];

    //     if (user) {
    //         if (await bcrypt.compare(password, user.password) === true) {
    //             let token = jwt.sign({ username }, SECRET_KEY);
    //             User.updateLoginTimestamp(username);
    //             return res.json({ token });
    //         }
    //     }
    //     throw new ExpressError("Invalid user/password", 400);
    // } catch(e) {
    //     return next(e);
    // }
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
        } else {
            throw new ExpressError("Invalid username/password", 400);
        }
    } catch(e) {
        return next(e);
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function(req, res, next) {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});
    } catch(e) {
        return next(e);
    }
})

module.exports = router;