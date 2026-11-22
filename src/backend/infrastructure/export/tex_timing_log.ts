import {app} from "electron";

interface TimingLogEntry {
    completeTime: number;
    promiseTime: number;
    compileTime: number;
    writeTime: number;
}

const toStr = (e: TimingLogEntry): string => {
    return `{total: ${e.completeTime.toFixed()} promise: ${e.promiseTime.toFixed()} compile: ${e.compileTime.toFixed()} write: ${e.writeTime.toFixed()}}`
}

const timingLog: TimingLogEntry[] = [];
const getTimingLogAverage = (): TimingLogEntry => {
    const avg: TimingLogEntry = {
        compileTime: 0,
        completeTime: 0,
        promiseTime: 0,
        writeTime: 0
    }
    if (timingLog.length == 0) {
        return avg;
    }

    for (const e of timingLog) {
        avg.completeTime += e.completeTime;
        avg.promiseTime  += e.promiseTime;
        avg.writeTime    += e.writeTime;
        avg.compileTime  += e.compileTime;
    }

    avg.completeTime /= timingLog.length;
    avg.promiseTime  /= timingLog.length;
    avg.writeTime    /= timingLog.length;
    avg.compileTime  /= timingLog.length;

    return avg;
}

const getTimingLogMax = (): TimingLogEntry => {
    const max: TimingLogEntry = {
        compileTime: 0,
        completeTime: 0,
        promiseTime: 0,
        writeTime: 0
    }
    if (timingLog.length == 0) {
        return max;
    }

    for (const e of timingLog) {
        if (max.completeTime < e.completeTime) {
            max.completeTime = e.compileTime;
        }
        if (max.promiseTime < e.promiseTime) {
            max.promiseTime = e.promiseTime;
        }
        if (max.writeTime < e.writeTime) {
            max.writeTime = e.writeTime;
        }
        if (max.compileTime < e.compileTime) {
            max.compileTime = e.compileTime;
        }
    }

    return max;
}

const skipLogging = true;

export const logTiming = (fnStart: Date, compStart: Date, compDone: Date, writeDone: Date, cleanupDone: Date): void => {
    if (app.isPackaged || skipLogging) {
        return;
    }

    const entry: TimingLogEntry = {
        completeTime: cleanupDone.getTime() - fnStart.getTime(),
        promiseTime: writeDone.getTime() - fnStart.getTime(),
        compileTime: compDone.getTime() - compStart.getTime(),
        writeTime: writeDone.getTime() - compDone.getTime(),
    }
    timingLog.push(entry);

    console.log(`TeX: Timing of this call was ${toStr(entry)}`);
    console.log(`TeX: Timing of average call  ${toStr(getTimingLogAverage())}`);
    console.log(`TeX: Timing of worst call    ${toStr(getTimingLogMax())}`);
}
