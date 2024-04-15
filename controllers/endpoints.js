const expressListEndpoints = require('express-list-endpoints');

/* Retrieve all endpoints from the еxpress application */
const endpoints = async (req, res) => {
    const endpoints = expressListEndpoints(req.app);
    res.json(endpoints);
};

module.exports = {
    endpoints,
}
