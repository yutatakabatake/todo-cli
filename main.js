import * as util from "node:util";
import { Client } from 'pg';
import 'dotenv/config';

const { values, positionals } =
    util.parseArgs({
        allowPositionals: true,
        options: {
            // --new to add a new todo item
            new: {
                type: "boolean",
                default: false
            },
            // --list [all|pending|done] to list the todo items
            list: {
                type: "string"
            },
            // --done [id] to update a todo item
            done: {
                type: "boolean",
                default: false
            },
            // --delete [id] to delete a todo item
            delete: {
                type: "boolean",
                default: false
            },
            // --help to list all the available options
            help: {
                type: "boolean",
                default: false
            },
            // --version to print the version of the application
            version: {
                type: "boolean",
                default: false
            }
        }
    });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

await client.connect();

const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()