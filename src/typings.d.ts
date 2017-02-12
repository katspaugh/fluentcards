// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

interface Window {
  DEMO_BOOKS: any;
  fluentcards: any;
  ga: any;
  speechSynthesis: any;
  SpeechSynthesisUtterance: any;
}

declare module 'filesaver' {
    var saveAs: any;
    export = saveAs;
}

declare module 'sql.js' {
    var SQL: any;
    export = SQL;
}
