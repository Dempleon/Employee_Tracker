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
        switch (answer.main_menu) {
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
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Update an employee role':
                await updateEmployee();
                break;
            case 'Quit':
                process.exit();

        }

    }).then(() => {
        mainMenu();
    })

}



function viewDepartments() {
    db.query('SELECT * FROM departments ORDER BY name', (err, result) => {
        console.table('\nDepartments', result);
    });
}

function viewRoles() {
    db.query(`SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles INNER JOIN departments on roles.department_id = departments.id ORDER BY roles.id`, (err, result) => {
        console.table('\nRoles', result);
    })
}

function viewEmployees() {
    db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, employees.manager_id as manager FROM employees INNER JOIN roles on employees.role_id = roles.id INNER JOIN departments on roles.department_id = departments.id ORDER BY employees.id;', (err, result) => {
        console.table('\nEmployees', result);
    })
}

async function addDepartment() {
    await inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
    }).then(async (answer) => {
        db.query(`INSERT INTO departments (name) VALUES (?)`, answer.department, async (err, result) => {
            console.log(`inserted ${answer.department} into departments`);
        })
    })
}

async function addRole() {
    const deps = await db.promise().query('SELECT * FROM departments ORDER BY departments.id');
    const departmentNames = [];
    deps[0].forEach(element => {
        departmentNames.push(element.name);
    });

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
            choices: departmentNames,
        }
    ]).then(async (answers) => {
        let dep_id;
        for (let i = 0; i < departmentNames.length; i++) {
            if (departmentNames[i] === answers.dept) {

                dep_id = i + 1;
            }
        }
        db.query(`INSERT INTO roles(title, department_id, salary) VALUES ('${answers.title}',${dep_id},${answers.salary})`, async (err, result) => {
            console.log(`Inserted ${answers.title} into roles`);

        })
    })
}

async function addEmployee() {
    var roles = await db.promise().query('SELECT * FROM roles ORDER BY roles.id');
    roles = roles[0];

    var roleTitles = [];
    roles.forEach(element => {
        roleTitles.push(element.title);
    });

    var managers = await db.promise().query('SELECT * FROM employees ORDER BY employees.id');
    managers = managers[0];

    var managerNames = [];
    managers.forEach(manager => {
        managerNames.push(manager.first_name);
    });
    await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roleTitles,
        },
        {
            type: 'list',
            name: 'manager',
            message: "What is the manager's id?",
            choices: managerNames,
        }
    ]).then(async (answers) => {

        let role_id;
        for (let i = 0; i < roleTitles.length; i++) {
            if (roleTitles[i] === answers.role) {
                role_id = i + 1;
            }
        }

        let manager_id;
        for (let i = 0; i < managerNames.length; i++) {
            if (managerNames[i] === answers.manager) {
                manager_id = i + 1;
            }
        }

        db.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}','${answers.last_name}',${role_id}, ${manager_id})`, async (err, result) => {
            console.log('inserted ? ? into employees', [answers.first_name, answers.last_name]);

        })
    })
}

async function updateEmployee() {
    var employeeList = await db.promise().query(`SELECT *, CONCAT(first_name,' ', last_name) as name FROM employees ORDER BY id`);
    employeeList = employeeList[0];

    var employeeArr = [];
    employeeList.forEach(employee => {
        employeeArr.push(employee.name)
    })


    var roles = await db.promise().query('SELECT * FROM roles ORDER BY roles.id');
    roles = roles[0];

    var roleTitles = [];
    roles.forEach(element => {
        roleTitles.push(element.title);
    });


    await inquirer.prompt(
        [{
            type: 'list',
            name: 'employee',
            message: `Which employee's role do you want to update?`,
            choices: employeeArr
        },
        {
            type: 'list',
            name: 'role',
            message: `Which role do you want to assign to the selected employee?`,
            choices: roleTitles
        }]
    ).then(async (answer) => {
        var employee_id = employeeArr.indexOf(answer.employee) + 1;

        var role_id = roleTitles.indexOf(answer.role) + 1;
        db.query(`UPDATE employees SET employees.role_id = ${role_id} WHERE employees.id = ${employee_id}`, async (err, result) => {
            console.log(`Updated ${answer.employee} role to ${answer.role}`);
            console.log(err);
        })
    })
}



mainMenu();

