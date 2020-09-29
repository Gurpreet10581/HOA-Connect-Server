module.exports = function(sequelize, DataTypes){
    return sequelize.define('profile', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        about:{
            type: DataTypes.STRING,
            allowNull: true
        }
        // ownerId: {
        //     type: DataTypes.INTEGER
        // }

    })
}