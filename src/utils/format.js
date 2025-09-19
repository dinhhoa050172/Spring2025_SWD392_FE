const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const formatTime = (hour) => {
  const formattedHour = String(hour).padStart(2, "0");
  return `${formattedHour}:00:00`;
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateTimeString));
};

function formatMoney(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "";
  }
  return amount.toLocaleString("vi-VN", {
    // style: "currency",
    // currency: "VND",
  });
}

export { formatDate, formatDateTime, formatTime, formatMoney };
