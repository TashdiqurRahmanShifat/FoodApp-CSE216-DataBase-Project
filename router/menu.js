const express=require("express");

const router=express.Router();

const oracle=require("oracledb");
const {dbConfig}=require("../connection");

//const{getMenu}=require("../controller/menuController.js");
//const{getOrder}=require("../controller/menuController.js");
let items={};
router.get('/',async(req,res)=>{
    const id = req.query.id; 
    const query2="select * FROM Menu natural join menu_img  WHERE RESTAURANT_ID = :id";
    const res2=await connection.execute(query2,{id});
    console.log(res2.rows);
    oracle.getConnection(
        {
            user : "FOODCHAIN",
            password : "1234567",
            connectString : "localhost:1521/orclpdb",
        },(err,con)=>{
            if(err) console.log("connection error");
            else{
                var query = "select * FROM Menu  WHERE RESTAURANT_ID = :id"
                con.execute(
                    query,[id],{autoCommit:true},(e,result)=>{
                        if(e) console.log(e);
                        items=result.rows;
                        res.render("menu" , {menu : result.rows,imgL: res2.rows});
                        
                    }
                );
            }
        }
    );
    //  const query="select * FROM Menu  WHERE RESTAURANT_ID = :id";
    //  const query2="select * FROM Menu NATURAL JOIN MENU_IMG  WHERE RESTAURANT_ID = :id";
    //  const res1=await connection.execute(query,{id});
    //  const res2=await connection.execute(query2,{id});
    //  res.render("menu" , {menu : res1.rows,imgL:res2.rows});     

});
router.post("/",async(req,res)=>{
    const orderedItems=[];
    try{
        const query1='SELECT * FROM DELIVER_MAN ORDER BY DELIVERY_COUNT ASC';
        const res1= await connection.execute(query1);
        const deliver_man_id=res1.rows[0][0];

        //const order_id=process.env.order_id;
        const user_id=req.session.userId;
        console.log(user_id,'user');
        const price=0;
        const review=' ';
        const oidquery=await connection.execute('SELECT ORDER_ID_SEQ.NEXTVAL FROM dual');
        const order_id=oidquery.rows[0][0];
        const res_id=1;
        console.log(user_id,deliver_man_id,order_id);
        await connection.execute(
            "INSERT INTO ORDERS (RESTAURANT_ID,ORDER_ID,ORDER_PRICE, REVIEW, USER_ID,DELIVER_MAN_ID) VALUES (:res_id,:order_id,:price,:review, :user_id,:deliver_man_id)",
            {res_id,order_id,price, review, user_id,deliver_man_id}
          );
        //const res112=await connection.execute("SELECT ORDER_ID FROM ORDERS WHERE REVIEW='ppO01' ");
        console.log('bhoot');
        await connection.execute('commit');
    
        //console.log(order_id);
        
        // console.log(order_id,deliver_man_id,user_id);
        // console.log('order serial gapla');
        // console.log('order serial issue');
        // await connection.execute(
        //     "INSERT INTO ORDER_SERIAL (ORDER_ID,DELIVER_MAN_ID,USER_ID) VALUES(:order_id,:deliver_man_id,:user_id)",
        //     {order_id,deliver_man_id,user_id}
        // );
        // console.log('update gapla');
        // await connection.execute(
        //     "UPDATE DELIVER_MAN SET DELIVERY_COUNT = DELIVERY_COUNT+1 WHERE DELIVER_MAN_ID=:deliver_man_id",
        //     {deliver_man_id}
        // );
        console.log('error in order history',items.length);
        for(var i=0;i<items.length;i++){
            const quantity=parseInt(req.body[items[i][0]]);
            console.log(quantity,'p');
            if(quantity>0){
                orderedItems.push({name:items[i][1],item_type:items[i][2],quantity: quantity});
                const item_no=items[i][0];
                await connection.execute(
                    'INSERT INTO ORDER_HISTORY (ITEM_NO,ORDER_ID, COUNT) VALUES (:item_no,:order_id,:quantity)',
                    {item_no,order_id,quantity}
                );
                const o1="GET_BILL";
                const o2="ORDER_ID";
                await connection.execute(
                    'INSERT INTO LOG_TABLE(USER_ID,FUNCTION_NAME,PARAMETERS) VALUES (:user_id,:o1,:o2)',{user_id,o1,o2}
                );
                await connection.execute('commit');
                  
            }
            //console.log(items[i][1],'Amount',quantities[items[i][1]]);
        }
        console.log(order_id,'HISTORY TAKEN');
        await connection.execute('UPDATE ORDERS SET ORDER_PRICE=GET_BILL(:order_id)',{order_id});   ///check this command not tested;
        await connection.execute('commit');
        //console.log(quantities);
        res.render('order',{orderedItems});
    }catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

module.exports=router;