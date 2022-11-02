// const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
});


async function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'main_menu',
            message: 'What would you like to do?',
            loop: true,
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
            ]
        },
    ]).then((answer) => {
        switch(answer.main_menu) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Quit':
                process.exit();
        }

        mainMenu();
    })

    
}



function viewDepartments(){
    db.query('SELECT * FROM departments ORDER BY name', (err, result) => {
        console.table('\nDepartments',result);
    });
}
function viewRoles() {
    db.query(`SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles INNER JOIN departments on roles.department_id = departments.id`, (err, result) => {
        console.table('\nRoles',result);
    })
}
function viewEmployees() {

    db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, employees.manager_id as manager FROM employees INNER JOIN roles on employees.role_id = roles.id INNER JOIN departments on roles.department_id = departments.id ORDER BY employees.last_name;', (err, result) => {
        console.table('\nEmployees',result);
    })
}

mainMenu();
