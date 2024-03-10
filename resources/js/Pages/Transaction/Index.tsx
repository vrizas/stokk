import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/Components/ui/data-table";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import SortedIcon from "@/Components/SortedIcon";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useToast } from "@/Components/ui/use-toast";
import { ToastAction } from "@/Components/ui/toast";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import formatPrice from "@/utils/formatPrice";
import { Product } from "../Product/Index";
import formatDate from "@/utils/formatDate";

export interface Transaction {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export default function TransactionIndex({ auth }: PageProps) {
    const { toast } = useToast();
    const [totalData, setTotalData] = useState(0);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [openPerPageCombobox, setOpenPerPageCombobox] = useState(false);
    const [search, setSearch] = useState("");
    const [sortedBy, setSortedBy] = useState("");
    const [sortedOrder, setSortedOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Transaction[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(
        {
            id: 0,
            product_id: 0,
            product: {
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                product_type_id: 0,
                product_type: {
                    id: 0,
                    name: "",
                },
            },
            quantity: 0,
            total: 0,
            created_at: "",
            updated_at: "",
        }
    );
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const csrfToken = document
        ?.getElementById?.("meta_token")
        ?.getAttribute("content");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("product.getData") + "?perPage=999999"
            );
            const responseJson = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.message);
            }

            setProducts(responseJson.data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat mengambil data",
                action: (
                    <ToastAction
                        altText="Muat ulang"
                        onClick={() => fetchProducts()}
                    >
                        Coba lagi
                    </ToastAction>
                ),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("transaction.getData") +
                    `?page=${page}&search=${search}&sortedBy=${sortedBy}&sortedOrder=${sortedOrder}`
            );
            const responseJson = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.message);
            }

            setData(responseJson.data);
            setTotalData(responseJson.total);
            setFrom(responseJson.from);
            setTo(responseJson.to);
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat mengambil data",
                action: (
                    <ToastAction
                        altText="Muat ulang"
                        onClick={() => fetchTransactions()}
                    >
                        Coba lagi
                    </ToastAction>
                ),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onPageChange = (event: { selected: number }) => {
        const newPage = event.selected + 1;
        setPage(newPage);
    };

    const onCreate = async (transaction: Transaction, isUndoing = false) => {
        setIsLoading(true);
        try {
            if (!transaction.product_id) {
                throw new Error("Barang tidak boleh kosong");
            }

            if (!transaction.quantity) {
                throw new Error("Jumlah barang tidak boleh kosong");
            }

            if (!transaction.total) {
                throw new Error("Total harga tidak boleh kosong");
            }

            const response = await fetch(route("transaction.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify({
                    product_id: transaction.product_id,
                    quantity: transaction.quantity,
                    total: transaction.total,
                }),
            });

            if (response.ok) {
                fetchTransactions();

                if (isUndoing) {
                    toast({
                        description: "Berhasil membatalkan tindakan",
                    });
                } else {
                    toast({
                        description: "Berhasil menambahkan data transaksi",
                    });

                    setSelectedTransaction({
                        id: 0,
                        product_id: 0,
                        product: {
                            id: 0,
                            name: "",
                            price: 0,
                            stock: 0,
                            product_type_id: 0,
                            product_type: {
                                id: 0,
                                name: "",
                            },
                        },
                        quantity: 0,
                        total: 0,
                        created_at: "",
                        updated_at: "",
                    });
                }
            } else {
                const responseJson = await response.json();
                throw new Error(responseJson.message);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat membuat data",
            });
        } finally {
            setIsLoading(false);
            setOpenCreateDialog(false);
        }
    };

    const onUpdate = async (transaction: Transaction) => {
        setIsLoading(true);
        try {
            if (!transaction.product_id) {
                throw new Error("Barang tidak boleh kosong");
            }

            if (!transaction.quantity) {
                throw new Error("Jumlah barang tidak boleh kosong");
            }

            if (!transaction.total) {
                throw new Error("Total harga tidak boleh kosong");
            }

            const response = await fetch(
                route("transaction.update", transaction.id),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                    },
                    body: JSON.stringify({
                        product_id: transaction.product_id,
                        quantity: transaction.quantity,
                        total: transaction.total,
                    }),
                }
            );

            if (response.ok) {
                fetchTransactions();
                toast({
                    description: "Berhasil mengubah data transaksi",
                });

                setSelectedTransaction({
                    id: 0,
                    product_id: 0,
                    product: {
                        id: 0,
                        name: "",
                        price: 0,
                        stock: 0,
                        product_type_id: 0,
                        product_type: {
                            id: 0,
                            name: "",
                        },
                    },
                    quantity: 0,
                    total: 0,
                    created_at: "",
                    updated_at: "",
                });
            } else {
                const responseJson = await response.json();
                throw new Error(responseJson.message);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat mengubah data",
            });
        } finally {
            setIsLoading(false);
            setOpenEditDialog(false);
        }
    };

    const onDelete = async (transaction: Transaction) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("transaction.destroy", transaction.id),
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                    },
                }
            );

            if (response.ok) {
                fetchTransactions();
                toast({
                    title: `Berhasil menghapus data transaksi`,
                    description: "Tekan tombol undo untuk membatalkan tindakan",
                    action: (
                        <ToastAction
                            altText="Kembalikan data transaksi"
                            onClick={() => onCreate(transaction, true)}
                        >
                            Undo
                        </ToastAction>
                    ),
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat menghapus data",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "product.name",
            header: ({ column }) => {
                const sorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSortedBy("products.name");
                            setSortedOrder(sorted === "asc" ? "desc" : "asc");
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }}
                        className="flex justify-start items-center gap-1 p-0 w-full"
                    >
                        Nama Barang
                        <SortedIcon
                            sorted={
                                sortedBy === "products.name" ? sorted : false
                            }
                        />
                    </Button>
                );
            },
        },
        {
            accessorKey: "product.product_type.name",
            header: "Jenis Barang",
        },
        {
            accessorKey: "product.stock",
            header: "Stok Barang",
        },
        {
            accessorKey: "quantity",
            header: "Jumlah Terjual",
        },
        {
            accessorKey: "total",
            header: "Total Harga",
            cell: (row) => {
                const price = row.getValue() as number;
                return formatPrice(price);
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                const sorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSortedBy("transactions.created_at");
                            setSortedOrder(sorted === "asc" ? "desc" : "asc");
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }}
                        className="flex justify-start items-center gap-1 p-0 w-full"
                    >
                        Tanggal Transaksi
                        <SortedIcon
                            sorted={
                                sortedBy === "transactions.created_at"
                                    ? sorted
                                    : false
                            }
                        />
                    </Button>
                );
            },
            cell: (row) => {
                const date = row.getValue() as string;
                return formatDate(date);
            },
        },
        {
            accessorKey: "action",
            header: "Aksi",
            cell: (row) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            className="bg-primary hover:bg-blue-600 rounded py-1 px-2 h-fit"
                            onClick={() => {
                                setOpenEditDialog(true);
                                setSelectedTransaction({
                                    id: row.cell.row.original.id,
                                    product_id:
                                        row.cell.row.original.product_id,
                                    product: row.cell.row.original.product,
                                    quantity: row.cell.row.original.quantity,
                                    total: row.cell.row.original.total,
                                    created_at:
                                        row.cell.row.original.created_at,
                                    updated_at:
                                        row.cell.row.original.updated_at,
                                });
                            }}
                        >
                            Edit
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-red-500 text-primary-foreground hover:bg-red-600 rounded py-1 px-2 h-fit">
                                    Hapus
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Hapus Transaksi</DialogTitle>
                                    <DialogDescription>
                                        <span className="inline-block mt-2">
                                            Tindakan ini tidak dapat dibatalkan.
                                            Apakah Anda yakin ingin menghapus
                                            transaksi ini?
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            disabled={isLoading}
                                        >
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-600"
                                        size="sm"
                                        onClick={() =>
                                            onDelete(row.cell.row.original)
                                        }
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Menghapus..." : "Hapus"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    useEffect(() => {
        if (sortedBy && sortedOrder) {
            fetchTransactions();
        }
    }, [sortedBy, sortedOrder]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchTransactions();
        }, 300);

        return () => clearTimeout(debounce);
    }, [search]);

    useEffect(() => {
        if (!openEditDialog) {
            setSelectedTransaction({
                id: 0,
                product_id: 0,
                product: {
                    id: 0,
                    name: "",
                    price: 0,
                    stock: 0,
                    product_type_id: 0,
                    product_type: {
                        id: 0,
                        name: "",
                    },
                },
                quantity: 0,
                total: 0,
                created_at: "",
                updated_at: "",
            });
        }
    }, [openEditDialog]);

    return (
        <AuthenticatedLayout user={auth.user} title="Transaksi" subtitle="List">
            <Head title="Data Transaksi" />
            <Card>
                <CardHeader className="py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-lg font-medium">
                        Data Transaksi
                    </CardTitle>
                    <Dialog
                        open={openCreateDialog}
                        onOpenChange={setOpenCreateDialog}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="flex gap-1 items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Tambah Transaksi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Transaksi</DialogTitle>
                                <DialogDescription>
                                    Buat transaksi baru. Tekan tombol simpan
                                    apabila sudah selesai.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="product_id">
                                        Barang
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        value={selectedTransaction.product_id}
                                        onChange={(event) => {
                                            const product = products.find(
                                                (product) =>
                                                    product.id ===
                                                    Number(event.target.value)
                                            ) || {
                                                id: 0,
                                                name: "",
                                                price: 0,
                                                stock: 0,
                                                product_type_id: 0,
                                                product_type: {
                                                    id: 0,
                                                    name: "",
                                                },
                                            };
                                            setSelectedTransaction({
                                                ...selectedTransaction,
                                                product_id: Number(
                                                    event.target.value
                                                ),
                                                product,
                                                total:
                                                    product.price *
                                                    Number(event.target.value),
                                            });
                                        }}
                                        className="
                                            bg-white 
                                            border 
                                            border-gray-300 
                                            rounded-md 
                                            py-2 
                                            px-3 
                                            text-gray-900 
                                            focus:outline-none 
                                            focus:ring-2 
                                            focus:ring-primary 
                                            focus:border-transparent 
                                            sm:text-sm
                                        "
                                    >
                                        <option value="0" disabled>
                                            Pilih barang
                                        </option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name +
                                                    " - " +
                                                    formatPrice(product.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="quantity">
                                        Kuantitas
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={selectedTransaction.quantity}
                                        onChange={(event) =>
                                            setSelectedTransaction({
                                                ...selectedTransaction,
                                                quantity: Number(
                                                    event.target.value
                                                ),
                                                total:
                                                    selectedTransaction.product
                                                        .price *
                                                    Number(event.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="total">
                                        Total Harga
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="total"
                                        name="total"
                                        value={formatPrice(
                                            selectedTransaction.total
                                        )}
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" disabled={isLoading}>
                                            Simpan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Simpan Transaksi
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data transaksi
                                                    ini?
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={isLoading}
                                                >
                                                    Batal
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    onCreate(
                                                        selectedTransaction
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Menyimpan..."
                                                    : "Simpan"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <hr className="border-gray-200" />
                <CardContent className="py-4">
                    <DataTable
                        columns={columns}
                        data={data}
                        onPageChange={onPageChange}
                        totalData={totalData}
                        from={from}
                        to={to}
                        search={search}
                        setSearch={setSearch}
                        openPerPageCombobox={openPerPageCombobox}
                        setOpenPerPageCombobox={setOpenPerPageCombobox}
                        perPage={perPage}
                        setPerPage={setPerPage}
                    />
                    <Dialog
                        open={openEditDialog}
                        onOpenChange={setOpenEditDialog}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Transaksi</DialogTitle>
                                <DialogDescription>
                                    <span className="inline-block mt-2">
                                        Ubah data transaksi. Tekan tombol simpan
                                        apabila sudah selesai.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="product_id">
                                        Barang
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        value={
                                            selectedTransaction.product.name +
                                            " - " +
                                            formatPrice(
                                                selectedTransaction.product
                                                    .price
                                            )
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="quantity">
                                        Kuantitas
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={selectedTransaction.quantity}
                                        onChange={(event) =>
                                            setSelectedTransaction({
                                                ...selectedTransaction,
                                                quantity: Number(
                                                    event.target.value
                                                ),
                                                total:
                                                    selectedTransaction.product
                                                        .price *
                                                    Number(event.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="total">
                                        Total Harga
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="total"
                                        name="total"
                                        value={formatPrice(
                                            selectedTransaction.total
                                        )}
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={isLoading}
                                        >
                                            Simpan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Simpan Transaksi
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data transaksi
                                                    ini?
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={isLoading}
                                                >
                                                    Batal
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    onUpdate(
                                                        selectedTransaction
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Menyimpan..."
                                                    : "Simpan"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
