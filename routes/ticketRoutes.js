const express = require('express');
const router = express.Router();
const {authMiddleware, checkManagerRole } = require('../middlewares/roleMiddleware');
const {createTicket, getTicketsByDepartmentId, updateTicket, deleteTicket, assignTicket, unassignTicket, deleteTicketComment, updateTicketComment, addTicketComment, getTicketComments} = require('../controllers/ticketController');

router.post('/tickets/department', createTicket);
router.get('/:departmentId/tickets', getTicketsByDepartmentId);//tam çalışmıyor kontrol et -artık çalışıyor sunumdan önce kontrol et genede sıkıntılı //comments alanı önemli
router.put('/:id/tickets', updateTicket);
router.delete('/:id/tickets', deleteTicket);
router.put('/tickets/assigned',authMiddleware, checkManagerRole, assignTicket);// adam atamam
router.put('/tickets/unassigned',authMiddleware,checkManagerRole, unassignTicket);

//----------------------------------------------------------

router.post('/:ticketId/comments', addTicketComment);
router.get('/:ticketId/comments', getTicketComments);
router.put('/:ticketId/comments/:commentId', updateTicketComment);
router.delete('/:ticketId/comments/:commentId', deleteTicketComment);

module.exports = router;