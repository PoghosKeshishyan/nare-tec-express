const { prisma } = require('../prisma/prisma-client');

/* Retrieve all children from the database */
const all = async (req, res) => {
    try {
        const children = await prisma.child.findMany();
        res.status(200).json(children);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch children from the database',
            error,
        });
    }
};

/* Retrieve a specific child from the database */
const child = async (req, res) => {
    const id = req.params.id;

    try {
        const child = await prisma.child.findUnique({
            where: {
                id,
            },
        });

        if (!child) {
            return res.status(404).json({
                message: 'Child not found',
            });
        }

        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the child data',
            error,
        });
    }
};

/* Add a new child to the database */
const add = async (req, res) => {
    const data = req.body;
   
    if (!data.name || !data.number_of_hours || !data.enrollment || !data.discharge || !data.birth || !data.parent_id) {
        return res.status(400).json({
            message: 'All fields are required for adding a new child',
        });
    }

    try {
        const child = await prisma.child.create({
            data: {
                name: data.name,
                number_of_hours: data.number_of_hours,
                enrollment: new Date(data.enrollment),
                discharge: data.discharge,
                birth: new Date(data.birth),
                parentId: data.parent_id,
            },
        });

        res.status(201).json({
            message: 'The new child has been successfully added to the database',
            added_data: child,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new child to the database',
            error,
        });
    }
};

/* Edit data for a specific child in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const child = await prisma.child.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the child data',
            updated_data: child,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the child data',
            error,
        });
    }
};

/* Remove data for a specific child from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const child = await prisma.child.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the child data',
            removed_data: child,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the child data',
            error,
        });
    }
};

module.exports = {
    all,
    child,
    add,
    edit,
    remove,
}
