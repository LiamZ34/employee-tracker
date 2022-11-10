USE employee_db;
INSERT INTO department (name)
VALUES ('sales'),
        ('engineering'),
        ('hr'),
        ('legal'),
        ('finance');
INSERT INTO role (title, salary, department_id)
VALUES ('salesperson', 150000, 1),
        ('lead engineer', 140000, 2),
        ('hr representative', 130000, 3),
        ('lawyer', 160000, 4),
        ('accountant', 170000, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 1, 5),
    ('Sarah', 'Lourd', 5, NULL),
    ('Tom', 'Allen', 5, 7);