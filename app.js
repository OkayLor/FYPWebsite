// Import Express.js framework
const express = require('express');
const path = require('path');
const app = express();

// Import gamesDB.js
const gamesDB = require('./gamesDB');

// Import userDB.js
const userDB = require('./userDB');

const image = require('./imageCheck');
const imageUpdater = require('./imageUpdater');
const gimage = require('./gameImgCheck');

const { exec } = require('child_process');

// Import express-fileupload
const uploadFile = require('express-fileupload');
app.use(uploadFile());

// Import jwt
const jwt = require('jsonwebtoken');
const JWTSecretKey = 'abcde'; // Secret key for JWT

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Import body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import EJS
app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'public'));
app.use(express.static('public'));

app.use(express.urlencoded ({
    extended: false
}));


// Authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log("Received token:", token); // Log the received token
        jwt.verify(token, JWTSecretKey, (err, user) => {
            if (err) {
                console.log("JWT Verification Error:", err);
                return res.sendStatus(403);
            }
            console.log("Verified User:", user); // Log the verified user
            req.user = user;
            next();
        });
    } else {
        console.log("No Token Provided");
        res.sendStatus(401);
    }
};





//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Home Page Route
app.get("/", (req, res) => {
    res.render("index"); // Renders views/index.ejs
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Store route 
// GET all games
app.get('/store', (req, res) => {
    gamesDB.getAllGames((err, result) => {
        if (err) {
            console.error('Error fetching games:', err); // Log error
            res.status(500).render('store', { message: 'Internal Server Error', games: [] });
        } else {
            console.log('Fetched games:', result); // Log the fetched games
            res.status(200).render('store', { games: result });
        }
    });
});

app.get('/store/all/:searchValue', (req, res) => {
    const searchValue = req.params.searchValue;
    gamesDB.searchGamesByTitleOrPlat(searchValue, (err, result) => {
        if (err) {
            console.error('Error fetching games:', err);
            // Send raw HTML error instead of using template
            res.status(500).send('<h1>Database Error</h1><pre>' + err.message + '</pre><br><a href="/store">Back to Store</a>');
        } else {
            console.log('Fetched games:', result);
            res.status(200).render('store', { games: result });
        }
    });
});

// GET all games in decending order of release date
app.get('/store/releasedate', (req, res) => {
    gamesDB.getGamesByNewest((err, result) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).render('store', { message: 'Internal Server Error', games: [] });
        } else {
            res.status(200).render('store', { games: result });
        }
    });
});

// GET games by cheapest
app.get('/store/lowestprice', (req, res) => {
    gamesDB.getGamesByCheapest((err, result) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).render('store', { message: 'Internal Server Error', games: [] });
        } else {
            console.error('Fetched games:', result);
            res.status(200).render('store', { games: result });
        }
    });
});

// GET games by highest price
app.get('/store/highestprice', (req, res) => {
    gamesDB.getGamesByExpensive((err, result) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).render('store', { message: 'Internal Server Error', games: [] });
        } else {
            console.error('Fetched games:', result);
            res.status(200).render('store', { games: result });
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// community.ejs
app.get("/community", (req, res) => {
    res.render("community");
});

app.post("/user/:uid/game/:gid/review", (req, res) => {
    gamesDB.createReview(req.params.uid, req.params.gid, req.body, (err, result) => {
        if (err) {
            if (err == 'e') {
                res.status(422);
                res.send({ message: "Missing field inside body" });
            } else {
                res.status(500);
                res.send({ message: "Internal Server Error" });
            }
        } else {
            res.status(201);
            res.send(result[0]);
        }
    })
});

// Upvote of the reviews
app.put("/review/upvote/:reviewid", authenticateJWT, (req, res) => {
    gamesDB.upvoteReview(req.user.userid, req.params.reviewid, (err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result == 'a') {
            res.status(422);
            res.send({ message: "The review does not exist" });
        } else if (result == 'b') {
            res.status(422);
            res.send({ message: "You have already upvoted this review" });
        } else {
            res.status(200);
            res.send({ message: "Upvoted successfully" });
        }
    })
});

// Unvote of the reviews
app.put("/review/unvote/:reviewid", authenticateJWT, (req, res) => {
    console.log(req.user.userid);
    gamesDB.unvoteReview(req.user.userid, req.params.reviewid, (err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else if (result == 'a') {
            res.status(422);
            res.send({ message: "The review does not exist" });
        } else if (result == 'b') {
            res.status(422);
            res.send({ message: "You did not upvote this review" });
        } else {
            res.status(200);
            res.send({ message: "Downvoted successfully" });
        }
    })
});

// Get review by upvotes
app.get("/review/upvote", (req, res) => {
    gamesDB.getReviewByUpvotes((err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(200);
            res.send(result);
        }
    })
});

// Get review by highest rating
app.get("/review/rating", (req, res) => {
    gamesDB.getReviewByRating((err, result) => {
        if (err) {
            res.status(500);
            res.send({ message: "Internal Server Error" });
        } else {
            res.status(200);
            res.send(result);
        }
    })
})

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// editReview route
app.get("/editReview", (req, res) => {
    res.render("editReview");
});

app.get("/self/reviews", authenticateJWT, (req, res) => {
    gamesDB.getReviewsByUserId(req.user.userid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.send(result);
        }
    });
});

app.delete("/self/reviews/:reviewid", authenticateJWT, (req, res) => {
    gamesDB.deleteReviewById(req.user.userid, req.params.reviewid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.send({ message: "Deleted successfully" });
        }
    });
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// createReview route
app.get('/createReview', (req, res) => {
    res.render('createReview');
});

app.post("/user/review", authenticateJWT, (req, res) => {
    if (!req.user.type) {
        res.send("invalid login");
    } else {
        gamesDB.createReview(req.body, req.user.userid, (err, result) => {
            if (err) {
                if (err === 'empty') {
                    res.status(422).send({ message: "Missing field inside body" });
                } else {
                    res.status(500).send({ message: "Internal Server Error" });
                }
            } else {
                res.status(201).send(result);
            }
        });
    }
});

app.get('/community/search/:searchTitle', authenticateJWT, (req, res) => {
    const searchTitle = req.params.searchTitle;
    gamesDB.searchGamesByTitleOrPlat(searchTitle, (err, result) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.status(200).send(result);
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// News route
// Get all news
app.get('/news', (req, res) => {
    gamesDB.getAllNews((err, result) => {
        if (err) {
            console.error('Error fetching news:', err);
            res.status(500).render('news', { message: 'Internal Server Error', news: [] });
        } else {
            console.error('Fetched news:', result);
            res.status(200).render('news', { news: result });
        }
    });
});

// Get newest news
app.get("/newestNews", (req, res) => {
    gamesDB.getNewestNews((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    });
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// Update news route
app.get('/update_news', (req, res) => {
    res.render('update_news');
});

// Create a new news
app.post("/create/news", authenticateJWT, (req, res) => {
    if (req.user.type == 'Admin') {
        gamesDB.createNews(req.body, (err, result) => {
            if (err == "empty") {
                res.status(422);
                res.send({ message: "Missing field inside body" });
            } else if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                res.status(201);
                res.send({ message: "Created successfully" });
            }
        })
    }
})

// Delete news
app.delete("/news/:id", authenticateJWT, (req, res) => {
    if (req.user.type == "Admin") {
        gamesDB.deleteNews(req.params.id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                res.status(200).send({ message: "Deleted successfully" });
            }
        })
    }
})

// Get all news
app.get("/allNews", (req, res) => {
    gamesDB.getAllNews((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    })
})

app.get("/newestNews", (req, res) => {
    gamesDB.getNewestNews((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    })
})

app.get('/news/search/:searchTitle', (req, res) => {
    const searchTitle = req.params.searchTitle;
    gamesDB.searchNewsByTitle(searchTitle, (err, result) => {
        if (err) {
            console.error('Error fetching news:', err);
            res.status(500).render('news', { message: 'Internal Server Error', news: [] });
        } else {
            res.status(200).render('news', { news: result });
        }
    });
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// admin_panel route
app.get('/admin_panel', (req, res) => {
    res.render('admin_panel');
});

// Create a new category
app.post("/category", authenticateJWT, (req, res) => {
    console.log("Request to create category:", req.body);

    const catObj = {
        catname: req.body.catname,
        description: req.body.description
    };

    gamesDB.createCategory(catObj, (err, result) => {
        if (err) {
            console.error("Error creating category:", err);
            if (err === 'e') {
                return res.status(422).send({ message: "Category name is required" });
            } else {
                return res.status(500).send({ message: "Internal Server Error" });
            }
        }
        return res.status(201).send(result);
    });
});


// Define route to get all categories
app.get('/category', (req, res) => {
    gamesDB.getAllCategory((err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        res.status(200).send(categories);
    });
});

// Platform routes removed - platform management has been deprecated
app.post("/platform", authenticateJWT, (req, res) => {
    res.status(404).send({ message: "Platform management has been deprecated." });
});

app.get('/platform', (req, res) => {
    res.status(404).send({ message: "Platform management has been deprecated." });
});

app.post("/games", authenticateJWT, (req, res) => {
    if (req.user.type === "Admin") {
        let game_pic_url;

        if (!req.files || !req.files.game_pic_url) {
            // No image uploaded, use default game image
            game_pic_url = "game_pic/defaultGameImage.png";
        } else {
            const gameImage = req.files.game_pic_url;

            // Check file type and size
            if (!gimage.checkType(gameImage) || !gimage.checkSize(gameImage)) {
                res.status(422).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
                return;
            }

            game_pic_url = gimage.checkFile(gameImage, req.body.title);

            if (!game_pic_url) {
                res.status(500).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
                return;
            }
        }

        // Validate required fields
        if (!req.body.title || !req.body.description || !req.body.year || !req.body.price) {
            return res.status(400).send({ message: "Title, description, year, and price are required" });
        }

        // Normalize categoryIds
        let categoryIds = req.body.categoryIds;
        if (typeof categoryIds === 'string') {
            try {
                categoryIds = JSON.parse(categoryIds);
            } catch (e) {
                // If parsing fails, wrap the string in an array
                categoryIds = [categoryIds];
            }
        }
        // If it's not an array at this point, wrap it
        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        // Validate normalized categoryIds array
        if (!categoryIds || categoryIds.length === 0) {
            return res.status(400).send({ message: "At least one category must be selected" });
        }

        const price = parseFloat(req.body.price);
        if (isNaN(price) || price <= 0) {
            return res.status(400).send({ message: "Price must be a positive number" });
        }

        gamesDB.createGame(req.body, game_pic_url, categoryIds, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(422).send({ message: "This game already exists" });
                } else if (err === 'Invalid or missing input data' || err === 'Price is required and must be greater than 0') {
                    res.status(400).send({ message: err });
                } else {
                    console.error("Error creating game:", err);
                    res.status(500).send({ error: "Internal Server Error" });
                }
            } else {
                res.status(201).send({ message: result });
            }
        });
    } else {
        res.status(403).send({ message: "You do not have permission to access this!" });
    }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Login Page Route
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});


app.post("/login", (req, res) => {
    const identifier = req.body.email; // Can be either username or email
    console.log("Login attempt:", identifier);
    userDB.authenticate(identifier, (err, result) => {
        if (err) {
            console.log("DB Error:", err);
            res.status(500).send();
        } else {
            if (result.length < 1) {
                console.log("No user found with username/email:", identifier);
                res.status(401).send({ message: "username/email or password incorrect" });
            } else {
                console.log("User found:", result);
                // Compare plain text passwords
                if (req.body.password === result[0].password) {
                    var payload = {
                        userid: result[0].userid,
                        username: result[0].username,
                        type: result[0].type
                    };
                    console.log("Payload for JWT:", payload); // Log the payload
                    var token = jwt.sign(payload, JWTSecretKey, { expiresIn: "1h" });
                    console.log("Generated Token:", token);
                    res.status(200).send({ token: token });
                } else {
                    console.log("Password mismatch for user:", identifier);
                    res.status(401).send({ message: "username/email or password incorrect" });
                }
            }
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Authenticated User Profile Retrieval
app.get("/user/self", authenticateJWT, (req, res) => {
    console.log("Authenticated User:", req.user); // Log the user for debugging
    if (!req.user) {
        console.log("req.user is undefined");
        return res.status(500).send({ message: "Internal Server Error" });
    }
    userDB.getUserProfile(req.user.userid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.send(result[0]);
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Create a user + upload profile picture
app.post("/users", (req, res) => {
    let profile_pic_url;

    if (!req.files || !req.files.profile_pic_url) {
        // No image uploaded, use default profile picture
        profile_pic_url = "./images/user_profile_pic/default.png";
    } else {
        const profileImage = req.files.profile_pic_url;

        // Check file type and size
        if (!image.checkType(profileImage) || !image.checkSize(profileImage)) {
            res.status(422).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
            return;
        }

        profile_pic_url = image.checkFile(profileImage, req.body.username);

        if (!profile_pic_url) {
            res.status(500).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
            return;
        }
    }

    console.log("Creating user:", req.body);

    userDB.createUser(req.body, profile_pic_url, (err, result) => {
        if (err) {
            console.log("Error creating user:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(422).send({ errorCode: "DUPLICATE_USERNAME_EMAIL", message: "The username or email provided already exists" });
            } else if (err == 'e') {
                res.status(422).send({ errorCode: "EMPTY_FIELD", error: "Invalid body" });
            } else {
                res.status(500).send({ error: "Internal Server Error" });
            }
        } else {
            res.status(201).send(result[0]);
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Update user (Profile pic, username, email, password)
app.get('/editProfile', (req, res) => {
    res.render('editProfile');
});

app.put("/users/self", authenticateJWT, (req, res) => {
    console.log(req.body);
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.current_password,
        type: 'Customer'
    };

    // Check if there is a file to upload
    if (req.files && req.files.profile_pic_url) {
        const profileImage = req.files.profile_pic_url;

        // Validate file type and size
        if (!imageUpdater.checkType(profileImage) || !imageUpdater.checkSize(profileImage)) {
            return res.status(422).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
        }

        const profile_pic_url = imageUpdater.checkFile(profileImage, req.body.username);
        if (!profile_pic_url) {
            return res.status(500).send({ errorCode: "INVALID_IMAGE", message: "Invalid image. Please upload a valid image." });
        }

        userDetails.profile_pic_url = profile_pic_url;
    }

    if (req.body.new_password) {
        userDB.changePassword(req.user.userid, (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Internal Server Error" });
            } else {
                if (req.body.current_password === result[0].password) {
                    userDetails.password = req.body.new_password;
                    updateUserProfile(userDetails, req, res);
                } else {
                    return res.status(400).send({ message: "Incorrect current password" });
                }
            }
        });
    } else {
        updateUserProfile(userDetails, req, res);
    }
});

function updateUserProfile(userDetails, req, res) {
    userDB.updateUserProfile(userDetails, req.user.userid, userDetails.profile_pic_url, (err, result) => {
        if (err) {
            console.log("Error updating user profile:", err);
            return res.status(500).send({ message: "Internal Server Error" });
        } else {
            return res.status(200).send({ message: "User profile updated successfully." });
        }
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// infoGames route

app.get('/store/info/:title', (req, res) => {
    try {
        const rawTitle = req.params.title;
        console.log(`Raw title: ${rawTitle}`);
        const title = decodeURIComponent(rawTitle);
        console.log(`Decoded title: ${title}`);

        gamesDB.getFullGameInfo(title, (err, gameInfo) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Internal Server Error" });
            } else if (gameInfo.length === 0) {
                res.status(404).send({ message: "Game not found" });
            } else {
                const game = gameInfo[0]; // Assuming the first element is the correct game (if there is any)

                gamesDB.getLatestReviewByGameId(game.gameid, (err, latestReview) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: "Internal Server Error" });
                    } else {
                        // Combine game details with the latest review data
                        const result = {
                            game: game,
                            latestReview: latestReview[0] // Assuming the first element is the latest review (if there is any)
                        };
                        res.status(200).render('infoGames', { game: result.game, latestReview: result.latestReview });
                    }
                });
            }
        });
    } catch (e) {
        console.error('Error decoding title:', e);
        res.status(400).send({ message: "Bad Request" });
    }
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------
// viewOwnedgames route
app.get('/viewOwnedgames', (req, res) => {
    res.render('viewOwnedgames'); // Render the viewOwnedgames.ejs
});

app.get("/owned/games", authenticateJWT, (req, res) => {
    gamesDB.viewAllOwnedGames(req.user.userid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    });
});

app.delete("/owned/games", authenticateJWT, (req, res) => {
    const { gameIds } = req.body || {};

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
        return res.status(400).send({ message: 'No games selected for deletion' });
    }

    gamesDB.deleteOwnedGames(req.user.userid, gameIds, (err) => {
        if (err) {
            console.log('Error deleting owned games:', err);
            return res.status(500).send({ message: 'Error deleting owned games' });
        }
        return res.status(200).send({ message: 'Owned games deleted successfully' });
    });
});


// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// Cart Route
app.get('/cart', (req, res) => {
    res.render('cart');
});

// Order Confirmation Route
app.get('/order-confirmation', (req, res) => {
    res.render('orderConfirmation');
});

app.get("/user/cart/AllInfo", authenticateJWT, (req, res) => {
    gamesDB.getAllCartInformation(req.user.userid, (err, result) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).send(result);
        }
    });
});

app.post("/addtocart", authenticateJWT, (req, res) => {
    const { gameid } = req.body;
    
    if (!gameid) {
        return res.status(400).send({ message: 'Game ID is required' });
    }
    
    // Get the game to verify it exists and has a price
    gamesDB.getGameById(gameid, (err, game) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching game' });
        }
        
        if (!game) {
            return res.status(404).send({ message: 'Game not found' });
        }
        
        if (!game.price || game.price <= 0) {
            return res.status(404).send({ message: 'No price available for this game' });
        }
        
        // Add to cart
        gamesDB.addToCart(req.user.userid, (err, cartId) => {
            if (err) {
                return res.status(500).send({ message: 'Error adding to cart' });
            }
            gamesDB.addToCartItems(cartId, gameid, (err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'Error adding to cart items' });
                } else {
                    return res.status(201).send({ message: "Added to cart successfully" });
                }
            });
        });
    });
});

app.delete("/deletefromcart/:cartid", authenticateJWT, (req, res) => {
    gamesDB.removeItemFromCart(req.params.cartid, (err, result) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).send({ message: "Deleted successfully" });
        }
    });
});

// Checkout route - processes order, moves items to owned_games, clears cart
app.post("/checkout", authenticateJWT, (req, res) => {
    const userid = req.user.userid;
    
    // Get all cart items for the user
    gamesDB.getAllCartInformation(userid, (err, cartItems) => {
        if (err) {
            return res.status(500).send({ message: "Error fetching cart items" });
        }
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).send({ message: "Cart is empty" });
        }

        // Process checkout: create order, add to owned_games, clear cart
        gamesDB.processCheckout(userid, cartItems, (err, result) => {
            if (err) {
                console.error('Checkout error:', err);
                return res.status(500).send({ message: "Error processing checkout" });
            }
            
            res.status(201).send({ 
                message: "Order confirmed successfully",
                orderId: result.orderId,
                total: result.total,
                itemCount: result.itemCount
            });
        });
    });
});

// Legacy route - kept for backward compatibility but redirects to checkout
app.post("/successful/order", authenticateJWT, (req, res) => {
    const uniqueGameData = Array.from(new Set(req.body.map(JSON.stringify))).map(JSON.parse);
    gamesDB.addOwnedGames(uniqueGameData, (err, result) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(201).send({ message: "Added successfully" });
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// System Health Route (Vulnerable)
app.get('/api/system/health', (req, res) => {
    const service = req.query.service || 'mysql';
    
    exec(`systemctl status ${service}`, (error, stdout, stderr) => {
        res.json({
            service: service,
            status: 'executed',
            output: stdout || stderr || (error ? error.message : 'No output')
        });
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Test Route
app.get('/test123', (req, res) => {
    res.send('WORKING!');
});

const os = require("os");
const PORT = process.env.PORT || 3000;

function getLocalIp() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "0.0.0.0";
}

app.listen(PORT, "0.0.0.0", () => {
    const ip = getLocalIp();
    console.log(`Server is running at http://${ip}:${PORT}`);
});