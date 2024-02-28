SELECT * FROM (
	WITH adjTransaction as (
            SELECT s.sale_purchaser_id as receiver_id, s.sale_date as transaction_date,
                l.collected_card_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.collected_card_id is not null
        UNION
            SELECT s.sale_purchaser_id as receiver_id, s.sale_date as transaction_date,
                l.collected_product_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.collected_product_id is not null
        UNION
            SELECT s.sale_purchaser_id as receiver_id, s.sale_date as transaction_date,
                l.bulk_split_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.bulk_split_id is not null
        UNION
            SELECT
                g.gift_receiver_id as receiver_id, g.gift_date as transaction_date,
                gc.gift_card_collected_card_id as item_id
            FROM gifts g
            left JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
            where gc.gift_card_collected_card_id is not null
        UNION
            SELECT
                g.gift_receiver_id as receiver_id, g.gift_date as transaction_date,
                gp.gift_product_collected_product_id as item_id
            FROM gifts g
            left JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
            where gp.gift_product_collected_product_id is not null
        UNION
            SELECT
                g.gift_receiver_id as receiver_id, g.gift_date as transaction_date,
                gb.gift_bulk_split_bulk_split_id as item_id
            FROM gifts g
            left JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id
            where gb.gift_bulk_split_bulk_split_id is not null
        
    )
	SELECT 
		userTransaction.saleId, userTransaction.giftId, userTransaction.transaction_date,
        userTransaction.item_id,
		prevTransaction.receiver_id as prevReceiver, prevTransaction.transaction_date as prevTransactionDate,
		nextTransaction.receiver_id as nextReceiver, nextTransaction.transaction_date as nextTransactionDate,
		row_number() over (partition by prevTransaction.item_id order by prevTransaction.transaction_date desc) as prevRow,
		row_number() over (partition by nextTransaction.item_id order by nextTransaction.transaction_date asc) as nextRow
	FROM (
            SELECT 
                s.sale_purchaser_id as debit_user_id, 
                s.sale_date as transaction_date,
                l.saleId, null as giftId,
                l.collected_card_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.collected_card_id is not null
                AND s.sale_purchaser_id = '816ec088-25d1-4992-98d9-629edb41c932'	
        UNION
            SELECT 
                s.sale_purchaser_id as debit_user_id, 
                s.sale_date as transaction_date,
                l.saleId, null as giftId,
                l.collected_product_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.collected_product_id is not null
                AND s.sale_purchaser_id = '816ec088-25d1-4992-98d9-629edb41c932'	
        UNION
            SELECT 
                s.sale_purchaser_id as debit_user_id, 
                s.sale_date as transaction_date,
                l.saleId, null as giftId,
                l.bulk_split_id as item_id
            FROM sales s
            JOIN Listing l on l.saleId = s.sale_id
            WHERE l.bulk_split_id is not null
                AND s.sale_purchaser_id = '816ec088-25d1-4992-98d9-629edb41c932'	
        UNION
            SELECT
                g.gift_receiver_id as debit_user_id, 
                g.gift_date as transaction_date,
                null as saleId, g.gift_id giftId,
                gc.gift_card_collected_card_id as item_id
            FROM gifts g
            left JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
            WHERE gc.gift_card_collected_card_id is not null
                AND g.gift_receiver_id = '816ec088-25d1-4992-98d9-629edb41c932'	
        UNION
            SELECT
                g.gift_receiver_id as debit_user_id, 
                g.gift_date as transaction_date,
                null as saleId, g.gift_id giftId,
                gp.gift_product_collected_product_id as item_id
            FROM gifts g
            left JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
            WHERE gp.gift_product_collected_product_id is not null
                AND g.gift_receiver_id = '816ec088-25d1-4992-98d9-629edb41c932'	
        UNION
            SELECT
                g.gift_receiver_id as debit_user_id, 
                g.gift_date as transaction_date,
                null as saleId, g.gift_id giftId,
                gb.gift_bulk_split_bulk_split_id as item_id
            FROM gifts g
            left JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id
            WHERE gb.gift_bulk_split_bulk_split_id is not null
                AND g.gift_receiver_id = '816ec088-25d1-4992-98d9-629edb41c932'	
	) as userTransaction
	LEFT JOIN adjTransaction as prevTransaction
		on (prevTransaction.item_id = userTransaction.item_id
        ) and (prevTransaction.transaction_date < userTransaction.transaction_date or prevTransaction.transaction_date is null)
	LEFT JOIN adjTransaction as nextTransaction
		on (nextTransaction.item_id = userTransaction.item_id
        ) and (nextTransaction.transaction_date > userTransaction.transaction_date)
) withRowNumbers
WHERE (prevRow = 1 and prevReceiver is not null) or (nextRow = 1 and nextReceiver is not null)