export interface CleanerConfiguration {
    projectPath: string;
    translationFilesPath: string;
    includeFiles?: string[],
    overwriteFiles?: boolean,
    outPath: string;
}

export namespace CleanerConfiguration {
    export const DEFAULT = (): CleanerConfiguration => ({
        projectPath: 'src/app',
        translationFilesPath: 'src/assets/i18n',
        includeFiles: ['html', 'ts'],
        overwriteFiles: false,
        outPath: 'src/assets/i18n-cleaned',
    })
}