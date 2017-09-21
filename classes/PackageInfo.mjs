import path from 'path';

import { getPackageDirSync as getPackageDir, isPackageDirSync as isPackageDir, getPackageJsonSync as getPackageJson, getModuleRef } from '../utils/packages';

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

        let packageJson = getPackageJson(packageDir);

        Object.assign(this, { packageDir, packageJson });
    }

    moduleRef(file) {
        return getModuleRef(this.packageDir, file);
    }
}