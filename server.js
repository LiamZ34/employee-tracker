const inquirer = require('inquirer');
const mysql = require('mysql2');
// const db = require('.env');
const dotenv = require('dotenv');
dotenv.config();

// const db = process.env.DB_NAME;
// console.log(`your db name is ${process.env.DB_NAME}`)

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: `${process.env.DB_USER}`,
        // TODO: Add MySQL password here
        password: `${process.env.DB_PASSWORD}`,
        database: `${process.env.DB_NAME}`
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
            },
            {
                name: 'view all departments',
                value: 'viewDepartments'
            }
            ]
        }
    ]).then (result => {
        console.log(result)
        if (result.choice === 'viewEmployees') {
            db.promise().query('SELECT * FROM employee;').then (result => {
                console.table(result[0])
            })
            employeeOptions();
        }
        if (result.choice === 'viewRoles') {
            db.promise().query('SELECT * FROM role;').then (result => {
                console.table(result[0])
            })
            employeeOptions();
        }
        if (result.choice === 'viewDepartments') {
            db.promise().query('SELECT * FROM department;').then (result => {
                console.table(result[0])
            })
            employeeOptions();
        }
    })
}

employeeOptions()
