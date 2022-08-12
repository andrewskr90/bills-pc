
const config = {
    MYSQL: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_ROOT_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_ROOT_PASS,
    },
    PTCGIO_API: {
        baseURL: 'https://api.pokemontcg.io/v2'
    },
    BILLS_PC_API: {
        options: {
            withCredentials: true,
            baseURL: 'http://localhost:7070'
        }
    }
}

module.exports = config
