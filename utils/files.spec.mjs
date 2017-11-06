import chai from 'chai';
import path from 'path';

import { getDirAsync, getDirSync, getParentDir } from './files';

const { expect } = chai;

const testFixturesDir = path.resolve(process.env.TEST_FIXTURES_DIR || 'test/fixtures');

describe('utils', () => {
    describe('files', () => {
        describe('getDirAsync()', () => {
            context('when the provided file is a directory', () => {
                it('should return the provided file', async () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir');

                    // When
                    let dir = await getDirAsync(file);

                    // Then
                    expect(dir).to.equal(path.resolve(testFixturesDir, 'test-dir/test-subdir'));
                });
            });

            context('when the provided file is a file', () => {
                it('should return the directory of the provided file', async () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let dir = await getDirAsync(file);

                    // Then
                    expect(dir).to.equal(path.resolve(testFixturesDir, 'test-dir/test-subdir'));
                });
            });
        });

        describe('getDirSync()', () => {
            context('when the provided file is a directory', () => {
                it('should return the provided file', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir');

                    // When
                    let dir = getDirSync(file);

                    // Then
                    expect(dir).to.equal(path.resolve(testFixturesDir, 'test-dir/test-subdir'));
                });
            });

            context('when the provided file is a file', () => {
                it('should return the directory of the provided file', () => {
                    // Given
                    let file = path.resolve(testFixturesDir, 'test-dir/test-subdir/test-file.txt');

                    // When
                    let dir = getDirSync(file);

                    // Then
                    expect(dir).to.equal(path.resolve(testFixturesDir, 'test-dir/test-subdir'));
                });
            });
        });

        describe('getParentDir()', () => {
            context('when the provided directory is the root directory', () => {
                it('should return undefined', () => {
                    // Given
                    let dir = path.resolve('/');

                    // When
                    let parentDir = getParentDir(dir);

                    // Then
                    expect(parentDir).to.be.undefined;
                });
            });

            context('when the provided directory is not the root directory', () => {
                it('should return the parent of the provided directory', () => {
                    // Given
                    let dir = path.resolve(testFixturesDir, 'test-dir/test-subdir');

                    // When
                    let parentDir = getParentDir(dir);

                    // Then
                    expect(parentDir).to.equal(path.resolve(testFixturesDir, 'test-dir'));
                });
            });
        });
    });
});