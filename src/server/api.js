const mock = require('./mock.js');
const md5  = require('md5');
const fetch = require('node-fetch');
const escape = require("html-escape");
const Yelp = require('node-yelp-fusion');

const makeSessionID = function(user,pass,data){
  const key = md5(`${Date.now()}-${user}/${pass}`);
  return key;
};

const yelp = new Yelp({
  id:'YOUR_YELP_ID' ,
  secret:'YOUR_YELP_SECRET'
});

const yelpSearch = (location,subject)=>{
  return yelp.search('term='+subject+'&location='+ location);
};


class DishfinderApi{

  auth(session_id){
    const DB = this.database;
    return new Promise(function(fulfill,reject){
      DB.get(`SELECT * FROM df_session , df_user
              where user_ref=user_id and session_key=? and is_active=1`,
        [session_id])
      .then(session => {
        if(!session){
          reject({error:"invalid session token!"});
          return;
        }
        const user_session = {
          id:session.user_id,
          name:session.fullName,
          mail:session.mail
        };

        fulfill({key:session_id,data:user_session});
      }).catch(err=>{
        console.log('AUTH error:',err);
        reject({error:"invalid session token!"});
      });
    });
  }

  logout(session_key){
    const DB = this.database;
    return new Promise(function(fulfill,reject){
      DB.run(`UPDATE df_session SET is_active =0 WHERE session_key=?`,[session_key])
      .then(r=>fulfill({result:'Successful'}))
      .catch(r=>reject({result:'Unsuccessful'}));
    });
  }

  login(username,pass){
    const DB = this.database;

    return new Promise(function(fulfill,reject){
      const hashPass = md5(pass);

      DB.get('SELECT * FROM df_user WHERE name=? and [password]=?',[username,hashPass])
      .then(user=>{
        if(user){
          const data = {id:user.user_id,name:user.fullName,email:user.mail};
          const key= makeSessionID(username,hashPass,data);
          DB.run('INSERT INTO df_session (session_key,is_active,user_ref) VALUES(?,?,?)',
                [key,1,user.user_id])
          .then(r=> fulfill({key,data}))
          .catch(err=>{
            console.log(err,'err');
            reject({error:'Internal Error'});
          });
        }else{
          reject({error:'Oops, Login failed!'});
        }
      }).catch(err=>{
         console.log('Login Error:',err);
         reject({error:'Oops, Error' ,data:err})
       });
    });
  }

  register(username,name,pass,mail){
    const DB = this.database;
    const hasPass = md5(pass);

    return new Promise(function(fulfill,reject){
      DB.run(`
        INSERT INTO df_user (name,fullname,password,mail,verified)
        VALUES (?,?,?,?,?)
      `,[username,name,hasPass,mail,true])//TODO:set verified to false
      .then(r=>fulfill({success:true}))
      .catch(err=>reject({error:err}));
    });
  }

  recover(mail){
    return new Promise(function(fulfill,reject){
      reject('NOT IMPLEMENTED');
    });
  }

  getComments(id){
    const DB = this.database;
    return new Promise(function(fulfill,reject){
      DB.all('SELECT * from df_comment join df_user on user_ref=user_id Where yelp_id=? ORDER BY comment_id DESC',[id])
      .then(comments => fulfill(comments.map(c=>{
          return {
            'user': c.fullName,
            'text': c.comment
          };
      }))).catch(_=>reject('Internal Error'));
    });
  }

  postComment(session_id,id,comment){
    const DB = this.database;
    const authFn = this.auth;

    return this.auth(session_id)
    .then(auth=> {
      const user_ref = auth.data.id;
      return DB.run('INSERT INTO df_comment (user_ref,yelp_id,comment) VALUES(?,?,?)',[user_ref,id,comment]);
    })
    .catch(r=> new Promise((fulfill,reject)=>reject('Internal Error')))
    .then(f=> new Promise((fulfill,rejct)=>{
      DB.all('SELECT * from df_comment join df_user on user_ref=user_id Where yelp_id=? ORDER BY comment_id DESC',[id])
      .then(comments => fulfill(comments.map(c=>{
          return {
            'user': c.fullName,
            'text': c.comment
          };
      }))).catch(_=>reject('Internal Error'));
    }));
  }

  search(location,subject){
    return new Promise((fulfill,reject)=>{
      yelpSearch(location,subject)
      .catch(err=>{
        reject(err);
      })
      .then(result=> {
        var converted=[];
        result.businesses && result.businesses.forEach(item=>{
            converted.push({
              id:item.id,
              title:item.name,
              location:{
                lng:item.coordinates.longitude,
                lat:item.coordinates.latitude
              },
              url:item.url,
              image:item.image_url,
              rating:item.rating,
              price:item.price,
              phone:item.display_phone,
              city:item.location.city,
              state:item.location.state,
              zip_code:item.location.zip_code,
              country:item.location.country,
              address:(item.location.address  || ' ') +
                      (item.location.address1 || ' ') +
                      (item.location.address2 || ' ')
            });
        });

        fulfill(converted);
        // fulfill(mock.MOCK_DATA_SEARCH);
      });
    });
  }

}



var api = new DishfinderApi();

module.exports.routes = function(app,db){

  api.database = db;

  app.route('/api').all(function(req,res){
    res.json({'message':'Dishfinder API - version 1'});
  });

  app.route('/api/comments/:id').get(function(req,res){
    api.getComments(req.params.id)
    .then(r=>res.json(r))
    .catch(err=>res.json({error:err}));
  });

  app.route('/api/comments/:id').post(function(req,res){
      const session_id = req.body.session_id;
      const id = req.params.id;
      const post = req.body.comment && escape(req.body.comment);
      api.postComment(session_id,id,post)
      .catch(err=>  res.json({error:err}))
      .then(result => res.json(result));
  });

  app.route('/api/logout').post(function(req,res){
    var session_id = req.body.session_id;
    api.logout(session_id)
    .then(function(result){
      res.json(result);
    })
    .catch(function(err){res.send(err)});
  });

  app.route('/api/login').post(function(req,res){
    var user =req.body.user;
    var pass =req.body.pass;
    api.login(user,pass).then(function(result){
      res.json(result);
    }).catch(function(err){res.send(err)});
  });

  app.route('/api/auth').post(function(req,res){
    var session_id = req.body.session_id;
    api.auth(session_id)
    .then(function(result){
      res.json(result);
    })
    .catch(function(err){res.send(err)});
  });

  app.route('/api/signup').post(function(req,res){
    var username  = req.body.username;
    var name      = req.body.name;
    var password  = req.body.password;
    var mail      = req.body.mail;

    api.register(username,name,password,mail).then(function(result){
      res.json(result);
    }).catch(function(err) {
      res.send(err);
    });
  })

  app.route('/api/recover').post(function(req,res){
    const email = req.body.mail;
    api.recover(email)
    .then(r=>res.json(r))
    .catch(err=>res.json({error:err}));
  });

  app.route('/api/search/:location/:subject').all(function(req,res){
    var location = req.params.location;
    var subject  = req.params.subject;

    api.search(location,subject).then(function(result){
        res.json(result);
    });
  });
}
