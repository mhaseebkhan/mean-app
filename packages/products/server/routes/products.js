'use strict';

var products = require('../controllers/products');

// product authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Products, app, auth) {

    app.get('/products/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/products/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/products/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/products/example/render', function(req, res, next) {
        Products.render('index', {
            package: 'products'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    app.route('/products')
        .get(auth.requiresLogin, products.all)
        .post(auth.requiresLogin, products.create);
    app.route('/products/:productId')
        .get(products.show)
        .put(auth.requiresLogin, hasAuthorization, products.update)
        .delete(auth.requiresLogin, hasAuthorization, products.destroy);

    // Finish with setting up the productId param
    app.param('productId', products.product);
};
