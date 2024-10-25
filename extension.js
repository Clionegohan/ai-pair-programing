
const vscode = require('vscode');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */

async function askAI(prompt) {
	const apiKey = 'AIzaSyBwZKCWAal-TKYmY3Cj4XWYG-Bdwh7s0nQ';
	const response = await axios.post(
		'https://api.gemini.com/v1/completion',
		{ prompt: prompt, max_tokens: 100},
		{ headers: { Authorization: `Bearer ${apiKey}`}}
	);
	return response.data.choices[0].text.trim();
	
}


function activate(context) {

	console.log('Congratulations, your extension "ai-pair-programing" is now active!');

	const disposable = vscode.commands.registerCommand('ai-pair-programing.helloWorld', function () {
		
		vscode.window.showInformationMessage('Hello World from ai-pair-programing!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
