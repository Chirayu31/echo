import { atom } from "recoil";

const categoriesAtom = atom<Category[] | []>({
    key: "categoriesAtom",
    default: []
})

export default categoriesAtom