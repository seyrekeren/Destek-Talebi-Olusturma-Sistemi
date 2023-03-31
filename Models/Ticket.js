const mongoose = require('mongoose');
Schema = mongoose.Schema;

const TicketSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    description: { type: String, required: true },
    comments: [{
        createdBy: { type:mongoose.Schema.Types.ObjectId, ref:'User',  required: true },//ref user objectıd
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
