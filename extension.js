const vscode = require('vscode');
const cp = require("child_process");


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations,extension "fxml-viewer" is now active!');

	let disposable = vscode.commands.registerCommand('extension.openFXML', (event) => {
		if (getSceneBuilderHome()) {
			let fxmlPath = event.path;
			let sceneBuilderHome = getSceneBuilderHome();
			viewFXML(fxmlPath, sceneBuilderHome);
			
		}
		else{
			vscode.window.showErrorMessage('please set ScenceBuilder.Home');
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function getSceneBuilderHome() {
	return vscode.workspace.getConfiguration().get('scenebuilder.home');
}

function viewFXML(filePath, exePath) {
	cp.execFile(exePath, [filePath], {}, (error, stdout, stderr) => {
		if (error) {
			console.log('exec error: ' + error);
			vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
		}
	});
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
