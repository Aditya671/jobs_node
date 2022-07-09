import sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose()

//DB FILE
const db = new sqlite3.Database(".db");

class AppDAO {
    constructor(db) {
        this.db = db;
    }
    
    // RUN the SQL Server
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                console.log("Error running sql " + sql);
                console.log(err);
                reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }
}
const dao = new AppDAO();
ProjectRepository(dao);

class ProjectRepository {
    constructor(dao) {
        this.dao = dao;
    }
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT)`;
        return this.dao.run(sql);
    }
    create(name, description, isComplete, projectId) {
        return this.dao.run(
            `INSERT INTO tasks (name, description, isComplete, projectId)
                VALUES (?, ?, ?, ?)`,
            [name, description, isComplete, projectId]
        );
    }
    update(task) {
        const { id, name, description, isComplete, projectId } = task;
            return this.dao.run(`UPDATE tasks SET name = ?,
                description = ?,
                isComplete = ?,
                projectId = ? WHERE id = ?`,
        [name, description, isComplete, projectId, id]
        );
    }
    delete(id) {
        return this.dao.run(`DELETE FROM tasks WHERE id = ?`, [id]);
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log("Error running sql: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log("Error running sql: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getById(id) {
        return this.dao.get(`SELECT * FROM projects WHERE id = ?`, [id]);
    }
    getAll() {
        return this.dao.all(`SELECT * FROM projects`);
    }
    getTasks(projectId) {
        return this.dao.all(`SELECT * FROM tasks WHERE projectId = ?`, [projectId]);
    }
}
// db.run('SOME SQL QUERY', [param1, param2], (err) => {
//    if (err) {
//      console.log('ERROR!', err)
//    }
//  })

