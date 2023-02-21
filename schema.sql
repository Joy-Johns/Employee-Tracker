DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
); 

--THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
CREATE TABLE role (
    title VARCHAR(30), 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    department VARCHAR(30),
    salary INT
);

--THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    jobTitle VARCHAR(30),
    department VARCHAR(30),
    salary INT,
    manager VARCHAR(30)
);

--view all departments, 
--view all roles, 
--view all employees, 
--** add a department, add a role, add an employee, and update an employee role

INSERT INTO department (name)
VALUES ("web");
INSERT INTO department (name)
VALUES ("sales");

INSERT INTO role (title, salary, department_id) VALUES ("front_end", 1200, 1);
INSERT INTO role (title, salary, department_id) VALUES ("back_end", 2200, 1);

INSERT INTO role (title, salary, department_id) VALUES ("rep", 1200, 2);
INSERT INTO role (title, salary, department_id) VALUES ("manager", 2200, 2);


INSERT INTO employee (role_id, first_name, last_name) VALUES (1, "Dinamo", "M");
INSERT INTO employee (role_id, first_name, last_name) VALUES (2, "Karen", "P");
INSERT INTO employee (role_id, first_name, last_name) VALUES (3, "Marcus", "H");
INSERT INTO employee (role_id, first_name, last_name) VALUES (4, "Lestat", "L");
INSERT INTO employee (role_id, first_name, last_name) VALUES (1, "Desmont", "J");

