export interface CleanerConfiguration {
    projectPath: string;
    translationFilesPath: string;
    includeFiles: string[],
    outPath: string;
}

export namespace CleanerConfiguration {
    export const DEFAULT = (): CleanerConfiguration => ({
        projectPath: 'src/app',
        translationFilesPath: 'src/assets/i18n',
        includeFiles: ['html', 'ts'],
        outPath: 'src/assets/i18n-cleaned',
    })
}