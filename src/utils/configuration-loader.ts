import { question } from "readline-sync";
import * as fs from 'fs'
import { CleanerConfiguration } from "../models/cleaner-configuration.model";

const configLocation = 'cleaner-config.json';

export function getCleanerConfiguration(): CleanerConfiguration {

    if(!fs.existsSync(configLocation)){
        console.warn(`"${configLocation}" was not found. Please provide the following information. Press Enter for default option.`)
        return getConfigurationInInteractiveTerminal();
    }

    const config = CleanerConfiguration.DEFAULT();

    const userConfig = JSON.parse(fs.readFileSync(configLocation, 'utf-8'));

    // ovverwrite
    Object.assign(config, userConfig);
    return config;
}


function getConfigurationInInteractiveTerminal(): CleanerConfiguration{
    const config = CleanerConfiguration.DEFAULT();
    config.projectPath =  question(`What is your project path? (default: ${config.projectPath})`) || config.projectPath;
    config.translationFilesPath = question(`Where are your translation files located? (default: ${config.translationFilesPath})`) || config.translationFilesPath;
    config.overwriteFiles = question(`Would you like to overwrite the files (yes/no)? (default: no)`) === 'yes';

    return config;
} 