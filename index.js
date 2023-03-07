import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb+srv://dbUser:dbUser@cluster0.juun3cc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB connected")
})
.catch((error) => {
    console.log(error)
})


const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String
    })
    
    const User = new mongoose.model("User", userSchema)
    
//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email})
    .then(user => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successful", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not found"})
        }
    })
    .catch(err => {
        console.log(err)
        res.send({message: "Error occurred"})
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email})
    .then(user => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save()
            .then(() => {
                res.send({ message: "Successfully Registered, Please login now." })
            })
            .catch(err => {
                console.log(err)
                res.send({message: "Error occurred"})
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.send({message: "Error occurred"})
    })
})
app.listen(9002,() => {
        console.log("BE started at port 9002")
})
    