const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Filesystem = require('file-system');


var context = {
  letters: ['']
  , rightLetters: ['']
  , displayErrors: ' '
  , replaceLetter: []
  , lettersUsed: []
  , guessesLeft: 5
  , Duplicate: ' '
  , Gameover: ''
};

const words = Filesystem.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

//exports all of it
module.exports = {
  renderHang: function(req, res) {
    context.letters = [''];
    context.rightLetters = [''];
    context.Gameover = '';
    context.lettersUsed = [];
    context.guessesLeft = 5;
    var randomGlossery = Math.floor(Math.random() * (words.length));
    var randomtext = words[randomGlossery];
    var letters = randomtext.split("");
    var rightLetters = randomtext.split("");

  //loops thru to replace _
    for (var i = 0; i < letters.length; i++) {
      letters[i] = '__';
    }

    // stores the letters
    context.letters = context.letters.concat(letters);
    context.letters.shift();
    context.rightLetters = context.rightLetters.concat(rightLetters);
    context.rightLetters.shift();
    req.session.word = context.letters;
    req.session.correctWord = context.rightLetters;
    res.render('hang', context);
  }
  , enterLetters: function(req, res) {

    req.checkBody('userInput', 'one letter at a time').isLength({min: 1, max: 1});
    let errors = req.validationErrors();
    if (errors) {
      context.errors = errors;
    } else {
      context.errors = ' ';
    }
      context['userInput'] = req.body.userInput;

    // replaces blank with letter
    for (var i = 0; i < context.rightLetters.length; i++) {
      if (req.body.userInput.toLowerCase() === context.rightLetters[i]) {
        context.Duplicate = ' ';
        context.letters[i] = context.rightLetters[i];
        req.session.word = context.letters;

      }
    }

    // letter not right
    if (!context.rightLetters.includes(req.body.userInput.toLowerCase())) {
      context.guessesLeft--;
      req.session.guessesLeft = context.guessesLeft;
      context.Duplicate = ' ';
    }
    context.Duplicate = ' ';

    // tells u if u choose letter
    if (context.lettersUsed.includes(req.body.userInput.toLowerCase()) && !context.rightLetters.includes(req.body.userInput.toLowerCase())) {
      context.guessesLeft++;
      req.session.guessesLeft = context.guessesLeft;
      context.Duplicate = 'repeating letter';

    } else if (context.lettersUsed.includes(req.body.userInput.toLowerCase()) && context.rightLetters.includes(req.body.userInput.toLowerCase())) {
      context.Duplicate = 'repeating letter';

    }

    // pushes letters to correct location
    if (req.body.userInput.toLowerCase().length > 1) {
      context.guessesLeft++;
      req.session.guessesLeft = context.guessesLeft;
      context.Duplicate = ' ';
    } else if (!context.lettersUsed.includes(req.body.userInput.toLowerCase())) {
      context.lettersUsed.push(req.body.userInput.toLowerCase());
      req.session.lettersUsed = context.lettersUsed;
    }

    // letters filled in win
    if (!req.session.word.includes('__')) {
      context.Gameover = 'u win, play again?';
      req.session.Gameover = context.Gameover;
    }

    // less then one guess lose
    if (context.guessesLeft < 1) {
      var correctWord = context.rightLetters.join('');
      context.Gameover = 'u lose ' + correctWord + ' <--was ur word, play again?';
      req.session.Gameover = context.Gameover;
    }

      res.render('hang', context);
    }
};
