const Sequelize = require('sequelize');
// const db = require('../config/database');

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