import database from "./database";
let Database = new database(globalThis.conf.database);

export default Database;
