let config = {
    env: "development",
    dev: {
        host: '0.0.0.0',
        port: 8899,
        serviceUrl: 'http://localhost:8080',
        serviceRewritePath: '/',
    },
    prod: {
        serviceUrl: '',
    },
};
module.exports = config;
