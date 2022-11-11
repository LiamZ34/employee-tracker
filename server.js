const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')
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
    ]).then(result => {
        console.log(result)
        if (result.choice === 'viewEmployees') {
            db.promise().query('SELECT * FROM employee;').then(result => {
                console.table(result[0])
            })
            employeeOptions();
        }
        if (result.choice === 'viewRoles') {
            db.promise().query('SELECT * FROM role;').then(result => {
                console.table(result[0])
            })
            employeeOptions();
        }
        if (result.choice === 'viewDepartments') {
            db.promise().query('SELECT * FROM department;').then(result => {
                console.table(result[0])
            })
            employeeOptions();
        }
        if (result.choice === 'addDepartment') {
            return inquirer.prompt(addDepartment).then((answer) => {
                console.log(answer)
                db.promise().query(`INSERT INTO department (name) VALUES (?)`, answer.newDepartment);

                employeeOptions();
            })

        }
        if (result.choice === 'addRole') {
            db.promise().query('SELECT * FROM department;').then(([results]) => {
                const deptNamesArr = [];
                results.forEach((department) => { deptNamesArr.push(department.name); });
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
                        name: 'salary',
                        message: 'enter salary amount'
                    },
                    {
                        type: 'list',
                        name: 'departmentName',
                        message: 'which department is this new role in?',
                        choices: deptNamesArr
                    }
                ]).then((answer) => {
                    let createdRole = answer.newRole;
                    let departmentId;
                    results.forEach((department) => {

                        if (answer.departmentName === department.name) { departmentId = department.id; }
                    })
                    console.log(departmentId)
                    let roleSql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    let newRoleValues = [createdRole, answer.salary, departmentId];

                    db.promise().query(roleSql, newRoleValues);

                    employeeOptions();
                })
            })

        }
        if (result.choice === 'addEmployee') {
            inquirer.prompt({
                type: 'confirm',
                name: 'manager',
                message: 'Does this Employee have a manager?'
            }).then((result) => {
                if (result.manager === true) {
                    db.promise().query('SELECT * FROM employee;').then(([response]) => {
                        const managerNamesArr = [];
                        response.forEach((employee) => { managerNamesArr.push(employee.first_name); });
                        inquirer.prompt({
                            type: 'list',
                            name: 'manager',
                            message: 'whos is the employees manager',
                            choices: managerNamesArr
                        }).then((answer) => {
                            let employeeId;
                            response.forEach((employee) => {
                                if (answer.manager === employee.first_name) { employeeId = employee.id }
                            })

                            console.log(employeeId);
                            db.promise().query('SELECT * FROM role;').then(([response]) => {
                                const roleNamesArr = [];
                                response.forEach((role) => { roleNamesArr.push(role.title); });
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        name: 'firstName',
                                        message: 'Enter employee first name'
                                    },
                                    {
                                        type: 'input',
                                        name: 'lastName',
                                        message: 'Enter employee last name'
                                    },
                                    {
                                        type: 'list',
                                        name: 'newEmployeeRole',
                                        message: 'What is the employees role',
                                        choices: roleNamesArr
                                    }
                                ]).then((result) => {
                                    let roleId;
                                    response.forEach((role) => {
                                        if (result.newEmployeeRole === role.title) { roleId = role.id; }
                                    })
                                    console.log(roleId)
                                    let employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                                    let newEmployeeValues = [result.firstName, result.lastName, roleId, employeeId];
                                    console.log(newEmployeeValues)
                                    db.promise().query(employeeSql, newEmployeeValues);

                                    employeeOptions();

                                })
                            })
                        })
                    })
                } else {
                    
                    db.promise().query('SELECT * FROM role;').then(([response]) => {
                        const roleNamesArr = [];
                        response.forEach((role) => { roleNamesArr.push(role.title); });
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'firstName',
                                message: 'Enter employee first name'
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: 'Enter employee last name'
                            },
                            {
                                type: 'list',
                                name: 'newEmployeeRole',
                                message: 'What is the employees role',
                                choices: roleNamesArr
                            }
                        ]).then((result) => {
                            let roleId;
                            response.forEach((role) => {
                                if (result.newEmployeeRole === role.title) { roleId = role.id; }
                            })
                            console.log(roleId)
                            let employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)`;
                            let newEmployeeValues = [result.firstName, result.lastName, roleId,];
                            console.log(newEmployeeValues)
                            db.promise().query(employeeSql, newEmployeeValues);

                            employeeOptions();

                        })
                    })
                } 
            })
        }
    })
}

employeeOptions()