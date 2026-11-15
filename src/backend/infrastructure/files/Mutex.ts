
type CloseFileFunction = () => void;
type ServeCloseFileFunction = () => void;

interface MutexElement {
    blocked: boolean;
    queue: ServeCloseFileFunction[];
}

export default class Mutex {
    private mutex: Map<string, MutexElement>;

    constructor() {
        this.mutex = new Map<string, MutexElement>();
    }

    /**
     * Block the file to which the given path belongs to.
     * Once the Promise fulfills with the CloseFileFunction,
     * the file is blocked for your operations.
     *
     * Always call the CloseFileFunction after
     * you are done manipulating the file! Otherwise,
     * you will block other processes from
     * accessing this file.
     * @param path The path to block. (case-sensitive)
     */
    async blockFile(path: string): Promise<CloseFileFunction> {
        const elem = this.mutex.get(path);
        let unblocked = false;
        const closeFileFn: CloseFileFunction = () => {
            if (!unblocked) {
                this.unblockFile(path);
                unblocked = true;
            }
        };

        if (!elem) {
            this.mutex.set(path, {
                blocked: true,
                queue: [],
            });
            return closeFileFn;
        }
        if (elem.blocked) {
            return new Promise<CloseFileFunction>(resolve => elem.queue.push(() => resolve(closeFileFn)));
        }
        elem.blocked = true;
        return closeFileFn;
    }

    private unblockFile(path: string) {
        const elem = this.mutex.get(path);
        if (!elem) {
            return;
        }
        const serveFirst: ServeCloseFileFunction | undefined = elem.queue.shift();
        if (!serveFirst) {
            elem.blocked = false;
            return;
        }
        serveFirst();
    }
}
