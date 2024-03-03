const { executeQueries } = require("../db")

const dateWithBackticks = '`date`'
const descriptionWithBackticks = '`description`'

const getItems = async (purchaserId) => {
    const query = `
        WITH userTransaction as (
        SELECT 
            s.sale_purchaser_id as debit_user_id, 
            s.sale_date as transaction_date,
            l.saleId, null as giftId,
            l.lotId,
            l.collected_card_id,
            l.collected_product_id,
            l.bulk_split_id,
            bsla.bulk_split_label_assignment_id,
            la.label_id,
            lc.label_component_id,
            r.rarity_id,
            r.rarity_name,
            t.type_id,
            t.type_name,
            pr.printing_id,
            pr.printing_name,
            se.set_v2_id,
            se.set_v2_name
        FROM sales s
        LEFT JOIN Listing l on l.saleId = s.sale_id
        LEFT JOIN LotItem li on li.lotId = l.lotId
        LEFT JOIN collected_cards cc ON cc.collected_card_id = l.collected_card_id
            OR cc.collected_card_id = li.collected_card_id
        LEFT JOIN cards_v2 ca ON ca.card_v2_id = cc.collected_card_card_id
        LEFT JOIN collected_products cp ON cp.collected_product_id = l.collected_product_id
            OR cp.collected_product_id = li.collected_product_id
        LEFT JOIN products p ON p.product_id = cp.collected_product_product_id
        LEFT JOIN bulk_splits bs ON bs.bulk_split_id = l.bulk_split_id
            OR bs.bulk_split_id = li.bulk_split_id
        LEFT JOIN bulk_split_label_assignments bsla ON bs.bulk_split_id = bsla.bulk_split_label_assignment_bulk_split_id
        LEFT JOIN labels la ON la.label_id = bsla.bulk_split_label_assignment_label_id
        LEFT JOIN label_components lc on lc.label_component_label_id = la.label_id
        LEFT JOIN rarities r ON r.rarity_id = lc.label_component_rarity_id
        LEFT JOIN types t ON t.type_id = lc.label_component_type_id
        LEFT JOIN printings pr ON pr.printing_id = lc.label_component_printing_id
        LEFT JOIN sets_v2 se ON se.set_v2_id = ca.card_v2_set_id OR
            se.set_v2_id = p.product_set_id OR
            se.set_v2_id = lc.label_component_set_v2_id

        WHERE (
            l.collected_card_id is not null OR 
            l.collected_product_id is not null OR 
            l.bulk_split_id is not null OR
            l.lotId is not null
        ) AND s.sale_purchaser_id = '${purchaserId}'	
        UNION
        SELECT
            g.gift_receiver_id as debit_user_id, 
            g.gift_date as transaction_date,
            null as saleId, g.gift_id giftId,
            gl.gift_lot_lot_id as lotId,
            gc.gift_card_collected_card_id as collected_card_id,
            gp.gift_product_collected_product_id as collected_product_id,
            gb.gift_bulk_split_bulk_split_id as bulk_split_id,
            bsla.bulk_split_label_assignment_id,
            la.label_id,
            lc.label_component_id,
            r.rarity_id,
            r.rarity_name,
            t.type_id,
            t.type_name,
            pr.printing_id,
            pr.printing_name,
            se.set_v2_id,
            se.set_v2_name
        FROM gifts g
        LEFT JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
        LEFT JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
        LEFT JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id
        LEFT JOIN gift_lots gl on gl.gift_lot_gift_id = g.gift_id

        LEFT JOIN LotItem li on li.lotId = gl.gift_lot_id
        LEFT JOIN collected_cards cc ON cc.collected_card_id = gc.gift_card_collected_card_id
            OR cc.collected_card_id = li.collected_card_id
        LEFT JOIN cards_v2 ca ON ca.card_v2_id = cc.collected_card_card_id
        LEFT JOIN collected_products cp ON cp.collected_product_id = gp.gift_product_collected_product_id
            OR cp.collected_product_id = li.collected_product_id
        LEFT JOIN products p ON p.product_id = cp.collected_product_product_id
        LEFT JOIN bulk_splits bs ON bs.bulk_split_id = gb.gift_bulk_split_bulk_split_id
            OR bs.bulk_split_id = li.bulk_split_id
        LEFT JOIN bulk_split_label_assignments bsla ON bs.bulk_split_id = bsla.bulk_split_label_assignment_bulk_split_id
        LEFT JOIN labels la ON la.label_id = bsla.bulk_split_label_assignment_label_id
        LEFT JOIN label_components lc on lc.label_component_label_id = la.label_id
        LEFT JOIN rarities r ON r.rarity_id = lc.label_component_rarity_id
        LEFT JOIN types t ON t.type_id = lc.label_component_type_id
        LEFT JOIN printings pr ON pr.printing_id = lc.label_component_printing_id
        LEFT JOIN sets_v2 se ON se.set_v2_id = ca.card_v2_set_id OR
            se.set_v2_id = p.product_set_id OR
            se.set_v2_id = lc.label_component_set_v2_id

        WHERE (
            gc.gift_card_collected_card_id is not null OR
            gp.gift_product_collected_product_id is not null OR
            gb.gift_bulk_split_bulk_split_id is not null OR
            gl.gift_lot_lot_id is not null
        ) AND g.gift_receiver_id = '${purchaserId}'

    ), adjTransaction as (    
        SELECT 
            s.sale_purchaser_id as debit_user_id, 
            s.sale_date as transaction_date,
            l.saleId, null as giftId,
            l.collected_card_id,
            l.collected_product_id,
            l.bulk_split_id,
            l.lotId
        FROM sales s
        JOIN Listing l on l.saleId = s.sale_id
        UNION
        SELECT
            g.gift_receiver_id as debit_user_id, 
            g.gift_date as transaction_date,
            null as saleId, g.gift_id giftId,
            gc.gift_card_collected_card_id as collected_card_id,
            gp.gift_product_collected_product_id as collected_product_id,
            gb.gift_bulk_split_bulk_split_id as bulk_split_id,
            gl.gift_lot_lot_id as lotId
        FROM gifts g
        LEFT JOIN gift_cards gc on gc.gift_card_gift_id = g.gift_id
        LEFT JOIN gift_products gp on gp.gift_product_gift_id = g.gift_id
        LEFT JOIN gift_bulk_splits gb on gb.gift_bulk_split_gift_id = g.gift_id	
        LEFT JOIN gift_lots gl on gl.gift_lot_gift_id = g.gift_id
    )
    SELECT * FROM (
        SELECT 
            userTransaction.saleId, userTransaction.giftId, userTransaction.transaction_date,
            userTransaction.collected_card_id, userTransaction.collected_product_id, userTransaction.bulk_split_id, userTransaction.lotId,
            prevTransaction.debit_user_id as prevDebitUser, prevTransaction.transaction_date as prevTransactionDate,
            nextTransaction.debit_user_id as nextDebitUser, nextTransaction.transaction_date as nextTransactionDate,
            row_number() over (partition by prevTransaction.collected_card_id order by prevTransaction.transaction_date desc) as prevCardRow,
            row_number() over (partition by nextTransaction.collected_card_id order by nextTransaction.transaction_date asc) as nextCardRow,		
            row_number() over (partition by prevTransaction.collected_product_id order by prevTransaction.transaction_date desc) as prevProductRow,
            row_number() over (partition by nextTransaction.collected_product_id order by nextTransaction.transaction_date asc) as nextProductRow,		
            row_number() over (partition by prevTransaction.bulk_split_id order by prevTransaction.transaction_date desc) as prevSplitRow,
            row_number() over (partition by nextTransaction.bulk_split_id order by nextTransaction.transaction_date asc) as nextSplitRow,
            row_number() over (partition by prevTransaction.lotId order by prevTransaction.transaction_date desc) as prevLotRow,
            row_number() over (partition by nextTransaction.lotId order by nextTransaction.transaction_date asc) as nextLotRow
        FROM userTransaction
        LEFT JOIN adjTransaction as prevTransaction
            on (
                prevTransaction.collected_card_id = userTransaction.collected_card_id OR
                prevTransaction.collected_product_id = userTransaction.collected_product_id OR
                prevTransaction.bulk_split_id = userTransaction.bulk_split_id OR
                prevTransaction.lotId = userTransaction.lotId
            ) and (prevTransaction.transaction_date < userTransaction.transaction_date or prevTransaction.transaction_date is null)
        LEFT JOIN adjTransaction as nextTransaction
            on (
                nextTransaction.collected_card_id = userTransaction.collected_card_id OR
                nextTransaction.collected_product_id = userTransaction.collected_product_id OR
                nextTransaction.bulk_split_id = userTransaction.bulk_split_id OR
                nextTransaction.lotId = userTransaction.lotId
            ) and (nextTransaction.transaction_date > userTransaction.transaction_date)
    ) withRowNumbers
    WHERE (
        (prevCardRow = 1 AND collected_card_id IS NOT NULL) OR 
        (prevProductRow = 1 AND collected_product_id IS NOT NULL) OR 
        (prevSplitRow = 1 AND bulk_split_id IS NOT NULL) OR 
        (prevLotRow = 1 AND lotId IS NOT NULL)
    ) OR (
        (nextCardRow = 1 AND collected_card_id IS NOT NULL) OR 
        (nextProductRow = 1 AND collected_product_id IS NOT NULL) OR 
        (nextSplitRow = 1 AND bulk_split_id IS NOT NULL) OR
        (nextLotRow = 1 AND lotId IS NOT NUll)
    )
`
    const req = { queryQueue: [query] }
    const res = {}
    let transactionItems
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactionItems = req.results
    })
    return transactionItems
}

module.exports = { getItems }