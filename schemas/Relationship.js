import mongoose from 'mongoose';
import relationshipTypeSchema from './RelationshipType';

const relationshipSchema = mongoose.Schema({
	type: relationshipTypeSchema,
	userId: Number
});

export default relationshipSchema;
