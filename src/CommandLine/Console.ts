import {InvalidArgumentException} from "../Exception/InvalidArgumentException";
import dayjs = require("dayjs");

export class Console
{
    private static originalConsole = console;
    private dateTimeFormat: string = 'YYYY-MM-DD HH:mm:ss.SSS';

    private handleLogger = (method: string, ...messages: any[]): void =>
    {
        messages.forEach((message) => {
            this.logPrefixedMessage(message.toString(), method);
        });
    }

    private logPrefixedMessage = (message: string, method: string): void =>
    {
        if(!Console.originalConsole.hasOwnProperty(method)) {
            throw new InvalidArgumentException(`Method ${method} was not found on console.`);
        }

        Console.originalConsole[method](this.formatPrefix() + message);
    }

    private formatPrefix = (): string =>
    {
        return `[${dayjs().format(this.dateTimeFormat).trim()}] `;
    }

    public log = (...messages: any) => this.handleLogger('log', ...messages);
    public info = (...messages: any) => this.handleLogger('info', ...messages);
    public error = (...messages: any) => this.handleLogger('error', ...messages);
    public debug = (...messages: any) => this.handleLogger('debug', ...messages);
    public warn = (...messages: any) => this.handleLogger('warn', ...messages);
    public assert = Console.originalConsole.assert;
    public count = Console.originalConsole.count;
    public clear = Console.originalConsole.clear;
    public dir = Console.originalConsole.dir;
    public dirxml = Console.originalConsole.dirxml;
    public group = Console.originalConsole.group;
    public groupCollapsed = Console.originalConsole.groupCollapsed;
    public groupEnd = Console.originalConsole.groupEnd;
    public countReset = Console.originalConsole.countReset;
    public table = Console.originalConsole.table;
    public time = Console.originalConsole.time;
    public timeEnd = Console.originalConsole.timeEnd;
    public timeLog = Console.originalConsole.timeLog;
    public timeStamp = Console.originalConsole.timeStamp;
    public trace = Console.originalConsole.trace;
    public profile = Console.originalConsole.profile;
    public profileEnd = Console.originalConsole.profileEnd;
    public Console = Console.originalConsole.Console;

}