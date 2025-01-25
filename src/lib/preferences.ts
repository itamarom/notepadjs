import { LocalFs } from "./local-fs";

export enum FsType {
    localFs = 'localFs',
    localStorageFs = 'localStorageFs',
}

const FsTypeKey = 'fsType';

export function getPreferredFsType(): FsType {
    if (!LocalFs.isSupported()) {
        return FsType.localStorageFs;
    }

    const fsType = localStorage.getItem(FsTypeKey);

    if (fsType === FsType.localFs) {
        return FsType.localFs;
    }

    if (fsType === FsType.localStorageFs) {
        return FsType.localStorageFs;
    }

    if (!!fsType) {
        console.warn(`Unknown fsType: ${fsType}`);
    }

    return FsType.localFs;
}

export function setPreferredFsType(fsType: FsType) {
    localStorage.setItem(FsTypeKey, fsType);
}
