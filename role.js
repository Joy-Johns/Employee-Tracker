module.exports = class Employee {
    constructor(id, first_name, last_name) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager_id = null
    }
    getID(){
        return this.id
    }
    getFirstName() {
        return this.first_name
    }
    getLastName() {
        return this.last_name
    }
    getManagerId() {
        return this.manager_id
    }

    setManagerId(id) {
        this.manager_id = id
    }
}