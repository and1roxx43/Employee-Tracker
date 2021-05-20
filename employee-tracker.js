const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',

    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`
    ----------------------------------------------------
    ----------------------------------------------------
    `);
    startTracker();
});

let managers;

const startTracker = () => {
    inquirer
    .prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View All Employees by department',
                'View All Employees by manager',
                'Add Employee', 
                'Add Role',
                'Add Department',
                'Update Employee', 
                'Remove Employee', 
                'Exit'
            ],
    })
    .
    then(({ choice }) => {
        switch(choice){
            case 'View All Employees':
                allEmployees();
                break;
            case 'View All Employees by department':
                allEmployeesByDept();
                break;
            case 'View All Employees by manager':
                allEmployeesByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${choice}`);
        }
        console.log(
            `
            ------------------------------------------------------
                          ${choice}
            ------------------------------------------------------
            `);
    });
};

const allEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as'department', CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => 
    {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);

        startTracker();
    });  
}

const allEmployeesByDept = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, d.name as'department' FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
        startTracker();
    });
}

const allEmployeesByManager = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
        startTracker();
    });
}

const addEmployee = () => {
    let employees = [];
    let roles = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;


        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }

        connection.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                employees.push(res[i].first_name + ' ' + res[i].last_name);
            }

            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        message: "What is the employee's first name?",
                        type: 'input'
                    },
                    {
                        name: 'last_name',
                        message: "What is the employee's last name?",
                        type: 'input',
                    },
                    {
                        name: 'role_id',
                        message: 'What is their role?',
                        type: 'list',
                        choices: roles,
                    },
                    {
                        name: 'manager_id',
                        message: "Who is their manager?",
                        type: 'list',
                        choices: ['none'].concat(employees)
                    }
                ]).then(({ first_name, last_name, role_id, manager_id }) => {
                    let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
                    if (manager_id != 'none') {
                        queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id)}, ${employees.indexOf(manager_id) + 1})`
                    } else {
                        queryText += `) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id) + 1})`
                    }
                    //console.log(queryText)

                    connection.query(queryText, (err) => {
                        if (err) throw err;

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
                        allEmployees();
                    });
                });

        });
    });
}


const addRole = () => {

    let roles = [];
    let departments = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;


        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }

        connection.query(`SELECT * FROM department`, (err, res) => {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                departments.push(res[i].name);
            }
            
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What title would you like to add?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does it belong to?',
                    choices: departments
                }
            ]).then(({ title, salary, department }) => {
                let queryText = `INSERT INTO role (title, salary`;
                
                    queryText += `,  department_id) VALUES ('${title}', '${salary}', ${departments.indexOf(department) + 1})`
            
                //console.log(queryText)

                connection.query(queryText, (err) => {
                    if (err) throw err;

    console.log(`
    ----------------------------------------------------
    ----------------------------------------------------
    `);
                allRoles();
                });
            });
        });
    });

}

const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'deptName',
            message: 'What department would you like to add?'
        })
        .then(({ deptName }) => {
            let queryText = `INSERT INTO department (name) VALUES ('${deptName}')`;

            

            connection.query(queryText, (err) =>{
                if (err) throw err;

                allDepartments();

console.log(`
----------------------------------------------------
----------------------------------------------------
`);
            // allDepartments();
        
            // startTracker();
            });
        });
 }
    


const updateEmployee = () => {
    inquirer
        .prompt(
            {
                name: 'update',
                message: 'What would you like to update?',
                type: 'list',
                choices: ["Update employee's role", "Update employee's manager"],
            }
        ).then(({ update }) => {
            switch (update) {
                case "Update employee's role":
                    update_role();
                    break;
                case "Update employee's manager":
                    update_manager();
                    break;
            }
        });
}

const update_role = () => {
    connection.query(`SELECT * FROM employee`, function (err, res) {
        if (err) throw err;

        let employees = [];
        let roles = [];

        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].first_name + ' ' + res[i].last_name);
        }

        connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                roles.push(res[i].title)
            }

            inquirer
                .prompt([
                    {
                        name: 'employee_id',
                        message: "Who's role needs to be updated",
                        type: 'list',
                        choices: employees
                    },
                    {
                        name: 'role_id',
                        message: "What is the new role?",
                        type: 'list',
                        choices: roles
                    }
                ]).then(({ employee_id, role_id }) => {
                
                    connection.query(`UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`, (err) => {
                        if (err) throw err;

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
                        allEmployees();
                    });
                });
        });

    });
}

const update_manager = () => {
    connection.query(`SELECT * FROM employee`, function (err, res) {
        if (err) throw err;

        let employees = [];

        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].first_name + ' ' + res[i].last_name);
        }

        inquirer
            .prompt([
                {
                    name: 'employee_id',
                    message: 'Who would you like to update?',
                    type: 'list',
                    choices: employees
                },
                {
                    name: "manager_id",
                    message: "Who's their new manager?",
                    type: 'list',
                    choices: ['none'].concat(employees)
                }
            ]).then(({ employee_id, manager_id }) => {
                let queryText = ""
                if (manager_id !== "none") {
                    queryText = `UPDATE employee SET manager_id = ${employees.indexOf(manager_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`
                } else {
                    queryText = `UPDATE employee SET manager_id = ${null} WHERE id = ${employees.indexOf(employee_id) + 1}`
                }

                connection.query(queryText, (err) =>{
                    if (err) throw err;

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
                    allEmployees();
                });

            });
    });

}

const removeEmployee = () => {
    connection.query(`SELECT * FROM employee`, function (err, res) {
        if (err) throw err;

        let employeesName = [];
        
        for (let i = 0; i < res.length; i++) {
            employeesName.push(res[i].first_name + ' ' + res[i].last_name);
        }
        

    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_details',
            message: 'Which employee you would like to remove?',
            choices: employeesName
        },
    ])
    .then(({ employee_details }) => {

        let queryText = `DELETE FROM employee WHERE id = "${employeesName.indexOf(employee_details)+1}"`;
        // console.log(queryText);
       
        connection.query(queryText, function (err) {
            if (err) throw err;

    console.log(`
    ----------------------------------------------------
    ----------------------------------------------------
    `);
                allEmployees();
            });
        });
    });
}


const allRoles = () => {

    connection.query("SELECT * FROM role", (err, res) =>{
        if(err) throw err;
        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);

        startTracker();

    });
}


const allDepartments = () => {

    connection.query("SELECT * FROM department", (err, res) =>{
        if(err) throw err;
        

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);

        console.table(res);

        startTracker();

    });
}