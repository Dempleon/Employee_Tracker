// const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');


// const app = express();
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
});

// db.query('source ./db/schema.sql', (err, result) => {
//     if(err) {
//         console.log(err)
//     }
// });
// db.query('source ./db/seeds.sql', (err, result) => {
//     if(err) {
//         console.log(err)
//     }
// });

async function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'main_menu',
            messege: 'What would you like to do?',
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
        // {
        //     type: 'input',
        //     name: 'test',
        //     messege: 'this is what is ahhpening'
        // }
    ]).then((answer) => {
        console.log(answer);
        switch(answer.main_menu) {
            case 'View all departments':
                viewDepartments();
        }

        mainMenu();
    })

    
}



function viewDepartments(){
    db.query('SELECT * FROM departments', (err, result) => {
        console.log(result);
    });
}

mainMenu();
