module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'Jrjjjrvct123.',
        database: process.env.DB_NAME || 'doos',
        host: process.env.DB_HOSTNAME || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql'
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'Jrjjjrvct123.',
        database: process.env.DB_NAME || 'doos',
        host: process.env.DB_HOSTNAME || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql'
    },
    production: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'Jrjjjrvct123.',
        database: process.env.DB_NAME || 'doos',
        host: process.env.DB_HOSTNAME || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql'
    }
};
