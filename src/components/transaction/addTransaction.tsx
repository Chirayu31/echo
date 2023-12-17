import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React, { useState } from 'react'
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { useRecoilState } from "recoil"
import transactionAtom from "@/atoms/transactionAtom"
import axios from "axios"

interface props {
    categoryId: string
}

const AddTransaction: React.FC<props> = ({ categoryId }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [date, setDate] = useState<Date>()
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        description: null,
        amount: null,
    });
    const [transactions, setTransactions] = useRecoilState(transactionAtom)

    const validateForm = () => {
        const newErrors: { [key: string]: string | null } = {};

        if (!description.trim()) {
            newErrors.description = "Description is required";
        } else {
            newErrors.description = null;
        }

        if (amount === null || isNaN(amount)) {
            newErrors.amount = "Amount is required and must be a valid number";
        } else {
            newErrors.amount = null;
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === null);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const { data } = await axios.post(`/api/transaction/${categoryId}`, {
                    amount,
                    description,
                    date,
                });

                setTransactions((prevTransactions) => [...prevTransactions, data.transaction]);

                setAmount(null);
                setDescription('');
                setDate(undefined);
            } catch (error) {
                console.error('Error submitting transaction:', error);
            }
        } else {
            console.log("Form validation failed. Please check the errors.");
        }
    };

    return (
        <Sheet>
            <SheetTrigger className="border px-5 bg-black text-white py-3 rounded-2xl">New Transaction</SheetTrigger>
            <SheetContent side={"top"}>
                <SheetHeader>
                    <SheetTitle>Add a new Transaction</SheetTitle>
                    <SheetDescription className="flex flex-col gap-6 items-center ">
                        <Input
                            className="max-w-[500px]"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {errors.description && (
                            <span className="text-red-500">{errors.description}</span>
                        )}

                        <Input
                            className="max-w-[500px]"
                            type="number"
                            placeholder="Enter Amount"
                            value={amount !== null ? amount : ''}
                            onChange={(e) => setAmount(e.target.value !== '' ? parseFloat(e.target.value) : null)}
                        />

                        {errors.amount && (
                            <span className="text-red-500">{errors.amount}</span>
                        )}

                        <Popover>
                            <PopoverTrigger asChild>

                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full max-w-[500px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >

                                    <CalendarIcon className="mr-2 h-4 w-4" />

                                    {date ?
                                        format(date, "PPP") :
                                        <span>Date of transaction</span>
                                    }

                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Button className={cn("w-full max-w-[500px]")} onClick={handleSubmit}>
                            Add Transaction
                        </Button>

                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default AddTransaction