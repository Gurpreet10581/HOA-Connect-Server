module.exports = function(sequelize, DataTypes){
    return sequelize.define('profile', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true
        },
        ownerId: {
            type: DataTypes.INTEGER
        }

    })
}