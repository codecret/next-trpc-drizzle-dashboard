import { TRPCClientError } from "@trpc/client";

type mutationHandlerFnHandler = () => any | Promise<any>;

interface mutationHandlerFnOptions<T extends mutationHandlerFnHandler> {
  onSuccess?: (result: Awaited<ReturnType<T>>) => void;
  onError?: (error: unknown) => void;
  successMessage?: string | ((result: Awaited<ReturnType<T>>) => string);
  errorMessage?: string;
}

export async function mutationHandler<T extends mutationHandlerFnHandler>(
  handler: T,
  opts: mutationHandlerFnOptions<T> = {},
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  }
) {
  try {
    const result = await handler();

    if (opts.onSuccess) {
      opts.onSuccess(result);
    }

    if (opts.successMessage) {
      if (typeof opts.successMessage === "function") {
        toast.success(opts.successMessage(result));
      } else {
        toast.success(opts.successMessage);
      }
    }
  } catch (error) {
    console.log(error);
    console.log(typeof error);

    if (opts.onError) {
      opts.onError(error);
    }

    if (opts.errorMessage) {
      toast.error(opts.errorMessage);
    } else {
      if (error instanceof TRPCClientError) {
        const errorData = JSON.parse(error.message);
        const errorMessage = errorData[0].message;
        toast.error(errorMessage);
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Oh no, something went wrong!";
        toast.error(message);
      }
    }
  }
}
