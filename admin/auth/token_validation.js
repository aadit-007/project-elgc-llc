var jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.headers["authorization"];
    console.log(token);
    token = token.slice(7);
    jwt.verify(token, process.env.WEBTOKEN_KEY, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });

      next();
    });
  },
};
