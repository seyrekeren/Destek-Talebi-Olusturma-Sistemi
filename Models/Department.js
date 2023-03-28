const mongoose = require('mongoose');
Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
