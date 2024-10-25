
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
	let disposable = vscode.commands.registerCommand('ai-pair-programing.askAI', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const selection = editor.selections;
		const code = editor.document.getText(selection);

		vscode.window.showInformationMessage('AIが提案を考えています・・・');

		const suggestion = await askAI(`このコードの改善案を教えて: \n\n${code}`);

		vscode.window.showInformationMessage(`AIからの提案: ${suggestion}`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
