// hasher.js

(function (hasher) {
    var crypto = require("crypto"); //build in function so no need to import

    hasher.createSalt = function () {
        var len = 8;
        return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').substring(0, len);
    };

    hasher.computeHash = function (source, salt) {
        var hmac = crypto.createHmac("sha1", salt); //using sha1 algorithm
        var hash = hmac.update(source);
        return hash.digest("hex");
    };

})(module.exports);