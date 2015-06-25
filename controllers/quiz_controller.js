var models = require('../models/models.js');


function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
  text = text.toString().replace(busca,reemplaza);
  return text;

}


// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	
	var resultado=req.query.search;
	if (resultado){
	resultado=replaceAll(resultado,' ','%');
	}

	models.Quiz.findAll(resultado ? {where: ["pregunta like ?", '%' + resultado + '%'], order: 'pregunta ASC'} : {}).then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error) {next(error);});
};




// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');  
  })   // res.redirect: Redirección HTTP a lista de preguntas
};