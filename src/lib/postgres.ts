import { Client } from "pg";

export const client = new Client({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASS,
    port:parseInt(process.env.DB_PORT as string)
})

client.connect()