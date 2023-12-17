import addTransaction from "./controller/addTransaction";
import deleteTransaction from "./controller/deleteTransaction";
import getTransactions from "./controller/getTransactions";
export {
    addTransaction as POST,
    getTransactions as GET,
    deleteTransaction as DELETE
}