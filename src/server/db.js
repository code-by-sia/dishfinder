
module.exports.updateDataBase =  function(db){
  db.run(`
      CREATE TABLE IF NOT EXISTS df_user(
        user_id integer primary key autoincrement,
        name varchar(255),
        fullName varchar(255),
        password varchar(255),
        mail varchar(20),
        verified BOOLEAN
      );

      CREATE UNIQUE INDEX IF NOT EXISTS
        UNIQUE_USER_EMAIL ON df_user (mail);

      CREATE UNIQUE INDEX IF NOT EXISTS
        UNIQUE_USER_USERNAME ON df_user (name);`
    );

    db.run(`
      CREATE TABLE IF NOT EXISTS df_session(
        session_id integer primary key autoincrement,
        session_key varchar(255),
        is_active boolean,
        user_ref integer ,
          FOREIGN KEY (user_ref) REFERENCES df_user(user_id)
      );`);

    db.run(`
      CREATE TABLE IF NOT EXISTS df_comment(
        comment_id integer primary key autoincrement,
        yelp_id nvarchar(255) ,
        comment nvarchar(255),
        user_ref integer,
          FOREIGN KEY (user_ref) REFERENCES df_user(user_id)
      );`
    );


}
