const formatBulkSplits = (rawSplitData) => {
    const splitsRef = {}
    rawSplitData.forEach(component => {
        if (!splitsRef[component.bulk_split_id]) { // if it is a new split
            splitsRef[component.bulk_split_id] = {
                bulk_split_id: component.bulk_split_id,
                bulk_split_count: component.bulk_split_count,
                bulk_split_estimate: component.bulk_split_estimate,
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
    return Object.keys(splitsRef).map(splitKey => splitsRef[splitKey])
}

module.exports = { formatBulkSplits }