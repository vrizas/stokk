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
import { Textarea } from "@/Components/ui/textarea";

export interface ProductType {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export default function ProductTypeIndex({ auth }: PageProps) {
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
    const [data, setData] = useState<ProductType[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<ProductType>(
        {
            id: 0,
            name: "",
            description: "",
        }
    );
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const csrfToken = document
        ?.getElementById?.("meta_token")
        ?.getAttribute("content");

    const fetchProductTypes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("product-type.getData") +
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

    const onPageChange = (event: { selected: number }) => {
        const newPage = event.selected + 1;
        setPage(newPage);
    };

    const onCreate = async (productType: ProductType, isUndoing = false) => {
        setIsLoading(true);
        try {
            if (!productType.name) {
                throw new Error("Nama jenis barang tidak boleh kosong");
            }

            const response = await fetch(route("product-type.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify({
                    name: productType.name,
                    description: productType.description,
                }),
            });

            if (response.ok) {
                fetchProductTypes();

                if (isUndoing) {
                    toast({
                        description: "Berhasil membatalkan tindakan",
                    });
                } else {
                    toast({
                        description: "Berhasil menambahkan data jenis barang",
                    });

                    setSelectedProductType({
                        id: 0,
                        name: "",
                        description: "",
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

    const onUpdate = async (productType: ProductType) => {
        setIsLoading(true);
        try {
            if (!productType.name) {
                throw new Error("Nama jenis barang tidak boleh kosong");
            }

            const response = await fetch(
                route("product-type.update", productType.id),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                    },
                    body: JSON.stringify(productType),
                }
            );

            if (response.ok) {
                fetchProductTypes();
                toast({
                    description: "Berhasil mengubah data jenis barang",
                });

                setSelectedProductType({
                    id: 0,
                    name: "",
                    description: "",
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

    const onDelete = async (productType: ProductType) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                route("product-type.destroy", productType.id),
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken || "",
                    },
                }
            );

            if (response.ok) {
                fetchProductTypes();
                toast({
                    title: `Berhasil menghapus data jenis barang`,
                    description: "Tekan tombol undo untuk membatalkan tindakan",
                    action: (
                        <ToastAction
                            altText="Kembalikan data jenis barang"
                            onClick={() => onCreate(productType, true)}
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

    const columns: ColumnDef<ProductType>[] = [
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
            accessorKey: "description",
            header: "Deskripsi",
            cell: (row) => {
                const description = row.cell.row.original.description;

                return description || "-";
            },
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
                                setSelectedProductType({
                                    id: row.cell.row.original.id,
                                    name: row.cell.row.original.name,
                                    description:
                                        row.cell.row.original.description,
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
                                    <DialogTitle>
                                        Hapus Jenis Barang
                                    </DialogTitle>
                                    <DialogDescription>
                                        <span className="inline-block mt-2">
                                            Tindakan ini tidak dapat dibatalkan.
                                            Apakah Anda yakin ingin menghapus
                                            jenis barang <strong>{name}</strong>
                                            ?
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
    }, [page]);

    useEffect(() => {
        if (sortedBy && sortedOrder) {
            fetchProductTypes();
        }
    }, [sortedBy, sortedOrder]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchProductTypes();
        }, 300);

        return () => clearTimeout(debounce);
    }, [search]);

    useEffect(() => {
        if (!openEditDialog) {
            setSelectedProductType({
                id: 0,
                name: "",
                description: "",
            });
        }
    }, [openEditDialog]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Jenis Barang"
            subtitle="List"
        >
            <Head title="Data Jenis Barang" />
            <Card>
                <CardHeader className="py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-lg font-medium">
                        Data Jenis Barang
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
                                Tambah Jenis Barang
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Jenis Barang</DialogTitle>
                                <DialogDescription>
                                    Buat jenis barang baru. Tekan tombol simpan
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
                                        placeholder="Masukkan nama jenis barang"
                                        value={selectedProductType.name}
                                        onChange={(event) =>
                                            setSelectedProductType({
                                                ...selectedProductType,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Masukkan deskripsi jenis barang"
                                        value={
                                            selectedProductType.description ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            setSelectedProductType({
                                                ...selectedProductType,
                                                description: event.target.value,
                                            })
                                        }
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
                                                Simpan Barang
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data jenis barang
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
                                                        selectedProductType
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
                                <DialogTitle>Edit Jenis Barang</DialogTitle>
                                <DialogDescription>
                                    <span className="inline-block mt-2">
                                        Ubah data jenis barang. Tekan tombol
                                        simpan apabila sudah selesai.
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
                                        placeholder="Masukkan nama jenis barang"
                                        value={selectedProductType.name}
                                        onChange={(event) =>
                                            setSelectedProductType({
                                                ...selectedProductType,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Masukkan deskripsi jenis barang"
                                        value={
                                            selectedProductType.description ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            setSelectedProductType({
                                                ...selectedProductType,
                                                description: event.target.value,
                                            })
                                        }
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
                                                Simpan Barang
                                            </DialogTitle>
                                            <DialogDescription>
                                                <span className="inline-block mt-2">
                                                    Apakah Anda yakin ingin
                                                    menyimpan data jenis barang
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
                                                        selectedProductType
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
