import mongoose from 'mongoose';

const nodeSchema = mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    children: Array
})

const treeSchema = mongoose.Schema({
    name: String,
    children: [nodeSchema]
});

export default treeSchema;
