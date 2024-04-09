const { prisma } = require('../prisma/prisma-client');

/* Retrieve all providers from the database */
const all = async (req, res) => {
    try {
        const providers = await prisma.provider.findMany();
        res.status(200).json(providers);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch providers from the database',
            error,
        });
    }
};

/* Add a new provider to the database */
const add = async (req, res) => {
    const data = req.body;

    if (!data.name || !data.address || !data.telephone || !data.email) {
        return res.status(400).json({
            message: 'All fields are required for adding a new provider',
        });
    }

    try {
        const provider = await prisma.provider.create({
            data,
        });

        res.status(201).json({
            message: 'The new provider has been successfully added to the database',
            added_data: provider,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new provider to the database',
            error,
        });
    }
};

/* Edit data for a specific provider in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const provider = await prisma.provider.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the provider data',
            updated_data: provider,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the provider data',
            error,
        });
    }
};

/* Remove data for a specific provider from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const provider = await prisma.provider.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the provider data',
            removed_data: provider,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the provider data',
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
