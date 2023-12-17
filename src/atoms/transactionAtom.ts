import { atom } from "recoil";

const transactionAtom = atom<Transaction[] | []>({
    key: "transactionAtom",
    default: []
})

export default transactionAtom