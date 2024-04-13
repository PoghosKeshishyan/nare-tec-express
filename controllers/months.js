const { prisma } = require('../prisma/prisma-client');

/* Retrieve all months from the database */
const all = async (req, res) => {
    try {
        const months = await prisma.month.findMany();
        res.status(200).json(months);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch months from the database',
            error,
        });
    }
};

/* Add a new month to the database */
const add = async (req, res) => {
    const data = req.body;
   
    if (!data.month) {
        return res.status(400).json({
            message: 'All fields are required for adding a new month',
        });
    }

    try {
        const month = await prisma.month.create({
            data,
        });

        res.status(201).json({
            message: 'The new month has been successfully added to the database',
            added_data: month,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new month to the database',
            error,
        });
    }
};

/* Edit data for a specific month in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const month = await prisma.month.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the month data',
            updated_data: month,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the month data',
            error,
        });
    }
};

/* Remove data for a specific month from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const month = await prisma.month.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the month data',
            removed_data: month,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the month data',
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
