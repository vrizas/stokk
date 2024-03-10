"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import ReactPaginate from "react-paginate";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Command, CommandGroup, CommandItem } from "./command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onPageChange,
    totalData,
    from,
    to,
    search,
    setSearch,
    openPerPageCombobox,
    setOpenPerPageCombobox,
    perPage,
    setPerPage,
}: DataTableProps<TData, TValue> & {
    onPageChange: (event: { selected: number }) => void;
    totalData: number;
    from: number;
    to: number;
    search: string;
    setSearch: (value: string) => void;
    openPerPageCombobox: boolean;
    setOpenPerPageCombobox: (value: boolean) => void;
    perPage: number;
    setPerPage: (value: number) => void;
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const perPages = [
        {
            value: "5",
            label: "5",
        },
        {
            value: "10",
            label: "10",
        },
        {
            value: "15",
            label: "15",
        },
        {
            value: "20",
            label: "20",
        },
    ];

    return (
        <div>
            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full">
                    <Input
                        placeholder="Search here"
                        type="search"
                        className="max-w-[300px] ps-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon absolute top-3 left-3 text-gray-400"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </div>
                {/* <Popover
                    open={openPerPageCombobox}
                    onOpenChange={setOpenPerPageCombobox}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPerPageCombobox}
                            className="w-[70px] justify-between"
                        >
                            {perPage
                                ? perPages.find(
                                      (item) => Number(item.value) === perPage
                                  )?.label
                                : "Select per page..."}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon ml-2"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M8 9l4 -4l4 4" />
                                <path d="M16 15l-4 4l-4 -4" />
                            </svg>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[70px] p-0">
                        <Command>
                            <CommandGroup>
                                {perPages.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            if (
                                                Number(currentValue) !== perPage
                                            ) {
                                                setPerPage(
                                                    Number(currentValue)
                                                );
                                            }
                                            setOpenPerPageCombobox(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                perPage === Number(item.value)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover> */}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-4">
                <p className="text-sm text-gray-600">
                    Menampilkan {from} s.d. {to} dari {totalData} data
                </p>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={onPageChange}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(totalData / 5)}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName="flex space-x-1 text-sm flex-wrap"
                    pageLinkClassName="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground rounded-md h-8 w-8 flex items-center justify-center"
                    previousLinkClassName="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground rounded-md h-8 w-8 flex items-center justify-center"
                    nextLinkClassName="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground rounded-md h-8 w-8 flex items-center justify-center"
                    breakClassName="flex items-end"
                />
            </div>
        </div>
    );
}
