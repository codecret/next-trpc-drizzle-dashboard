import { trpc } from "@/lib/trpc/client";

export const useAddUser = () => {
  return trpc.user.addUser.useMutation();
};

export const useEditUser = () => {
  return trpc.user.editUser.useMutation();
};
