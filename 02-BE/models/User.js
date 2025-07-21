import {Schema,model} from 'mongoose';



const userSchema = new Schema({
    email:{ 
        type: String,
        trim: true,
         required: true,
         unique: true,
             validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
            }
        },
    password:{ 
        type: String,
        required: true,
        minlength: 6,
        maxlength: 64
    }
},
{ 
    collection:'User',
    timestamps:true,
}
);
export default model('User', userSchema);