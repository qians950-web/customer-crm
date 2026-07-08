import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CustomerForm from "../../CustomerForm";
import { updateCustomer } from "../../actions";
import { requireUser } from "@/lib/dal";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    notFound();
  }

  const updateCustomerWithId = updateCustomer.bind(null, customer.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">顧客情報の編集</h1>
      <CustomerForm
        action={updateCustomerWithId}
        defaultValues={customer}
        submitLabel="更新する"
      />
    </div>
  );
}
