import ApplicationLogoWhite from "@/Components/ApplicationLogoWhite";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex">
            <div className="w-full px-7 py-8 hidden lg:flex lg:flex-col bg-primary justify-between">
                <Link href="/">
                    <ApplicationLogoWhite className="w-28" />
                </Link>
                <blockquote className="text-primary-foreground font-semibold space-y-2">
                    <p className="text-lg">
                        “The stock market is a device for transferring money
                        from the impatient to the patient.“
                    </p>
                    <footer className="text-sm"> - Warren Buffet</footer>
                </blockquote>
            </div>
            <div className="w-[60%] px-7 py-8 lg:px-20 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}
