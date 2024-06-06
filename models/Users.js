module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        firstName: {
            type: DataTypes.STRING,
        },
        middleName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        contactNo: {
            type: DataTypes.INTEGER,
        },
        email: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        },
    }, {
        paranoid: true
    });

    Users.associate = (models) => {
        Users.hasMany(models.Appointments, { foreignKey: 'userId', as: 'appointment' });
        Users.hasMany(models.Appointments, { foreignKey: 'doctorId', as: 'doctor' });
    }

    return Users;
};
