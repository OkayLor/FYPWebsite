const connection = require('./dbConnect');

var userDB = {};

userDB.authenticate = function(identifier, callback) {
    var sqlStmt = "SELECT userid, username, type, password FROM rp_games.users WHERE email = ? OR username = ? LIMIT 1";

    connection.query(sqlStmt, [identifier, identifier], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

userDB.changePassword = function(userid, callback) {
    var sqlStmt = "SELECT password FROM rp_games.users WHERE userid = ?";

    connection.query(sqlStmt, [userid], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

userDB.getUserProfile = function(userid, callback) {
    var sqlStmt = "SELECT * FROM rp_games.users WHERE userid = ?";

    connection.query(sqlStmt, [userid], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

userDB.updateUserProfile = function(userDetails, userid, currentProfilePicUrl, callback) {
    var sqlStmt = 'UPDATE `rp_games`.`users` SET `username` = ?, `email` = ?, `password` = ?, `profile_pic_url` = ? WHERE (`userid` = ?)';

    connection.query(sqlStmt, [userDetails.username, userDetails.email, userDetails.password, currentProfilePicUrl, userid], (err, result) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

userDB.updateUserProfileWithoutProfilePic = function(userDetails, userid, callback) {
    console.log(userDetails);

    if (!userDetails.profile_pic_url) {
        var sqlStmt = 'UPDATE `rp_games`.`users` SET `username` = ?, `email` = ?, `password` = ? WHERE `userid` = ?';

        connection.query(sqlStmt, [userDetails.username, userDetails.email, userDetails.password, userid], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        });
    } else {
        var sqlStmt = 'UPDATE `rp_games`.`users` SET `username` = ?, `email` = ?, `password` = ?, `profile_pic_url` = ? WHERE `userid` = ?';

        connection.query(sqlStmt, [userDetails.username, userDetails.email, userDetails.password, userDetails.profile_pic_url, userid], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        });
    }
};

// POST Create a user + upload profile pic
userDB.createUser = (userObj, profile_pic_url, callback) => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!userObj.username || !userObj.email || !userObj.password || !userObj.type) {
        return callback('e', null); // Return 'e' in the callback to indicate empty required fields
    } else if (!emailRegex.test(userObj.email)) {
        return callback('e', null); // Invalid email format
    } else {
        var sqlStmt = 'INSERT INTO `rp_games`.`users` (`username`, `email`, `password`, `type`, `profile_pic_url`) VALUES (?, ?, ?, ?, ?)';

        connection.query(sqlStmt, [userObj.username, userObj.email, userObj.password, userObj.type, profile_pic_url], (err, results) => {
            if (err) {
                return callback(err, null);
            } else {
                var sqlStmt2 = 'SELECT userid FROM rp_games.users ORDER BY userid DESC LIMIT 1';

                connection.query(sqlStmt2, [], (err, results) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    }
};

module.exports = userDB;
