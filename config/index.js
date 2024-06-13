
const config = {
    MYSQL: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_ROOT_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_ROOT_PASS,
        connectionLimit: 10
    },
    PTCGIO_API: {
        baseURL: 'https://api.pokemontcg.io/v2'
    },
}

module.exports = config
