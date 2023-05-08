var mysql      = require('mysql2');


var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pass",
  database: "tracker_db",
  multipleStatements: true,
});
//Connection

async function mysql_connection()
{
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
	});

}



module.exports = { mysql_connection };
module.exports = { con };

