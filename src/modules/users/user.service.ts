import { User } from "./user.model";

export async function createUser(input: { email: string; name: string; role?: string }) {
  const user = await User.create(input);
  return user;
}
