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
import { ProductType } from "../ProductType/Index";
import formatPrice from "@/utils/formatPrice";

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    product_type_id: number;
    product_type: ProductType;
    created_at?: string;
    updated_at?: string;
}

export default function ProductIndex({ auth }: PageProps) {
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
    const [data, setData] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product>({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        product_type_id: 0,
        product_type: {
            id: 0,
            name: "",
        },
    });
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const csrfToken = document
        ?.getElementById?.("meta_token")
        ?.getAttribute("content");

    const fetchProductTypes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("product-type.getData") + "?perPage=999999"
            );
            const responseJson = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.message);
            }

            setProductTypes(responseJson.data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                description:
                    error?.message || "Terjadi kesalahan saat mengambil data",
                action: (
                    <ToastAction
                        altText="Muat ulang"
                        onClick={() => fetchProductTypes()}
                    >
                        Coba lagi
                    </ToastAction>
                ),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("product.getData") +
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

    const onPageChange = (event: { selected: number }) => {
        const newPage = event.selected + 1;
        setPage(newPage);
    };

    const onCreate = async (product: Product, isUndoing = false) => {
        setIsLoading(true);
        try {
            if (!product.name) {
                throw new Error("Nama barang tidak boleh kosong");
            }

            if (!product.price) {
                throw new Error("Harga barang tidak boleh kosong");
            }

            if (!product.stock) {
                throw new Error("Stok barang tidak boleh kosong");
            }

            if (!product.product_type_id) {
                throw new Error("Jenis barang tidak boleh kosong");
            }

            const response = await fetch(route("product.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    product_type_id: product.product_type_id,
                }),
            });

            if (response.ok) {
                fetchProducts();

                if (isUndoing) {
                    toast({
                        description: "Berhasil membatalkan tindakan",
                    });
                } else {
                    toast({
                        description: "Berhasil menambahkan data barang",
                    });

                    setSelectedProduct({
                        id: 0,
                        name: "",
                        price: 0,
                        stock: 0,
                        product_type_id: 0,
                        product_type: {
                            id: 0,
                            name: "",
                        },
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

    const onUpdate = async (product: Product) => {
        setIsLoading(true);
        try {
            if (!product.name) {
                throw new Error("Nama barang tidak boleh kosong");
            }

            if (!product.price) {
                throw new Error("Harga barang tidak boleh kosong");
            }

            if (!product.stock) {
                throw new Error("Stok barang tidak boleh kosong");
            }

            if (!product.product_type_id) {
                throw new Error("Jenis barang tidak boleh kosong");
            }

            const response = await fetch(route("product.update", product.id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    product_type_id: product.product_type_id,
                }),
            });

            if (response.ok) {
                fetchProducts();
                toast({
                    description: "Berhasil mengubah data barang",
                });

                setSelectedProduct({
                    id: 0,
                    name: "",
                    price: 0,
                    stock: 0,
                    product_type_id: 0,
                    product_type: {
                        id: 0,
                        name: "",
                    },
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

    const onDelete = async (product: Product) => {
        setIsLoading(true);
        try {
            const response = await fetch(route("product.destroy", product.id), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            if (response.ok) {
                fetchProducts();
                toast({
                    title: `Berhasil menghapus data barang`,
                    description: "Tekan tombol undo untuk membatalkan tindakan",
                    action: (
                        <ToastAction
                            altText="Kembalikan data barang"
                            onClick={() => onCreate(product, true)}
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

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                const sorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSortedBy("name");
                            setSortedOrder(sorted === "asc" ? "desc" : "asc");
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }}
                        className="flex justify-start items-center gap-1 p-0 w-full"
                    >
                        Nama
                        <SortedIcon sorted={sorted} />
                    </Button>
                );
            },
        },
        {
            accessorKey: "stock",
            header: "Stok",
        },
        {
            accessorKey: "price",
            header: "Harga",
            cell: (row) => {
                const price = row.getValue() as number;
                return formatPrice(price);
            },
        },
        {
            accessorKey: "product_type.name",
            header: "Jenis Barang",
        },
        {
            accessorKey: "action",
            header: "Aksi",
            cell: (row) => {
                const name = row.cell.row.original.name;

                return (
                    <div className="flex gap-2">
                        <Button
                            className="bg-primary hover:bg-blue-600 rounded py-1 px-2 h-fit"
                            onClick={() => {
                                setOpenEditDialog(true);
                                setSelectedProduct({
                                    id: row.cell.row.original.id,
                                    name: row.cell.row.original.name,
                                    price: row.cell.row.original.price,
                                    stock: row.cell.row.original.stock,
                                    product_type_id:
                                        row.cell.row.original.product_type_id,
                                    product_type: {
                                        id: row.cell.row.original.product_type
                                            .id,
                                        name: row.cell.row.original.product_type
                                            .name,
                                    },
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
                                    <DialogTitle>Hapus Barang</DialogTitle>
                                    <DialogDescription>
                                        <span className="inline-block mt-2">
                                            Tindakan ini tidak dapat dibatalkan.
                                            Apakah Anda yakin ingin menghapus
                                            barang <strong>{name}</strong>?
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
        fetchProductTypes();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        if (sortedBy && sortedOrder) {
            fetchProducts();
        }
    }, [sortedBy, sortedOrder]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(debounce);
    }, [search]);

    useEffect(() => {
        if (!openEditDialog) {
            setSelectedProduct({
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                product_type_id: 0,
                product_type: {
                    id: 0,
                    name: "",
                },
            });
        }
    }, [openEditDialog]);

    return (
        <AuthenticatedLayout user={auth.user} title="Barang" subtitle="List">
            <Head title="Data Barang" />
            <Card>
                <CardHeader className="py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-lg font-medium">
                        Data Barang
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
                                Tambah Barang
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Barang</DialogTitle>
                                <DialogDescription>
                                    Buat barang baru. Tekan tombol simpan
                                    apabila sudah selesai.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">
                                        Nama
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Masukkan nama barang"
                                        value={selectedProduct.name}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="stock">
                                        Stok
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={selectedProduct.stock}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                stock: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">
                                        Harga
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formatPrice(
                                            selectedProduct.price
                                        )}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                price: event.target.value
                                                    ? Number(
                                                          event.target.value
                                                              .replace(
                                                                  "Rp ",
                                                                  ""
                                                              )
                                                              .replaceAll(
                                                                  ".",
                                                                  ""
                                                              )
                                                      )
                                                    : 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="product_type_id">
                                        Jenis Barang
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="product_type_id"
                                        name="product_type_id"
                                        value={selectedProduct.product_type_id}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                product_type_id: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
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
                                            Pilih jenis barang
                                        </option>
                                        {productTypes.map((productType) => (
                                            <option
                                                key={productType.id}
                                                value={productType.id}
                                            >
                                                {productType.name}
                                            </option>
                                        ))}
                                    </select>
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
                                                Simpan Barang
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data barang ini?
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
                                                    onCreate(selectedProduct)
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
                                <DialogTitle>Edit Barang</DialogTitle>
                                <DialogDescription>
                                    <span className="inline-block mt-2">
                                        Ubah data barang. Tekan tombol simpan
                                        apabila sudah selesai.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">
                                        Nama
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Masukkan nama barang"
                                        value={selectedProduct.name}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="stock">
                                        Stok
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={selectedProduct.stock}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                stock: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">
                                        Harga
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formatPrice(
                                            selectedProduct.price
                                        )}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                price: event.target.value
                                                    ? Number(
                                                          event.target.value
                                                              .replace(
                                                                  "Rp ",
                                                                  ""
                                                              )
                                                              .replaceAll(
                                                                  ".",
                                                                  ""
                                                              )
                                                      )
                                                    : 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="product_type_id">
                                        Jenis Barang
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="product_type_id"
                                        name="product_type_id"
                                        value={selectedProduct.product_type_id}
                                        onChange={(event) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                product_type_id: Number(
                                                    event.target.value
                                                ),
                                            })
                                        }
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
                                            Pilih jenis barang
                                        </option>
                                        {productTypes.map((productType) => (
                                            <option
                                                key={productType.id}
                                                value={productType.id}
                                            >
                                                {productType.name}
                                            </option>
                                        ))}
                                    </select>
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
                                                Simpan Barang
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data barang ini?
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
                                                    onUpdate(selectedProduct)
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
