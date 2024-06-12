import React, { useState } from 'react'
import PrintingForm from '../printing-form/index.jsx'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import BillsPcService from '../../../../../../api/bills-pc'

const PrintingCard = (props) => {
    const { printing, printings, setPrintings } = props
    const [editPrinting, setEditPrinting] = useState(false)
    const [editPrintingFormValues, setEditPrintingFormValues] = useState(printing)

    const displayParentName = (printing) => {
        const targetParent = printings.filter(t => t.printing_id === printing.printing_parent_id)
        if (targetParent.length > 0) return targetParent[0].printing_name
        else return null
    }

    const updatePrinting = async (printing) => {
        try {
            const updatedRes = await BillsPcService.updatePrinting({ printing })
            const printingsToSet = printings.map(stalePrinting => {
                if (stalePrinting.printing_id === updatedRes.data.id) {
                    return printing
                } else return stalePrinting
            })
            setPrintings(printingsToSet)
            setEditPrinting(false)
        } catch (err) {
            console.log(err)
        }
    }

    const deletePrinting = async (printing) => {
        try {
            const deletedRes = await BillsPcService.deletePrinting({ printing })
            const printingsToSet = printings.filter(printing => printing.printing_id !== deletedRes.data.id)
            setPrintings(printingsToSet)
            setEditPrinting(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (<div className='printing'>
        {!editPrinting ? <>
            <div className='name'>
                <label>Name</label>
                <h4>{printing.printing_name}</h4>
            </div>
            <div className='parentName'>
                <label>Parent Name</label>
                <h4>{displayParentName(printing) || 'N/A'}</h4>
            </div>
            <Button onClick={() => setEditPrinting(true)}>edit</Button>
        </> : <>
            <PrintingForm printings={printings} toggleForm={() => setEditPrinting(false)} printingFormValues={editPrintingFormValues} setPrintingFormValues={setEditPrintingFormValues} updatePrinting={updatePrinting} deletePrinting={deletePrinting} />
        </>}
    </div>)
}

export default PrintingCard
