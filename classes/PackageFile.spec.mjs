import chai from 'chai';
import path from 'path';

import PackageFile from './PackageFile';
import PackageInfo from './PackageInfo';

const { expect } = chai;

const testFixturesDir = path.resolve(process.env.TEST_FIXTURES_DIR || 'test/fixtures');

describe('classes', () => {
    describe('PackageFile', () => {
        describe('forFile()', () => {
            it('should return an instance for the package and path of the provided file', () => {
                // Given
                let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                // When
                let packageFile = PackageFile.forFile(file);

                // Then
                expect(packageFile.packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                expect(packageFile.packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
                expect(packageFile.packagePath).to.equal('test-package-dir/test-package-file.txt');
                expect(packageFile.file).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt'));
                expect(packageFile.dir).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir'));
            });
        });

        describe('constructor()', () => {
            context('when the provided package info value is a PackageInfo instance', () => {
                context('when the provided package path value is a relative path', () => {
                    context('when the provided package path value is empty', () => {
                        it('should initialise an instance for the provided package info and path', () => {
                            // Given
                            let packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package'));
                            let packagePath = '';

                            // When
                            let packageFile = new PackageFile(packageInfo, packagePath);

                            // Then
                            expect(packageFile.packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                            expect(packageFile.packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
                            expect(packageFile.packagePath).to.equal('');
                            expect(packageFile.file).to.equal(path.resolve(testFixturesDir, 'test-package'));
                            expect(packageFile.dir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                        });
                    });

                    context('when the provided package path value is a path to a file', () => {
                        it('should initialise an instance for the provided package info and path', () => {
                            // Given
                            let packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package'));
                            let packagePath = 'test-package-dir/test-package-file.txt';

                            // When
                            let packageFile = new PackageFile(packageInfo, packagePath);

                            // Then
                            expect(packageFile.packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                            expect(packageFile.packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
                            expect(packageFile.packagePath).to.equal('test-package-dir/test-package-file.txt');
                            expect(packageFile.file).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt'));
                            expect(packageFile.dir).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir'));
                        });
                    });

                    context('when the provided package path value is a path to a directory', () => {
                        it('should initialise an instance for the provided package info and path', () => {
                            // Given
                            let packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package'));
                            let packagePath = 'test-package-dir';

                            // When
                            let packageFile = new PackageFile(packageInfo, packagePath);

                            // Then
                            expect(packageFile.packageInfo.packageDir).to.equal(path.resolve(testFixturesDir, 'test-package'));
                            expect(packageFile.packageInfo.packageJson).to.eql({ name: 'test-package', version: '1.0.0', dependencies: { 'test-dependency': '1.0.0' } });
                            expect(packageFile.packagePath).to.equal('test-package-dir');
                            expect(packageFile.file).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir'));
                            expect(packageFile.dir).to.equal(path.resolve(testFixturesDir, 'test-package/test-package-dir'));
                        });
                    });
                });

                context('when the provided package path value is not a relative path', () => {
                    it('should throw an error', () => {
                        // Given
                        let packageInfo = new PackageInfo(path.resolve(testFixturesDir, 'test-package'));
                        let packagePath = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                        // When
                        let fn = () => new PackageFile(packageInfo, packagePath);

                        // Then
                        expect(fn).to.throw(Error, 'packagePath must be a relative path');
                    });
                });
            });

            context('when the provided package info value is not a PackageInfo instance', () => {
                it('should throw an error', () => {
                    // Given
                    let packageInfo = {};
                    let packagePath = 'test-package-dir/test-package-file.txt';

                    // When
                    let fn = () => new PackageFile(packageInfo, packagePath);

                    // Then
                    expect(fn).to.throw(TypeError, 'packageInfo must be an instance of PackageInfo');
                });
            });
        });

        describe('moduleRef()', () => {
            let packageFile;

            beforeEach(() => packageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir/test-package-file.txt'));

            context('when the provided file is a PackageFile instance', () => {
                context('when the provided file is a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency')), '');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('test-dependency');
                    });
                });

                context('when the provided file is in a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency')), 'test-dependency-dir/test-dependency-file.txt');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('test-dependency/test-dependency-dir/test-dependency-file.txt');
                    });
                });

                context('when the provided file is not in a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir/test-package-file.txt');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('./test-package-file.txt');
                    });
                });
            });

            context('when the provided file is not a PackageFile instance', () => {
                context('when the provided file is a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('test-dependency');
                    });
                });

                context('when the provided file is in a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency/test-dependency-dir/test-dependency-file.txt');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('test-dependency/test-dependency-dir/test-dependency-file.txt');
                    });
                });

                context('when the provided file is not in a dependency of the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = path.resolve(testFixturesDir, 'test-package/test-package-dir/test-package-file.txt');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('./test-package-file.txt');
                    });
                });

                context('when the provided file is not in the package', () => {
                    it('should return the module reference for the provided file relative to the package file', () => {
                        // Given
                        let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                        // When
                        let moduleRef = packageFile.moduleRef(file);

                        // Then
                        expect(moduleRef).to.equal('../../test-dir/test-subdir/test-file.txt');
                    });
                });
            });
        });

        describe('equals()', () => {
            let packageFile;

            beforeEach(() => packageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir/test-package-file.txt'));

            context('when the provided value is a PackageFile instance', () => {
                context('when the package info of the provided instance is the same as the package info', () => {
                    context('when the package path of the provided instance is the same as the package path', () => {
                        it('should return true', () => {
                            // Given
                            let otherPackageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir/test-package-file.txt');

                            // When
                            let result = packageFile.equals(otherPackageFile);

                            // Then
                            expect(result).to.be.true;
                        });
                    });

                    context('when the package path of the provided instance is not the same as the package path', () => {
                        it('should return false', () => {
                            // Given
                            let otherPackageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir');

                            // When
                            let result = packageFile.equals(otherPackageFile);

                            // Then
                            expect(result).to.be.false;
                        });
                    });
                });

                context('when the package info of the provided instance is not the same as the package info', () => {
                    it('should return false', () => {
                        // Given
                        let otherPackageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package/node_modules/test-dependency')), 'test-dependency-dir/test-dependency-file.txt');

                        // When
                        let result = packageFile.equals(otherPackageFile);

                        // Then
                        expect(result).to.be.false;
                    });
                });
            });

            context('when the provided value is not a PackageFile instance', () => {
                it('should return false', () => {
                    // Given
                    let otherPackageFile = {};

                    // When
                    let result = packageFile.equals(otherPackageFile);

                    // Then
                    expect(result).to.be.false;
                });
            });
        });

        describe('toString()', () => {
            let packageFile;

            beforeEach(() => packageFile = new PackageFile(new PackageInfo(path.resolve(testFixturesDir, 'test-package')), 'test-package-dir/test-package-file.txt'));

            it('should return a string representation of the instance', () => {
                // Given

                // When
                let string = packageFile.toString();

                // Then
                expect(string).to.equal('PackageFile(PackageInfo(' + path.resolve(testFixturesDir, 'test-package') + '),test-package-dir/test-package-file.txt)');
            });
        });
    });
});