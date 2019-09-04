import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import Schemas from "./schemas";
import { searchTree } from './utilities';

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

app.post('/api/login', (req, res) => {
	logHit('POST', 'Login', req.body);
	const { email } = req.body;
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.findOne({ email }, (err, person) => {
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support'})
		}
		else {
			console.log(email, person);
			if (person) {
				res.send({ result: person._id });
			} else {
				res.send({ error: 'Person does not exist '})
			}
		}
	});
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

app.get('/api/persons/:id', (req, res) => {
	logHit('GET', 'Persons', req.params);
	const { id } = req.params;
	const Person = mongoose.model('Person', Schemas.personSchema);
	Person.findById(id, (err, persons) => {
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
	const {
		email, parentId, childId,
		firstName, middleName, lastName, maidenName,
		birthDay, birthMonth, birthYear,
		profileImage, images, relationships, treeId
	} = req.body;
	const Person = mongoose.model('Person', Schemas.personSchema);
	const trees = treeId ? [treeId] : [];
	Person.create({ email, firstName, middleName, lastName, maidenName, birthDay, birthMonth, birthYear, profileImage, images, relationships, trees: trees }, (err, person) => {
		console.log(person);
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support' });
		}
		else {
			const Tree = mongoose.model('Tree', Schemas.treeSchema);
			Tree.findOne({ _id: treeId }, (err, tree) => {
				if (err) {
					console.error(err);
					res.send({ error: 'Unknown error occurred, please reach out to support'})
				}
				else {
					if (relationships.length > 0) {

					} else {
						const newPerson = { userId: person._id, children: [] }
						Tree.update(
							{ _id: treeId},
							{ $push: { tree: { newPerson }}}
						)
					}
					res.send(tree);
				}
			});
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

app.get('/api/trees/:id', (req, res) => {
	logHit('GET', 'Trees', req.params);
	const { id } = req.params;
	const Tree = mongoose.model('Tree', Schemas.treeSchema);
	Tree.findById(id, (err, tree) => {
		console.log('Tried to find a tree')
		console.log(err, tree);
		if (err) {
			console.error(err);
			res.send({ error: 'Unknown error occurred, please reach out to support'})
		}
		else {
			res.send(tree);
		}
	});
});

// curl -d '{"name": "Test Tree 1", "userId": "5d5c0bd048401bdce50dad1d"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/trees
app.post('/api/trees', (req, res) => {
	logHit('POST', 'Trees', req.body);
	const { name, userId } = req.body;
	const Tree = mongoose.model('Tree', Schemas.treeSchema);
	const firstChild = { userId, children: [] };
	Tree.create({ name, children: [firstChild] }, (err, treeRes) => {
		if (err) {
			console.log(err);
			res.send({ error: 'Failed to create tree, please reach out to support' });
		}
		else {
			console.log('Created tree ', treeRes);
			const Person = mongoose.model('Person', Schemas.personSchema);
			Person.updateOne(
				{ _id: userId },
				{ $push: { trees: treeRes } },
				(err, personRes) => {
					if (err) {
						console.log(err);
						res.send({ error: 'Failed to update user with new tree, please reach out to support' });
					}
					else {
						console.log(`Added tree ${treeRes._id} to user ${userId} `, personRes);
						res.send({ treeRes, personRes });
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
