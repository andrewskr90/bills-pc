const config = {
    BILLS_PC_API: {
        options: {
            withCredentials: true,
        }
    }
}
if (import.meta.env.VITE_NODE_ENV === 'development') {
    config.BILLS_PC_API.options.baseURL = 'http://localhost:7070'
}

export default config