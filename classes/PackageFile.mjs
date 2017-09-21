import path from 'path';

import PackageInfo from './PackageInfo';

import { getDirSync as getDir } from '../utils/files';
import { isLibraryFile } from '../utils/packages';

export default class PackageFile {
    static forFile(file) {
        file = path.resolve(file);

        let packageInfo = PackageInfo.forFile(file);
        let packagePath = path.relative(packageInfo.packageDir, file);

        return new PackageFile(packageInfo, packagePath);
    }

    constructor(packageInfo, packagePath) {
        if (!(packageInfo instanceof PackageInfo)) {
            throw new TypeError('packageInfo must be an instance of PackageInfo');
        }

        if (path.isAbsolute(packagePath)) {
            throw new Error('packagePath must be a relative path');
        }

        let file = path.resolve(packageInfo.packageDir, packagePath);
        let dir = getDir(file);

        Object.assign(this, { packageInfo, packagePath, file, dir });
    }

    moduleRef(file) {
        let packageFile = file instanceof PackageFile ? file : PackageFile.forFile(file);

        let moduleRef;
        if (isLibraryFile(this.packageInfo.packageDir, packageFile.file)) {
            moduleRef = packageFile.packageInfo.packageJson.name +
                (packageFile.packagePath !== '' ? `/${ packageFile.packagePath}` : '');
        }
        else if (packageFile.file.startsWith(this.dir + path.sep)) {
            moduleRef = `./${ path.relative(this.dir, packageFile.file) }`;
        }
        else {
            moduleRef = path.relative(this.dir, packageFile.file);
        }

        return moduleRef.replace(/\\/g, '/');
    }

    equals(that) {
        return that instanceof PackageFile &&
            that.packageInfo.equals(this.packageInfo) &&
            that.packagePath === this.packagePath;
    }

    toString() {
        return `PackageFile(${ this.packageInfo },${ this.packagePath })`;
    }
}