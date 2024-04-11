const { prisma } = require('../prisma/prisma-client');

/* Retrieve all stories from the database */
const all = async (req, res) => {
    try {
        const stories = await prisma.story.findMany();
        res.status(200).json(stories);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to fetch stories from the database',
            error,
        });
    }
};

/* Retrieve a specific story by year from the database */
const byYear = async (req, res) => {
    const year = req.params.year;

    try {
        const story = await prisma.story.findMany({
            where: {
                year,
            },
        });

        if (!story) {
            return res.status(404).json({
                message: `Story for the year ${year} not found`,
            });
        }

        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the story data',
            error,
        });
    }
};

/* Add a new story to the database */
const add = async (req, res) => {
    const data = req.body;
   
    if (!data.amount || !data.parent_name || !data.payment_date || !data.year) {
        return res.status(400).json({
            message: 'All fields are required for adding a new story',
        });
    }

    try {
        const story = await prisma.story.create({
            data: {
                amount: data.amount,
                parent_name: data.parent_name,
                payment_date: new Date(data.payment_date),
                year: data.year,
            },
        });

        res.status(201).json({
            message: 'The new story has been successfully added to the database',
            added_data: story,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new story to the database',
            error,
        });
    }
};

/* Edit data for a specific story in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const story = await prisma.story.update({
            where: {
                id,
            },
            data,
        });

        res.status(200).json({
            message: 'Successfully updated the story data',
            updated_data: story,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the story data',
            error,
        });
    }
};

/* Remove data for a specific story from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        const story = await prisma.story.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Successfully deleted the story data',
            removed_data: story,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete the story data',
            error,
        });
    }
};

module.exports = {
    all,
    byYear,
    add,
    edit,
    remove,
}
