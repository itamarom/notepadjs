import type { IFileSystem, IFileSystemFileHandle, OpenFilePickerCallback, SaveFilePickerCallback } from "./fs";

const FileKeyPrefix = 'file/';

export class LocalStorageFs implements IFileSystem {
    constructor(private storage: Storage, 
        public showOpenFilePicker: OpenFilePickerCallback, 
        public showSaveFilePicker: SaveFilePickerCallback) {
    }

    public listFiles(): IFileSystemFileHandle[] {
        const fileKeys = Object.keys(this.storage).filter(key => key.startsWith(FileKeyPrefix));
        return fileKeys.map(key => new LocalStorageFileHandle(this.storage, key));
    }

    public getHandle(fileName: string): IFileSystemFileHandle {
        return new LocalStorageFileHandle(this.storage, `${FileKeyPrefix}${fileName}`);
    }
}

export class LocalStorageFileHandle implements IFileSystemFileHandle {
    constructor(private _storage: Storage, private _key: string) { }

    async isSameEntry(other: IFileSystemFileHandle) {
        if (!(other instanceof LocalStorageFileHandle)) {
            return false;
        }

        return this._key === other._key;
    }

    get name() {
        return this._key.substring(FileKeyPrefix.length);
    }

    async getContent() {
        return this._storage.getItem(this._key) || "";
    }

    async writeContent(content: string) {
        this._storage.setItem(this._key, content);
    }
}