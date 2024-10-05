export interface TranslationCleanupTask{
    sourceTranslation: Record<string, any>;
    fileName: string;
    cleanedTranslation: Record<string, any>;
}