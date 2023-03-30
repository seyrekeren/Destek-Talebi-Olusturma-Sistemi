const Department = require('../models/Department');
const Ticket = require("../Models/Ticket");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');

const createTicket = async (req, res) => {
    try {
      const { department, createdBy, assignedTo, status, priority, description } = req.body;
  
      const departmentObj = await Department.findById(department);
  
      if (!departmentObj) {
        return res.status(404).json({ success: false, error: 'Department not found' });
      }
  
      const ticket = new Ticket({
        department,
        createdBy,
        assignedTo,
        status,
        priority,
        description,
      });
  
      const newTicket = await ticket.save();
      console.log(newTicket);
  
      cron.schedule('0 12 * * *', async () => {
        try {
          // Calculate the date two days ago.
          const twoDaysAgo = moment().subtract(2, 'days');
  
          // Find the tickets that are in "in_progress" state and created two or more days ago.
          const ticketsInProgress = await Ticket.find({
            status: 'in_progress',
            createdDate: { $lte: twoDaysAgo.toDate() },
          }).populate('department');
  
          // If there are any tickets, send an email.
          if (ticketsInProgress.length > 0) {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'example@gmail.com', // Sender account details
                pass: 'password',
              },
            });
  
            const mailOptions = {
              from: 'example@gmail.com',
              to: 'recipient@example.com', // Recipient address
              subject: 'Warning: Tickets are still in "in_progress" state',
              html: `
                <p>Hello,</p>
                <p>The following tickets are still in "in_progress" state and have not been completed for more than two days:</p>
                <ul>
                  ${ticketsInProgress.map(ticket => `
                    <li>
                      <strong>Department:</strong> ${ticket.department.name}<br>
                      <strong>Created By:</strong> ${ticket.createdBy}<br>
                      <strong>Description:</strong> ${ticket.description}<br>
                      <strong>Created Date:</strong> ${moment().format('DD.MM.YYYY hh:mm:ss')}
                    </li>
                  `).join('')}
                </ul>
                <p>Please check these tickets and take necessary actions.</p>
                <p>Have a good day!</p>
              `,
            };
  
            const info = await transporter.sendMail(mailOptions);
            console.log(`Message sent: ${info.messageId}`);
          }
        } catch (err) {
          console.error(err);
        }
      });
  
      res.status(201).json({ success: true, data: newTicket });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  };
  
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo, status, priority, description } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(id, { assignedTo, status, priority, description }, { new: true });

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByIdAndDelete(id);

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

//departmana göre ticket getirme
const getTicketsByDepartmentId = async (req, res) => {
    try {
        const departmentId = req.params.departmentId;

        const departmentObj = await Department.findById(departmentId);
        if (!departmentObj) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }

        const tickets = await Ticket.find({ department: departmentId });
        res.status(200).json({ success: true, data: tickets });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


const assignTicket = async (req, res) => {
    try {
        const { ticketId, assignedTo, } = req.body;
       
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        // Update the ticket's assignedTo field and save it
        ticket.assignedTo = assignedTo;
        ticket.updatedDate = new Date();
        const updatedTicket = await ticket.save();

        res.status(200).json({ success: true, data: updatedTicket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


const unassignTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;

        // Check if ticket exists
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        // Update the ticket's assignedTo field to null and save it
        ticket.assignedTo = null;
        ticket.updatedDate = new Date();
        const updatedTicket = await ticket.save();

        res.status(200).json({ success: true, data: updatedTicket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Find the ticket with the given id and populate the comments field
        const ticket = await Ticket.findById(ticketId).populate('comments.createdBy', 'name');

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        res.status(200).json({ success: true, data: ticket.comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const addTicketComment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { createdBy, message } = req.body;

        // Find the ticket with the given id
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        // Add the new comment to the ticket and save it
        ticket.comments.push({ createdBy, message });
        ticket.updatedDate = new Date();
        const updatedTicket = await ticket.save();

        res.status(200).json({ success: true, data: updatedTicket.comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const updateTicketComment = async (req, res) => {
    try {
        const { ticketId, commentId } = req.params;
        const { message } = req.body;

        // Find the ticket with the given id and the comment with the given id
        const ticket = await Ticket.findOneAndUpdate(
            { _id: ticketId, 'comments._id': commentId },
            { $set: { 'comments.$.message': message, 'comments.$.createdAt': new Date() } },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket or comment not found' });
        }

        res.status(200).json({ success: true, data: ticket.comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

const deleteTicketComment = async (req, res) => {
    try {
        const { ticketId, commentId } = req.params;

        // Find the ticket with the given id and remove the comment with the given id
        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { $pull: { comments: { _id: commentId } }, updatedDate: new Date() },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket or comment not found' });
        }

        res.status(200).json({ success: true, data: ticket.comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


module.exports = {
    createTicket,
    getTicketsByDepartmentId,
    updateTicket,
    assignTicket,
    deleteTicket,
    unassignTicket,
    deleteTicketComment,
    updateTicketComment,
    addTicketComment,
    getTicketComments
}