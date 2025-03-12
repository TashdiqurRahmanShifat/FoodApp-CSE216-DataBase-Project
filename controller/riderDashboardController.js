
const oracle = require("oracledb");
async function check(req,res){
    const connection=await oracle.getConnection(  {
        user : "FOODCHAIN",
        password : "1234567",
        connectString : "localhost:1521/orclpdb",
    });
    const rider_id=req.session.riderId;
    const query='SELECT * FROM ORDER_SERIAL WHERE DELIVER_MAN_ID=:rider_id ';
    console.log(rider_id);
    const query2='SELECT * FROM DELIVER_MAN NATURAL JOIN ORDERS NATURAL JOIN PAYMENT WHERE DELIVER_MAN_ID=:rider_id';
    const result =await connection.execute(query,[rider_id]);
    const res2=await connection.execute(query2,[rider_id]);
    res.render("riderDashboard" , {orderList : result.rows,deliverList:res2.rows});
}
module.exports = {
    check,
  };