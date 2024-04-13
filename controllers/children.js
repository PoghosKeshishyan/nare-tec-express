const { prisma } = require('../prisma/prisma-client');
const { generateCalendar } = require('../helpers/createCalendar');

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

    if (
        !data.name ||
        !data.number_of_hours ||
        !data.enrollment ||
        !data.discharge ||
        !data.birth ||
        !data.parent_id
    ) {
        return res.status(400).json({
            message: 'All fields are required for adding a new child',
        });
    }

    try {
        /* Create the child */
        const child = await prisma.child.create({
            data,
        });

        /* Call generateCalendar function */
        const calendar = generateCalendar(data.parent_id, child.id, data.name);

        /* Create the week using the generated calendar */
        for (const weekData of calendar) {
            const daysData = weekData.days.map(day => ({
                title: day.title || '',
                arrived: '',
                isGone: '',
                completed: false,
                disabled:  false,
            }));

            await prisma.week.create({
                data: {
                    week: weekData.week,
                    month: weekData.month,
                    year: weekData.year,
                    parent_id: weekData.parent_id,
                    child_id: weekData.child_id,
                    child_name: weekData.child_name,
                    dates: weekData.dates,
                    total_time_in_week: weekData.total_time_in_week,
                    total_days: weekData.total_days,
                    days: {
                        createMany: {
                            data: daysData,
                        },
                    },
                },
            });
        }

        res.status(201).json({
            message: 'The new child has been successfully added to the database',
            added_data: child,
            calendar_data: calendar,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add the new child to the database',
            error: error.message, // Include the error message for debugging
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
        await prisma.day.deleteMany({
            where: {
                week: {
                    child_id: id,
                },
            },
        });

        await prisma.week.deleteMany({
            where: {
                child_id: id,
            },
        });

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
