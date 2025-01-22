import type { IFileSystem, IFileSystemFileHandle } from "./fs";

export class LocalFs implements IFileSystem {
    static isSupported() {
        return (window as any).showOpenFilePicker !== undefined && (window as any).showSaveFilePicker !== undefined;
    }

    showOpenFilePicker(callback: (handles: LocalFsFileHandle[]) => void) {
        return (window as any).showOpenFilePicker().then((handles: FileSystemFileHandle[]) => callback(handles.map(handle => new LocalFsFileHandle(handle))));
    }

    async showSaveFilePicker(suggestedName?: string): Promise<IFileSystemFileHandle> {
        const opts = {
            suggestedName,
            types: [
                {
                    accept: { 'text/plain': ['.txt'] }
                }
            ]
        }
        // TODO: Fix FS API types
        return await (window as any).showSaveFilePicker(opts)
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
