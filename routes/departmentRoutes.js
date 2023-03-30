const express = require('express');
const router = express.Router();
const {authMiddleware, checkManagerRole } = require('../middlewares/roleMiddleware');
const  { getAllDepartments, createDepartment, updateDepartment} = require('../controllers/departmentController');

router.post('/departments', createDepartment);  //çalıştı
router.get('/:companyId/departments', getAllDepartments);  //çalıştı
router.put('/departments/:id', updateDepartment); //çalıştı

module.exports = router;