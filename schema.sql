DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
); 

--THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
CREATE TABLE roles (
    title VARCHAR(30), 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    department VARCHAR(30),
    salary INT
);

--THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
CREATE TABLE employees (
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