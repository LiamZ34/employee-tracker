const inquirer = require('inquirer');
const mysql = require('mysql2');
// const db = require('.env');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to the database.`)
);

function employeeOptions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'what would you like to do',
            choices: [{
                name: 'view all employees',
                value: 'viewEmployees'
            },
            {
                name: 'view all roles',
                value: 'viewRoles'
            }
            ]
        }
    ]).then (result => {
        console.log(result)
        if (result.choice === 'viewEmployees') {
            db.promise().query('SELECT * FROM employee;').then (result => {
                console.table(result[0])
            })
        }
    })
}

employeeOptions()
