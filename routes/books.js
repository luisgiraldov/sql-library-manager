const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize'); 
/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).render("error", {error, title: "Server Error"});
      }
    }
}

/* Get All books */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
}));

/** Get New book's form */
router.get('/new', (req, res) => {
  res.render("books/new_book", { title: "New Book" });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/form_error", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

/**Search Bar */
router.get('/search', asyncHandler(async (req, res) => {
  const booksList = await Book.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${req.query.search.trim()}%`
        },
        author: {
          [Op.like]: `%${req.query.search.trim()}%`
        },
        genre: {
          [Op.like]: `%${req.query.search.trim()}%`
        },
        year: {
          [Op.like]: `%${req.query.search.trim()}%`
        }
      }
    }
  });

  if(booksList) {
    let books = [];
    //regex to find match on query
    const regexForSelection = new RegExp(`${req.query.search}`, "i");
    booksList.forEach(book => {
      //get the information from every query returned by the database
      let thisBook = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year
      };
      let found = "";
      let stringMatched = "";
      //test which column matches the query
      if(regexForSelection.test(thisBook.title)){
        //get the characters that match the query
        found = thisBook.title.match(regexForSelection);
        //add the span tags to highlight the match
        stringMatched = thisBook.title.replace(found[0], `<span class="js-stringMatched stringMatched">${found[0]}</span>`);
        //update the column with the text and the span tags inside
        thisBook.title = stringMatched;
      } else if(regexForSelection.test(thisBook.author)){
        found = thisBook.author.match(regexForSelection);
        stringMatched = thisBook.author.replace(found[0], `<span class="js-stringMatched stringMatched">${found[0]}</span>`);
        thisBook.author = stringMatched;
      } else if(regexForSelection.test(thisBook.genre)){
        found = thisBook.genre.match(regexForSelection);
        stringMatched = thisBook.genre.replace(found[0], `<span class="js-stringMatched stringMatched">${found[0]}</span>`);
        thisBook.genre = stringMatched;
      }
      books.push(thisBook);
    });

    console.log(books);
    res.render("index", { books, title: "Books" })
  } else {
    res.status(404).render("books/page_not_found", { error: 404, title: "Page Not Found!" });
  }
}));

/** Get Book */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update_book", { book, title: book.title });  
  } else {
    res.status(404).render("books/page_not_found", { error: 404, title: "Page Not Found!" });
  }
}));

/* Update a book */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.status(404).render("books/page_not_found", { error: 404, title: "Page Not Found!" });
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render(`books/update_book`, { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    res.status(404).render("books/page_not_found", { error: 404, title: "Page Not Found!" });
  }
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.status(404).render("books/page_not_found", { error: 404, title: "Page Not Found!" });
  }
}));

module.exports = router;