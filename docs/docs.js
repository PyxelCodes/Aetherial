const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const swc = require('@swc/core');

// Directory containing the source files
const srcDir = path.join(__dirname, '..', 'src');

// Output directory for the documentation
const outputDir = path.join(__dirname, 'output');

// Temporary directory for compiled JavaScript files
const tempDir = path.join(__dirname, 'temp');

// Ensure the output and temp directories exist
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

// Clean up old documentation files
const cleanOldDocs = (dir) => {
	if (fs.existsSync(dir)) {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				cleanOldDocs(filePath);
			} else {
				fs.unlinkSync(filePath);
			}
		});
	}
};
cleanOldDocs(outputDir);

// Function to generate documentation for a file
const generateDocs = async (filePath, relativePath) => {
	const outputFilePath = path.join(outputDir, `${relativePath}.md`);
	const outputDirPath = path.dirname(outputFilePath);

	// Ensure the output directory exists
	if (!fs.existsSync(outputDirPath)) {
		fs.mkdirSync(outputDirPath, { recursive: true });
	}

	const docs = await jsdoc2md.render({ files: `${filePath}` });
	fs.writeFileSync(outputFilePath, docs);
	console.log(`Documentation generated for ${filePath}`);
};

// Function to compile TypeScript files to JavaScript using swc
const compileTsToJs = async (filePath, relativePath) => {
	const tempFilePath = path.join(tempDir, `${relativePath}.js`);
	const tempDirPath = path.dirname(tempFilePath);

	// Ensure the temp directory exists
	if (!fs.existsSync(tempDirPath)) {
		fs.mkdirSync(tempDirPath, { recursive: true });
	}

	try {
		const { code } = await swc.transformFile(filePath, { 
			jsc: { 
				target: 'es2015', 
				parser: { syntax: 'typescript' }, 
				transform: { 
					react: { 
						pragma: 'React.createElement', 
						pragmaFrag: 'React.Fragment', 
						throwIfNamespace: true, 
						development: false, 
						useBuiltIns: false 
					} 
				} 
			}, 
			minify: false, 
			sourceMaps: false, 
			isModule: true, 
			module: { 
				type: 'commonjs', 
				strict: true, 
				strictMode: true, 
				lazy: false, 
				noInterop: false 
			}
		});
		fs.writeFileSync(tempFilePath, code);
		return tempFilePath;
	} catch (err) {
		throw err;
	}
};

// Function to check if a file should be ignored
const shouldIgnoreFile = (filePath) => {
	const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
	return firstLine.trim() === '// docs-ignore';
};

// Read all files in the src directory recursively
const readDirRecursive = async (dir, relativeDir = '') => {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		const relativeFilePath = path.join(relativeDir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			await readDirRecursive(filePath, relativeFilePath);
		} else if (file.endsWith('.ts') && !shouldIgnoreFile(filePath)) {
			try {
				const tempFilePath = await compileTsToJs(filePath, relativeFilePath.replace(/\.ts$/, ''));
				await generateDocs(tempFilePath, relativeFilePath.replace(/\.ts$/, ''));
				fs.unlinkSync(tempFilePath); // Clean up the temporary file
			} catch (err) {
				console.error(`Error processing ${filePath}:`, err);
			}
		}
	}
	await cleanTempDir(tempDir);
};

// Clean up temporary directory after processing
const cleanTempDir = (dir) => {
	if (fs.existsSync(dir)) {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				cleanTempDir(filePath);
			} else {
				fs.unlinkSync(filePath);
			}
		});
		fs.rmdirSync(dir);
	}
};

readDirRecursive(srcDir);
