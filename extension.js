/*
 * @Author: lzw-723
 * @Date: 2020-03-06 15:28:19
 * @LastEditors: lzw-723
 * @LastEditTime: 2020-06-27 11:04:01
 * @Description: 描述信息
 * @FilePath: \fxml-viewer\extension.js
 */
const vscode = require('vscode');
const cp = require("child_process");
const regedit = require('regedit');
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('fxml-viewer.openFXML', (event) => {
		if (getSceneBuilderExecutable() || autoFindPath()) {
			let fxmlPath = event.path;
			let sceneBuilderHome = getSceneBuilderExecutable();
			console.error(fxmlPath + '----===---' + sceneBuilderHome);
			viewFXML(fxmlPath, sceneBuilderHome);
		}
		else {
			vscode.window.showErrorMessage('please set SceneBuilder.executable');
			// console.error(autoFindPath());
			
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function autoFindPath() {
	let path;
	if (vscode.workspace.getConfiguration().get('fxml-viewer.autoFindPath')) {
		console.log('reg');
		
		regedit.list(['HKLM\\SOFTWARE\\Gluon\\SceneBuilder']).on('data', function (entry) {
			let keys01 = entry.data.keys;
			keys01.forEach(function (key) {

				regedit.list(['HKLM\\SOFTWARE\\Gluon\\SceneBuilder\\' + key]).on('data', function (e) {

					let sum_key = e.key;
					var keys02 = e.data.keys;
					if (keys02) {

						keys02.forEach(function (key) {

							if (key == 'ApplicationPath') {

								regedit.list([sum_key + '\\' + key]).on('data', function (e) {

									let val = e.data.values;
									let builder_path = val[""].value;

									path = builder_path + "\\SceneBuilder.exe";
									vscode.workspace.getConfiguration().update('fxml-viewer.SceneBuilder.executable', path, true);
								console.log(path);
								
								});
							}
						});
					}
				});
			})
		});
	}
}

function getSceneBuilderExecutable() {
	let executable = vscode.workspace.getConfiguration().get('fxml-viewer.SceneBuilder.executable');
	if (executable) {

	} else {
		executable = autoFindPath();
	}
	return executable;
}

function viewFXML(filePath, exePath) {

	cp.execFile(exePath, [filePath], {}, (error, stdout, stderr) => {
		if (error) {
			console.log('exec error: ' + error);
			vscode.window.showErrorMessage('SceneBuilder couldn\'t opened!');
		}
	});
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
