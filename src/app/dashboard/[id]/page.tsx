'use client'
import transactionAtom from '@/atoms/transactionAtom';
import TransactionCard from '@/components/transaction/TransactionCard';
import AddTransaction from '@/components/transaction/addTransaction';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';

const typeColors = {
    expense: 'text-red-500',
    income: 'text-green-500',
    saving: 'text-blue-500',
};

const formatDate = (inputDate: Date | string): string => {
    return new Date(inputDate).toLocaleString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
};


const Transaction = ({ params }: { params: { id: string } }) => {
    const categoryId = params.id
    const [category, setCategory] = useState<Category>()
    const [transactions, setTransactions] = useRecoilState(transactionAtom)
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast()

    async function fetchCategory() {
        try {
            const { data } = await axios.get(`/api/category/${categoryId}`)
            return { category: data.category, transactions: data.transactions }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast({ title: error.response.data.message })
                    console.log(error.response.data.message);
                } else {
                    console.log("An unexpected error occurred:", error.message);
                }
            } else {
                console.log("An unknown error occurred:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const deleteTransaction = async (transactionId: string) => {
        try {
            await axios.delete(`/api/transaction/${transactionId}`);

            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction._id !== transactionId)
            );

            toast({ title: 'Transaction deleted successfully' });
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast({ title: 'Error deleting transaction' });
        }
    };

    useEffect(() => {
        async function get() {
            const data = await fetchCategory()
            setCategory(data?.category)
            setTransactions(data?.transactions)
        }
        get()
    })

    if (isLoading) {
        return <div className='scroll-m-20 text-4xl font-extrabold mt-10 text-center tracking-tight lg:text-5xl text-amber-500'>Loading...</div>;
    }

    if (!category) {
        return (
            <h1 className="scroll-m-20 text-4xl font-extrabold mt-10 text-center tracking-tight lg:text-5xl">
                Category does not exist
            </h1>
        );
    }

    return (
        <>
            <nav className="flex items-center gap-16 md:gap-28 mt-6 px-12 border-b-2 pb-4">
                <Link href="/">
                    <Logo />
                </Link>

                <Link href='/dashboard'>
                    <Button>
                        dashboard
                    </Button>
                </Link>
            </nav>
            <div className='flex justify-center gap-5 md:gap-10 items-center mt-10'>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {category?.name}
                </h1>

                <h3 className={`${(typeColors as any)[category.type]}  scroll-m-20 text-2xl font-semibold tracking-tight `}>
                    {category?.type}
                </h3>

                <AddTransaction categoryId={category._id} />
            </div>

            <Table className='max-w-[800px] mt-10 border'>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {transactions.map(transaction => (
                        <TableRow key={transaction._id}>
                            <TableCell className="font-medium">
                                {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>Rs. {transaction.amount}</TableCell>
                            <TableCell className="text-right">
                                <Trash2 className='cursor-pointer w-5 h-5 text-red-500' onClick={() => deleteTransaction(transaction._id)} />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </>
    );
}

export default Transaction;
