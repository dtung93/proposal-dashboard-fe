import { JSX } from "react";
import { ProposalStatus, User, UserRole } from "../types";
import { ApprovalRecordResponse } from "./api";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  MAX_TOTAL_SIZE_MB,
} from "../constants";
import { useToast } from "./useToast";

export function formatUTC7Date(date?: Date | string | number): string {
  if (!date) return "";

  // Convert to Date if needed
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else {
    return "";
  }

  if (isNaN(d.getTime())) return ""; // invalid date

  // Shift to UTC+7
  const utc7Time = new Date(d.getTime() + 7 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = utc7Time.getUTCFullYear();
  const month = pad(utc7Time.getUTCMonth() + 1);
  const day = pad(utc7Time.getUTCDate());

  let hours = utc7Time.getUTCHours();
  const minutes = pad(utc7Time.getUTCMinutes());

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12; // 12 AM / 12 PM
  const hoursStr = pad(hours);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekday = weekdays[utc7Time.getUTCDay()];

  return `${day}-${month}-${year} (${getVietnameseWeekday(
    weekday
  )}) ${hoursStr}:${minutes} ${period}`;
}

function getVietnameseWeekday(englishWeekday: string): string {
  switch (englishWeekday) {
    case "Sunday":
      return "Chủ Nhật";
    case "Monday":
      return "Thứ Hai";
    case "Tuesday":
      return "Thứ Ba";
    case "Wednesday":
      return "Thứ Tư";
    case "Thursday":
      return "Thứ Năm";
    case "Friday":
      return "Thứ Sáu";
    case "Saturday":
      return "Thứ Bảy";
    default:
      return englishWeekday;
  }
}
/**
 * Parses a date string (like '2025-11-09 14:30:00') into a Date object (UTC+7)
 */
export function parseDateUTC7(dateStr: string): Date {
  const [datePart, timePart] = dateStr.split(" ");

  if (!datePart || !timePart) {
    throw new Error("Invalid date string format, expected YYYY-MM-DD HH:mm:ss");
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Create date in UTC
  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hours - 7, minutes, seconds)
  );

  return utcDate;
}

export function disabledProcessButton(
  userRole: UserRole,
  proposalStatus: ProposalStatus
): boolean {
  if (userRole === UserRole.STAFF) return true;
  if (
    userRole === UserRole.ACCOUNTANT &&
    proposalStatus === ProposalStatus.ACCOUNTANT_REJECTED
  ) {
    return true;
  } else if (
    userRole === UserRole.ACCOUNTANT &&
    proposalStatus === ProposalStatus.ACCOUNTANT_REVIEWED
  ) {
    return true;
  } else if (
    userRole === UserRole.MANAGER &&
    (proposalStatus === ProposalStatus.ACCOUNTANT_REVIEWED ||
      proposalStatus === ProposalStatus.ACCOUNTANT_REJECTED)
  ) {
    return true;
  } else if (
    userRole === UserRole.DIRECTOR &&
    (proposalStatus === ProposalStatus.DIRECTOR_REVIEWED ||
      proposalStatus === ProposalStatus.DIRECTOR_REJECTED)
  ) {
    return true;
  }
  return false;
}
export function getVietnameseStatus(status: ProposalStatus): string {
  switch (status) {
    // Accountant
    case ProposalStatus.ACCOUNTANT_REVIEW:
      return "Kế toán";
    case ProposalStatus.ACCOUNTANT_REVIEWED:
      return "Kế toán đã duyệt";
    case ProposalStatus.ACCOUNTANT_REJECTED:
      return "Kế toán từ chối";

    // Manager
    case ProposalStatus.MANAGER_REVIEW:
      return "Manager";
    case ProposalStatus.MANAGER_REVIEWED:
      return "Manager đã duyệt";
    case ProposalStatus.MANAGER_REJECTED:
      return "Manager từ chối";

    // Director
    case ProposalStatus.DIRECTOR_REVIEW:
      return "BOD";
    case ProposalStatus.DIRECTOR_REVIEWED:
      return "BOD đã duyệt";
    case ProposalStatus.DIRECTOR_REJECTED:
      return "BOD từ chối";

    // Final status
    case ProposalStatus.Approved:
      return "Đã duyệt";
    case ProposalStatus.Rejected:
      return "Đã từ chối";

    default:
      return status; // fallback: return enum string
  }
}

export function isDisabled(proposalStatus: ProposalStatus): boolean {
  return (
    proposalStatus === ProposalStatus.DIRECTOR_REVIEWED ||
    proposalStatus === ProposalStatus.ACCOUNTANT_REJECTED
  );
}

export function getServerMessage(error: any): string {
  const backend = error?.response?.data;

  return (
    backend?.errorMessage ||
    backend?.message ||
    backend?.status ||
    error?.message ||
    "Đã xảy ra lỗi không xác định."
  );
}

export function getVietnameseRole(role: UserRole): string {
  switch (role) {
    case UserRole.STAFF:
      return "Nhân viên";
    case UserRole.ACCOUNTANT:
      return "Kế toán";
    case UserRole.MANAGER:
      return "Quản lý";
    case UserRole.DIRECTOR:
      return "BOD";
    default:
      return "Nhân Viên";
  }
}
