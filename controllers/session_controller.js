var segundos_inactividad=120; //2 minutos

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};
		
		req.session.fecha_ultima_accion_sesion = Math.round(new Date/1000); //fecha ultima accion en segundos

        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

//AUTOLOGOUT

exports.autologout = function(req, res, next)
{
	req.session.logout=false; //variable para saber si se ha hecho logout.La dejamos en false mientras no se haga logout
	
	if(req.session.user)	
	{
		var fecha_actual=Math.round(new Date/1000); //fecha actual en segundos
			
			if ((fecha_actual-req.session.fecha_ultima_accion_sesion) > segundos_inactividad)
			{
				console.log("Sesión terminada.Ha estado inactivo mas de "+ segundos_inactividad/60+"minutos");
				delete req.session.user;
				delete req.session.fecha_ultima_accion_sesion;
				req.session.logout=true; //ponemos a true esta variable para saber que se ha hecho logout
				res.redirect("/login");  //destruimos la sesión y redirigimos a la pantalla de login		
			}	
			
			else
			{
				req.session.fecha_ultima_accion_sesion = Math.round(new Date/1000); //si no se cumple la condición,la última acción será la fecha actual
				next();
			}	
	}
	
	else
	{
		next();
	}	
};


// DELETE /logout   -- Destruir sesion 
exports.destroy = function(req, res) {
    delete req.session.user;
	delete req.session.fecha_ultima_accion_sesion;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};