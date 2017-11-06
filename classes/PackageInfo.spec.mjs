import chai from 'chai';
import path from 'path';

import PackageInfo from './PackageInfo';

const { expect } = chai;

const testFixturesDir = path.resolve(process.env.TEST_FIXTURES_DIR || 'test/fixtures');

describe('classes', () => {
    describe('PackageInfo', () => {
        describe('forFile()', () => {
            it('should return an instance for the package of the provided file', () => {
                // Given
                let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                // When
                let packageInfo = PackageInfo.forFile(file);

                // Then
                expect(packageInfo).to.be.instanceOf(PackageInfo);
                expect(packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                expect(packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
            });
        });

        describe('constructor()', () => {
            context('when the provided directory is a package directory', () => {
                it('should initialise an instance for the provided directory', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-package');

                    // When
                    let packageInfo = new PackageInfo(packageDir);

                    // Then
                    expect(packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                    expect(packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
                });
            });

            context('when the provided directory is not a package directory', () => {
                it('should throw an error', () => {
                    // Given
                    let packageDir = path.resolve(testFixturesDir, 'test-dir');

                    // When
                    let fn = () => new PackageInfo(packageDir);

                    // Then
                    expect(fn).to.throw(Error, 'Not a package dir: ' + path.resolve(testFixturesDir, 'test-dir'));
                });
            });
        });

        describe('moduleRef()', () => {
            let packageInfo;

            beforeEach(() => packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package')));

            context('when the provided file is in a dependency of the package', () => {
                it('should return the module reference for the provided file relative to the package', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency/test-dependency-dir/test-dependency-file.txt');

                    // When
                    let moduleRef = packageInfo.moduleRef(file);

                    // Then
                    expect(moduleRef).to.equal('test-dependency/test-dependency-dir/test-dependency-file.txt');
                });
            });

            context('when the provided file is not in a dependency of the package', () => {
                it('should return the module reference for the provided file relative to the package', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                    // When
                    let moduleRef = packageInfo.moduleRef(file);

                    // Then
                    expect(moduleRef).to.equal('./test-package-dir/test-package-file.txt');
                });
            });

            context('when the provided file is not in the package', () => {
                it('should return the module reference for the provided file relative to the package', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let moduleRef = packageInfo.moduleRef(file);

                    // Then
                    expect(moduleRef).to.equal('../test-dir/test-subdir/test-file.txt');
                });
            });
        });

        describe('equals()', () => {
            let packageInfo;

            beforeEach(() => packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package')));

            context('when the provided value is a PackageInfo instance', () => {
                context('when package of the provided instance is the same as the package', () => {
                    it('should return true', () => {
                        // Given
                        let otherPackageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package'));

                        // When
                        let result = packageInfo.equals(otherPackageInfo);

                        // Then
                        expect(result).to.be.true;
                    });
                });

                context('when package of the provided instance is not the same as the package', () => {
                    it('should return false', () => {
                        // Given
                        let otherPackageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency'));

                        // When
                        let result = packageInfo.equals(otherPackageInfo);

                        // Then
                        expect(result).to.be.false;
                    });
                });
            });

            context('when the provided value is not a PackageInfo instance', () => {
                it('should return false', () => {
                    // Given
                    let otherPackageInfo = {};

                    // When
                    let result = packageInfo.equals(otherPackageInfo);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('toString()', () => {
            let packageInfo;

            beforeEach(() => packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package')));

            it('should return a string representation of the instance', () => {
                // Given

                // When
                let string = packageInfo.toString();

                // Then
                expect(string).to.equal('PackageInfo(' + path.resolve(testFixturesDir, 'test-package') + ')');
            });
        });
    });
});