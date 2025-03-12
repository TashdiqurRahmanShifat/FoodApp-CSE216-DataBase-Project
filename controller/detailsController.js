const oracle = require('oracledb');

async function history(req,res){
    const id = req.query.id; 
    console.log(id,'id');
    const connection=await oracle.getConnection(  {
        user : "FOODCHAIN",
        password : "1234567",
        connectString : "localhost:1521/orclpdb",
    });
    const query='SELECT ORDER_ID,MENU.ITEM_NAME,ORDER_HISTORY.COUNT,MENU.PRICE,MENU.TYPE FROM ORDERS NATURAL JOIN ORDER_HISTORY  JOIN MENU ON ORDER_HISTORY.ITEM_NO=MENU.ITEM_NO WHERE ORDER_ID=:order_id'; // should be not natural join but join menu on restaurant id;
    const result=await connection.execute(query,[id]);
    console.log(result.rows,'query res');
    res.render("details",{list : result.rows});
}

module.exports={
    history,
}