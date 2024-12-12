# ngx-translate-cleanup

This is a tool that helps you cleanup unused keys in your ngx-translate  .json translation files.

## Usage

You can run it via `npx @kntavidi/ngx-translate-cleanup` . 

## cleaner-config.json
The tool will look for a file named `cleaner-config.json` at the root level of your project. It if finds such a file it will overwrite the default options with the options that are defined in this .json file.

## Config options
The properties that can be parameterized through the `cleaner-config.json` file are:

- **projectPath** (defaults to 'src/app'):  
You can define that path that you what to limit your search to

- **translationFilesPath** (defaults to 'src/assets/i18n'):  
The path to your .json translation files
- **includeFiles** (defaults to ['html', 'ts']): Limit your search to specific type of files
- **outPath**  (defaults to 'src/assets/i18n-cleaned'):  
The path that the cleaned up files will be placed to. If you set this to the  same path as your **projectPath**, then the .json translation files will be overwritten.


## Example of cleaner-config.json

```
{
    "projectPath":"src",
    "translationFilesPath": "translation-files"
}
```


### Sample run

![sample run image](https://github.com/ntavidikristian/ngx-translate-cleanup/blob/main/sample_run.png)

