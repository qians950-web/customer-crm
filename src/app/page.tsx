import CustomersPage from "./customers/page";

export default function Home() {
  return <CustomersPage searchParams={Promise.resolve({})} />;
}
