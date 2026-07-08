"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { RequestType } from "@/generated/prisma/client";

function readCustomerForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("氏名/会社名は必須です");
  }

  const optional = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value === "" ? null : value;
  };

  const optionalDate = (key: string) => {
    const value = optional(key);
    return value === null ? null : new Date(value);
  };

  const requestTypeValue = optional("requestType");
  const requestType =
    requestTypeValue !== null &&
    (Object.values(RequestType) as string[]).includes(requestTypeValue)
      ? (requestTypeValue as RequestType)
      : null;

  return {
    name,
    kana: optional("kana"),
    company: optional("company"),
    email: optional("email"),
    phone: optional("phone"),
    address: optional("address"),
    memo: optional("memo"),
    startDate: optionalDate("startDate"),
    endDate: optionalDate("endDate"),
    requestType,
  };
}

export async function createCustomer(formData: FormData) {
  await requireUser();
  const data = readCustomerForm(formData);
  const customer = await prisma.customer.create({ data });
  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(id: number, formData: FormData) {
  await requireUser();
  const data = readCustomerForm(formData);
  await prisma.customer.update({ where: { id }, data });
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: number) {
  await requireUser();
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customers");
  redirect("/customers");
}
