import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { exit } from 'process';
import { TranslationCleanupTask } from './models/translation-cleanup-task.model';
import { Utils } from './utils';
import { getCleanerConfiguration } from './utils/configuration-loader';
import { Logger } from './utils/logger';


const configuration = getCleanerConfiguration();

console.info('Configuration loaded => ', configuration);


const projectPathExists = fs.existsSync(configuration.projectPath);
const translationsPathExists = fs.existsSync(configuration.translationFilesPath);

if (!projectPathExists) {
    Logger.error(`Project path "${configuration.projectPath}" does not exist`);
    exit(-1);
}

if (!translationsPathExists) {
    Logger.error(`Translation path "${configuration.translationFilesPath}" does not exist`);
    exit(-1);
}


const translationFilesPattern = path.join(
    configuration.translationFilesPath,
    '*.json'
);
const translationFiles = glob.sync(translationFilesPattern, { nodir: true });

if (!translationFiles) {
    Logger.error('No translation files were found');
}

Logger.info(` ${translationFiles.length} Translation files found`);


const cleanupTasks: TranslationCleanupTask[] = translationFiles.map(
    filePath => ({
        cleanedTranslation: {},
        fileName: path.basename(filePath),
        sourceTranslation: JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    })
)


const stats = cleanupTasks.map(
    task => {
        Logger.info(`Checking file ${task.fileName}`);
        const allKeys = Utils.extractKeys(task.sourceTranslation);
        const unusedKeys = Utils.keysNotUsedInProject(allKeys, configuration.projectPath, configuration.includeFiles);
        Utils.buildTranslation(task.sourceTranslation, '', task.cleanedTranslation, new Set(unusedKeys));

        const keysInNewJSON = Utils.extractKeys(task.cleanedTranslation);
        Logger.log(`Keys in Original: \t ${allKeys.length}`);
        Logger.log(`Unused Keys: \t\t ${unusedKeys.length}`);
        Logger.log(`Keys in CleanedItem: \t ${keysInNewJSON.length}`);
        Logger.log(`KeyDiff \t\t ${allKeys.length - keysInNewJSON.length}`);


        return {
            keysInOriginal: allKeys.length,
            unusedKeys,
            keysInNewJSON,
            keyDiff: allKeys.length - keysInNewJSON.length,
            task
        }
    }
)

const outPath = configuration.outPath;
if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true });
}



cleanupTasks.forEach(
    task => {
        fs.writeFileSync(
            path.join(outPath, task.fileName),
            JSON.stringify(task.cleanedTranslation, null, 2)
        )
    }
)



// * write log

const logPath = path.join(
    configuration.outPath,
    `__cleanup_logs ${new Date().toJSON()}`
)

if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
}

stats.forEach(
    stat => {
        fs.writeFileSync(
            path.join(
                logPath,
                stat.task.fileName + '__log.txt'
            ),

            `

 .o88b. db      d88888b  .d8b.  d8b   db db    db d8888b.      d8888b. d88888b d8888b.  .d88b.  d8888b. d888888b 
d8P  Y8 88      88'     d8'  8b 888o  88 88    88 88   8D      88   8D 88'     88   8D .8P  Y8. 88   8D  ~~88~~' 
8P      88      88ooooo 88ooo88 88V8o 88 88    88 88oodD'      88oobY' 88ooooo 88oodD' 88    88 88oobY'    88    
8b      88      88~~~~~ 88~~~88 88 V8o88 88    88 88~~~        88 8b   88~~~~~ 88~~~   88    88 88 8b      88    
Y8b  d8 88booo. 88.     88   88 88  V888 88b  d88 88           88  88. 88.     88       8b  d8' 88  88.    88    
  Y88P' Y88888P Y88888P YP   YP VP   V8P ~Y8888P' 88           88   YD Y88888P 88        Y88P'  88   YD    YP   


********************************************
    File: ${stat.task.fileName}
    #Removed Keys: ${stat.unusedKeys.length}
********************************************

** List of removed Keys ***

${stat.unusedKeys.join('\n')}
`
        )
    }
)