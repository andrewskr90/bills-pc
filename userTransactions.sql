WITH userTransaction as (
    SELECT 
        s.sale_purchaser_id as debit_user_id, 
        s.sale_date as transaction_date,
        l.saleId, null as giftId,
        l.collected_card_id,
        l.collected_product_id,
        l.bulk_split_id
    FROM sales s
    JOIN Listing l on l.saleId = s.sale_id
    WHERE (
        l.collected_card_id is not null OR 
        l.collected_product_id is not null OR 
        l.bulk_split_id is not null
    ) AND s.sale_purchaser_id = '816ec088-25d1-4992-98d9-629edb41c932'	
    UNION
    SELECT
        g.gift_receiver_id as debit_user_id, 
        g.gift_date as transaction_date,
        null as saleId, g.gift_id giftId,
        gc.gift_card_collected_card_id as collected_card_id,
        gp.gift_product_collected_product_id as collected_product_id,
        gb.gift_bulk_split_bulk_split_id as bulk_split_id
    FROM gifts g
    LEFT JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
    LEFT JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
    LEFT JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id
    WHERE (
        gc.gift_card_collected_card_id is not null OR
        gp.gift_product_collected_product_id is not null OR
        gb.gift_bulk_split_bulk_split_id is not null
    ) AND g.gift_receiver_id = '816ec088-25d1-4992-98d9-629edb41c932'

), adjTransaction as (    
    SELECT 
        s.sale_purchaser_id as debit_user_id, 
        s.sale_date as transaction_date,
        l.saleId, null as giftId,
        l.collected_card_id,
        l.collected_product_id,
        l.bulk_split_id
    FROM sales s
    JOIN Listing l on l.saleId = s.sale_id
    UNION
    SELECT
        g.gift_receiver_id as debit_user_id, 
        g.gift_date as transaction_date,
        null as saleId, g.gift_id giftId,
        gc.gift_card_collected_card_id as collected_card_id,
        gp.gift_product_collected_product_id as collected_product_id,
        gb.gift_bulk_split_bulk_split_id as bulk_split_id
    FROM gifts g
    LEFT JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
    LEFT JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
    LEFT JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id	
)
SELECT * FROM (
	SELECT 
		userTransaction.saleId, userTransaction.giftId, userTransaction.transaction_date,
        userTransaction.collected_card_id, userTransaction.collected_product_id, userTransaction.bulk_split_id,
		prevTransaction.debit_user_id as prevDebitUser, prevTransaction.transaction_date as prevTransactionDate,
		nextTransaction.debit_user_id as nextDebitUser, nextTransaction.transaction_date as nextTransactionDate,
		row_number() over (partition by prevTransaction.collected_card_id order by prevTransaction.transaction_date desc) as prevCardRow,
		row_number() over (partition by nextTransaction.collected_card_id order by nextTransaction.transaction_date asc) as nextCardRow,		
        row_number() over (partition by prevTransaction.collected_product_id order by prevTransaction.transaction_date desc) as prevProductRow,
		row_number() over (partition by nextTransaction.collected_product_id order by nextTransaction.transaction_date asc) as nextProductRow,		
        row_number() over (partition by prevTransaction.bulk_split_id order by prevTransaction.transaction_date desc) as prevSplitRow,
		row_number() over (partition by nextTransaction.bulk_split_id order by nextTransaction.transaction_date asc) as nextSplitRow
    FROM userTransaction
	LEFT JOIN adjTransaction as prevTransaction
		on (
            prevTransaction.collected_card_id = userTransaction.collected_card_id OR
            prevTransaction.collected_product_id = userTransaction.collected_product_id OR
            prevTransaction.bulk_split_id = userTransaction.bulk_split_id
        ) and (prevTransaction.transaction_date < userTransaction.transaction_date or prevTransaction.transaction_date is null)
	LEFT JOIN adjTransaction as nextTransaction
		on (
            nextTransaction.collected_card_id = userTransaction.collected_card_id OR
            nextTransaction.collected_product_id = userTransaction.collected_product_id OR
            nextTransaction.bulk_split_id = userTransaction.bulk_split_id
        ) and (nextTransaction.transaction_date > userTransaction.transaction_date)
) withRowNumbers
WHERE (
	(prevCardRow = 1 AND collected_card_id IS NOT NULL) OR 
    (prevProductRow = 1 AND collected_product_id IS NOT NULL) OR 
    (prevSplitRow = 1 AND bulk_split_id IS NOT NULL)
) OR (
	(nextCardRow = 1 AND collected_card_id IS NOT NULL) OR 
    (nextProductRow = 1 AND collected_product_id IS NOT NULL) OR 
    (nextSplitRow = 1 AND bulk_split_id IS NOT NULL)
)