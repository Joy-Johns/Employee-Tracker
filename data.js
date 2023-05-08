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

module.exports = { employeeQuestions, roleQuestions, options };