import fs from 'fs';
import path from 'path';
import util from 'util';

const existsAsync = util.promisify(fs.exists);

import { getDirAsync, getDirSync, getParentDir } from './files';

export async function isPackageDirAsync(dir) {
    return existsAsync(path.resolve(dir, 'package.json'));
}

export function isPackageDirSync(dir) {
    return fs.existsSync(path.resolve(dir, 'package.json'));
}

export async function getPackageDirAsync(file) {
    file = path.resolve(file);

    for (let dir = await getDirAsync(file); dir !== undefined; dir = getParentDir(dir)) {
        if (await isPackageDirAsync(dir)) {
            return dir;
        }
    }
}

export function getPackageDirSync(file) {
    file = path.resolve(file);

    for (let dir = getDirSync(file); dir !== undefined; dir = getParentDir(dir)) {
        if (isPackageDirSync(dir)) {
            return dir;
        }
    }
}