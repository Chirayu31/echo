'use client';
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import categoriesAtom from '@/atoms/categoriesAtom';
import { useToast } from '../ui/use-toast';
import Logo from '../ui/logo';
import Link from 'next/link';

interface Errors {
    categoryTitle?: string;
    transactionType?: string;
}

const Navbar = () => {
    const [categoryTitle, setCategoryTitle] = useState<string>('');
    const [transactionType, setTransactionType] = useState<string>('');
    const setCategories = useSetRecoilState(categoriesAtom)
    const { toast } = useToast()
    const [errors, setErrors] = useState<Errors>({});

    async function addCategory(title: string, type: string) {
        try {
            const { data } = await axios.post('/api/category', { title, type })
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!categoryTitle.trim()) {
            newErrors.categoryTitle = 'Category Title is required';
        }

        if (!transactionType) {
            newErrors.transactionType = 'Transaction Type is required';
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            try {
                const data = await addCategory(categoryTitle, transactionType)
                setCategories(prevCategories => { return [...prevCategories, data.category] })
                toast({ title: "Category added successfully" })
            } catch (error) {
                console.log(error)
            }

            setCategoryTitle('');
            setTransactionType('');
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <nav className="flex items-center gap-16 md:gap-28 mt-6 px-12 border-b-2 pb-4">
            <Link href="/">
                <Logo />
            </Link>
            <Dialog>
                <DialogTrigger className='border-2 p-3 font-semibold rounded-xl'>
                    Add Budget Category
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new Category</DialogTitle>
                        <DialogDescription className='py-4 flex flex-col gap-3'>

                            <Input
                                placeholder="Enter Category Title"
                                className='text-base text-black'
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                            />
                            {errors.categoryTitle && <span className="text-red-500">{errors.categoryTitle}</span>}

                            <Select value={transactionType}
                                onValueChange={(value) => setTransactionType(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue className='text-base text-black'
                                        placeholder="Transaction Type"
                                    />
                                </SelectTrigger>
                                <SelectContent className='text-base text-black'>
                                    <SelectItem className='text-base text-black' value="saving">Saving</SelectItem>
                                    <SelectItem className='text-base text-black' value="income">Income</SelectItem>
                                    <SelectItem className='text-base text-black' value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.transactionType && <span className="text-red-500">{errors.transactionType}</span>}

                            <Button onClick={handleSubmit}>Submit</Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </nav>
    )
}

export default Navbar