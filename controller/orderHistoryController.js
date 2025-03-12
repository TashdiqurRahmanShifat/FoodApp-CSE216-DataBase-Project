const oracle = require("oracledb");
async function loadHistory(req,res){
    const connection=await oracle.getConnection(  {
        user : "FOODCHAIN",
        password : "1234567",
        connectString : "localhost:1521/orclpdb",
    });
    const user_id=req.session.userId;

    const query='SELECT * FROM USERS NATURAL JOIN ORDERS  WHERE USER_ID=:user_id AND IS_DELIVERED=1 ORDER BY ORDER_ID';
    const query2='SELECT * FROM USERS NATURAL JOIN ORDERS  WHERE USER_ID=:user_id AND IS_DELIVERED=0 ORDER BY ORDER_ID';
    const result =await connection.execute(query,[user_id]);
    const result2 =await connection.execute(query2,[user_id]);
    res.render("orderHistory" , {orderList : result.rows, pendingList:result2.rows});
}
module.exports = {
    loadHistory,
  };