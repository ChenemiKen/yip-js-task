const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const {Op} = require("sequelize");
const{Db, Customer, Planner} = require('./DBmodels');
const PORT = process.env.PORT || 5050;

// connect to the database
Db.authenticate()
  .then(()=> console.log('Database connected...'))
  .catch(err =>console.log('Error: '+err))

const app = express();
// app configs
app.engine('html', handlebars.engine({
    defaultLayout: false,
    extname: 'html',
}));
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//__________________ Routes/Controllers_______________________
// index view route/controller
app.get('', async function(req, res, next) {
    // fetch customers from the db
    const customers = await Customer.findAll({
        attributes:['id', 'name', 'pickup_loc', 'dropoff_loc', 'scheduled'],
        raw: true
    })
    
    // seven days starting from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for(var i=0; i<7; i++){
        let day = new Date();
        day.setDate(today.getDate() + i);
        day.setHours(0, 0, 0, 0);
        day = day.toLocaleDateString("en-US", { year: 'numeric' })+ "-"+ day.toLocaleDateString("en-US", { month: 'numeric' })+ "-" + day.toLocaleDateString("en-US", { day: 'numeric' })
        dates.push(day)
    }

    // fetch shedules from the db
    const schedules = await Planner.findAll({
        attributes:['date', 'slot1', 'slot2', 'slot3', 'slot4'],
        // only schedules in range of seven days from today
        where:{
            date:{
                [Op.gte]:dates[0],
                [Op.lte]:dates[6]
            }
        },
        raw: true
    })
    // creating planner for the seven days interval
    const planner = schedules
    dates.forEach(date => {
        if(!(planner.some(d => d.date === date))){
            plan = {
                date:date,
                slot1:null,
                slot2:null,
                slot3:null,
                slot4:null
            }
            planner.push(plan)
        }
    });
    planner.sort((a, b) =>{
        let da = new Date(a.date),db = new Date(b.date);
        return da - db;
    });
    // console.log(planner);
    // render page
    res.render('index', {customers: customers, planner:planner});
});


// enpoint/Controller to schedule a customer into a slot
app.post('/schedule', async function(req, res, next){
    // fetch the operation data
    const customer_id = req.body.customer_id;
    const date = req.body.date;
    const slot = req.body.slot;

    try {
        // check if the customer delivery has already been scheduled
        const check = await Customer.findOne({
            attributes:['id', 'name', 'scheduled', 'delivery_date', 'delivery_slot'],
            where:{id:customer_id},
            raw:true
        })
        if(check.scheduled == false){    
            // check for any schedule on the specified date. If theres a schedule, update the schedule
            // else create a new schedule entry for the specified date
            const schedule = await Planner.findAll({
                attributes:['date', 'slot1', 'slot2', 'slot3', 'slot4'],
                where:{
                    date:date
                },
                raw:true
            })
            if(schedule.length > 0){
                // theres a schedule entry for that date
                const updateSchedule = await Planner.update({[slot]:customer_id}, {
                    where:{
                        date:date
                    }
                })
            }else{
                // theres no schedule entry for that date yet, create one
                const newSchedule = await Planner.create({date:date, [slot]:customer_id})
            } 

            // update customer data
            const updateCustomer = await Customer.update({scheduled:true, delivery_date:date, delivery_slot:slot},{
                where:{
                    id:customer_id
                }
            })

            var data={message:'success'}
            res.status(201).send(data)
        }else{
            var data={
                message:'already scheduled',
                delivery_date:check.delivery_date,
                delivery_slot:check.delivery_slot,
            }
            res.status(208).send(data)
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }   
})
// _______________routes end______________________


app.listen(PORT, () => {
    console.log(`Server started listening on http://127.0.0.1:${PORT}`);
});