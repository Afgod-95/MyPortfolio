const mongoose = require('mongoose');

const designSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    category: {
        type: String, 
        enum: ["Graphic Design", "Web development", "Mobile development", "UI/UX Design"],
        default: 'Graphic Design'
    },
    description: { 
        type: String,
        required: true
    },
    images: [{
        data: Buffer, 
        contentType: String
    }],
    url: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const PortFolioModel = mongoose.model('PortFolioModel', designSchema);
module.exports = PortFolioModel;
