const PortFolioModel = require('../model/softwares_design.js')
const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({ 
    storage: storage, 
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed'))
        }
        cb(null, true)
    }
}).array('images', 10)

const controller = {
    // it includes graphic design, software dev (mobile and web), and UI/UX design
    postWorks: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                console.log(`Image Error: ${err.message}`)
                return res.status(400).json({
                    message: 'Only image files are allowed'
                })
            }

            const { title, category, description, url } = req.body

            if (!title || !description || !url) {
                return res.status(400).json({
                    message: 'Title, description, and URL are required'
                })
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: 'Images not received'
                })
            }

            const images = req.files.map((file) => ({
                data: file.buffer,
                contentType: file.mimetype
            }))

            const newData = new PortFolioModel({
                title: title,
                category: category,
                description: description,
                url: url,
                images: images,
            })

            try {
                await newData.save()
                res.status(200).json({
                    message: 'Data successfully saved',
                    newData
                })
            } catch (error) {
                console.log(`Error Message: ${error.message}`)
                res.status(500).json({
                    message: 'Internal server error'
                })
            }
        })
    },

    // get all works 
    getAllWorks: async (req, res) => {
        try {
            const allWorks = await PortFolioModel.find({})

            if (!allWorks || allWorks.length === 0) {
                return res.status(404).json({
                    message: 'No works found'
                })
            }
            res.status(200).json({
                message: 'Graphic Design Works',
                allWorks
            })
        } catch (error) {
            console.log(`Error Message: ${error.message}`)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}

module.exports = controller
