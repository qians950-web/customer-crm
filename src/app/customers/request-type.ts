import { RequestType } from "@/generated/prisma/client";

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  INSTALLATION: "設置",
  REPAIR: "修理",
  OTHER: "その他",
};

export const REQUEST_TYPE_OPTIONS = Object.entries(REQUEST_TYPE_LABELS) as [
  RequestType,
  string,
][];
