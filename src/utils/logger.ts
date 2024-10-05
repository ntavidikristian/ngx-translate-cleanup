const clc = require('cli-color');

export namespace Logger {
    export function error(...args: any[]): void {
        console.error(clc.red(...args))
    }

    export function info(...args: any[]): void {
        console.info(clc.blue(...args))
    }
    export function log(...args: any[]): void {
        console.log(...args);
    }
}