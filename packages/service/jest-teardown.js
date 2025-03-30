
const teardown = async (globalConfig, projectConfig) => {
    const testPool = globalThis.testPool
    await testPool.end(function (err) {
        if (err) throw err;
    });
}

module.exports = teardown