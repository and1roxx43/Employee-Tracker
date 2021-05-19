const mysql = require ('mysql');
const inquirer = require ('inquirer');
const consoleTable = require('console.table');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',

    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;

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
    });
};

const allEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as'department', CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => 
    {
        if(err) throw err;

        console.table(res);
        startTracker();
    });  
}

const allEmployeesByDept = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, d.name as'department' FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);
        startTracker();
    });
}

const allEmployeesByManager = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);
        startTracker();
    });
}

const addEmployee = () => {
    let employees = [];
    let roles = [];

    connection.query(`SELECT * FROM role`, function (err, res) {
        if (err) throw err;


        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }

        connection.query(`SELECT * FROM employee`, function (err, res) {
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
                ]).then(function ({ first_name, last_name, role_id, manager_id }) {
                    let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
                    if (manager_id != 'none') {
                        queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id)}, ${employees.indexOf(manager_id) + 1})`
                    } else {
                        queryText += `) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id) + 1})`
                    }
                    //console.log(queryText)

                    connection.query(queryText, function (err, res) {
                        if (err) throw err;

                        console.log(`----------------------------------------------------------------------------`);
                        allEmployees();
                    });
                });

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
                    //UPDATE `table_name` SET `column_name` = `new_value' [WHERE condition]
                    connection.query(`UPDATE employee SET role_id = ${roles.indexOf(role_id) + 1} WHERE id = ${employees.indexOf(employee_id) + 1}`, function (err, res) {
                        if (err) throw err;

                        console.log(`----------------------------------------------------------------------------`);
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

                connection.query(queryText, function (err, res) {
                    if (err) throw err;

                    console.table(res);

                    console.log(`----------------------------------------------------------------------------`);
                    allEmployees();
                });

            });

    });

}

const removeEmployee = () => {
    inquirer.prompt([
        {
            type: ''
        }
    ])
}
