//This js file read the schema.sql and send queries to mysql so it can execute all the commands inside of schema.sql

var mysql = require('mysql2');
const fs = require('fs');

//Reading schema.sql
const dataSql = fs.readFileSync('./schema.sql').toString();
const dataArr = dataSql.toString().split(';'); //slpitting by ;


var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "pass",
	multipleStatements: true,
});


async function  mysql_query(myquery){

	connection.connect();
  connection.query(myquery);
}


async function mysql_query0(myquery)
{
  await mysql_query(myquery);
}


async function init(){
  dataArr.forEach((query) => 
  {
    if(query) 
    {
      // Add the delimiter back to each query before you run them
      // In my case the it was `;`
      if (query!='\n')//to detect if the query is empty
      {
        query += ';'; //add ; at the end of the query
        mysql_query0(query);
      }
    }
  })

  connection.end();//close mysql connection 
  console.log("the connection ended")

}


init()

console.log("It finished the sql commands")