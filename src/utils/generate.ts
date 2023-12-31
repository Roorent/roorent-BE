export const generatePaymentNumber = () => {
  const currentDate = new Date()

  // Menetapkan zona waktu
  const options: any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }

  // Menggunakan toLocaleString dengan opsi zona waktu
  const formattedDate = currentDate.toLocaleString('id-ID', options)
  // Mengambil tanggal dan waktu dari hasil format
  const [day, month, year, hours, minutes] = formattedDate.match(/(\d+)/g)

  const randomString = Math.random().toString(36).substring(2, 12)
  const paymentNumber = `${year}${month}${day}${hours}${minutes}${randomString}`

  return paymentNumber
}
