const { prisma } = require('../prisma/prisma-client');

/* Retrieve all headers from the database */
const all = async (req, res) => {
    try {
        const headers = await prisma.header.findMany();
        res.status(200).json(headers);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch headers from the database',
            error,
        });
    }
};

/* Add a new header to the database */
const add = async (req, res) => {
    const data = req.body;

    if (!data.title || !data.logo) {
        return res.status(400).json({
            message: 'All fields are required for adding a new header',
        });
    }

    try {
        const header = await prisma.header.create({
            data,
        });

        res.status(201).json({
            message: 'The new header has been successfully added to the database',
            added_data: header,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new header to the database',
            error,
        });
    }
};

/* Edit data for a specific header in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const header = await prisma.header.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the header data',
            updated_data: header,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the header data',
            error,
        });
    }
};

/* Remove data for a specific header from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const header = await prisma.header.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the header data',
            removed_data: header,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the header data',
            error,
        });
    }
};

module.exports = {
    all,
    add,
    edit,
    remove,
}
