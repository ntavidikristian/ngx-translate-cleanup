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
        const unusedKeys = Utils.keysNotUsedInProject(allKeys, configuration.projectPath);
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


if (!configuration.overwriteFiles) {
    cleanupTasks.forEach(
        task => {
            fs.writeFileSync(
                path.join(outPath, task.fileName),
                JSON.stringify(task.cleanedTranslation, null, 2)
            )
        }
    )
} else {

}


// * write log

fs.writeFileSync(
    path.join(
        outPath,
        `__cleanup-log__${new Date().toJSON()}.txt`
    ),

    stats.reduce(
        (aggr, current) => `
${aggr}
${current.task.fileName}
removed Keys: ${current.unusedKeys.length}
${current.unusedKeys.join('\n')}
`, ''
    )

)



