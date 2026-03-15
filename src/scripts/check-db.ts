import {db} from '../config/db';

async function main() {
    const result = await db.query('SELECT NOW() as now');
    console.log(result.rows[0]);
    await db.end();
}

main().catch(error => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
});