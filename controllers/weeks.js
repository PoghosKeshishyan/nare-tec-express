const { prisma } = require('../prisma/prisma-client');

/* Retrieve all weeks from the database */
const all = async (req, res) => {
    try {
        const weeks = await prisma.week.findMany({
            include: {
                days: true,
            },
        });

        res.status(200).json(weeks);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch weeks from the database',
            error,
        });
    }
};

/* Retrieve a specific week from the database */
const week = async (req, res) => {
    const id = req.params.id;

    try {
        const week = await prisma.week.findUnique({
            where: {
                id,
            },
            include: {
                days: true,
            },
        });

        if (!week) {
            return res.status(404).json({
                message: 'Week not found',
            });
        }

        res.status(200).json(week);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the week data',
            error,
        });
    }
};

/* Add a new week to the database */
const add = async (req, res) => {
    const data = req.body;

    try {
        const week = await prisma.week.create({
            data: {
                ...data,
                days: {
                    create: data.days.map(day => ({
                        title: day.title,
                        arrived: day.arrived,
                        isGone: day.isGone,
                        completed: day.completed,
                        disabled: day.disabled,
                    })),
                },
            },
            include: {
                days: true
            },
        });

        res.status(201).json({
            message: 'New week created successfully',
            week,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create the new week',
            error,
        });
    }
};

/* Edit data for a specific week in the database */
const edit = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const week = await prisma.week.update({
            where: { 
                id, 
            },
            data: {
                ...data,
                days: {
                    updateMany: data.days.map(day => ({
                        where: { 
                            id: day.id, 
                        },
                        data: {
                            title: day.title,
                            arrived: day.arrived,
                            isGone: day.isGone,
                            completed: day.completed,
                            disabled: day.disabled,
                        },
                    })),
                },
            },
            include: { 
                days: true, 
            },
        });

        res.status(200).json({
            message: 'Week updated successfully',
            week,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update the week',
            error,
        });
    }
};

/* Remove data for a specific week from the database */
const remove = async (req, res) => {
    const id = req.params.id;

    try {
        /* First, fetch the days to be deleted */
        const daysToDelete = await prisma.day.findMany({
            where: {
                weekId: id,
            },
        });

        /* Delete all associated days */
        await prisma.day.deleteMany({
            where: {
                weekId: id,
            },
        });

        /* Now delete the week */
        const week = await prisma.week.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: 'Week and associated days deleted successfully',
            removed_data: {
                ...week,
                days: daysToDelete,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete the week and associated days',
            error,
        });
    }
};

module.exports = {
    all,
    week,
    add,
    edit,
    remove,
};
