import { AsyncLocalStorage } from "async_hooks";

export interface TracingContext {
    externalCustomerId?: string;
    externalProductId?: string;
    storePrompt?: boolean;
    metadata?: Record<string, any>;
}

const getDefaultTracingContext = (): TracingContext => ({
    externalCustomerId: undefined,
    externalProductId: undefined,
    storePrompt: false,
    metadata: undefined,
});

const tracingContextStorage = new AsyncLocalStorage<TracingContext>();

export const getTracingContext = () => tracingContextStorage.getStore() || getDefaultTracingContext();

export async function runWithTracingContext<F extends (...args: any) => any>(
    ctx: TracingContext,
    fn: F,
): Promise<ReturnType<F>> {
    return await tracingContextStorage.run(ctx, fn);
}
