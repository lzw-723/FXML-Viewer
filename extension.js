/*
 * @Author: lzw-723
 * @Date: 2020-03-06 15:28:19
 * @LastEditTime: 2021-06-19 19:31:04
 */
const vscode = require('vscode');
const cp = require("child_process");
const fs = require("fs");
const { Uri } = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('fxml-viewer.openFXML', (event) => {
		if (getSceneBuilderExecutable()) {
			let fxmlPath = event.path;
			let sceneBuilderHome = getSceneBuilderExecutable();
			console.log('file: ' + fxmlPath)
			console.log('exe: ' + sceneBuilderHome)
			if (enableAutoSave()) {
				console.log('AutoSave---')
				save(fxmlPath);
			}
			showFXML(fxmlPath, sceneBuilderHome);
		}
		else {
			vscode.window.showErrorMessage('please set SceneBuilder.executable');
			// console.error(autoFindPath());

		}
	});

	context.subscriptions.push(disposable);
}
// exports.activate = activate;


function getSceneBuilderExecutable() {
	let executable = vscode.workspace.getConfiguration().get('fxml-viewer.SceneBuilder.executable');
	return executable;
}

function showFXML(filePath, exePath) {

	cp.execFile(exePath, [filePath], {}, (error, stdout, stderr) => {
		if (error) {
			console.log('exec error: ' + error);
			vscode.window.showErrorMessage('SceneBuilder couldn\'t opened!');
		}
	});
}

function enableAutoSave(){
	return vscode.workspace.getConfiguration().get('fxml-viewer.enableAutoSave');
}

function save(filePath) {
	let uri = Uri.file(filePath);
	let success = vscode.commands.executeCommand('vscode.file.save', uri);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
