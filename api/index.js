import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import connectDB from "./db/mongoose.js"
import User from './model/User.js'
import multer from 'multer';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import Post from './model/Post.js';

const upload = multer({ dest: 'resources/' })

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/resources', express.static( __dirname + '/resources'))
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:"http://localhost:3000"
}));
app.use(cookieParser())

connectDB();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.json("Hello World")
}) 

app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {        
        const salt = bcrypt.genSaltSync(10);
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });  
        res.json(userDoc)
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }    
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try { 
        const userDoc =  await User.findOne({username});         
        if(userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password)
            let secret = process.env.SECRET_KEY
            if(passOk) {
                await jwt.sign({username, id:userDoc.id},secret, {}, (err, token)=> {
                    if(err) throw err;                    
                    res.status(200).cookie('token', token).json({
                        id:userDoc._id,
                        username
                    })
                });    
            } else {
                throw "Wrong Credentials";                 
            } 
        } else {            
            throw "Username not found!!!";
        }                  
    } catch (error) {        
        res.status(400).json(error);
    }    
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if(token) {
        let secret = process.env.SECRET_KEY    
        jwt.verify(token, secret, {}, (err, info) => {
            if(err) throw err
            res.json(info);
        });
    }    
    //res.json({});   
})  


app.post('/logout', (req, res) => {
    res.cookie('token', '').json("ok");       
})

app.post('/post', upload.single('file'),  (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext =  parts[parts.length - 1];
    const newPath = path+"."+ext;
    fs.renameSync(path, newPath);
    //PostModel

    const {token} = req.cookies;
    if(token) {
        let secret = process.env.SECRET_KEY    
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err
            const {title, summary, content} = req.body;
            const postDac = await Post.create({
                title,
                summary,
                content,
                cover:newPath,
                author:info.id                  
            });
            postDac.save();    
            res.json({postDac}); 
        });
    }         
})

app.get('/posts', async (req, res) => {    
   const data = await Post.find({})
                    .populate('author', ['username'])
                    .sort({createdAt: -1})
                    .limit(20) ;    

   res.json(data);
});   

app.get('/post/:id', async (req, res) => {    
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);    
    res.json(postDoc);    
});  


app.put('/post', upload.single('file'),  (req, res) => {
    let newPath = null;
    if(req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext =  parts[parts.length - 1];
        const newPath = path+"."+ext;
        fs.renameSync(path, newPath);
        //PostModel
    }

    const {token} = req.cookies;
    if(token) {
        let secret = process.env.SECRET_KEY    
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err
            const {id, title, summary, content} = req.body;
            const postDoc = await Post.findById(id);
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
            if(!isAuthor) {
                return res.status(400).json("Your are not the author")
                throw "Your are not the author";
            }              
            await postDoc.updateOne({
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            })
            postDoc.save();
            res.json({postDoc}); 
        });
    }         
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});