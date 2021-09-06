export class CallerHelper
{

    /**
     * Get's the name of the caller
     * We can't use arguments.caller or something similar so we have to hack around
     */
    public static getCaller = (error: Error): string =>
    {
        const stack = error.stack;
        const lines = stack.split('\n');

        return lines[0];
    }

}