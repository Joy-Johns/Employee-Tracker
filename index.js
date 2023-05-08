var mysql = require("mysql2");
const inquirer = require("inquirer");
const mysql_lib = require("./connection.js");//import connection mysql
const data = require("./data.js");

let Department = require("./department.js");
let Role = require("./role.js");
let Employee = require("./employee.js");

let departments = [];
let roles = [];
let employees = [];

//Read the database
async function read_db() 
{
  let sql =
    "SELECT * FROM department; SELECT * FROM role; SELECT * FROM employee";
    mysql_lib.con.query(sql, (err, row) => {
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
  });
}


async function start() {
  
  await read_db();
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What do you want to do?",
      choices: data.options,
    })
    .then((answer) => {
      if (answer.action == "Add department") {
        addDepartment();
      }
      else if (answer.action == "Add role") {
        addRole();
      }
      else if (answer.action == "Add employee") {
        addEmployee();
      }
      else if (answer.action == "View departments") {
        let sql = "SELECT * FROM department;";
        mysql_lib.con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      else if (answer.action == "View roles") {
        let sql = "SELECT * FROM role;";
        mysql_lib.con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      else if (answer.action == "View employees") {
        let sql = "SELECT * FROM employee;";
        mysql_lib.con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      else if (answer.action == "View employees by manager") {
        viewByManager();
      }
      else if (answer.action == "View the total utilized budget of a department") {
        totalBudget();
      }
      else if (answer.action == "Update roles") {
        updateEmpRole();
      }
      else if (answer.action == "Update employee manager") {
        updateEmpManager();
      }
      else if (answer.action == "Delete department") {
        deleteDepartments();
      }
      else if (answer.action == "Delete role") {
        deleteRole();
      }
      else if (answer.action == "Delete employee") {
        deletedEmployee();
      }
      else if (answer.action == "Exit") {
        process.exit();
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department_name",
      type: "input",
      message: "Enter department name",
    })
    .then((input) => {
      if (input) {
        let sql = `INSERT INTO department (name) VALUES ("${input.department_name}");`;
        mysql_lib.con.query(sql, (err, row) => {
          if (err) throw err;
          let temp = new Department(row.insertId, input.department_name);
          departments.push(temp);
          console.log("Department added");
          start();
        });
      }
    });
};
const addRole = () => {
  let deps = [];
  for (dep of departments) {
    deps.push(dep.getName());
  }

  inquirer.prompt(data.roleQuestions).then((answer) => {
    let title = answer.role_title;
    let salary = answer.role_salary;

    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Select department",
        choices: deps,
      })
      .then((input) => {
        let index = deps.indexOf(input.department);
        let id = departments[index].getID();
        let sql = `INSERT INTO role (department_id, title, salary) VALUES ("${id}", "${title}", "${salary}");`;
        mysql_lib.con.query(sql, (err, row) => {
          if (err) throw err;
          let temp = new Role(row.insertId, title, salary, id);
          roles.push(temp);
          console.log("Role added");
          start();
        });
      });
  });
};
const addEmployee = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer.prompt(data.employeeQuestions).then((answer) => {
    let firstName = answer.first_name;
    let lastName = answer.last_name;

    inquirer
      .prompt({
        name: "rol",
        type: "list",
        message: "Select role",
        choices: role,
      })
      .then((input) => {
        let index = role.indexOf(input.rol);
        let role_id = roles[index].getID();
        inquirer
          .prompt({
            name: "manager",
            type: "list",
            message: "Select manager",
            choices: employee,
          })
          .then((input) => {
            let index = employee.indexOf(input.manager);
            let manager_id = employees[index].getID();
            let sql = `INSERT INTO employee (role_id, first_name, last_name, manager_id) VALUES ("${role_id}", "${firstName}", "${lastName}", "${manager_id}");`;
            if (index === employee.length - 1) {
              sql = `INSERT INTO employee (role_id, first_name, last_name) VALUES ("${role_id}", "${firstName}", "${lastName}");`;
            }
            mysql_lib.con.query(sql, (err, row) => {
              if (err) throw err;
              let temp = new Employee(
                row.insertId,
                firstName,
                lastName,
                role_id
              );
              if (manager_id) {
                temp.setManagerId(manager_id);
              }
              employee.push(temp);
              console.log("Employee added");
              start();
            });
          });
      });
  });
};
const updateEmpRole = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }

  let employeeNames = [];
  for (emp of employees) {
    employeeNames.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employeeNames,
    })
    .then((input) => {
      let indexEmp = employeeNames.indexOf(input.name);
      let id = employees[indexEmp].getID();
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Select role",
          choices: role,
        })
        .then((input) => {
          let index = role.indexOf(input.role);
          let role_id = roles[index].getID();
          let sql = `UPDATE employee SET role_id=${role_id} WHERE id=${id};`;

          mysql_lib.con.query(sql, (err, row) => {
            if (err) throw err;
            employees[indexEmp].setRoleId(role_id);
            console.log("Role updated");
            start();
          });
        });
    });
};
const viewByManager = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let index = employee.indexOf(input.name);
      let man_id = employees[index].getID();
      let sql2 = `SELECT * FROM employee WHERE manager_id="${man_id}"`;
      mysql_lib.con.query(sql2, (err, row) => {
        if (err) throw err;
        console.table(row);
        start();
      });
    });
};
const updateEmpManager = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }

  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let indexEmp = employee.indexOf(input.name);
      let id = employees[indexEmp].getID();
      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Select manager",
          choices: employee,
        })
        .then((input) => {
          let index = employee.indexOf(input.manager);
          let emp_id = employees[index].getID();
          let sql = `UPDATE employee SET manager_id=${emp_id} WHERE id=${id};`;
          mysql_lib.con.query(sql, (err, row) => {
            if (err) throw err;
            employees[indexEmp].setRoleId(emp_id);
            console.log("Employee manager updated");
            start();
          });
        });
    });
};
const totalBudget = () => {
  let department = [];
  for (dep of departments) {
    department.push(dep.getName());
  }
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Select department to view budget",
      choices: department,
    })
    .then((input) => {
      let sql = `CREATE TABLE sumSalary ( SELECT employee.first_name, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id AND department.name = "${input.department}"); SELECT SUM(salary) total FROM sumSalary; DROP TABLE sumSalary;`;
      mysql_lib.con.query(sql, (err, row) => {
        if (err) throw err;
        console.table(row[1]);
        start();
      });
    });
};
const deleteDepartments = () => {
  let departmentDel = [];
  for (dep of departments) {
    departmentDel.push(dep.getName());
  }
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Select department to delete",
      choices: departmentDel,
    })
    .then((input) => {
      let sql = `DELETE FROM department WHERE name="${input.department}"`;
      mysql_lib.con.query(sql, (err, row) => {
        if (err) throw err;
        console.log("Department deleted");
        start();
      });
    });
};
const deleteRole = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Select role",
      choices: role,
    })
    .then((input) => {
      let index = role.indexOf(input.role);
      let role_id = roles[index].getID();
      let sql = `DELETE FROM role WHERE id="${role_id}"`;
      mysql_lib.con.query(sql, (err, row) => {
        if (err) throw err;
        console.log("Role deleted");
        start();
      });
    });
};
const deletedEmployee = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let index = employee.indexOf(input.name);
      let id = employees[index].getID();
      let sql = `DELETE FROM employee WHERE id=${id}`;
      mysql_lib.con.query(sql, (err) => {
        if (err) throw err;
        console.log("Employee deleted");
        start();
      });
    });
};



async function myconnection()
{
  mysql_lib.mysql_connection;
}

async function init()
{
  await myconnection();
  await start();

}


init();