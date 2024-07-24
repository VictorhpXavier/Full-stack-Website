const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const security = express();
const con = require('../Database/Dbconnection.js')
const jwt = require('jsonwebtoken');
const axios = require('axios');
const requestIp = require('request-ip');

security.use(requestIp.mw());

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;


security.use(async (req, res, next) => {
    const staticPaths = ['/Logo', '/Css', '/wallpapers', '/Country_Flags', '/Features_Images', '/UserIcon', '/imagesRevamp', '/mascot', '/Js', '/uploads', '/python'];

    
    // Skip logging for static paths
    if (staticPaths.some(path => req.path.startsWith(path))) {
        return next(); 
    }

    // Get client IP address
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip && ip.startsWith("::ffff:")) {
        ip = ip.substr(7);
    }
    req.clientIp = ip;
    


    // check the location of the user based on IP
    const checkLocation = async (ip) => {
        try {
            const apiKey = process.env.ipApiKey;
            const response = await axios.get(`https://ipinfo.io/${ip}?token=${apiKey}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching location data:', error);
            return null;
        }
    };
    const token = req.cookies.token;
    if (!token) {
        return next(); // No token, proceed to next middleware or route
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.email = decoded.email;

        const checkIdQuery = 'SELECT id FROM Users WHERE email = ?';
        con.query(checkIdQuery, [req.email], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return next();
            }

            if (results.length > 0) {
                const userId = results[0].id;
                req.userId = userId;

                const updateSecurityQuery = 'UPDATE Security SET user_id = ? WHERE email = ?';
                con.query(updateSecurityQuery, [userId, req.email], (err) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                    }
                    next();
                });

                // check and update IP address
                //This feature will be if connecting from different ip / device
                // send confirmation code to users email
                const checkIpQuery = 'SELECT Current_Ip FROM Security WHERE user_id = ? AND email = ?';
                con.query(checkIpQuery, [userId, req.email], (err, results) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return next();
                    }

                    const currentIp = results[0]?.Current_Ip;
                    if (currentIp !== ip) {
                        const updateIpQuery = 'UPDATE Security SET Current_Ip = ? WHERE user_id = ? AND email = ?';
                        con.query(updateIpQuery, [ip, userId, req.email], (err) => {
                            if (err) {
                                console.error('Error executing MySQL query:', err);
                            }
                        });
                    }
                });

                //Check if user location is already set
                //If user doesnt have a location set it
                //So basically it will work like 
                //If user have a location and have changed locattion from a radius bigger 
                //than 100km in less than a min show captcha to confirm is not a bot
                const userLocationQuery = 'SELECT user_Location FROM Security WHERE user_id = ? AND email = ?';
                con.query(userLocationQuery, [userId, req.email], async (err, results) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return next();
                    }

                    let location = results[0]?.user_Location;
                    if (!location || location === 'NULL') {
                        const locationData = await checkLocation(ip);

                        if (locationData) {
                            const { city, region, country } = locationData;
                            const newLocation = `${city || 'Unknown'}, ${region || 'Unknown'}, ${country || 'Unknown'}`;
                            
                            console.log('Location data:', locationData);
                            console.log('Formatted location:', newLocation);

                            const setUserLocationQuery = 'UPDATE Security SET user_Location = ? WHERE user_id = ? AND email = ?';
                            con.query(setUserLocationQuery, [newLocation, userId, req.email], (err) => {
                                if (err) {
                                    console.error('Error executing MySQL query:', err);
                                }
                            });
                        } else {
                            console.error('Failed to fetch location data');
                        }
                    }
                });
            } else {
                next();
            }
        });
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

//Get user device info
security.post('/sendOs', (req, res) => {
    const { os } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in request' });
    }

    const insertOsQuery = 'UPDATE Security SET system_name = ? WHERE user_id = ?';
    con.query(insertOsQuery, [os, userId], (err) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'System name updated successfully' });
    });
});

const verifyDevice = (req, res, next) => {
    const { os } = req.body;
    const ip = req.clientIp;
    const userId = req.userId;

    const checkDeviceQuery = 'SELECT system_name FROM Security WHERE user_id = ?';
    con.query(checkDeviceQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const storedOs = results[0]?.system_name;
        if (storedOs && storedOs !== os) {
            sendVerificationCode(req, res, next);
        } else {
            next();
        }
    });
};

//Send confirmation code to user
const sendVerificationCode = (req, res, next) => {
    const email = req.email;
    console.log(`Sending verification code to ${email}`);
    
    next();
};

//show captcha if user location radius has signitificaly changed
const showCaptcha = (req, res, next) => {
    next();
};




module.exports = security

