// const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');


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
        console.log(answer);
        switch(answer.main_menu) {
            case 'View all departments':
                viewDepartments();
            case 'View all roles':

        }

        mainMenu();
    })

    
}



function viewDepartments(){
    db.query('SELECT * FROM departments', (err, result) => {
        console.log(result);
    });
}
function viewRoles() {
    DOMQuad.query(`SELECT * FROM roles`)
}

mainMenu();
