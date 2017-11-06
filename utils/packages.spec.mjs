import chai from 'chai';
import path from 'path';
import tmp from 'tmp';
import util from 'util';

import { isPackageDirAsync, isPackageDirSync, getPackageDirAsync, getPackageDirSync, isPackageFile, isLibraryFile,
    getModuleRef, getPackageJsonAsync, getPackageJsonSync } from './packages';

const tmpFileAsync = util.promisify(tmp.file);

const { expect } = chai;

const testFixturesDir = path.resolve(process.env.TEST_FIXTURES_DIR || 'test/fixtures');

describe('utils', () => {
    describe('packages', () => {
        describe('isPackageDirAsync()', () => {
            context('when the provided directory is a package directory', () => {
                it('should return true', async () => {
                    // Given
                    let dir = path.resolve(testFixturesDir, 'test-package');

                    // When
                    let result = await isPackageDirAsync(dir);

                    // Then
                    expect(result).to.be.true;
                });
            });

            context('when the provided directory is not a package directory', () => {
                it('should return false', async () => {
                    // Given
                    let dir = path.resolve(testFixturesDir, 'test-dir');

                    // When
                    let result = await isPackageDirAsync(dir);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('isPackageDirSync()', () => {
            context('when the provided directory is a package directory', () => {
                it('should return true', () => {
                    // Given
                    let dir = path.resolve(testFixturesDir, 'test-package');

                    // When
                    let result = isPackageDirSync(dir);

                    // Then
                    expect(result).to.be.true;
                });
            });

            context('when the provided directory is not a package directory', () => {
                it('should return false', () => {
                    // Given
                    let dir = path.resolve(testFixturesDir, 'test-dir');

                    // When
                    let result = isPackageDirSync(dir);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('getPackageDirAsync()', () => {
            context('when the provided file is in a package', () => {
                it('should return the package directory of the provided file', async () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let packageDir = await getPackageDirAsync(file);

                    // Then
                    expect(packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                });
            });

            context('when the provided file is not in a package', () => {
                it('should return undefined', async () => {
                    // Given
                    let file = await tmpFileAsync();

                    // When
                    let packageDir = await getPackageDirAsync(file);

                    // Then
                    expect(packageDir).to.be.undefined;
                });
            });
        });

        describe('getPackageDirSync()', () => {
            context('when the provided file is in a package', () => {
                it('should return the package directory of the provided file', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let packageDir = getPackageDirSync(file);

                    // Then
                    expect(packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                });
            });

            context('when the provided file is not in a package', () => {
                it('should return undefined', () => {
                    // Given
                    let file = tmp.fileSync().name;

                    // When
                    let packageDir = getPackageDirSync(file);

                    // Then
                    expect(packageDir).to.be.undefined;
                });
            });
        });

        describe('isPackageFile()', () => {
            context('when the provided file is in the provided package', () => {
                it('should return true', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let result = isPackageFile(packageDir, file);

                    // Then
                    expect(result).to.be.true;
                });
            });

            context('when the provided file is not in the provided package', () => {
                it('should return false', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let result = isPackageFile(packageDir, file);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('isLibraryFile()', () => {
            context('when the provided file is in a dependency of the provided package', () => {
                it('should return true', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency/test-dependency-dir/test-dependency-file.txt');

                    // When
                    let result = isLibraryFile(packageDir, file);

                    // Then
                    expect(result).to.be.true;
                });
            });

            context('when the provided file is not in a dependency of the provided package', () => {
                it('should return false', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let result = isLibraryFile(packageDir, file);

                    // Then
                    expect(result).to.be.false;
                });
            });

            context('when the provided file is not in the provided package', () => {
                it('should return false', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let result = isLibraryFile(packageDir, file);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('getModuleRef()', () => {
            context('when the provided file is in a dependency of the provided package', () => {
                it('should return the module reference for the provided file relative to the provided package', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency/test-dependency-dir/test-dependency-file.txt');

                    // When
                    let moduleRef = getModuleRef(packageDir, file);

                    // Then
                    expect(moduleRef).to.equal('test-dependency/test-dependency-dir/test-dependency-file.txt');
                });
            });

            context('when the provided file is not in a dependency of the provided package', () => {
                it('should return the module reference for the provided file relative to  the provided package', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let moduleRef = getModuleRef(packageDir, file);

                    // Then
                    expect(moduleRef).to.equal('./test-package-dir/test-package-file.txt');
                });
            });

            context('when the provided file is not in the provided package', () => {
                it('should return the module reference for the provided file relative to  the provided package', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let moduleRef = getModuleRef(packageDir, file);

                    // Then
                    expect(moduleRef).to.equal('../test-dir/test-subdir/test-file.txt');
                });
            });
        });

        describe('getPackageJsonAsync()', () => {
            it('should return the contents of the package.json file of the provided package', async () => {
                // Given
                let packageDir = path.resolve(testFixturesDir, 'test-package');

                // When
                let packageJson = await getPackageJsonAsync(packageDir);

                // Then
                expect(packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
            });
        });

        describe('getPackageJsonSync()', () => {
            it('should return the contents of the package.json file of the provided package', () => {
                // Given
                let packageDir = path.resolve(testFixturesDir, 'test-package');

                // When
                let packageJson = getPackageJsonSync(packageDir);

                // Then
                expect(packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
            });
        });
    });
});