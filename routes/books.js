const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

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
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      console.log(error.errors[0].message);
      res.render("books/form_error", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
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
      res.redirect("/books/" + book.id); 
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