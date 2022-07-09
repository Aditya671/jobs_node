import mysql2 from 'mysql2';

const pool = mysql2.createPool({
   host:'localhost',
   user:'root',
   database:'ecommerce_',
   password:'_ecommerce_'
})
const db = pool.promise()
class MySQLExecute{
   constructor(db){
      this.db = db;
   }

   createTable(tableObject) {
      const syntax = `CREATE TABLE IF NOT EXISTS ${tableObject}]`;  
      // const syntax = `CREATE TABLE IF NOT EXISTS projects (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT)`;
      return this.db.execute(syntax).then((data) => {
         console.log(data)
      }).catch((err) => {
         console.log(err)
      });
  }
   getAll(tableName){
      return this.db.execute(`Select * from ?`,[tableName]).then().catch()
   }
}
const mysqlConnection = new MySQLExecute(db)
