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

/* Retrieve a specific week by child ID from the database */
const weekByChildId = async (req, res) => {
    const child_id = req.params.child_id;
    const { month, year } = req.query;

    try {
        const weeks = await prisma.week.findMany({
            where: {
                child_id,
                month,
                year: parseInt(year),
            },
            include: {
                days: true,
            },
        });

        if (!weeks || !weeks.length) {
            return res.status(404).json({
                message: 'Weeks not found',
            });
        }

        res.status(200).json(weeks);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the week data',
            error,
        });
    }
};

/* Retrieve a specific week by parent ID from the database */
const weekByParentId = async (req, res) => {
    const parent_id = req.params.parent_id;
    const { week, month, year } = req.query;

    try {
        const weeks = await prisma.week.findMany({
            where: {
                parent_id,
                month,
                week: parseInt(week),
                year: parseInt(year),
            },
        });

        if (!weeks || !weeks.length) {
            return res.status(404).json({
                message: 'Weeks not found',
            });
        }

        res.status(200).json(weeks);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve the week data',
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

module.exports = {
    all,
    weekByChildId,
    weekByParentId,
    edit,
};
