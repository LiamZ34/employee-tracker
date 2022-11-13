const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')
const dotenv = require('dotenv');
dotenv.config();

// allows connection to database
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


// const addDepartment = {
//     type: 'input',
//     name: 'newDepartment',
//     message: 'enter department name'
// }

// const updateEmployeeRole = {
//     type: 'input',
//     name: 'updateEmployRole',
//     message: ''
// }

//starts up the inquirer prompt
function employeeOptions() {
    // asks all the questions of what the client wants to do
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
        }//the following code adds a new department to the db if "adddepartment" is chosen
        if (result.choice === 'addDepartment') {
            return inquirer.prompt(addDepartment).then((answer) => {
                console.log(answer)
                db.promise().query(`INSERT INTO department (name) VALUES (?)`, answer.newDepartment);

                employeeOptions();
            })

        }//if add role is chosen then the following code will add a new role to the db
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

        }// if add employee is chosen the following code will add a new employee to the db
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
                            message: 'who is the employees manager',
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
            })// updates an employees role if "updateEmployeeRole" is chosen
        } if (result.choice === 'updateEmployeeRole') {
            
             
            db.promise().query(`SELECT * FROM employee;`).then(([response]) => {
                let allEmployeeArr = [];
                response.forEach((employee) => { allEmployeeArr.push(employee.first_name);});

                
                db.promise().query(`SELECT * FROM role;`).then(([result]) => {
                    let allRolesArr = [];
                    result.forEach((role) => {allRolesArr.push(role.title);});

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'chooseEmployee',
                            message: 'Which employee will have a new role?',
                            choices: allEmployeeArr
                        },
                        {
                            type: 'list',
                            name: 'chooseNewRole',
                            message: 'What new role will this employee have?',
                            choices: allRolesArr
                        }
                    ]).then ((answer) => {
                        let chosenEmployeeId, newRoleId;
                        
                        response.forEach((employee) => {
                            if (answer.chooseEmployee === employee.first_name) { chosenEmployeeId = employee.id }
                        });

                        result.forEach((role) => {
                            if (answer.chooseNewRole === role.title) { newRoleId = role.id }
                        });

                        console.log(chosenEmployeeId, newRoleId)

                        let updateSql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                        db.promise().query(updateSql, [newRoleId, chosenEmployeeId]);

                        employeeOptions();
                    })


                })


            })
        }
    })
}

employeeOptions()