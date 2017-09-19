import path from 'path';

import { getPackageDirSync as getPackageDir, isPackageDirSync as isPackageDir } from '../utils/packages';

export default class PackageInfo {
    static forFile(file) {
        let packageDir = getPackageDir(file);

        return new PackageInfo(packageDir);
    }

    constructor(packageDir) {
        packageDir = path.resolve(packageDir);

        if (!isPackageDir(packageDir)) {
            throw new Error(`Not a package dir: ${ packageDir }`);
        }

        Object.assign(this, { packageDir });
    }
}