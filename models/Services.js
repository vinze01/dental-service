module.exports = (sequelize, DataTypes) => {
    const Services = sequelize.define("Services", {
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        schedule: {
            type: DataTypes.STRING,
        },
        morningSlot: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        afternoonSlot: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        paranoid: true
    });

    return Services;
};
