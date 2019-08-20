import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import Schemas from "./schemas";

const app = express();
// Connect to mongodb
mongoose.connect('mongodb://localhost/family-tree', { useNewUrlParser: true });
// Disable CORS to enable localhost dev
app.use(cors());
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logHit = (httpMethod, endpoint, details) => {
	console.log(`Received ${httpMethod} to ${endpoint}`);
	if (details) console.log(details);
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/relationship-types', (req, res) => {
	logHit('GET', 'RelationshipTypes');
	const RelationshipType = mongoose.model('RelationshipType', Schemas.relationshipTypeSchema);
	RelationshipType.find({}, (err, users) => {
		if (err) console.error(err);
		res.send(users);
	})
});

app.post('/api/relationship-types', (req, res) => {
	logHit('POST', 'RelationshipTypes', req.body);
	const { name } = req.body;
	const RelationshipType = mongoose.model('RelationshipType', Schemas.relationshipTypeSchema);
	RelationshipType.find({ name }, (err, types) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support' });
		}
		else if (types.length > 0) {
			res.send({ error: 'Type already exists' });
		}
		else {
			RelationshipType.create({ name }, (err, mongoRes) => {
				if (err) console.error(err);
				res.send(mongoRes);
			})
		}
	})

});

app.get('/health', (req, res) => {
	res.send({ result: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`FamilyTree local API listening on port ${PORT}`);
});
