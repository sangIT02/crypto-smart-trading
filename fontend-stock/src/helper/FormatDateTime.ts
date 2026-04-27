export const formatDate = (
  dateString: string,
  format: "full" | "date" | "time" | "short" = "full",
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Kiểm tra ngày có hợp lệ không
  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  switch (format) {
    case "full":
      // 15/03/2026 21:50:36
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    case "date":
      // 15/03/2026
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    case "time":
      // 21:50:36
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    case "short":
      // 15/03/2026 21:50
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    default:
      return date.toLocaleString("vi-VN");
  }
};
