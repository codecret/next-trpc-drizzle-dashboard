import { trpc } from "@/lib/trpc/client";

export const useAddProject = () => {
  return trpc.user.addUser.useMutation();
};

export const useEditProject = () => {
  return trpc.user.editUser.useMutation();
};
