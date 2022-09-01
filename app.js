require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var encrypt = require('mongoose-encryption');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser:true}).then(()=>{console.log("Connected")}).catch(()=>{console.log("Error")});

const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
);
// const secret = "thisisoursecret";
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
// const secret = "thisisoursecret";
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User = mongoose.model('User',userSchema);
app.get('/',(req,res)=>{
    res.render("home");
});
app.get('/register',(req,res)=>{
    res.render("register");
});
app.get('/login',(req,res)=>{
    res.render('login');
});
app.post('/register',(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const response = new User(
            {
                username:username,
                password:password
            }
        );
    response.save((error)=>{
        if(error){
            res.send(error);
        }
        else{
            res.render('secrets');
        }
    });
    }
    catch(e){
        res.send(e);
    }
});
app.post('/login',(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({
            username:username
        },(er,user)=>{
            if(er){
                res.send(er);
            }
            else if(user.password===password){
                res.render('secrets');
            }
        });
    }catch(e){
        res.send(e);
    }
});
app.listen(3000,()=>{
    console.log("Listening to port 3000 ....");
});