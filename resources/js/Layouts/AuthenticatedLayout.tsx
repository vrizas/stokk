import { PropsWithChildren, ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ApplicationLogoWhite from "@/Components/ApplicationLogoWhite";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import { User } from "@/types";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Toaster } from "@/Components/ui/toaster";

export default function Authenticated({
    user,
    children,
    title,
    subtitle,
}: PropsWithChildren<{ user: User; title: string; subtitle: string }>) {
    const routeName = route().current();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow px-4 flex items-center justify-between lg:justify-end h-14 sticky top-0">
                <div className="flex items-center gap-3">
                    <Sheet>
                        <SheetTrigger className="lg:hidden">
                            <svg
                                className="h-6 w-6 text-gray-500 scale-x-[-1]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </SheetTrigger>
                        <SheetContent side="left" className="px-0">
                            <SheetHeader className="font-semibold text-lg mb-3 px-6">
                                Menu
                            </SheetHeader>
                            <nav className="flex flex-col">
                                <Link
                                    href={route("dashboard")}
                                    className={
                                        routeName === "dashboard"
                                            ? "flex items-center gap-2 w-full bg-slate-100 px-6 py-2 text-sm font-medium"
                                            : "flex items-center gap-2 w-full hover:bg-slate-100 px-6 py-2 text-sm font-medium"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                        <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                        <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                        <path d="M14 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("product-type.index")}
                                    className={
                                        routeName === "product-type.index"
                                            ? "flex items-center gap-2 w-full bg-slate-100 px-6 py-2 text-sm font-medium"
                                            : "flex items-center gap-2 w-full hover:bg-slate-100 px-6 py-2 text-sm font-medium"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-category"
                                        width="20"
                                        height="20"
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
                                        <path d="M4 4h6v6h-6z" />
                                        <path d="M14 4h6v6h-6z" />
                                        <path d="M4 14h6v6h-6z" />
                                        <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                    </svg>
                                    Data Jenis Barang
                                </Link>
                                <Link
                                    href={route("product.index")}
                                    className={
                                        routeName === "product.index"
                                            ? "flex items-center gap-2 w-full bg-slate-100 px-6 py-2 text-sm font-medium"
                                            : "flex items-center gap-2 w-full hover:bg-slate-100 px-6 py-2 text-sm font-medium"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                                        <path d="M12 12l8 -4.5"></path>
                                        <path d="M12 12l0 9"></path>
                                        <path d="M12 12l-8 -4.5"></path>
                                        <path d="M16 5.25l-8 4.5"></path>
                                    </svg>
                                    Data Barang
                                </Link>
                                <Link
                                    href={route("transaction.index")}
                                    className={
                                        routeName === "transaction.index"
                                            ? "flex items-center gap-2 w-full bg-slate-100 px-6 py-2 text-sm font-medium"
                                            : "flex items-center gap-2 w-full hover:bg-slate-100 px-6 py-2 text-sm font-medium"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-file-invoice"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                        <path d="M9 7l1 0"></path>
                                        <path d="M9 13l6 0"></path>
                                        <path d="M13 17l2 0"></path>
                                    </svg>
                                    Data Transaksi
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="lg:hidden">
                        <ApplicationLogo className="h-5" />
                    </Link>
                </div>
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                >
                                    {user.name}

                                    <svg
                                        className="ms-2 -me-0.5 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route("profile.edit")}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </header>
            <aside className="hidden lg:block fixed left-0 top-0 h-full w-[15rem] bg-primary">
                <div className="flex justify-center pt-5 px-4 mb-6">
                    <Link href="/">
                        <ApplicationLogoWhite className="h-6" />
                    </Link>
                </div>
                <nav className="flex flex-col text-white">
                    <Link
                        href={route("dashboard")}
                        className={
                            routeName === "dashboard"
                                ? "flex items-center gap-2 w-full bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                                : "flex items-center gap-2 w-full hover:bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                            <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                            <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                            <path d="M14 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href={route("product-type.index")}
                        className={
                            routeName === "product-type.index"
                                ? "flex items-center gap-2 w-full bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                                : "flex items-center gap-2 w-full hover:bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-category"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4h6v6h-6z" />
                            <path d="M14 4h6v6h-6z" />
                            <path d="M4 14h6v6h-6z" />
                            <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        </svg>
                        Data Jenis Barang
                    </Link>
                    <Link
                        href={route("product.index")}
                        className={
                            routeName === "product.index"
                                ? "flex items-center gap-2 w-full bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                                : "flex items-center gap-2 w-full hover:bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                            <path d="M12 12l8 -4.5"></path>
                            <path d="M12 12l0 9"></path>
                            <path d="M12 12l-8 -4.5"></path>
                            <path d="M16 5.25l-8 4.5"></path>
                        </svg>
                        Data Barang
                    </Link>
                    <Link
                        href={route("transaction.index")}
                        className={
                            routeName === "transaction.index"
                                ? "flex items-center gap-2 w-full bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                                : "flex items-center gap-2 w-full hover:bg-[rgba(24,36,51,0.3)] px-6 py-2 text-sm font-medium"
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-file-invoice"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                            <path d="M9 7l1 0"></path>
                            <path d="M9 13l6 0"></path>
                            <path d="M13 17l2 0"></path>
                        </svg>
                        Data Transaksi
                    </Link>
                </nav>
            </aside>
            <main className="py-8 px-5 lg:pl-[16.25rem]">
                <p className="font-bold text-xs text-gray-500 uppercase">
                    {subtitle}
                </p>
                <h2 className="font-semibold text-xl">{title}</h2>
                <div className="mt-5">{children}</div>
                <Toaster />
            </main>
        </div>
    );
}
