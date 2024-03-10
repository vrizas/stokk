export default function formatDate(date: string) {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }).format(new Date(date));
}