import type { FileSelectedCallback, IFileSystem, IFileSystemFileHandle } from "./fs";

export class LocalFs implements IFileSystem {
    static isSupported() {
        return (window as any).showOpenFilePicker !== undefined && (window as any).showSaveFilePicker !== undefined;
    }

    showOpenFilePicker(fileOpenedCallback: FileSelectedCallback) {
        // TODO: Do we want to support multiple files?
        // TODO: Fix FS API types
        return (window as any).showOpenFilePicker().then((handles: FileSystemFileHandle[]) => fileOpenedCallback(new LocalFsFileHandle(handles[0])));
    }

    showSaveFilePicker(suggestedName: string | undefined, fileSavedCallback: FileSelectedCallback): void {
        const opts = {
            suggestedName,
            types: [
                {
                    accept: { 'text/plain': ['.txt'] }
                }
            ]
        }
        // TODO: Fix FS API types
        const handlePromise: Promise<FileSystemFileHandle> = (window as any).showSaveFilePicker(opts);
        handlePromise.then(handle => fileSavedCallback(new LocalFsFileHandle(handle)));
    }
}

export class LocalFsFileHandle implements IFileSystemFileHandle {
    constructor(private _handle: FileSystemFileHandle) { }

    async isSameEntry(other: IFileSystemFileHandle) {
        if (!(other instanceof LocalFsFileHandle)) {
            return false;
        }

        return await this._handle.isSameEntry(other._handle);
    }

    get name() {
        return this._handle.name;
    }

    async getContent() {
        return (await this._handle.getFile()).text();
    }

    async writeContent(content: string) {
        const writable = await this._handle.createWritable()
        await writable.write(content)
        await writable.close()
    }
}
