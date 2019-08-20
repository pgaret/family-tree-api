import express from 'express';
import mongoose, { mongo } from 'mongoose';
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
	RelationshipType.find({}, (err, relationshipTypes) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support' });
		}
		else {
			res.send(relationshipTypes);
		}
	});
});

// curl -d '{"name": "Whatever_I_Want"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/relationship-types
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
				if (err) {
					console.error(err);
					res.send({ error: 'Unknown error occurred, please reach out to support'})
				}
				else {
					res.send(mongoRes);
				}
			});
		}
	});
});

app.get('/api/persons', (req, res) => {
	logHit('GET', 'Persons');
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.find({}, (err, persons) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support'})
		}
		else {
			res.send(persons);
		}
	});
});

app.get('/api/persons/:email', (req, res) => {
	logHit('GET', 'Persons', req.params);
	const { email } = req.params;
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.findOne({ email }, (err, persons) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support'})
		}
		else {
			res.send(persons);	
		}
	});
})

// curl -d '{"email": "peregringaret@gmail.com", "firstName":"Peregrin", "middleName": "Hazard", "lastName": "Garet", "birthDay": 16, "birthMonth": 7, "birthYear": 1992, "profileImage": -1, "images": [], "relationships": []}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/persons
app.post('/api/persons', (req, res) => {
	logHit('POST', 'Persons', req.body);
	const { email, firstName, middleName, lastName, maidenName, birthDay, birthMonth, birthYear, profileImage, images, relationships, trees } = req.body;
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.create({ email, firstName, middleName, lastName, maidenName, birthDay, birthMonth, birthYear, profileImage, images, relationships, trees }, (err, mongoRes) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support' });
		}
		else {
			res.send(mongoRes);
		}
	});
});

// curl -d '{"email": "peregringaret@gmail.com"}' -H "Content-Type: application/json" -X PUT http://localhost:3001/api/persons
app.put('/api/persons', (req, res) => {
	logHit('PUT', 'Persons', req.body);
	const { userId } = req.body;
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.updateOne(
		{ _id: userId },
		{ ...req.body },
		(err, personRes) => {
			if (err) {
				console.log(err);
				res.send({ error: 'Failed to update user with new data, please reach out to support' });
			}
			else {
				res.send({ personRes });
			}
		}
	);
});

app.get('/api/trees', (req, res) => {
	logHit('GET', 'Trees');
	const Tree = mongoose.model('Tree', Schemas.treeSchema);
	Tree.find({}, (err, trees) => {
		if (err) console.error(err);
		res.send(trees);
	});
});

// curl -d '{"name": "Test Tree 1", "userId": "5d5c0bd048401bdce50dad1d"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/trees
app.post('/api/trees', (req, res) => {
	logHit('POST', 'Trees', req.body);
	const { name, userId } = req.body;
	const Tree = mongoose.model('Tree', Schemas.treeSchema);
	Tree.create({ name }, (err, treeRes) => {
		if (err) {
			console.log(err);
			res.send({ error: 'Failed to create tree, please reach out to support' });
		}
		else {
			const Person = mongoose.model('Person', Schemas.personSchema);
			Person.update(
				{ _id: userId },
				{ $push: { trees: treeRes } },
				(err, personRes) => {
					if (err) {
						console.log(err);
						res.send({ error: 'Failed to update user with new tree, please reach out to support' });
					}
					else {
						res.send({ personRes });
					}
				}
			);
		}

	});
})

app.get('/health', (req, res) => {
	res.send({ result: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`FamilyTree local API listening on port ${PORT}`);
});