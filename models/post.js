module.exports = function(sequelize, DataTypes){
    return sequelize.define('post', {
       
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // ownerId: {
        //     type: DataTypes.INTEGER
        // },
        description: DataTypes.STRING,
            likes:{

                type:DataTypes.INTEGER,
                defaultValue:0
            },
        
    })

}
        


