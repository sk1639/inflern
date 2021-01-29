if (process.env.NODE_ENV === 'production') {
    console.log('PROD CONNECTED...');
    module.exports = require('./prod');
} else {
    console.log('DEV CONNECTED...');
    module.exports = require('./dev');
}