// EXPORT
module.exports = (req, res, next) => {
    console.log('URL:', req.url); // Log the URL of the incoming request
    console.log('Parameters:', req.params); // Log the parameters passed in the request URL
    console.log('Request:', req.body); // Log the body of the request (data submitted by the client)
    // console.log('Response:', res.body); // Uncomment this line to log the response (if needed)
    next(); // Call the next middleware function in the chain
    }