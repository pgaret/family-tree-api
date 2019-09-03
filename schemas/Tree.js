import mongoose from 'mongoose';

const treeSchema = mongoose.Schema({
    name: String,
    tree: Object
});

export default treeSchema;
