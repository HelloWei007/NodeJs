const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/',(req,res)=>{
    res.send('hello world');    
});
app.get('/api/courses',(req,res)=>{
    res.send(courses);    
}); 

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find( c => c.id == parseInt(req.params.id));
    if(!course) res.status(404).send('the course not found');
    res.send(course);

}); 

//use postman and send /api/courses with body (json) _> "name" : x
app.post('/api/courses',(req,res)=>{

    const {
        error
    } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    console.log(req.body);    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req, res)=>{
      const course = courses.find(c => c.id == parseInt(req.params.id));
      if (!course) res.status(404).send('the course not found');
    
      const { error } = validateCourse(req.body);
  
      if (error) {
          res.status(400).send(error.details[0].message);
          return;
      }
      course.name = req.body.name;
      res.send(course);

});

function validateCourse(course){
     const schema = {
         name: Joi.string().min(3).required()
     };
     return Joi.validate(course, schema);

}


const port = process.env.PORT ||3000;
app.listen(port,()=> console.log(`listening on port ${port}`));