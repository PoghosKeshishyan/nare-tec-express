const { prisma } = require('../prisma/prisma-client');

/* Retrieve all parents from the database */
const all = async (req, res) => {
    try {
        const parents = await prisma.parent.findMany();
        res.status(200).json(parents);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch parents from the database',
            error,
        });
    }
};

/* Retrieve a specific parent from the database */
const parent = async (req, res) => {
    const id = req.params.id;

    try {
        const parent = await prisma.parent.findUnique({
            where: {
                id,
            },
        });

        if (!parent) {
            return res.status(404).json({
                message: 'Parent not found',
            });
        }

        res.status(200).json(parent);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the parent data',
            error,
        });
    }
};

/* Add a new parent to the database */
const add = async (req, res) => {
    const data = req.body;

    if (!data.name || !data.address || !data.telephone || !data.email) {
        return res.status(400).json({
            message: 'All fields are required for adding a new parent',
        });
    }

    try {
        const parent = await prisma.parent.create({
            data,
        });

        res.status(201).json({
            message: 'The new parent has been successfully added to the database',
            added_data: parent,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new parent to the database',
            error,
        });
    }
};

/* Edit data for a specific parent in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const parent = await prisma.parent.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the parent data',
            updated_data: parent,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the parent data',
            error,
        });
    }
};

/* Remove data for a specific parent from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const parent = await prisma.parent.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the parent data',
            removed_data: parent,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the parent data',
            error,
        });
    }
};

module.exports = {
    all,
    parent,
    add,
    edit,
    remove,
}
