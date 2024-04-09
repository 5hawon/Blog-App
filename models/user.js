const {Schema,model} = require('mongoose');
const { randomBytes, createHmac } = require('crypto');



const userSchema = new Schema({
    fullName:{
        type : String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique : true
    },
    salt:{
        type : String,
        
    },
    password:{
        type : String,
        required: true
    },
    profileImage:{
        type : String,
        default: '../public/images/kaka2.png'
    },
    role:{
        type : String,
        enum : ["USER","ADMIN"],
        deafult: "USER"
    }

},{timestamps: true})
userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified("password")) return next();
   
    const salt =randomBytes(16).toString();

    const hashedPassword = createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPassword;

    next();
})

userSchema.static('matchPassword',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("No such user");


    const salt = user.salt;

    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256',salt)
    .update(password)
    .digest("hex");
    if(userProvidedHash!==hashedPassword) throw new Error("Authentication failed");

    return user;





})

const User = model('user', userSchema);



module.exports = User;