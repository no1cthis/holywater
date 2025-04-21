import { MongoMemoryServer } from "mongodb-memory-server"

const emulator = new MongoMemoryServer({
    instance: {
        dbName: "holywater",
        dbPath: "./.tmp"
    }
})
await emulator.start()

export const mongoDbEmulatorUrl = emulator.getUri()