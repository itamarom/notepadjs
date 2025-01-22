export interface IFileSystem {
    showOpenFilePicker(callback: (handles: IFileSystemFileHandle[]) => void): Promise<void>;
    showSaveFilePicker(suggestedName?: string): Promise<IFileSystemFileHandle>;
}

export interface IFileSystemFileHandle {
    isSameEntry(other: IFileSystemFileHandle): Promise<boolean>;
    getContent(): Promise<string>;
    writeContent(content: string): Promise<void>;
    name: string;
}
