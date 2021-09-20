# NoSQL Databases

We have previously looked at relational databases and seen how useful they can be. By following the strict, table-based structure we can store our data safe in the knowledge that everything is in a consistent format and that we can write queries based on the structure we defined. The flip side of that is that we need to know *exactly* how our tables need to look before we can build them, and if we do need to make any changes later on it's a pretty big task.

**Non-relational** (or **NoSQL**) databases enable us to avoid some of the challenges presented by relation databases, but come with their own requirements which may or may not make them more suitable for any given application. Just like there are different types of relational database there are many different types of non-relational database, with some much bigger differences between them.

## Types of NoSQL Databases

There are four main categories of NoSQL database:

- **Graph-Based**: A graph-based database is one where the relationships between entities are the focus rather than the entities themselves. When working with highly interconnected data (such as a social network, for example) they are often more efficient than a relational system.
- **Column-Oriented**: Each column is stored separately in the database, making it much easier to add extra fields after the initial database setup. There is the downside that adding a new row requires updating multiple tables instead of just one, meaning they are a poor choice for a high-traffic system, but the improved lookup time makes them well-suited for analytic purposes.
- **Key-Value Store**: The database is simply a series of key-value pairs, making it incredibly easy to add new data. The values can themselves be key-value pairs which allows for some very complicated data structures to be stored. There is the obvious downside that keys must be unique.
- **Document Stores**: The most common type of NoSQL database and the type which we will be looking at here. Each document is a collection of key-value pairs, meaning repetition of keys is permitted across documents. It is also possible to specify some sort of schema and give some structure similar to a relational database, however this schema is much more flexible than in an SQL system.

## NoSQL + JavaScript - PouchDB

### Database Setup

The system we will use here is called [CouchDB](http://couchdb.apache.org/), an easy to set up and use document store. Once it has been installed starting the application will open a web interface where we can create and interact with databases, just like we could with tools such as Postico when working with PostgreSQL. We want to be able to have our programs interact with the database, which will require some configuration.

As a security measure it is not possible for another application to interact with our database without explicitly giving permission. The first step in doing so is to enable **Cross-Origin Resource Sharing**, or **CORS**. CORS prevents requests from an external source being actioned, which will include the JS application we will write. Click the "Config" tab on the left of the screen, then "Enable CORS" and ensure "all domains" is selected.

![CouchDB CORS setup - 1](img/couchdb_cors_disabled.png)

![CouchDB CORS setup - 2](img/couchdb_cors_enabled.png)

We also need to create a server admin account which our JS application will use to sign in to the database. Ordinarily we would encrypt this when sending it over the web, but **in this example we will be writing it in plain text**. Click the "user management" tab, then "create server admin".

![CouchDB server admin creation](img/couchdb_admin_creation.png)

### JavaScript Setup

Our application will be built using the **PouchDB** library. This provides functionality to connect to a CouchDB database, but also to embed one within our application if needed. PouchDB is lightweight, meaning it provides only the minimum functionality needed to run out of the box. When we need to perform more advanced operations we can add plugins to add those features.

```sh
# terminal
npm init -y
npm i pouchdb

touch film_database.js
```

After we import PouchDB into our application we can use the methods provided to connect to a database. By using the PouchDB constructor we create an object representing the connection with methods which facilitate the CRUD actions. The string we pass to the constructor represents the databse location. If we simply pass in the name of a database we will create one locally, alternatively we pass a url for a remote database. Any server admin credentials need to be included in the url.

```js
// film_database.js

const PouchDB = require('pouchdb');

const db = new PouchDB('http://bnta:bnta@localhost:5984/films');
```

If the database already exists this will connect to it, otherwise it will be created. Checking in the CouchDB GUI won't show the database yet in this case, we need to perform an operation on it first. Querying the database is an asynchronous operation (even if it is embedded), meaning the methods will return Promises. We'll start by using the `info` method to check the status of our database.

```js
db.info().then((response) => {
	console.log(response);
})

```

> Comment out method calls as we go, or things can get quite messy

The databse should now also appear in the GUI in the browser.

## CRUD in NoSQL

### Create

Just like with a relational database, we need to be able to create, read, update and delete records. We'll start by adding a new film, but what data should we include? In a relational system we have the specification provided by the schema but we no longer have that to guide us. We're free to add any information we like about our film, which we save to the database using the `put` method.

```js
const batmanBegins = {
    "_id": "batman_begins",
    "title": "Batman Begins",
    "rating": "12A",
    "duration": 140,
    "villain": "Ra's Al Ghul",
    "cast": [
        "Christian Bale",
        "Liam Neeson",
        "Katie Holmes",
        "Gary Oldman"
    ]
};

db.put(batmanBegins);

```

Note some key differences to the PostgreSQL queries:

- The database isn't tracking the id, we're providing it. This can make it easier to keep track of which id corresponds to which document, but it passes the responsibility back to the user.
- We didn't have to specify any datatypes before we saved the document. The only requirement is that we submit JSON, the document can contain whatever we like. It is, however, good practice to maintain some form of consistency for the benefit of anyone reading the data.
- Related to this, we can store arrays as values within our documents. This means we don't have the same need for a connected multi-table structure as we do in SQL. We can even store other objects as values here!

Let's add another document:

```js
const darkKnight = {
    "_id": "dark_knight",
    "title": "The Dark Knight",
    "rating": "12A",
    "duration": 152,
    "villain": [
        "Joker",
        "Two-Face"
    ],
    "cast": [
        "Christian Bale",
        "Heath Ledger",
        "Maggie Gyllenhaal",
        "Gary Oldman",
        "Aaron Eckhart"
    ],
    "release_year": 2008
};

db.put(darkKnight);

```

Not being constrained by a schema means that we can add or remove information to a new document which was not part of the existing data. This removes the need to rebuild a table if we need to make changes to the schema, but there are potential problems for the end user if the structure of the data changes significantly.

Being able to set the ID values ourselves raises the possibility of duplicating one - what happens if we do?

```js
const darkKnightRises = {
    "_id": "dark_knight",
    "title": "The Dark Knight Rises",
    "rating": "12A",
    "duration": 164,
    "villain": "Bane",
    "cast": [
        "Christian Bale",
        "Tom Hardy",
        "Anne Hathaway",
        "Gary Oldman"
    ],
    "release_year": 2012
};

db.put(darkKnightRises);

```

We see an error, so something has gone wrong somewhere. We get a Promise back from the `put` method so we can add a `catch` statement to find out what.

```js
db.put(darkKnightRises).catch((error) => {
    console.log(error);
});

```

Looking at the JSON in the error message we see that our request is causing a **409** error, meaning there is some sort of conflict. This is because there is already a document with the id `dark_knight`, so we can't add another. Updating the ID to something different (`dark_knight_rises`?) will resolve this and allow us to save the document.

### Read

Information can be retrieved from the database using the `get` method, which lets us query the databse by ID. The method is asynchronous, meaning we need to handle the promise when we get the response.

```js
db.get("dark_knight").then((doc) => {
    console.log(doc);
});

```

We simply log the response here, but as it is a JSON object we could interact with it in any way we like here. We could, for example, `map` or `filter` it, illustrating the need for consistency in our data.

### Update

Just like with SQL, if we can identify an entry then we can modify it. We reuse the methods we have seen already to retrieve an entry before modifying and replacing it. 

```js
db.get('batman_begins').then((doc) => {
    doc.cast = [...doc.cast, "Cillian Murphy"];
    db.put(doc);
    
```

If we return the Promise returned by the `put` call we can see how the updated record looks.

```js
db.get('batman_begins').then((doc) => {
    doc.cast = [...doc.cast, "Cillian Murphy"];
    return db.put(doc);
}).then(() => {
    return db.get('batman_begins');
}).then((doc) => {
    console.log(doc);
});

```

Our extra cast member is here, but notice that the `_rev` property has also changed. A feature of CouchDB is the ability to merge multiple users' changes to the same document (in a similar way to Git) and this property provides an indicator to those users that changes have been made since they last accessed the resource.

### Delete

Deleting from a NoSQL database can be done in different ways. We can manually set a `_deleted` property on a document using `put`, but we can accomplish them same thing by first finding the document then using the `remove` method.

```js
db.get('dark_knight_rises').then((doc) => {
    return db.remove(doc);
});

```

## Querying with Mango

We are somewhat limited compared to what we have seen before with SQL in that we can only query our database using an ID property. We can address that though by adding a plugin to PouchDB which will let us specify exactly what we want to query the database using.

```sh
npm i pouchdb-find

```

```js
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('http://bnta:bnta@localhost:5984/films');

//...

```

We can now call a `find` method and pass a JSON object specifying the selectors we want to query and the values we want to search for.

```js
db.find({
    selector: {
        title: "The Dark Knight"
    }
}).then((doc) => {
    console.log(doc.docs[0]);
});
```

We can also use comparators to search by.

```js
db.find({
    selector: {
        duration: {$lt: 150}
    }
}).then((doc) => {
    console.log(doc.docs[0]);
});
```

## Further Reading

- [Types of NoSQL Database](https://dzone.com/articles/nosql-database-types-1)
- [PouchDB](https://pouchdb.com/)
- [The Mango Query Language](https://github.com/cloudant/mango)