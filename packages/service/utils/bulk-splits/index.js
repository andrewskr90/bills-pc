const Label = require("../../models/Label")
const { v4: uuidV4 } = require('uuid')

const compileLabelComponentsIntoSplits = (components) => {
    const splitsRef = {}
    components.forEach(component => {
        if (!splitsRef[component.bulk_split_id]) { // if it is a new split
            splitsRef[component.bulk_split_id] = {
                ...component,
                labels: [
                    {
                        bulk_split_label_assignment_id: component.bulk_split_label_assignment_id,
                        label_id: component.label_id,
                        components: [
                            {
                                label_component_id: component.label_component_id,
                                rarity_id: component.rarity_id,
                                rarity_name: component.rarity_name,
                                type_id: component.type_id,
                                type_name: component.type_name,
                                printing_id: component.printing_id,
                                printing_name: component.printing_name,
                                set_v2_id: component.set_v2_id,
                                set_v2_name: component.set_v2_name,
                            }
                        ]
                    }
                ]
            }
        } else {
            if (!splitsRef[component.bulk_split_id].labels.find(label => component.label_id === label.label_id)) { // if it is a new label
                splitsRef[component.bulk_split_id] = {
                    ...splitsRef[component.bulk_split_id],
                    labels: [
                        ...splitsRef[component.bulk_split_id].labels,
                        {
                            bulk_split_label_assignment_id: component.bulk_split_label_assignment_id,
                            label_id: component.label_id,
                            components: [
                                {
                                    label_component_id: component.label_component_id,
                                    rarity_id: component.rarity_id,
                                    rarity_name: component.rarity_name,
                                    type_id: component.type_id,
                                    type_name: component.type_name,
                                    printing_id: component.printing_id,
                                    printing_name: component.printing_name,
                                    set_v2_id: component.set_v2_id,
                                    set_v2_name: component.set_v2_name,
                                }
                            ]
                        }
                    ]
                }
            } else { // add component to existing label
                splitsRef[component.bulk_split_id] = {
                    ...splitsRef[component.bulk_split_id],
                    labels: splitsRef[component.bulk_split_id].labels.map(label => {
                        if (component.label_id === label.label_id) {
                            return {
                                ...label,
                                components: [
                                    ...splitsRef[component.bulk_split_id].labels.find(label => component.label_id === label.label_id).components,
                                    {
                                        label_component_id: component.label_component_id,
                                        rarity_id: component.rarity_id,
                                        rarity_name: component.rarity_name,
                                        type_id: component.type_id,
                                        type_name: component.type_name,
                                        printing_id: component.printing_id,
                                        printing_name: component.printing_name,
                                        set_v2_id: component.set_v2_id,
                                        set_v2_name: component.set_v2_name,
                                    }
                                ]
                            }
                        } else {
                            return label
                        }
                    })
                }
            }
        }
    })
    const removedExcessLabelData = Object.keys(splitsRef).map(splitKey => {
        const bulkSplit = splitsRef[splitKey]
        delete bulkSplit.bulk_split_label_assignment_id
        delete bulkSplit.label_id
        delete bulkSplit.label_component_id
        delete bulkSplit.rarity_id
        delete bulkSplit.rarity_name
        delete bulkSplit.type_id
        delete bulkSplit.type_name
        delete bulkSplit.printing_id
        delete bulkSplit.printing_name
        delete bulkSplit.set_v2_id
        delete bulkSplit.set_v2_name
        return bulkSplit
    })
    return removedExcessLabelData
}

const generateNewOrExistingLabelId = async (label) => {
    const matchedLabels = await Label.getLabelByExactComponents(label)
    if (matchedLabels.length === 0) {
        try {
            const label_id = uuidV4()
            await Label.createLabel(label_id, label)
            return label_id
        } catch (err) {
            throw err
        }
    } else {
        return matchedLabels[0].label_component_label_id
    }
}

const fetchOrCreateLabelIds = async (split) => {
    const labels = split.labels.map(label => ({
        rarities: label.rarities.filter(label => label),
        types: label.types.filter(label => label),
        printings: label.printings.filter(label => label),
        expansions: label.expansions.filter(label => label)
    }))

    for (let i=0; i<labels.length; i++) {
        try {
            const labelId = await generateNewOrExistingLabelId(labels[i])
            labels[i] = {
                bulk_split_label_assignment_id: uuidV4(),
                bulk_split_label_assignment_bulk_split_id: split.bulk_split_id,
                bulk_split_label_assignment_label_id: labelId
            }
        } catch (err) {
            throw err
        }
    }
    return labels
}

module.exports = { fetchOrCreateLabelIds, compileLabelComponentsIntoSplits, generateNewOrExistingLabelId }