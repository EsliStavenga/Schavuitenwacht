import * as fs from 'fs';
import * as path from 'path';

export class ConfigService {

    public static readonly instance = new ConfigService('./config/config.json');
    private readonly configFile: string;
    private config: JSON;

    /**
     *
     * @param {string} configFile The config file relative to the project's root
     */
    private constructor(configFile: string) {
        this.configFile = path.resolve(configFile);

        this.readConfig();
        this.listenToConfigChanges();
    }

    public getConfig(key: string, _default: any = ""): string
    {
        //TODO add multi level support
        return this.config[key] || _default;
    }

    private readConfig(): void
    {
        const rawData = fs.readFileSync(this.configFile);

        try {
            // @ts-ignore rawData is Buffer but does work with JSON.parse https://stackabuse.com/reading-and-writing-json-files-with-node-js/
            this.config = JSON.parse(rawData);
        } catch(e) {
            console.error("Couldn't read config", e);
        }
    }

    private listenToConfigChanges()
    {
        fs.watchFile(this.configFile, () => {this.readConfig(); });
    }
}