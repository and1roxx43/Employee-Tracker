const mysql = require ('mysql');
const inquirer = require ('inquirer');
const consoleTable = require('console.table');

const connection = mysql.connection({
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
            message: 'What wpild you like to do?',
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
    
});
};