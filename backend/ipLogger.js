const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const security = express.Router();

security.use((req, res, next) => {
    const staticPaths = ['/Logo', '/Css', '/wallpapers', '/Country_Flags', '/Features_Images', '/UserIcon', '/imagesRevamp', '/mascot', '/Js', '/uploads', '/python'];

    // Skip logging for static paths
    if (staticPaths.some(path => req.path.startsWith(path))) {
        return next(); 
    }

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Remove the IPv6 prefix if the address is IPv4
    if (ip.substr(0, 7) === "::ffff:") {
        ip = ip.substr(7);
    }

    // Log IP address

    // Attach the IP address to the request object
    req.clientIp = ip;

    next();
    
});

module.exports = security