interface Category {
    _id: string,
    name: string,
    type: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface Transaction {
    _id: string,
    amount: number,
    description: string,
    date: Date,
    createdAt?: Date,
    updatedAt?: Date
}