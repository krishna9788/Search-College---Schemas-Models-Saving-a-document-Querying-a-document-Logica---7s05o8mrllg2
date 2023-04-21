const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connections } = require('mongoose');
const { connection } = require('./connector');

const isNullOrUndefined = val => val === null || val === undefined;

app.get("/findColleges", async (req, res)=>{
    const name = req.query.name;
    const state = req.query.state;
    const city = req.query.city;
    const minPackage = req.query.minPackage;
    const maxFees = req.query.maxFees;
    const course = req.query.course;
    const exam = req.query.exam;
    let result = [];
    let combineQuery = [];

    for(let key in req.query){
        if(key === 'name'){
            combineQuery.push({name: {$regex: req.query[key], $options:"i"}});
        }
        else if(key === 'state'){
            combineQuery.push({state: {$regex: req.query[key], $options:"i"}});
        }else if(key === 'city'){
            combineQuery.push({city: {$regex: req.query[key], $options:"i"}});
        }else if(key === 'minPackage'){
            combineQuery.push({minPackage:{$gte : parseFloat(req.query[key])}});
        }else if(key === 'maxFees'){
            combineQuery.push({maxFees:{$lte : parseFloat(req.query[key])}});
        }else if(key === 'course'){
            combineQuery.push({course: {$regex: req.query[key], $options:"i"}});
        }else if(key === 'exam'){
            combineQuery.push({exam: {$regex: req.query[key], $options:"i"}});
        }
    }

    if(Object.keys(req.query).length > 1){
        const listOfCombinCollege = await connection.find({$and: combineQuery})
        listOfCombinCollege.forEach(element =>{
            result.push(element);
        })
        res.send(result);
    }
    else if(isNullOrUndefined(name) && isNullOrUndefined(state) && isNullOrUndefined(city) && isNullOrUndefined(minPackage) && isNullOrUndefined(maxFees) && isNullOrUndefined(course) && isNullOrUndefined(exam)){
        res.send(await connection.find());
    }else{
        if(!isNullOrUndefined(name)){
            const listOfName = await connection.find({name:{$regex:name,$options:"$i"}});
            listOfName.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(state)){
            const listOfstate = await connection.find({state:{$regex:state,$options:"$i"}});
            listOfstate.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(city)){
            const listOfcity = await connection.find({city:{$regex:city,$options:"$i"}});
            listOfcity.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(minPackage) && minPackage > 0){
            const listOfminPackage = await connection.find({minPackage:{$gte : parseFloat(minPackage)}});
            listOfminPackage.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(maxFees) && maxFees > 0){
            const listOfmaxFees = await connection.find({maxFees:{$lte : parseFloat(maxFees)}});
            listOfmaxFees.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(course)){
            const listOfcourse = await connection.find({course:{$regex:course,$options:"$i"}});
            listOfcourse.forEach(element => {
                result.push(element);
            });    
        }
        else if(!isNullOrUndefined(exam)){
            const listOfexams = await connection.find({exam:{$all:exam}});
            listOfexams.forEach(element => {
                result.push(element);
            });    
        }
        res.send(result);
    }

})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
