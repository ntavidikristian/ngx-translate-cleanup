import { question } from "readline-sync";
import * as fs from 'fs'
import { CleanerConfiguration } from "../models/cleaner-configuration.model";
import { Logger } from "./logger";
const clc = require('cli-color');

const configLocation = 'cleaner-config.json';

export function getCleanerConfiguration(): CleanerConfiguration {

    if (!fs.existsSync(configLocation)) {
        Logger.info(`"${configLocation}" was not found. Please provide the following information. Press Enter for default option.`)
        return getConfigurationInInteractiveTerminal();
    }

    const config = CleanerConfiguration.DEFAULT();

    const userConfig = JSON.parse(fs.readFileSync(configLocation, 'utf-8'));

    // ovverwrite
    Object.assign(config, userConfig);
    return config;
}


function getConfigurationInInteractiveTerminal(): CleanerConfiguration {
    const config = CleanerConfiguration.DEFAULT();
    config.projectPath = question(clc.green(`What is your project path? `) + `(default: ${config.projectPath}): `) || config.projectPath;
    config.translationFilesPath = question(clc.green(`Where are your translation files located? `) + ` (default: ${config.translationFilesPath}): `) || config.translationFilesPath;
    config.outPath = question(clc.green(`Where would you like to put your cleaned up translations? `) + ` (default: ${config.outPath}): `) || config.outPath;
    const filesInput = question(clc.green(`What files would you like to search in? `) + ` default(${config.includeFiles}): `).split(
        ','
    ).map(x => x.trim()).filter(x => x);


    if (filesInput.length) {
        config.includeFiles = filesInput;
    }

    return config;
} 