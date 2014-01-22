// Encryption functions using the bcrypt module for node.js

bcrypt = require('bcrypt');

module.exports = {

    bcryptPassword: function(pw) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(pw, salt);
        return hash;
    },

    decryptPassword: function(pw, storedPw) {
        return bcrypt.compareSync(pw, storedPw);
    }

};

