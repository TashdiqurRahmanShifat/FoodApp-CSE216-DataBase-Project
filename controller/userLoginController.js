const bcrypt = require('bcrypt');
   const oracledb = require('oracledb');
const { use } = require('../router/home');

   async function checkLogin(req ,res){
    console.log("running"); 
    const { username, password } = req.body;
    console.log(username,password);
    var query = 'SELECT  * from users WHERE USERNAME = :username' ;
    const result =await connection.execute(query,[username]); 
    console.log(result.rows.length)
    if(result.rows.length === 0){
        res.send("User not found");
    }
    else{
        ///console.log(result.rows);
        const dbPasswordHash = result.rows[0][4];
        
         if (dbPasswordHash===password) {
          const user=[username];

          const myObject =[username];
          const serializedObject = JSON.stringify(myObject);
          res.redirect(`/dashboard?data=${encodeURIComponent(serializedObject)}`)
          console.log(user);
          //req.user=user;
           //req.session.user = { username };
          // res.redirect('/home');
         } else {
           res.send('Invalid password');
         }
    }
   }

 // Export controller functions
 module.exports = {
    checkLogin,
  };