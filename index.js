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


function mainMenu() {
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
    ]).then(async (answer) => {
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
            case 'Add a department':
                await addDepartment();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Quit':
                process.exit();
                break;
        }

    }).then(()=>{
        mainMenu();
    })
    
}



function viewDepartments() {
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

async function addDepartment() {
    await inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
    }).then(async(answer) => {
        console.log(answer.department);
        db.query(`INSERT INTO departments (name) VALUES (?)`, answer.department, async(err, result) => {
            console.log(`inserted ? into departments`, answer.department);
        })
    })
}

async function addRole() {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the role title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary?'
        },
        {
            type: 'list',
            name: 'dept',
            message: 'What department?',
            choices: [1, 2, 3, 4],
        }
    ]).then(async (answers) => {
        
        db.query(`INSERT INTO roles(title, department_id, salary) VALUES ('${answers.title}',${answers.dept},${answers.salary})`, async (err, result) => {
            console.log('inserted ? into roles', answers.title);
            console.log(err);
        })
        
    })
}

mainMenu();

