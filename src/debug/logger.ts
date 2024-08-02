import signale from 'signale';

export function log(...args: string[]) {
    if (process.env.NODE_ENV === 'development') {
        console.log("\n//#region DEBUG LOG \n\n");
        signale.debug(...args);
        console.log("\n//#endregion\n");
    }
}