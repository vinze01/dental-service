
module.exports = (sequelize, DataTypes) => {
    const Appointments = sequelize.define("Appointments",{
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        
    }, {
        paranoid: true
    });

    Appointments.associate = (models) => {
        Appointments.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
        Appointments.belongsTo(models.Users, { foreignKey: 'doctorId', as: 'doctor' });
        Appointments.belongsTo(models.Services, { foreignKey: 'serviceId', as: 'service' });
    }
    
    return Appointments;
}