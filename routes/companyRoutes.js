const express = require('express');
const router = express.Router();
const  {getAllCompanies, createCompany, updateCompany} = require('../controllers/companyController');


router.get('/company', getAllCompanies);    //çalıştı
router.post('/company', createCompany);     //çalıştı
router.put('/company/:id', updateCompany);   //çalıştı

module.exports = router;