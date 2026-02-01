// gamesDB.js
const connection = require('./dbConnect');

const gamesDB = {};

// GET all games
gamesDB.getAllGames = (callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.gameimage, g.title, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const games = {};

                results.forEach((game) => {
                    const { gameid, gameimage, title, price, catname, year } = game;

                    if (!games[gameid]) {
                        games[gameid] = {
                            gameid,
                            gameimage,
                            title,
                            price: parseFloat(price),
                            categories: [],
                            year: parseInt(year),
                        };
                    }

                    if (!games[gameid].categories.includes(catname)) {
                        games[gameid].categories.push(catname);
                    }
                });

                const formattedGames = Object.values(games);
                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};

// Search games by title substring
gamesDB.searchGamesByTitleOrPlat = (searchTitle, callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.gameimage, g.title, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
      WHERE g.title LIKE '%${searchTitle}%'
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const games = {};

                results.forEach((game) => {
                    const { gameid, gameimage, title, price, catname, year } = game;

                    if (!games[gameid]) {
                        games[gameid] = {
                            gameid,
                            gameimage,
                            title,
                            price: parseFloat(price),
                            categories: [],
                            year: parseInt(year),
                        };
                    }

                    if (!games[gameid].categories.includes(catname)) {
                        games[gameid].categories.push(catname);
                    }
                });

                const formattedGames = Object.values(games);
                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};

// GET all games in descending order of release date (newest first)
gamesDB.getGamesByNewest = (callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title, g.gameimage, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
      ORDER BY g.year DESC
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const games = {};

                results.forEach((game) => {
                    const { gameid, title, gameimage, price, catname, year } = game;
                    if (!games[gameid]) {
                        games[gameid] = {
                            gameid,
                            title,
                            gameimage,
                            price: parseFloat(price),
                            categories: [],
                            year: parseInt(year),
                        };
                    }
                    if (!games[gameid].categories.includes(catname)) {
                        games[gameid].categories.push(catname);
                    }
                });

                const formattedGames = Object.values(games);
                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};

// GET all games in ascending order of price (cheapest first)
gamesDB.getGamesByCheapest = (callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title, g.gameimage, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
      ORDER BY g.price ASC
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const games = {};

                results.forEach((game) => {
                    const { gameid, title, gameimage, price, catname, year } = game;
                    if (!games[gameid]) {
                        games[gameid] = {
                            gameid,
                            title,
                            gameimage,
                            price: parseFloat(price),
                            categories: [],
                            year: parseInt(year),
                        };
                    }
                    if (!games[gameid].categories.includes(catname)) {
                        games[gameid].categories.push(catname);
                    }
                });

                const formattedGames = Object.values(games);
                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};

// GET all games in descending order of price (most expensive first)
gamesDB.getGamesByExpensive = (callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title, g.gameimage, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
      ORDER BY g.price DESC
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const games = {};

                results.forEach((game) => {
                    const { gameid, title, gameimage, price, catname, year } = game;
                    if (!games[gameid]) {
                        games[gameid] = {
                            gameid,
                            title,
                            gameimage,
                            price: parseFloat(price),
                            categories: [],
                            year: parseInt(year),
                        };
                    }
                    if (!games[gameid].categories.includes(catname)) {
                        games[gameid].categories.push(catname);
                    }
                });

                const formattedGames = Object.values(games);
                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};


gamesDB.getReviewByRating = (callback) => {
    const sqlStmt = `
      SELECT r.id AS reviewid, g.title, u.username, r.content, r.rating, r.created, r.upvoteBy, r.counter 
      FROM reviews r
      JOIN users u ON r.user_id = u.userid
      JOIN game g ON r.game_id = g.gameid 
      ORDER BY r.rating DESC
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};


gamesDB.getReviewByUpvotes = (callback) => {
    const sqlStmt = `
      SELECT r.id AS reviewid, g.title, u.username, r.content, r.rating, r.created, r.upvoteBy, r.counter 
      FROM reviews r
      JOIN users u ON r.user_id = u.userid
      JOIN game g ON r.game_id = g.gameid 
      ORDER BY r.counter DESC
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// Advanced feature 2: Upvote a review
gamesDB.upvoteReview = (userid, reviewid, callback) => {
    const checkQuery = `SELECT * FROM reviews WHERE id = ?`;
    connection.query(checkQuery, [reviewid], (error, results) => {
        if (error) {
            return callback(error);
        } else if (results[0] === undefined) {
            return callback(null, 'a'); // Review does not exist
        }

        var database_upvoteBy = results[0].upvoteBy;
        var database_Counter = results[0].counter;

        if (database_upvoteBy && database_upvoteBy.includes(userid)) {
            console.log("This user already upvoted this review");
            callback(null, 'b'); // User already upvoted
        } else {
            var newUpvoteBy = database_upvoteBy ? `${database_upvoteBy},${userid}` : userid;
            var newCounter = database_Counter + 1;
            var sqlStmt = 'UPDATE reviews SET upvoteBy = ?, counter = ? WHERE id = ?';
            connection.query(sqlStmt, [newUpvoteBy, newCounter, reviewid], (err, results) => {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, results);
                }
            });
        }
    });
};

// Part of Advanced feature 2: Unvote a review
gamesDB.unvoteReview = (userid, reviewid, callback) => {
    const checkQuery = `SELECT * FROM reviews WHERE id = ?`;
    connection.query(checkQuery, [reviewid], (error, results) => {
        if (error) {
            return callback(error);
        } else if (results[0] === undefined) {
            return callback(null, 'a'); // Review does not exist
        }

        var database_upvoteBy = results[0].upvoteBy;
        var database_Counter = results[0].counter;

        if (!database_upvoteBy || !database_upvoteBy.includes(userid)) {
            console.log("This user has not upvoted this review");
            callback(null, 'b'); // User has not upvoted
        } else {
            var idList = database_upvoteBy.split(',').map(id => id.trim());
            var index = idList.indexOf(userid.toString());
            if (index > -1) {
                idList.splice(index, 1);
                var newUpvoteBy = idList.join(',');
                var newCounter = database_Counter - 1;

                var updateQuery = 'UPDATE reviews SET upvoteBy = ?, counter = ? WHERE id = ?';
                connection.query(updateQuery, [newUpvoteBy, newCounter, reviewid], (err, results) => {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        }
    });
};

// Get game by ID
gamesDB.getGameById = (gameid, callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title, g.gameimage, g.description, g.price, g.year
      FROM game g
      WHERE g.gameid = ?
    `;

    connection.query(sqlStmt, [gameid], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (results.length === 0) {
                callback(null, null);
            } else {
                callback(null, results[0]);
            }
        }
    });
};

// Infogames.ejs
gamesDB.getFullGameInfo = (title, callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title, g.gameimage, g.description, g.price, c.catname, g.year
      FROM game g
      JOIN game_category gc ON g.gameid = gc.gameid
      JOIN category c ON gc.catid = c.catid
      WHERE g.title = ?
    `;

    connection.query(sqlStmt, [title], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            const gamesMap = new Map();

            for (const game of results) {
                if (!gamesMap.has(game.gameid)) {
                    gamesMap.set(game.gameid, {
                        gameid: game.gameid,
                        title: game.title,
                        gameimage: game.gameimage,
                        description: game.description,
                        price: parseFloat(game.price),
                        catname: [game.catname],
                        year: game.year,
                    });
                } else {
                    const existingGame = gamesMap.get(game.gameid);
                    if (!existingGame.catname.includes(game.catname)) {
                        existingGame.catname.push(game.catname);
                    }
                }
            }

            const games = Array.from(gamesMap.values());
            return callback(null, games);
        }
    });
};

gamesDB.getLatestReviewByGameId = (gameid, callback) => {
    const sqlStmt = `
      SELECT r.id, u.username, r.game_id, r.content, r.rating, r.created, r.counter AS likes
      FROM reviews r
      JOIN users u ON r.user_id = u.userid
      WHERE r.game_id = ?
      ORDER BY r.created DESC
      LIMIT 1;
    `;

    connection.query(sqlStmt, [gameid], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// Get reviews from the userid
gamesDB.getReviewsByUserId = (userid, callback) => {
    const sqlStmt = `
      SELECT g.title, r.content as review, r.rating, r.created, r.counter AS likes, r.id 
      FROM reviews r
      JOIN game g ON r.game_id = g.gameid 
      WHERE r.user_id = ?
    `;

    connection.query(sqlStmt, [userid], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// Delete review by ID and user ID
gamesDB.deleteReviewById = (userid, id, callback) => {
    const sqlStmt = `
      DELETE FROM reviews 
      WHERE id = ? AND user_id = ?;
    `;

    connection.query(sqlStmt, [id, userid], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// Create a new news
gamesDB.createNews = (newsObj, callback) => {
    if (!newsObj.title || !newsObj.content) {
        return callback('empty', null);
    }

    const sqlStmt = `
      INSERT INTO news (title, content) 
      VALUES (?, ?);
    `;

    connection.query(sqlStmt, [newsObj.title, newsObj.content], (err, results) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

gamesDB.getAllNews = (callback) => {
    const sqlStmt = `
      SELECT * FROM news
      WHERE title LIKE '%${searchTitle}%' 
      ORDER BY newsid DESC;
    `;

    connection.query(sqlStmt, [], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

gamesDB.deleteNews = (newsId, callback) => {
    const sqlStmt = `
      DELETE FROM news 
      WHERE newsid = ?;
    `;

    connection.query(sqlStmt, [newsId], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

gamesDB.getNewestNews = (callback) => {
    const sqlStmt = `
      SELECT * FROM news 
      ORDER BY newsid DESC 
      LIMIT 1;
    `;

    connection.query(sqlStmt, (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

// Search news by title (VULNERABLE)
gamesDB.searchNewsByTitle = (searchTitle, callback) => {
    const sqlStmt = `
        SELECT * FROM news 
        WHERE title LIKE '%${searchTitle}%'
        ORDER BY newsid DESC
    `;
    
    connection.query(sqlStmt, (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};


// Create review
gamesDB.createReview = (reviewObj, userid, callback) => {
    if (reviewObj.content === "" || reviewObj.rating === "") {
        return callback('empty', null);
    }

    const sqlStmt = `
      INSERT INTO reviews (user_id, game_id, content, rating) 
      VALUES (?, ?, ?, ?);
    `;

    connection.query(sqlStmt, [userid, reviewObj.game_id, reviewObj.content, reviewObj.rating], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// Search games by title substring
gamesDB.searchGamesByTitle = (searchTitle, callback) => {
    const sqlStmt = `
      SELECT g.gameid, g.title 
      FROM game g 
      WHERE g.title LIKE '%${searchTitle}%'
    `;

    connection.query(sqlStmt, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const formattedGames = results.map((game) => ({
                    gameid: game.gameid,
                    title: game.title,
                }));

                callback(null, formattedGames);
            } else {
                console.log('No games found.');
                callback(null, null);
            }
        }
    });
};

// POST for game
gamesDB.createGame = (gameObj, game_pic_url, categoryIds, callback) => {
    if (!gameObj.title || !gameObj.description || isNaN(parseInt(gameObj.year)) || !categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return callback('Invalid or missing input data');
    }

    if (!gameObj.price || isNaN(parseFloat(gameObj.price)) || parseFloat(gameObj.price) <= 0) {
        return callback('Price is required and must be greater than 0');
    }

    gameObj.year = parseInt(gameObj.year);
    gameObj.price = parseFloat(gameObj.price);

    const gameSql = `
      INSERT INTO game (gameimage, title, description, year, price) 
      VALUES (?, ?, ?, ?, ?);
    `;

    connection.query(gameSql, [game_pic_url, gameObj.title, gameObj.description, gameObj.year, gameObj.price], (err, results) => {
        if (err) {
            console.log(err);
            return callback(err);
        }

        const gameId = results.insertId;
        const categoryValues = categoryIds.map(id => [gameId, id]);

        const gameCategorySql = `
          INSERT INTO game_category (gameid, catid) 
          VALUES ?;
        `;

        connection.query(gameCategorySql, [categoryValues], (err) => {
            if (err) {
                console.log(err);
                return callback(err);
            } else {
                return callback(null, 'Game created successfully');
            }
        });
    });
};

// Essential for creating a new game:
gamesDB.getAllCategory = (callback) => {
    const sqlStmt = `
      SELECT * FROM category;
    `;

    connection.query(sqlStmt, [], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

gamesDB.getAllPlatform = (callback) => {
    const sqlStmt = `
      SELECT * FROM platform;
    `;

    connection.query(sqlStmt, [], (err, results) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// POST for category
gamesDB.createCategory = (catObj, callback) => {
    if (!catObj.catname || !catObj.catname.trim()) {
        console.error("Category name is required");
        return callback('e', null);
    }

    const sqlStmt = `
      INSERT INTO category (catname, description) 
      VALUES (?, ?);
    `;

    connection.query(sqlStmt, [catObj.catname.trim(), catObj.description || ''], (err, results) => {
        if (err) {
            console.error("Error creating category:", err);
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};

// POST for platform
gamesDB.createPlatform = (platObj, callback) => {
    if (!platObj.platform_name) {
        console.error("Platform name is required");
        return callback('e', null);
    }

    const sqlStmt = `
      INSERT INTO platform (platform_name, description) 
      VALUES (?, ?);
    `;

    connection.query(sqlStmt, [platObj.platform_name, platObj.description], (err, results) => {
        if (err) {
            console.error("Error creating platform:", err);
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
};


// Add to cart 
gamesDB.addToCart = (userid, callback) => {
    const sqlStmt = `
      INSERT INTO cart (user_id) 
      VALUES (?);
    `;

    connection.query(sqlStmt, [userid], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            const cartId = result.insertId;
            callback(null, cartId);
        }
    });
};

gamesDB.addToCartItems = (cartId, gameid, callback) => {
    const sqlStmt = `
      INSERT INTO cart_items (cart_id, gameid, platformid) 
      VALUES (?, ?, NULL);
    `;

    connection.query(sqlStmt, [cartId, gameid], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Get all cart information
gamesDB.getAllCartInformation = (userid, callback) => {
    const sqlStmt = `
      SELECT c.cart_id, g.gameid, g.title, g.price 
      FROM cart c
      JOIN cart_items ci ON c.cart_id = ci.cart_id
      JOIN game g ON ci.gameid = g.gameid
      WHERE c.user_id = ?
    `;

    connection.query(sqlStmt, [userid], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

gamesDB.removeItemFromCart = (cartId, callback) => {
    const sqlStmt = `
      DELETE FROM cart 
      WHERE cart_id = ?;
    `;

    connection.query(sqlStmt, [cartId], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

gamesDB.addOwnedGames = (games, callback) => {
    const sqlStmt = `
      INSERT INTO owned_games (userid, gameid, platformid) 
      VALUES ?;
    `;
    const values = games.map(game => [game.userid, game.gameid, null]);

    connection.query(sqlStmt, [values], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// View all owned games
gamesDB.viewAllOwnedGames = (userid, callback) => {
    const sqlStmt = `
      SELECT og.gameid, g.title 
      FROM owned_games og
      JOIN users u ON og.userid = u.userid
      JOIN game g ON og.gameid = g.gameid
      WHERE og.userid = ?
    `;

    connection.query(sqlStmt, [userid], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Delete owned games for a user
gamesDB.deleteOwnedGames = (userid, gameIds, callback) => {
    if (!Array.isArray(gameIds) || gameIds.length === 0) {
        return callback(new Error('No game IDs provided'), null);
    }

    const sanitizedIds = gameIds
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

    if (sanitizedIds.length === 0) {
        return callback(new Error('Invalid game IDs'), null);
    }

    const placeholders = sanitizedIds.map(() => '?').join(', ');
    const sqlStmt = `
      DELETE FROM owned_games
      WHERE userid = ?
      AND gameid IN (${placeholders})
    `;

    connection.query(sqlStmt, [userid, ...sanitizedIds], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Create an order record
gamesDB.createOrder = (userid, total, callback) => {
    const sqlStmt = `
      INSERT INTO orders (user_id, total, created_at) 
      VALUES (?, ?, NOW());
    `;

    connection.query(sqlStmt, [userid, total], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result.insertId);
        }
    });
};

// Add order items
gamesDB.addOrderItems = (orderId, cartItems, callback) => {
    if (!cartItems || cartItems.length === 0) {
        return callback(null, []);
    }

    const sqlStmt = `
      INSERT INTO order_items (order_id, gameid, platformid, price) 
      VALUES ?;
    `;
    const values = cartItems.map(item => [orderId, item.gameid, null, item.price]);

    connection.query(sqlStmt, [values], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Clear all cart items for a user
gamesDB.clearUserCart = (userid, callback) => {
    const sqlStmt = `
      DELETE c FROM cart c
      WHERE c.user_id = ?;
    `;

    connection.query(sqlStmt, [userid], (err, results) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Process checkout: create order, add items to owned_games, clear cart
gamesDB.processCheckout = (userid, cartItems, callback) => {
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

    // Start transaction
    connection.beginTransaction((err) => {
        if (err) {
            return callback(err, null);
        }

        // Create order
        gamesDB.createOrder(userid, total, (err, orderId) => {
            if (err) {
                return connection.rollback(() => {
                    callback(err, null);
                });
            }

            // Add order items
            gamesDB.addOrderItems(orderId, cartItems, (err, orderItemsResult) => {
                if (err) {
                    return connection.rollback(() => {
                        callback(err, null);
                    });
                }

                // Add to owned_games
                const ownedGamesData = cartItems.map(item => ({
                    userid: userid,
                    gameid: item.gameid
                }));
                
                gamesDB.addOwnedGames(ownedGamesData, (err, ownedGamesResult) => {
                    if (err) {
                        return connection.rollback(() => {
                            callback(err, null);
                        });
                    }

                    // Clear cart
                    gamesDB.clearUserCart(userid, (err, clearCartResult) => {
                        if (err) {
                            return connection.rollback(() => {
                                callback(err, null);
                            });
                        }

                        // Commit transaction
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    callback(err, null);
                                });
                            }
                            callback(null, { orderId, total, itemCount: cartItems.length });
                        });
                    });
                });
            });
        });
    });
};

module.exports = gamesDB;
