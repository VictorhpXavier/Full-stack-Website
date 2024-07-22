const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const security = express.Router();
const con = require('../Database/Dbconnection.js')
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

security.use((req, res, next) => {
    const staticPaths = ['/Logo', '/Css', '/wallpapers', '/Country_Flags', '/Features_Images', '/UserIcon', '/imagesRevamp', '/mascot', '/Js', '/uploads', '/python'];

    // Skip logging for static paths
    if (staticPaths.some(path => req.path.startsWith(path))) {
        return next(); 
    }

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Remove the IPv6 prefix if the address is IPv4
    if (ip && ip.substr(0, 7) === "::ffff:") {
        ip = ip.substr(7);
    }
    // Log IP address
    req.clientIp = ip;
    //Put user id on the table
    const token = req.cookies.token;

    if (!token) {
        return next(); // No token, proceed to next middleware or route
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const email = decoded.email;
        const checkId = 'SELECT id FROM Users WHERE email = ?';

        con.query(checkId, [email], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return next(); // Proceed even if there's an error
            }

            if (results.length > 0) {
                const userId = results[0].id;
                req.userId = userId; // Store userId in request object

                const updateSecurityQuery = 'UPDATE Security SET user_id = ? WHERE email = ?';
                con.query(updateSecurityQuery, [userId, email], (err) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                    }
                    return next(); // Proceed to next middleware or route
                });
            } else {
                return next(); // No user found, proceed to next middleware or route
            }
        });
    });
    
    
    
});

security.post('/sendOs', (req, res) => {
    const userId = req.userId; // Retrieve userId from request object
    const os = req.body.os;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in request' });
    }

    const insertOsQuery = 'UPDATE Security SET system_name = ? WHERE user_id = ?';

    con.query(insertOsQuery, [os, userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ message: 'System name updated successfully' });
    });
})
module.exports = security

