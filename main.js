import * as util from "node:util";
import { Client } from 'pg';
import 'dotenv/config';

const { values, positionals } =
    util.parseArgs({
        allowPositionals: true,
        options: {
            // --new to add a new todo item
            new: {
                type: "string"
            },
            // --list [all|pending|done] to list the todo items
            list: {
                type: "string"
            },
            // --done [id] to update a todo item
            done: {
                type: "string"
            },
            // --delete [id] to delete a todo item
            delete: {
                type: "string"
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

try {
    if (values.new) {
        const res = await client.query('INSERT INTO tasks(task_name) VALUES ($1)', [values.new]);
        console.log(`Create new task: ${values.new}`)
    } else if (values.list) {
        const status = values.list;
        if (status === 'all') {
            const res = await client.query('SELECT task_id, task_name, done FROM tasks');
            console.log('All tasks');
            console.log(res.rows);
        } else if (status === 'done') {
            const res = await client.query('SELECT task_id, task_name, done FROM tasks WHERE done = true');
            console.log('Done tasks');
            console.log(res.rows);
        } else if (status === 'pending') {
            const res = await client.query('SELECT task_id, task_name, done FROM tasks WHERE done = false');
            console.log('Pending tasks');
            console.log(res.rows);
        }
    } else if (values.done) {
        const res = await client.query('UPDATE tasks SET done = true WHERE task_name = $1', [values.done]);
        console.log(`Done ${values.done}`);
    } else if (values.delete) {
        const res = await client.query('DELETE FROM tasks WHERE task_name = $1', [values.delete]);
        console.log(`Delete ${values.delete}`);
    }

} catch (err) {
    console.error(err);
} finally {
    await client.end()
}