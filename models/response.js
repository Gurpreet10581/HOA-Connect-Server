module.exports = function(sequelize, DataTypes){
    return sequelize.define('response', {
        ownerId: {
            type: DataTypes.INTEGER
        },
        description: DataTypes.STRING,
            likes:{

                type:DataTypes.INTEGER,
                defaultValue:0
            }
    })

}