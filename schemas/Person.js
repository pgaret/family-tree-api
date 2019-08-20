import mongoose from 'mongoose';
import relationshipSchema from './Relationship';

const personSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	birthDay: Number,
	birthMonth: Number,
	birthYear: Number,
	profileImage: Number,
	relationships: [relationshipSchema]
});

export default personSchema;
