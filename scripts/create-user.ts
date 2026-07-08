import { config } from "dotenv";

config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error(
      "使い方: npm run create-user -- \"氏名\" \"email@example.com\" \"パスワード\"",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash },
  });

  console.log(`ユーザーを作成/更新しました: ${user.email} (id: ${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
