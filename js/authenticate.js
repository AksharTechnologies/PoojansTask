function ensureAuthenticated(req, res, next) {

    console.log('///')
    console.log(req.session.details) ;
    if (req.session.details !== null && req.session.details !== undefined && req.session.details !== '' )
    {
        console.log('ensure user authenticated');
        return next();
    }

    else if(req.session.passport !==null && req.session.passport !== undefined && req.session.passport !== ''){
        
        console.log('passport passed');
        return next();
    }
    else{
        res.redirect("https://" + req.headers['host'] + '/login/loginview');
        res.finished = true
        res.end();
    }
      // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
  }
  module.exports  = ensureAuthenticated ;