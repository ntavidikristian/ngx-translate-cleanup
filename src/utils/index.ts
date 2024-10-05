import * as fs from 'fs';
import * as glob from 'glob';


export const Utils =  {
    extractKeys,
    keysNotUsedInProject,
    buildTranslation,    
}

function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
    let keys: string[] = [];

    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            keys = keys.concat(extractKeys(obj[key], `${prefix}${key}.`));
        } else {
            keys.push(`${prefix}${key}`);
        }
    } 
    return keys;
}

function keysThatAreUsedInFile(filePath: string, listOfKeysToSearchFor: string[]): string[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const keysIncluded = listOfKeysToSearchFor.filter(
        key => fileContent.includes(key)
    )

    return keysIncluded;
}

function keysNotUsedInProject(listOfKeysToSearchFor: string[], projectPath: string, includeFiles: string[]): string[] {

    let keysNotFoundInTheProject = listOfKeysToSearchFor;
    const pattern = `${projectPath}/**/{${includeFiles?.map(x => `*.${x}`).join(',')}}`
    const files = glob.sync(pattern, { nodir: true });
    for (const file of files) {
        const keysUsed = keysThatAreUsedInFile(file, keysNotFoundInTheProject);
        keysNotFoundInTheProject = keysNotFoundInTheProject.filter(key => !keysUsed.includes(key));
    }

    return keysNotFoundInTheProject;
}

function buildTranslation(sourceTranslationObject: Record<string, any>, prefix: string, targetTranslationObject: Record<string, any>, unusedKeys: Set<string>) {

    if (!(typeof sourceTranslationObject === 'object')) {
        return;
    }

    for (const [key, value] of Object.entries(sourceTranslationObject)) {
        const currentKey = `${prefix}${key}`;

        if (unusedKeys.has(currentKey)) {
            continue;
        }

        if (typeof value === 'string') {
            targetTranslationObject[key] = value;
        }else if (typeof value === 'object'){
            // this key is used
            const child = {};
    
            buildTranslation(sourceTranslationObject[key], `${prefix}${key}.`, child, unusedKeys);
            if (Object.keys(child).length) {
                targetTranslationObject[key] = child;
            }
        }


    }
}