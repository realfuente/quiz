var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página de entrada (home page)
router.get('/',sessionController.autologout, function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId
router.param('commentId', commentController.load);  // autoload :commentId

// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de /quizes
router.get('/quizes', sessionController.autologout,quizController.index);
router.get('/quizes/:quizId(\\d+)',sessionController.autologout,quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',sessionController.autologout,sessionController.autologout,quizController.answer);
router.get('/quizes/new', 				   sessionController.loginRequired,sessionController.autologout,quizController.new);
router.post('/quizes/create',              sessionController.loginRequired,sessionController.autologout,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired,sessionController.autologout,quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired,sessionController.autologout,quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired,sessionController.autologout,quizController.destroy);
router.get('/quizes/:quizId(\\d+)/comments/new',sessionController.autologout,commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',sessionController.autologout,commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.autologout,sessionController.loginRequired,commentController.publish);

router.get('/author',sessionController.autologout, function(req, res){
	res.render('author', {errors: []})
});

module.exports = router;