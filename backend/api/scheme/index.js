import * as path from 'path';
import {fileLoader, mergeTypes} from "merge-graphql-schemas";

const rootDir = path.resolve(path.dirname(__dirname), '../backend/api/scheme');
const schemes = fileLoader(rootDir, {recursive: true});
export default [mergeTypes(schemes)];

