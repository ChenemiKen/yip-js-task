const Sequelize = require('sequelize');

const Db = new Sequelize('js_task', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

const Customer= Db.define('customer', {
    id: {
        type:Sequelize.STRING,
        primaryKey: true,
    },
    name: {
        type:Sequelize.STRING
    },
    pickup_loc: {
        type:Sequelize.STRING
    },
    dropoff_loc: {
        type:Sequelize.STRING
    },
    scheduled: {
        type:Sequelize.BOOLEAN,
        default:false
    },
    delivery_date:{
        type:Sequelize.DATEONLY,
        allowNull:true
    },
    delivery_slot:{
        type:Sequelize.STRING,
        allowNull:true
    }

    
})

const Planner = Db.define('planner',{
    date:{
        type:Sequelize.DATEONLY,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    slot1:{
        type:Sequelize.STRING,
        references:{
            model:'customers',
            key: '_id',
            allowNull: true
        }
    },
    slot2:{
        type:Sequelize.STRING,
        references:{
            model:'customers',
            key: '_id',
            allowNull: true
        }
    },
    slot3:{
        type:Sequelize.STRING,
        references:{
            model:'customers',
            key: '_id',
            allowNull: true
        }
    },
    slot4:{
        type:Sequelize.STRING,
        references:{
            model:'customers',
            key: '_id',
            allowNull: true
        }
    }
})

module.exports ={Db, Customer, Planner};