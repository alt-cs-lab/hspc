const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const users = require("../services/user");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            users.getLogin(jwt_payload.email)
                .then(user => {
                    if (user) {
                        // reformat the user params to camel case (psql causes this)

                        return done(null, {
                            id: user.id,
                            name: user.firstName + " " + user.lastName,
                            accessLevel: user.accessLevel,
                            email: user.email
                        });
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};