const express = require('express');
const router = express.Router();
const {authMiddleware, checkManagerRole } = require('../middlewares/roleMiddleware');
const  { getAllDepartments, createDepartment, updateDepartment} = require('../controllers/departmentController');

router.post('/departments', createDepartment);
router.get('/:companyId/departments', getAllDepartments);
router.put('/departments/:id', updateDepartment);

module.exports = router;