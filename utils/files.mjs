import fs from 'fs';
import path from 'path';
import util from 'util';

const statAsync = util.promisify(fs.stat);

export async function getDirAsync(file) {
    file = path.resolve(file);

    let stats = await statAsync(file);

    return stats.isDirectory() ? file : path.dirname(file);
}

export function getDirSync(file) {
    file = path.resolve(file);

    let stats = fs.statSync(file);

    return stats.isDirectory() ? file : path.dirname(file);
}

export function getParentDir(dir) {
    let parentDir = path.resolve(dir, '..');

    return parentDir !== dir ? parentDir : undefined;
}