import React, { useEffect, useState } from 'react'
import Button from '../../../../components/buttons/text-button/index.jsx'
import BillsPcService from '../../../../api/bills-pc'
import './assets/index.less'
import PrintingForm from './components/printing-form/index.jsx'
import PrintingCard from './components/printing-card/index.jsx'

const initialPrintingFormValues = {
    printing_id: '',
    printing_name: '',
    printing_parent_id: null
}

const PrintingTools = (props) => {
    const [printings, setPrintings] = useState([])
    const [formToggled, setFormToggled] = useState(false)
    const [printingFormValues, setPrintingFormValues] = useState(initialPrintingFormValues)
    const [selectedTool, setSelectedTool] = useState('printingManager')

    useEffect(() => {
        (async () => {
            try {
                const printingsResponse = await BillsPcService.getPrintings()
                setPrintings(printingsResponse.data)
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])

    const toggleForm = () => {
        setFormToggled(!formToggled)
    }

    const createPrinting = async (printing) => {
        const config = {
            data: printing
        }
        try {
            const postPrintingResponse = await BillsPcService.postPrinting(config)
            setPrintings([
                ...printings,
                {
                    ...printing,
                    printing_id: postPrintingResponse.data.id
                }
            ])
            setFormToggled(false)
            setPrintingFormValues(initialPrintingFormValues)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChangeTool = (e) => {
        setSelectedTool(e.target.value)
    }

    return (<div className='printingManager'>
        <select onChange={handleChangeTool}>
            <option value={'printingManager'}>Printing Manager</option>
            <option value={'printingGroupManager'}>Printing Group Manager</option>
        </select>
        {selectedTool === 'printingManager' ? <>
            {formToggled ? <>
                {<PrintingForm printingFormValues={printingFormValues} printings={printings} toggleForm={toggleForm} createPrinting={createPrinting} setPrintingFormValues={setPrintingFormValues} />}
            </> : <>
                <Button onClick={() => setFormToggled(true)}>+ Printing</Button>
            </>}
            <div className='printings'>
                {printings.map((printing, idx) => {
                    return (<PrintingCard key={idx} printing={printing} printings={printings} setPrintings={setPrintings} />)
                })}
            </div>
        </> : <></>}
    </div>)
}

export default PrintingTools
