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

export function isPackageFile(packageDir, file) {
    packageDir = path.resolve(packageDir);
    file = path.resolve(file);

    return file.startsWith(packageDir + path.sep);
}

export function isLibraryFile(packageDir, file) {
    packageDir = path.resolve(packageDir);
    file = path.resolve(file);

    let nodeModulesDir = path.resolve(packageDir, 'node_modules');

    return file.startsWith(nodeModulesDir + path.sep);
}

export function getModuleRef(packageDir, file) {
    packageDir = path.resolve(packageDir);
    file = path.resolve(file);

    let nodeModulesDir = path.resolve(packageDir, 'node_modules');
    let moduleRef;

    if (file.startsWith(nodeModulesDir + path.sep)) {
        moduleRef = path.relative(nodeModulesDir, file);
    }
    else if (file.startsWith(packageDir + path.sep)) {
        moduleRef = `./${ path.relative(packageDir, file) }`;
    }
    else {
        moduleRef = path.relative(packageDir, file);
    }

    return moduleRef.replace(/\\/g, '/');
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