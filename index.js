var mysql = require("mysql");
const inquirer = require("inquirer");

let Department = require("./department.js");
let Role = require("./role.js");
let Employee = require("./employee.js");

let departments = [];
let roles = [];
let employees = [];

let options = [
  "Add department",
  "Add role",
  "Add employee",
  "View departments",
  "View roles",
  "View employees",
  "View employees by manager",
  "View the total utilized budget of a department",
  "Update roles",
  "Update employee manager",
  "Delete department",
  "Delete role",
  "Delete employee",
  "Exit",
];
let roleQuestions = [
  {
    name: "role_title",
    type: "input",
    message: "Enter role title",
  },
  {
    name: "role_salary",
    type: "input",
    message: "Enter role salary",
  },
];
let employeeQuestions = [
  {
    name: "first_name",
    type: "input",
    message: "Enter employee first name",
  },
  {
    name: "last_name",
    type: "input",
    message: "Enter employee last name",
  },
];

var con = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "mypass",
  password: "mypass",
  database: "tracker_db",
  multipleStatements: true,
});

//Connection
con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected");

  let sql =
    "SELECT * FROM department; SELECT * FROM role; SELECT * FROM employee";
  con.query(sql, (err, row) => {
    if (err) throw err;
    for (dep of row[0]) {
      //console.table(dep)
      let temp = new Department(dep.id, dep.name);
      departments.push(temp);
    }
    for (role of row[1]) {
      let temp = new Role(role.id, role.title, role.salary, role.department_id);
      roles.push(temp);
    }
    for (emp of row[2]) {
      let temp = new Employee(
        emp.id,
        emp.first_name,
        emp.last_name,
        emp.role_id
      );
      if (emp.manager_id) {
        temp.setManagerId(emp.manager_id);
      }
      employees.push(temp);
    }

    start();
  });
});

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What do you want to do?",
      choices: options,
    })
    .then((answer) => {
      if (answer.action == "Exit") {
        process.exit();
      }
    });
};
