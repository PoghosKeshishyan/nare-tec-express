const { prisma } = require('../prisma/prisma-client');

/* Retrieve all years from the database */
const all = async (req, res) => {
    try {
        const years = await prisma.year.findMany();
        res.status(200).json(years);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch years from the database',
            error,
        });
    }
};

/* Add a new year to the database */
const add = async (req, res) => {
    const data = req.body;
   
    if (!data.year) {
        return res.status(400).json({
            message: 'All fields are required for adding a new year',
        });
    }

    try {
        const year = await prisma.year.create({
            data,
        });

        res.status(201).json({
            message: 'The new year has been successfully added to the database',
            added_data: year,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new year to the database',
            error,
        });
    }
};

/* Edit data for a specific year in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const year = await prisma.year.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the year data',
            updated_data: year,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the year data',
            error,
        });
    }
};

/* Remove data for a specific year from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const year = await prisma.year.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the year data',
            removed_data: year,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the year data',
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
