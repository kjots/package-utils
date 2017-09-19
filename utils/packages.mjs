import fs from 'fs';
import path from 'path';
import util from 'util';

import { getDirAsync, getDirSync, getParentDir } from './files';

const [ existsAsync, readFileAsync ] = [ fs.exists, fs.readFile ].map(util.promisify);

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

export async function getPackageJsonAsync(packageDir, encoding = 'utf8') {
    packageDir = path.resolve(packageDir);

    let packageJson = await readFileAsync(path.resolve(packageDir, 'package.json'), { encoding });

    return JSON.parse(packageJson);
}

export function getPackageJsonSync(packageDir, encoding = 'utf8') {
    packageDir = path.resolve(packageDir);

    let packageJson = fs.readFileSync(path.resolve(packageDir, 'package.json'), { encoding });

    return JSON.parse(packageJson);
}