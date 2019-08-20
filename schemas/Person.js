import mongoose from 'mongoose';
import relationshipSchema from './Relationship';
import treeSchema from './Tree';

const personSchema = mongoose.Schema({
	email: String,
	firstName: String,
	middleName: String,
	lastName: String,
	maidenName: String,
	birthDay: Number,
	birthMonth: Number,
	birthYear: Number,
	profileImage: Number,
	images: [String],
	relationships: [relationshipSchema],
	trees: [treeSchema]
});

export default personSchema;
