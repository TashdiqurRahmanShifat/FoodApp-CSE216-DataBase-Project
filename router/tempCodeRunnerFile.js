await connection.execute('UPDATE ORDERS SET ORDER_PRICE=GET_BILL(:order_id)',{order_id});   ///check this command not tested;
        await connection.execute('commit');