var models = require('../models/models.js');

exports.estadisticas = function(req, res) {
	
	models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function (quizes) 
	{
		var quizestotales = quizes.length;
		var comentariostotales = 0;
		var quizessincomentarios = 0;
		var quizesconcomentarios = 0;
		
		for(i in quizes)
		{
			var quizcomentario = quizes[i].Comments.length;
			comentariostotales += quizcomentario;
			
			if(quizcomentario === 0)
			{
				quizessincomentarios ++;
			}
			else
			{
				quizesconcomentarios ++;
			}
		}
		
		var mediacomentarios = Math.round((comentariostotales/quizestotales) * 100) / 100;
		
		res.render('estadisticas/index', { 
			quizestotales: quizestotales,
			comentariostotales: comentariostotales,
			mediacomentarios: mediacomentarios,
			quizessincomentarios: quizessincomentarios,
			quizesconcomentarios: quizesconcomentarios, errors: []
		});
	});
};