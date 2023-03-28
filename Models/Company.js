const mongoose = require('mongoose');
Schema = mongoose.Schema;

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    departments: [{ type: Schema.Types.ObjectId, ref: 'Department' }]
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;