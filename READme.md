# 📚 PLP Bookstore - MongoDB Scripts

This project demonstrates how to set up a MongoDB database (`plp_bookstore`) with a sample **books collection**, populate it with sample data, and run **basic, advanced, and aggregation queries** using Node.js and the official MongoDB driver.

---

## 🚀 Features
- **insert_books.js**
  - Connects to a MongoDB server (local or Atlas).
  - Creates the `plp_bookstore` database and `books` collection.
  - Populates it with sample book data (12 popular books).
  - Prints inserted documents.

- **queries.js**
  - Demonstrates MongoDB queries in Node.js:
    - Basic queries (`find`, `updateOne`, `deleteOne`)
    - Advanced queries (sorting, pagination, projections)
    - Aggregation pipelines (average price by genre, books by decade, top author)
    - Indexing & query performance with `.explain()`

---

## 🛠️ Requirements
- **Node.js** (v14+ recommended)
- **MongoDB** (local installation or MongoDB Atlas cluster)
- **npm packages**:
  - [mongodb](https://www.npmjs.com/package/mongodb)
  - [dotenv](https://www.npmjs.com/package/dotenv) (optional, if you want to use environment variables)

Install dependencies:
```bash
npm install mongodb dotenv

git clone https://github.com/your-username/plp-bookstore.git
cd plp-bookstore

      --- Database Connection ---
const uri = 'mongodb://localhost:27017';

const uri = process.env.MONGO_URI; // Example if using .env

MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net


--- ▶️ Running the Scripts ---
Populate database with sample books

node insert_books.js

---- Run queries ----
node queries.js

// Find all books
db.books.find()

// Find books by a specific author
db.books.find({ author: "George Orwell" })

// Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } })

// Find in-stock books
db.books.find({ in_stock: true })

=== Project Structure ===
plp-bookstore/
│── insert_books.js   # Script to insert sample books
│── queries.js        # Query examples (basic, advanced, aggregation, indexing)
│── package.json      # Dependencies
│── .env              # (optional) Atlas connection string


👨‍💻 Author
Omotosho Joshua
MERN Stack Assignment for MongoDB.
