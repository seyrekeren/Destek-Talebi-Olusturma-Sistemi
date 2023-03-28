const Company = require('../Models/Company');

// Tüm şirketleri listele
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({}, { name: 1, _id: 0 });
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Şirket oluştur
const createCompany = async (req, res) => {
    const company = new Company({
        name: req.body.name,
        //departments: req.body.departments
    });
    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Şirket güncelle
const updateCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllCompanies,
    createCompany,
    updateCompany
};