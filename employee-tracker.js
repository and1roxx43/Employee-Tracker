const mysql = require ('mysql');
const inquirer = require ('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'and1roxx52@',

    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;

    startTracker();
});

const startTracker = () => {
    inquirer
    .prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'Add Employee', 
                'Update Emplyee', 
                'Delete Employee', 
                'Exit'
            ],
    })
    .
    then((answer) => {
        switch(answer.choice){
            case 'View All Employees':
                allEmployees();
                break;
            case 'Add Employee':
                addEmployees();
                break;
            case 'Update Emplyee':
                updateEmployees();
                break;
            case 'Delete Employee':
                deleteEmployees();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.choice}`);
        }
    });
};

const allEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as'department', CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id;", (err, res) => 
    {
        if(err) throw err;

        console.table(res);
        startTracker();
    });  
}

const addEmployees = () => {
    
}