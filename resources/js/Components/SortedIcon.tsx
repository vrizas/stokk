import { SortDirection } from "@tanstack/react-table";

export default function SortedIcon({
    sorted,
}: {
    sorted: false | SortDirection;
}) {
    if (sorted === "asc") {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
            </svg>
        );
    } else if (sorted === "desc") {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 15l6 -6l6 6" />
            </svg>
        );
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 9l4 -4l4 4" />
            <path d="M16 15l-4 4l-4 -4" />
        </svg>
    );
}
