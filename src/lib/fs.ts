
export interface IFileSystemFileHandle {
    isSameEntry(other: IFileSystemFileHandle): Promise<boolean>;
    getContent(): Promise<string>;
    writeContent(content: string): Promise<void>;
    name: string;
}

export type FileSelectedCallback = (handle: IFileSystemFileHandle) => void
export type OpenFilePickerCallback = (callback: FileSelectedCallback) => void

export type SaveFilePickerCallback = (suggestedName: string | undefined, callback: FileSelectedCallback) => void
export interface IFileSystem {
    showOpenFilePicker(fileOpenedCallback: FileSelectedCallback): void;
    showSaveFilePicker(suggestedName: string | undefined, fileSavedCallback: FileSelectedCallback): void;
}