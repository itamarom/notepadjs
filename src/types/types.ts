import type { IFileSystemFileHandle } from "@/lib/fs"

export interface Tab {
    id: string
    handle?: IFileSystemFileHandle
    title?: string
    unsaved: boolean
    content: string
}
