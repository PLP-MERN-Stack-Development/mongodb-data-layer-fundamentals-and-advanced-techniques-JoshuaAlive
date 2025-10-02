// queries.js
const { MongoClient } = require('mongodb');

require('dotenv').config();


const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const books = db.collection('books');

    console.log("\n=== BASIC QUERIES ===");

    // 1) Find all books in a specific genre
    const genre = "Fiction";
    const inGenre = await books.find({ genre }).toArray();
    console.log(`\nBooks in genre "${genre}":`);
    console.table(inGenre.map(b => ({ title: b.title, author: b.author, year: b.published_year })));

    // 2) Find books published after a certain year
    const year = 1960;
    const afterYear = await books.find({ published_year: { $gt: year } }).toArray();
    console.log(`\nBooks published after ${year}:`);
    console.table(afterYear.map(b => ({ title: b.title, year: b.published_year })));

    // 3) Find books by a specific author
    const author = "Harper Lee";
    const byAuthor = await books.find({ author }).toArray();
    console.log(`\nBooks by ${author}:`);
    console.table(byAuthor.map(b => ({ title: b.title, year: b.published_year })));

    // 4) Update the price of a specific book
    const updateTitle = "To Kill a Mockingbird";
    const newPrice = 35.55;
    const upd = await books.updateOne({ title: updateTitle }, { $set: { price: newPrice } });
    console.log(`\nUpdate price of "${updateTitle}" -> matched: ${upd.matchedCount}, modified: ${upd.modifiedCount}`);

    // 5) Delete a book by its title
    const deleteTitle = "The Great Gatsby";
    const del = await books.deleteOne({ title: deleteTitle });
    console.log(`\nDelete "${deleteTitle}" -> deletedCount: ${del.deletedCount}`);

    console.log("\n=== ADVANCED QUERIES ===");

    // Books in stock and published after 2010, projection title,author,price
    const inStockAfter2010 = await books.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log("\nIn-stock and published after 2010 (title, author, price):");
    console.table(inStockAfter2010);

    // Sorting by price ascending & descending
    const ascPrice = await books.find().sort({ price: 1 }).limit(10).toArray();
    const descPrice = await books.find().sort({ price: -1 }).limit(10).toArray();
    console.log("\nTop 10 cheapest:");
    console.table(ascPrice.map(b => ({ title: b.title, price: b.price })));
    console.log("\nTop 10 most expensive:");
    console.table(descPrice.map(b => ({ title: b.title, price: b.price })));

    // Pagination (5 per page) - show page 1 and page 2
    const perPage = 5;
    const page1 = await books.find().skip(0).limit(perPage).toArray();
    const page2 = await books.find().skip(perPage).limit(perPage).toArray();
    console.log("\nPage 1 (5 per page):");
    console.table(page1.map(b => ({ title: b.title })));
    console.log("\nPage 2 (5 per page):");
    console.table(page2.map(b => ({ title: b.title })));

    console.log("\n=== AGGREGATION PIPELINES ===");

    // Average price by genre
    const avgByGenre = await books.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } },
      { $sort: { avgPrice: -1 } }
    ]).toArray();
    console.log("\nAverage price by genre:");
    console.table(avgByGenre.map(g => ({ genre: g._id, avgPrice: g.avgPrice.toFixed(2), count: g.count })));

    // Author with the most books
    const topAuthor = await books.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("\nAuthor with most books:");
    console.table(topAuthor.map(a => ({ author: a._id, count: a.count })));

    // Group books by publication decade and count them
    const byDecade = await books.aggregate([
      { $addFields: { decadeStart: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } } },
      { $group: { _id: "$decadeStart", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("\nBooks by publication decade:");
    console.table(byDecade.map(d => ({ decade: `${d._id}s`, count: d.count })));

    console.log("\n=== INDEXING & EXPLAIN ===");

    // Explain BEFORE creating index
    const titleQuery = { title: "Wuthering Heights" };
    const explainBefore = await books.find(titleQuery).explain("executionStats");
    const extractExec = (ex) => ({
      nReturned: ex.executionStats?.nReturned ?? 'N/A',
      executionTimeMillis: ex.executionStats?.executionTimeMillis ?? 'N/A',
      totalDocsExamined: ex.executionStats?.totalDocsExamined ?? 'N/A',
      totalKeysExamined: ex.executionStats?.totalKeysExamined ?? 'N/A'
    });
    console.log("\nExplain (before index):", extractExec(explainBefore));

    // Create index on title
    const idx1 = await books.createIndex({ title: 1 });
    console.log("\nCreated index on title:", idx1);

    // Explain AFTER creating index
    const explainAfter = await books.find(titleQuery).explain("executionStats");
    console.log("Explain (after index):", extractExec(explainAfter));

    // Create compound index on author and published_year
    const idx2 = await books.createIndex({ author: 1, published_year: -1 });
    console.log("\nCreated compound index on author + published_year:", idx2);

    console.log("\nAll done. Close the script to end.");
  } catch (err) {
    console.error('Error running queries:', err);
  } finally {
    await client.close();
  }
}

run();
