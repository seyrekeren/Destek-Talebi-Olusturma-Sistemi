const Company = require('../Models/Company');
const Department = require('../models/Department');
const Ticket = require("../Models/Ticket");

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Company.findById(req.params.companyId).populate('departments')
    //const departments = await Department.find({ company: req.params.companyId }, { name: 1, _id: 0 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Departman oluştur
const createDepartment = async (req, res) => {
  const companyId = req.body.companyId;

  try {
    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    // Create the new department and add it to the company
    const department = new Department({
      name: req.body.name,
      company: companyId
    });
    const newDepartment = await department.save();
    company.departments.push(newDepartment);
    await company.save();

    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Departman güncelle
const updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
};

