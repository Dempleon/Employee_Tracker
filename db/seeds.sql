INSERT INTO departments(name)
VALUES ('Leadership'),
('Security'),
('Medical'),
('Maintenance');

INSERT INTO roles(title, department_id, salary)
VALUES ('Captain', 1, 3000000),
('Guard', 2, 70000),
('Doctor', 3, 500000),
('Shipwright', 4, 300000);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ('Luffy', 'Monkey', 1, NULL ),
('Ussop', 'Sogeking', 2, 1),
('Tony', 'Chopper', 3, 1),
('Cutty', 'Flam', 4, 1);