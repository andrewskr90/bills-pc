import { camelCaseToHyphenated } from "../../../../utils/params";

export const handleViewTransaction = (id, coreType, navigate) => {
    navigate(`/gym-leader/collection/transactions/${camelCaseToHyphenated(coreType)}/${id}`)
}