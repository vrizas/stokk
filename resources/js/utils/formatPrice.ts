export default function formatPrice(price: number) {
    const prefix = "Rp";
  
    if (isNaN(price)) {
        return "Rp 0";
    }

    let formattedValue = price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    formattedValue = formattedValue.replace(prefix, '').replace(/\s/g, '')

    return prefix + ' ' + formattedValue;
}