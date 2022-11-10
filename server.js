const inquirer = require('inquirer');
const mysql = require('mysql2');
// const db = require('.env');
const dotenv = require('dotenv');
dotenv.config();

// const db = process.env.DB_NAME;
// console.log(`your db name is ${process.env.DB_NAME}`)

// const deptNamesArr = [];
// response.forEach((department) => {deptNamesArr.push(department.department_name);});


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

const addDepartment = {
    type: 'input',
    name: 'newDepartment',
    message: 'enter department name'
}

// const addRole = [
//     {
//     type: 'input',
//     name: 'newRole',
//     message: 'enter role name'
//     },
//     {
//         type: 'input',
//         name: 'newSalary',
//         message: 'enter salary amount'
//     },
//     {
//         type: 'list',
//         name: 'departmentName',
//         message: 'which department is this new role in?',
//         choices: ''
//     }
// ]

const addEmployee = {
    type: 'input',
    name: 'addEmploy',
    message: 'enter employee name'
}

const updateEmployeeRole = {
    type: 'input',
    name: 'updateEmployRole',
    message: ''
}

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
            },
            {
                name: 'add a department',
                value: 'addDepartment'
            },
            {
                name: 'add a role',
                value: 'addRole'
            },
            {
                name: 'add an employee',
                value: 'addEmployee'
            },
            {
                name: 'update an employees role',
                value: 'updateEmployeeRole'
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
        if (result.choice === 'addDepartment') {
            return inquirer.prompt(addDepartment).then((answer) => {
                console.log(answer)
                db.promise().query(`INSERT INTO department (name) VALUES (?)`, answer.newDepartment );
               
                employeeOptions();
            })
            
        }
        if (result.choice === 'addRole') {
            db.promise().query('SELECT * FROM department;').then (([results]) => {
                const deptNamesArr = [];
                results.forEach((department) => {deptNamesArr.push(department.name);});
                console.log('results', results)
                console.log('deptNamesArr', deptNamesArr)
                inquirer.prompt([
                    {
                            type: 'input',
                            name: 'newRole',
                            message: 'enter role name'
                            },
                            {
                                type: 'input',
                                name: 'newSalary',
                                message: 'enter salary amount'
                            },
                            {
                                type: 'list',
                                name: 'departmentName',
                                message: 'which department is this new role in?',
                                choices: deptNamesArr
                            }
                ])
            })
           
        }
        if (result.choice === 'addEmployee') {
            return inquirer.prompt(addEmployee)
            
        }
    })
}

employeeOptions()